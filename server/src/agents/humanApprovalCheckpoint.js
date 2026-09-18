export async function runHumanApprovalCheckpoint({ shortlistingResult, approvalDecision, approvalNotes = "" }) {
  // If human approval is required and recruiter hasn't made a decision yet, pause
  if (shortlistingResult.requires_human_approval && !approvalDecision) {
    return {
      paused: true,
      status: "waiting_approval",
      message: "Workflow paused at Human Approval Checkpoint. Awaiting recruiter review.",
      shortlisting_decision: shortlistingResult.decision,
      match_score: shortlistingResult.match_score,
    };
  }

  // If already approved or rejected by recruiter
  const finalDecision = approvalDecision || shortlistingResult.decision;
  const isApproved = finalDecision === "approved" || finalDecision === "shortlisted";

  return {
    paused: false,
    status: isApproved ? "approved" : "rejected",
    decision: finalDecision,
    approvalNotes,
    proceedToInterview: isApproved && shortlistingResult.allow_interview,
    message: isApproved ? "Candidate approved by recruiter." : "Candidate rejected at human approval.",
  };
}
