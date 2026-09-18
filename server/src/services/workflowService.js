import { Workflow } from "../models/Workflow.js";
import { WorkflowLog } from "../models/WorkflowLog.js";
import { hiringWorkflowEngine } from "../workflows/hiringWorkflow.js";
import { specLoader } from "../utils/specLoader.js";

export class WorkflowService {
  async listWorkflows() {
    return Workflow.find()
      .sort({ created_at: -1 })
      .populate("candidate_id", "name email match_score status")
      .populate("job_id", "title required_skills");
  }

  async getWorkflowDetails(workflowId) {
    const workflow = await Workflow.findById(workflowId)
      .populate("candidate_id")
      .populate("job_id");

    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    const logs = await WorkflowLog.find({ workflow_id: workflowId }).sort({ created_at: 1 });
    const defaultWorkflowSpec = specLoader.getWorkflowSpec();
    const nodeStatesSpec = specLoader.getNodeStates();

    return {
      workflow,
      logs,
      execution_order: defaultWorkflowSpec.workflow,
      nodes_metadata: defaultWorkflowSpec.nodes,
      node_states_spec: nodeStatesSpec.states,
    };
  }

  async startWorkflow(candidateId, jobId) {
    const workflow = await hiringWorkflowEngine.createWorkflow(candidateId, jobId);
    const execution = await hiringWorkflowEngine.runWorkflow(workflow._id);
    return execution;
  }

  async approveCheckpoint(workflowId, decision, notes = "") {
    return hiringWorkflowEngine.resumeWorkflowWithApproval(workflowId, decision, notes);
  }

  async retryWorkflow(workflowId) {
    return hiringWorkflowEngine.retryFailedWorkflow(workflowId);
  }
}

export const workflowService = new WorkflowService();
