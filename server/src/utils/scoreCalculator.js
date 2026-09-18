import { specLoader } from "./specLoader.js";

export function calculateCandidateMatchScore({
  candidateSkills = [],
  candidateYearsOfExperience = 0,
  jobRequiredSkills = [],
  jobPreferredSkills = [],
  jobMinExperience = 0,
}) {
  const matchingSpec = specLoader.getPrompt("matching-agent");
  const weights = matchingSpec.scoring_weights || {
    required_skills_weight: 0.5,
    preferred_skills_weight: 0.25,
    experience_weight: 0.25,
  };

  const normCandidateSkills = candidateSkills.map((s) => s.toLowerCase().trim());
  const normRequired = jobRequiredSkills.map((s) => s.toLowerCase().trim());
  const normPreferred = jobPreferredSkills.map((s) => s.toLowerCase().trim());

  // Matched required skills
  const matchedRequired = jobRequiredSkills.filter((reqSkill) =>
    normCandidateSkills.some((cSkill) => cSkill.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(cSkill))
  );

  // Missing required skills
  const missingRequired = jobRequiredSkills.filter((reqSkill) =>
    !normCandidateSkills.some((cSkill) => cSkill.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(cSkill))
  );

  // Matched preferred skills
  const matchedPreferred = jobPreferredSkills.filter((prefSkill) =>
    normCandidateSkills.some((cSkill) => cSkill.includes(prefSkill.toLowerCase()) || prefSkill.toLowerCase().includes(cSkill))
  );

  // Calculate skill scores
  const reqScore = normRequired.length > 0 ? (matchedRequired.length / normRequired.length) * 100 : 100;
  const prefScore = normPreferred.length > 0 ? (matchedPreferred.length / normPreferred.length) * 100 : 100;

  // Calculate experience score
  let expScore = 100;
  if (jobMinExperience > 0) {
    if (candidateYearsOfExperience >= jobMinExperience) {
      expScore = 100;
    } else {
      expScore = Math.max(0, Math.min(100, (candidateYearsOfExperience / jobMinExperience) * 100));
    }
  }

  // Weighted total match score
  const finalScore =
    reqScore * weights.required_skills_weight +
    prefScore * weights.preferred_skills_weight +
    expScore * weights.experience_weight;

  return {
    match_score: Math.round(finalScore),
    matched_required_skills: matchedRequired,
    matched_preferred_skills: matchedPreferred,
    missing_skills: missingRequired,
    all_skills_matched: missingRequired.length === 0,
    breakdown: {
      required_skills_score: Math.round(reqScore),
      preferred_skills_score: Math.round(prefScore),
      experience_score: Math.round(expScore),
      weights,
    },
  };
}
