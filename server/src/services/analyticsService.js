import { Candidate } from "../models/Candidate.js";
import { Workflow } from "../models/Workflow.js";
import { Job } from "../models/Job.js";
import { WorkflowLog } from "../models/WorkflowLog.js";

export class AnalyticsService {
  async getRecruiterAnalytics() {
    const [totalJobs, totalCandidates, totalWorkflows] = await Promise.all([
      Job.countDocuments(),
      Candidate.countDocuments(),
      Workflow.countDocuments(),
    ]);

    const shortlistedCount = await Candidate.countDocuments({ status: "shortlisted" });
    const holdCount = await Candidate.countDocuments({ status: "hold" });
    const rejectedCount = await Candidate.countDocuments({ status: "rejected" });
    const processingCount = await Candidate.countDocuments({
      status: { $in: ["applied", "processing"] },
    });

    const completedWorkflows = await Workflow.countDocuments({ status: "completed" });
    const waitingApprovalWorkflows = await Workflow.countDocuments({ status: "waiting_approval" });
    const failedWorkflows = await Workflow.countDocuments({ status: "failed" });
    const runningWorkflows = await Workflow.countDocuments({ status: "running" });

    // Calculate score averages
    const scoredCandidates = await Candidate.find({ match_score: { $ne: null } }).select("match_score");
    const avgScore =
      scoredCandidates.length > 0
        ? Math.round(
            scoredCandidates.reduce((sum, c) => sum + (c.match_score || 0), 0) / scoredCandidates.length
          )
        : 0;

    const shortlistRate = totalCandidates > 0 ? Math.round((shortlistedCount / totalCandidates) * 100) : 0;
    const completionRate = totalWorkflows > 0 ? Math.round((completedWorkflows / totalWorkflows) * 100) : 0;

    // Agent metrics from logs
    const agentLogs = await WorkflowLog.aggregate([
      {
        $group: {
          _id: "$agent_name",
          totalExecutions: { $sum: 1 },
          successCount: {
            $sum: { $cond: [{ $eq: ["$status", "success"] }, 1, 0] },
          },
          failureCount: {
            $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
          },
        },
      },
    ]);

    // Recent workflows
    const recentWorkflows = await Workflow.find()
      .sort({ created_at: -1 })
      .limit(6)
      .populate("candidate_id", "name email match_score status")
      .populate("job_id", "title");

    return {
      overview: {
        totalJobs,
        totalCandidates,
        totalWorkflows,
        shortlistRate,
        completionRate,
        averageMatchScore: avgScore,
      },
      candidateStats: {
        shortlisted: shortlistedCount,
        hold: holdCount,
        rejected: rejectedCount,
        processing: processingCount,
      },
      workflowStats: {
        completed: completedWorkflows,
        waiting_approval: waitingApprovalWorkflows,
        failed: failedWorkflows,
        running: runningWorkflows,
      },
      agentMetrics: agentLogs.map((log) => ({
        agent: log._id,
        executions: log.totalExecutions,
        successRate:
          log.totalExecutions > 0
            ? Math.round((log.successCount / log.totalExecutions) * 100)
            : 100,
        failures: log.failureCount,
      })),
      recentWorkflows,
    };
  }
}

export const analyticsService = new AnalyticsService();
