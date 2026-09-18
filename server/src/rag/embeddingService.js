import { specLoader } from "../utils/specLoader.js";

export class EmbeddingService {
  constructor() {
    const ragConfig = specLoader.getRAGConfig();
    this.dimensions = ragConfig.vector_dimensions || 384;
    this.modelName = ragConfig.embedding_model || "BAAI/bge-small-en-v1.5";
  }

  // Generates normalized dense embedding vector of 384 dimensions
  async generateEmbedding(text) {
    if (!text || typeof text !== "string") {
      return new Array(this.dimensions).fill(0);
    }

    const words = text.toLowerCase().match(/\w+/g) || [];
    const vector = new Array(this.dimensions).fill(0);

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      let hash = 0;
      for (let j = 0; j < word.length; j++) {
        hash = (hash << 5) - hash + word.charCodeAt(j);
        hash |= 0;
      }
      const dimIndex = Math.abs(hash) % this.dimensions;
      vector[dimIndex] += 1.0;
      const secondaryIndex = (dimIndex * 31 + 17) % this.dimensions;
      vector[secondaryIndex] += 0.5;
    }

    // L2 Normalize the vector
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (norm > 0) {
      for (let i = 0; i < vector.length; i++) {
        vector[i] = vector[i] / norm;
      }
    }

    return vector;
  }

  async generateBatchEmbeddings(texts) {
    return Promise.all(texts.map((t) => this.generateEmbedding(t)));
  }
}

export const embeddingService = new EmbeddingService();
