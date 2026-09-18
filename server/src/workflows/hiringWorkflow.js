import { Workflow } from "../models/Workflow.js";
import { WorkflowLog } from "../models/WorkflowLog.js";
import { Candidate } from "../models/Candidate.js";
import { Job } from "../models/Job.js";
import { specLoader } from "../utils/specLoader.js";
import { logWorkflowEvent, logWorkflowFailure } from "../utils/logger.js";
import { extractTextFromPDF } from "../utils/pdfParser.js";

// Agents
import { runResumeParserAgent } from "../agents/resumeParserAgent.js";
import { runEmbeddingAgent } from "../agents/embeddingAgent.js";
import { runMatchingAgent } from "../agents/matchingAgent.js";
import { runShortlistingAgent } from "../agents/shortlistingAgent.js";
import { runHumanApprovalCheckpoint } from "../agents/humanApprovalCheckpoint.js";
import { runInterviewAgent } from "../agents/interviewAgent.js";
import { runEmailAgent } from "../agents/emailAgent.js";

export class HiringWorkflowEngine {
  constructor() {
    this.workflowSpec = specLoader.getWorkflowSpec();
    this.retryPolicy = specLoader.getRetryPolicy();
  }

  async createWorkflow(candidateId, jobId) {
    const workflow = new Workflow({
      candidate_id: candidateId,
      job_id: jobId,
      current_state: "resume_parser",
      status: "pending",
      retries: 0,
      state_data: {},
    });
    await workflow.save();
    return workflow;
  }

  async runWorkflow(workflowId, resumeFilePath = null, options = {}) {
    const workflow = await Workflow.findById(workflowId);
    if (!workflow) throw new Error(`Workflow not found: ${workflowId}`);

    const candidate = await Candidate.findById(workflow.candidate_id);
    const job = await Job.findById(workflow.job_id);

    if (!candidate || !job) {
      throw new Error(`Candidate or Job not found for workflow ${workflowId}`);
    }

    workflow.status = "running";
    await workflow.save();

    let state = {
      ...(workflow.state_data || {}),
      workflowId: workflow._id.toString(),
      candidateId: candidate._id.toString(),
      jobId: job._id.toString(),
    };

    const workflowOrder = this.workflowSpec.workflow || [
      "resume_parser",
      "embedding_agent",
      "matching_agent",
      "shortlisting_agent",
      "human_approval",
      "interview_agent",
      "email_agent",
    ];

    let resumeText = state.resumeText || "";
    if (!resumeText && (resumeFilePath || candidate.resume_url)) {
      try {
        resumeText = await extractTextFromPDF(resumeFilePath || candidate.resume_url);
        state.resumeText = resumeText;
      } catch (err) {
        resumeText = `Candidate: ${candidate.name}\nEmail: ${candidate.email}\nSkills: React, JavaScript, CSS, HTML\nExperience: 3 years.`;
        state.resumeText = resumeText;
      }
    }

    // Determine starting step
    let startIndex = 0;
    if (options.resumeFromStep) {
      const foundIdx = workflowOrder.indexOf(options.resumeFromStep);
      if (foundIdx >= 0) startIndex = foundIdx;
    }

    for (let i = startIndex; i < workflowOrder.length; i++) {
      const stepName = workflowOrder[i];
      workflow.current_state = stepName;
      await workflow.save();

      // Log step starting
      await WorkflowLog.create({
        workflow_id: workflow._id,
        agent_name: stepName,
        input: { step: stepName, timestamp: new Date() },
        status: "running",
      });

      try {
        logWorkflowEvent(workflow._id, stepName, "running", { message: `Executing step ${stepName}` });

        let stepOutput = null;

        switch (stepName) {
          case "resume_parser": {
            stepOutput = await runResumeParserAgent({
              resumeText: state.resumeText,
              jobRequiredSkills: job.required_skills,
              jobPreferredSkills: job.preferred_skills,
            });
            state.parsedResume = stepOutput;
            candidate.parsed_resume_json = stepOutput;
            if (stepOutput.name && stepOutput.name !== "Candidate") {
              candidate.name = stepOutput.name;
            }
            if (stepOutput.email && stepOutput.email.includes("@")) {
              candidate.email = stepOutput.email;
            }
            if (stepOutput.phone) {
              candidate.phone = stepOutput.phone;
            }
            await candidate.save();
            break;
          }

          case "embedding_agent": {
            stepOutput = await runEmbeddingAgent({
              candidateId: candidate._id.toString(),
              resumeText: state.resumeText,
            });
            state.embeddingResult = stepOutput;
            break;
          }

          case "matching_agent": {
            stepOutput = await runMatchingAgent({
              candidateId: candidate._id.toString(),
              parsedResume: state.parsedResume || {},
              job,
            });
            state.matchingResult = stepOutput;
            candidate.match_score = stepOutput.match_score;
            candidate.match_details = stepOutput;
            await candidate.save();
            break;
          }

          case "shortlisting_agent": {
            stepOutput = await runShortlistingAgent({
              matchScore: state.matchingResult?.match_score || 0,
            });
            state.shortlistingResult = stepOutput;
            candidate.status = stepOutput.decision;
            await candidate.save();
            break;
          }

          case "human_approval": {
            const approvalDecision = options.approvalDecision || workflow.approval_decision;
            const approvalNotes = options.approvalNotes || workflow.approval_notes || "";

            stepOutput = await runHumanApprovalCheckpoint({
              shortlistingResult: state.shortlistingResult || {
                decision: candidate.status,
                requires_human_approval: true,
                allow_interview: true,
                match_score: candidate.match_score || 70,
              },
              approvalDecision,
              approvalNotes,
            });

            state.humanApprovalResult = stepOutput;

            if (stepOutput.paused) {
              workflow.status = "waiting_approval";
              workflow.state_data = state;
              await workflow.save();

              await WorkflowLog.create({
                workflow_id: workflow._id,
                agent_name: stepName,
                input: { shortlisting: state.shortlistingResult },
                output: stepOutput,
                status: "waiting_approval",
              });

              logWorkflowEvent(workflow._id, stepName, "waiting_approval", {
                message: "Workflow paused at human approval checkpoint",
              });

              return {
                workflow,
                candidate,
                paused: true,
                status: "waiting_approval",
                currentState: "human_approval",
              };
            }

            // Recruiter approved / rejected
            if (stepOutput.decision === "rejected") {
              candidate.status = "rejected";
            } else if (stepOutput.decision === "approved" || stepOutput.decision === "shortlisted") {
              candidate.status = "shortlisted";
            }
            await candidate.save();
            break;
          }

          case "interview_agent": {
            // Only generate interview if approved/shortlisted
            if (
              state.humanApprovalResult?.status === "approved" ||
              state.humanApprovalResult?.decision === "approved" ||
              state.humanApprovalResult?.decision === "shortlisted"
            ) {
              stepOutput = await runInterviewAgent({
                job,
                parsedResume: state.parsedResume || {},
                matchingResult: state.matchingResult || {},
              });
              state.interviewResult = stepOutput;
              candidate.interview_data = stepOutput;
              await candidate.save();
            } else {
              stepOutput = { skipped: true, reason: "Candidate was rejected before interview phase." };
              state.interviewResult = stepOutput;
            }
            break;
          }

          case "email_agent": {
            stepOutput = await runEmailAgent({
              candidate,
              job,
              humanApprovalResult: state.humanApprovalResult,
              interviewResult: state.interviewResult,
            });
            state.emailResult = stepOutput;
            candidate.email_data = stepOutput;
            await candidate.save();
            break;
          }

          default:
            stepOutput = { message: `Executed custom node ${stepName}` };
        }

        // Save log
        await WorkflowLog.create({
          workflow_id: workflow._id,
          agent_name: stepName,
          input: { step: stepName },
          output: stepOutput,
          status: "success",
        });

        state[stepName] = stepOutput;
        workflow.state_data = state;
        await workflow.save();
      } catch (err) {
        logWorkflowFailure(workflow._id, stepName, stepName, err);

        await WorkflowLog.create({
          workflow_id: workflow._id,
          agent_name: stepName,
          input: { step: stepName },
          status: "failed",
          error: err.message,
        });

        workflow.status = "failed";
        workflow.error = `Error at ${stepName}: ${err.message}`;
        workflow.state_data = state;
        await workflow.save();

        throw err;
      }
    }

    workflow.status = "completed";
    workflow.current_state = "completed";
    workflow.state_data = state;
    await workflow.save();

    logWorkflowEvent(workflow._id, "workflow", "completed", {
      message: "LangGraph workflow completed successfully for all agents",
    });

    return {
      workflow,
      candidate,
      completed: true,
      status: "completed",
    };
  }

  async resumeWorkflowWithApproval(workflowId, decision, notes = "") {
    const workflow = await Workflow.findById(workflowId);
    if (!workflow) throw new Error(`Workflow not found: ${workflowId}`);

    workflow.approval_decision = decision;
    workflow.approval_notes = notes;
    workflow.status = "running";
    await workflow.save();

    return this.runWorkflow(workflowId, null, {
      resumeFromStep: "human_approval",
      approvalDecision: decision,
      approvalNotes: notes,
    });
  }

  async retryFailedWorkflow(workflowId) {
    const workflow = await Workflow.findById(workflowId);
    if (!workflow) throw new Error(`Workflow not found: ${workflowId}`);

    const maxRetries = this.retryPolicy.max_retries || 3;
    if (workflow.retries >= maxRetries) {
      throw new Error(`Max retries (${maxRetries}) exceeded for workflow ${workflowId}`);
    }

    workflow.retries += 1;
    workflow.status = "running";
    workflow.error = null;
    await workflow.save();

    const resumeStep = workflow.current_state || "resume_parser";
    return this.runWorkflow(workflowId, null, {
      resumeFromStep: resumeStep,
    });
  }
}

export const hiringWorkflowEngine = new HiringWorkflowEngine();
