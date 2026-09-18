import { specLoader } from "../src/utils/specLoader.js";

describe("SpecLoader Service", () => {
  it("should successfully load the default hiring workflow specification", () => {
    const workflowSpec = specLoader.getWorkflowSpec();
    expect(workflowSpec).toBeDefined();
    expect(workflowSpec.workflow).toEqual([
      "resume_parser",
      "embedding_agent",
      "matching_agent",
      "shortlisting_agent",
      "human_approval",
      "interview_agent",
      "email_agent",
    ]);
  });

  it("should successfully load node states with color codes", () => {
    const nodeStates = specLoader.getNodeStates();
    expect(nodeStates.states).toBeDefined();
    expect(nodeStates.states.running).toBeDefined();
    expect(nodeStates.states.waiting_approval).toBeDefined();
    expect(nodeStates.states.success).toBeDefined();
    expect(nodeStates.states.failed).toBeDefined();
  });

  it("should successfully load shortlisting rules without hardcoded values", () => {
    const rules = specLoader.getShortlistingRules();
    expect(rules.rules).toBeInstanceOf(Array);
    expect(rules.rules.length).toBeGreaterThanOrEqual(3);
    const shortlistedRule = rules.rules.find((r) => r.decision === "shortlisted");
    expect(shortlistedRule).toBeDefined();
    expect(shortlistedRule.min_score).toBe(80);
  });

  it("should successfully load RAG retrieval configuration", () => {
    const rag = specLoader.getRAGConfig();
    expect(rag.chunk_size.resume).toBe(500);
    expect(rag.retrieval.top_k).toBe(5);
  });
});
