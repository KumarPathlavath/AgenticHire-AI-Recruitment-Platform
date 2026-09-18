import { specLoader } from "../utils/specLoader.js";

export async function runInterviewAgent({ job, parsedResume, matchingResult }) {
  const spec = specLoader.getPrompt("interview-agent");
  const categories = spec.question_categories || [
    "Core Technical & Architecture",
    "Problem Solving & Coding Challenge",
    "Missing Skills Deep Dive",
    "System Design & Best Practices",
    "Behavioral & Project Experience",
  ];
  const rubrics = spec.rubric_scoring_criteria || [];

  const requiredSkills = job.required_skills || ["React", "JavaScript"];
  const missingSkills = matchingResult.missing_skills || [];
  const candidateSkills = parsedResume.skills || [];

  // Generate tailored questions
  const questions = [
    {
      id: "q1",
      category: categories[0] || "Core Technical",
      topic: requiredSkills[0] || "Core Architecture",
      question: `How would you architect a high-performance production application using ${requiredSkills.join(", ")}? Describe state management and component decoupling.`,
      expected_answer_points: [
        "Component hierarchy and modular state isolation",
        "Performance optimization (memoization, lazy loading)",
        "Error boundaries and resilience",
      ],
    },
    {
      id: "q2",
      category: categories[1] || "Coding Challenge",
      topic: "Algorithm & Practical Implementation",
      question: `Implement a resilient client-side caching & request deduplication layer for asynchronous data fetching in ${requiredSkills[0] || "JavaScript"}.`,
      expected_answer_points: [
        "Cache eviction policy (e.g., LRU or TTL)",
        "Concurrent in-flight request deduplication",
        "Race condition prevention and error handling",
      ],
    },
    {
      id: "q3",
      category: categories[2] || "Missing Skills Deep Dive",
      topic: missingSkills.length > 0 ? missingSkills[0] : "Advanced Tooling",
      question:
        missingSkills.length > 0
          ? `We noticed your background has less emphasis on ${missingSkills.join(", ")}. How would you quickly ramp up and apply best practices in a production setting?`
          : `Explain how you implement end-to-end integration testing and automated CI/CD deployment pipelines for ${requiredSkills[0] || "modern applications"}.`,
      expected_answer_points: [
        "Rapid ramp-up methodology and documentation study",
        "Prototyping with defensive coding patterns",
        "Automated regression testing",
      ],
    },
    {
      id: "q4",
      category: categories[3] || "System Design",
      topic: "Scalability & API Design",
      question: "Walk through how you design RESTful and real-time APIs to handle high concurrency with zero downtime.",
      expected_answer_points: [
        "Idempotency and rate limiting strategies",
        "Stateless token-based authentication (JWT)",
        "Database indexing and query optimization",
      ],
    },
    {
      id: "q5",
      category: categories[4] || "Behavioral & Experience",
      topic: "Complex Incident Handling",
      question: `In your previous experience with ${candidateSkills.slice(0, 3).join(", ") || "software projects"}, describe a challenging production bug you diagnosed and resolved.`,
      expected_answer_points: [
        "Root cause analysis technique",
        "Collaborative triage and blameless post-mortem",
        "Preventive unit/integration tests added",
      ],
    },
  ];

  return {
    generated_at: new Date().toISOString(),
    job_title: job.title,
    candidate_name: parsedResume.name,
    total_questions: questions.length,
    questions,
    rubric_scoring_criteria: rubrics,
    interview_topics: questions.map((q) => `${q.category}: ${q.topic}`),
  };
}
