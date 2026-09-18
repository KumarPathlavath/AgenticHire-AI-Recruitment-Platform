import { specLoader } from "../utils/specLoader.js";
import { embeddingService } from "./embeddingService.js";
import { env } from "../config/env.js";

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

class VectorStore {
  constructor() {
    this.collections = new Map();
    this.isQdrantEnabled = Boolean(env.QDRANT_URL);
  }

  getCollection(name) {
    if (!this.collections.has(name)) {
      this.collections.set(name, []);
    }
    return this.collections.get(name);
  }

  async upsertVectors(collectionName, points) {
    const collection = this.getCollection(collectionName);
    for (const point of points) {
      const existingIndex = collection.findIndex((p) => p.id === point.id);
      if (existingIndex >= 0) {
        collection[existingIndex] = point;
      } else {
        collection.push(point);
      }
    }
    return { success: true, count: points.length };
  }

  async search(collectionName, queryVector, filter = {}, topK = 5, minSimilarity = 0.5) {
    const collection = this.getCollection(collectionName);
    const results = [];

    for (const item of collection) {
      // Apply metadata filter if provided
      let matchesFilter = true;
      if (filter && typeof filter === "object") {
        for (const [key, val] of Object.entries(filter)) {
          if (item.payload && item.payload[key] !== val) {
            matchesFilter = false;
            break;
          }
        }
      }

      if (!matchesFilter) continue;

      const score = cosineSimilarity(queryVector, item.vector);
      if (score >= minSimilarity) {
        results.push({
          id: item.id,
          score,
          payload: item.payload,
        });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  }

  async indexResumeChunks(candidateId, chunks) {
    const ragConfig = specLoader.getRAGConfig();
    const collectionName = ragConfig.collection_names?.resumes || "agent_hire_resumes";

    const points = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const vector = await embeddingService.generateEmbedding(chunk.text);
      points.push({
        id: `${candidateId}-chunk-${i}`,
        vector,
        payload: {
          candidateId,
          text: chunk.text,
          chunkIndex: i,
          type: "resume",
        },
      });
    }

    await this.upsertVectors(collectionName, points);
    return points.length;
  }

  async queryResumeContext(candidateId, queryText) {
    const ragConfig = specLoader.getRAGConfig();
    const collectionName = ragConfig.collection_names?.resumes || "agent_hire_resumes";
    const topK = ragConfig.retrieval?.top_k || 5;
    const minSim = ragConfig.retrieval?.minimum_similarity || 0.5;

    const queryVec = await embeddingService.generateEmbedding(queryText);
    const results = await this.search(collectionName, queryVec, { candidateId }, topK, minSim);
    return results.map((r) => r.payload.text);
  }
}

export const vectorStore = new VectorStore();
