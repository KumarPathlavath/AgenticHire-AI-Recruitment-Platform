import { calculateCandidateMatchScore } from "../utils/scoreCalculator.js";
import { vectorStore } from "../rag/vectorStore.js";

export async function runMatchingAgent({ candidateId, parsedResume, job }) {
  // 1. RAG query retrieval to augment match context
  const searchTerms = (job.required_skills || []).join(" ");
  const ragContextChunks = await vectorStore.queryResumeContext(candidateId, searchTerms);

  // 2. Perform score calculation using spec weights & job fields
  const scoreResult = calculateCandidateMatchScore({
    candidateSkills: parsedResume.skills || [],
    candidateYearsOfExperience: parsedResume.years_of_experience || 0,
    jobRequiredSkills: job.required_skills || [],
    jobPreferredSkills: job.preferred_skills || [],
    jobMinExperience: job.min_experience || 0,
  });

  return {
    ...scoreResult,
    rag_context_snippets: ragContextChunks.slice(0, 3),
    evaluated_against_job: {
      job_id: job._id || job.id,
      title: job.title,
      required_skills: job.required_skills,
      preferred_skills: job.preferred_skills,
      min_experience: job.min_experience,
    },
  };
}
