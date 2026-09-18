import { specLoader } from "../utils/specLoader.js";

export async function runShortlistingAgent({ matchScore }) {
  const shortlistingSpec = specLoader.getShortlistingRules();
  const rules = shortlistingSpec.rules || [];

  let decision = shortlistingSpec.default_decision || "hold";
  let appliedRule = null;

  for (const rule of rules) {
    if (matchScore >= rule.min_score && matchScore <= rule.max_score) {
      decision = rule.decision;
      appliedRule = rule;
      break;
    }
  }

  return {
    decision,
    match_score: matchScore,
    requires_human_approval: appliedRule ? appliedRule.requires_human_approval : true,
    allow_interview: appliedRule ? appliedRule.allow_interview : false,
    reasoning: appliedRule ? appliedRule.description : "Decision based on match score rules.",
  };
}
