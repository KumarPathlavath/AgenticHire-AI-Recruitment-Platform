import { Resend } from "resend";
import { env } from "../config/env.js";
import { specLoader } from "../utils/specLoader.js";

let resendClient = null;
if (env.RESEND_API_KEY) {
  resendClient = new Resend(env.RESEND_API_KEY);
}

export async function sendInterviewInviteEmail({
  candidateName,
  candidateEmail,
  jobTitle,
  matchScore,
  highlightedSkills = [],
  interviewTopics = [],
}) {
  const template = specLoader.getEmailTemplate("interview-invite");

  let subject = template.subject_template.replace("{{job_title}}", jobTitle);
  let body = template.body_template
    .replace("{{candidate_name}}", candidateName)
    .replace("{{job_title}}", jobTitle)
    .replace("{{highlighted_skills}}", highlightedSkills.join(", ") || "Technical Software Engineering")
    .replace("{{match_score}}", String(matchScore))
    .replace(
      "{{interview_topics}}",
      interviewTopics.length > 0
        ? interviewTopics.map((t, idx) => `  ${idx + 1}. ${t}`).join("\n")
        : "  - System Design & Architecture\n  - Live Coding Assessment\n  - Technical Experience Review"
    );

  const emailPayload = {
    from: template.sender || "AgentHire <onboarding@resend.dev>",
    to: candidateEmail,
    subject,
    text: body,
  };

  if (resendClient) {
    try {
      const response = await resendClient.emails.send(emailPayload);
      return {
        success: true,
        provider: "resend",
        messageId: response.id || response.data?.id,
        emailPayload,
      };
    } catch (err) {
      console.warn("[EmailService] Resend API failed, generating simulated email output:", err.message);
    }
  }

  return {
    success: true,
    provider: "simulated_fallback",
    emailPayload,
    note: "Generated with spec templates (RESEND_API_KEY simulated)",
  };
}

export async function sendRejectionEmail({ candidateName, candidateEmail, jobTitle }) {
  const template = specLoader.getEmailTemplate("rejection");

  let subject = template.subject_template.replace("{{job_title}}", jobTitle);
  let body = template.body_template
    .replace("{{candidate_name}}", candidateName)
    .replace("{{job_title}}", jobTitle);

  const emailPayload = {
    from: template.sender || "AgentHire <onboarding@resend.dev>",
    to: candidateEmail,
    subject,
    text: body,
  };

  if (resendClient) {
    try {
      const response = await resendClient.emails.send(emailPayload);
      return {
        success: true,
        provider: "resend",
        messageId: response.id || response.data?.id,
        emailPayload,
      };
    } catch (err) {
      console.warn("[EmailService] Resend API failed, generating simulated email output:", err.message);
    }
  }

  return {
    success: true,
    provider: "simulated_fallback",
    emailPayload,
    note: "Generated with spec templates (RESEND_API_KEY simulated)",
  };
}
