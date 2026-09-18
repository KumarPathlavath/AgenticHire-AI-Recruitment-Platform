import { chunkText } from "../rag/chunker.js";
import { vectorStore } from "../rag/vectorStore.js";

export async function runEmbeddingAgent({ candidateId, resumeText }) {
  // 1. Chunk resume text according to 500 chars limit in spec
  const chunks = chunkText(resumeText, "resume");

  // 2. Push vectors to store (Qdrant / vectorStore)
  const indexedCount = await vectorStore.indexResumeChunks(candidateId, chunks);

  return {
    candidateId,
    chunksCreated: chunks.length,
    indexedCount,
    status: "indexed",
    model: "BAAI/bge-small-en-v1.5",
  };
}
