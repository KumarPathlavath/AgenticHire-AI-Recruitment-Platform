import { sendInterviewInviteEmail, sendRejectionEmail } from "../emails/emailService.js";

export async function runEmailAgent({ candidate, job, humanApprovalResult, interviewResult }) {
  const isApproved =
    humanApprovalResult?.status === "approved" ||
    humanApprovalResult?.decision === "approved" ||
    humanApprovalResult?.decision === "shortlisted";

  let result;
  if (isApproved) {
    result = await sendInterviewInviteEmail({
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      jobTitle: job.title,
      matchScore: candidate.match_score || 80,
      highlightedSkills: candidate.match_details?.matched_required_skills || [],
      interviewTopics: interviewResult?.interview_topics || [],
    });
  } else {
    result = await sendRejectionEmail({
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      jobTitle: job.title,
    });
  }

  return {
    email_type: isApproved ? "interview_invite" : "rejection",
    recipient: candidate.email,
    delivery_status: result.success ? "sent" : "failed",
    provider: result.provider,
    email_payload: result.emailPayload,
    note: result.note || "Email generated from spec template",
  };
}
