import { specLoader } from "../utils/specLoader.js";

export function chunkText(text, type = "resume") {
  if (!text || typeof text !== "string") return [];

  const ragConfig = specLoader.getRAGConfig();
  const chunkSize = ragConfig.chunk_size[type] || 500;
  const chunkOverlap = ragConfig.chunk_overlap[type] || 50;

  const chunks = [];
  let start = 0;

  // Clean and normalize text
  const cleanText = text.replace(/\r\n/g, "\n").trim();

  while (start < cleanText.length) {
    let end = start + chunkSize;
    if (end > cleanText.length) {
      end = cleanText.length;
    } else {
      // Find nearest sentence or word boundary
      const nextSpace = cleanText.lastIndexOf(" ", end);
      if (nextSpace > start + chunkSize / 2) {
        end = nextSpace;
      }
    }

    const chunk = cleanText.slice(start, end).trim();
    if (chunk.length > 0) {
      chunks.push({
        text: chunk,
        start,
        end,
        index: chunks.length,
      });
    }

    if (end >= cleanText.length) break;
    start = end - chunkOverlap;
  }

  return chunks;
}
