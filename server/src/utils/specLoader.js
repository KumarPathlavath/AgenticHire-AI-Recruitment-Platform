import fs from "fs";
import path from "path";
import { env } from "../config/env.js";

class SpecLoader {
  constructor() {
    this.specsPath = env.ROOT_SPECS_PATH;
    this.cache = new Map();
  }

  loadJson(relativePath) {
    const fullPath = path.join(this.specsPath, relativePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`[SpecLoader] Spec file not found at: ${fullPath}`);
    }

    try {
      const content = fs.readFileSync(fullPath, "utf-8");
      return JSON.parse(content);
    } catch (err) {
      throw new Error(`[SpecLoader] Error parsing JSON from ${fullPath}: ${err.message}`);
    }
  }

  getHiringSpec(id = "frontend-developer") {
    const filename = id.endsWith(".json") ? id : `${id}.json`;
    return this.loadJson(path.join("hiring", filename));
  }

  getWorkflowSpec(id = "default-hiring-workflow") {
    const filename = id.endsWith(".json") ? id : `${id}.json`;
    return this.loadJson(path.join("workflow", filename));
  }

  getNodeStates() {
    return this.loadJson(path.join("workflow", "node-states.json"));
  }

  getShortlistingRules() {
    return this.loadJson(path.join("evaluation", "shortlisting-rules.json"));
  }

  getRAGConfig() {
    return this.loadJson(path.join("evaluation", "rag-retrieval.json"));
  }

  getPrompt(name) {
    const filename = name.endsWith(".json") ? name : `${name}.json`;
    return this.loadJson(path.join("prompts", filename));
  }

  getEmailTemplate(type) {
    const filename = type.endsWith(".json") ? type : `${type}.json`;
    return this.loadJson(path.join("email", filename));
  }

  getRetryPolicy() {
    return this.loadJson(path.join("system", "retry-policy.json"));
  }

  getAllSpecs() {
    return {
      defaultWorkflow: this.getWorkflowSpec(),
      nodeStates: this.getNodeStates(),
      shortlistingRules: this.getShortlistingRules(),
      ragConfig: this.getRAGConfig(),
      retryPolicy: this.getRetryPolicy(),
      prompts: {
        resumeParser: this.getPrompt("resume-parser"),
        matchingAgent: this.getPrompt("matching-agent"),
        interviewAgent: this.getPrompt("interview-agent"),
      },
      emails: {
        interviewInvite: this.getEmailTemplate("interview-invite"),
        rejection: this.getEmailTemplate("rejection"),
      },
      hiring: {
        frontendDeveloper: this.getHiringSpec("frontend-developer"),
        backendDeveloper: this.getHiringSpec("backend-developer"),
      },
    };
  }
}

export const specLoader = new SpecLoader();
