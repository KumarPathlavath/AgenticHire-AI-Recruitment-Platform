import { calculateCandidateMatchScore } from "../src/utils/scoreCalculator.js";
import { runShortlistingAgent } from "../src/agents/shortlistingAgent.js";

describe("Score Calculator & Shortlisting Agent", () => {
  it("should calculate 100% match when all required, preferred skills and experience match", () => {
    const result = calculateCandidateMatchScore({
      candidateSkills: ["React", "JavaScript", "CSS", "Next.js", "Tailwind CSS"],
      candidateYearsOfExperience: 4,
      jobRequiredSkills: ["React", "JavaScript", "CSS"],
      jobPreferredSkills: ["Next.js", "Tailwind CSS"],
      jobMinExperience: 2,
    });

    expect(result.match_score).toBe(100);
    expect(result.all_skills_matched).toBe(true);
    expect(result.missing_skills).toHaveLength(0);
  });

  it("should calculate partial match score when skills are missing", () => {
    const result = calculateCandidateMatchScore({
      candidateSkills: ["CSS"],
      candidateYearsOfExperience: 1,
      jobRequiredSkills: ["React", "JavaScript", "CSS"],
      jobPreferredSkills: ["Next.js"],
      jobMinExperience: 2,
    });

    expect(result.match_score).toBeLessThan(60);
    expect(result.missing_skills).toContain("React");
    expect(result.missing_skills).toContain("JavaScript");
  });

  it("should shortlist a candidate with high match score (>=80)", async () => {
    const decision = await runShortlistingAgent({ matchScore: 90 });
    expect(decision.decision).toBe("shortlisted");
    expect(decision.requires_human_approval).toBe(true);
  });

  it("should put candidate on hold for score between 60-79", async () => {
    const decision = await runShortlistingAgent({ matchScore: 70 });
    expect(decision.decision).toBe("hold");
  });

  it("should reject candidate with score below 60", async () => {
    const decision = await runShortlistingAgent({ matchScore: 45 });
    expect(decision.decision).toBe("rejected");
  });
});
