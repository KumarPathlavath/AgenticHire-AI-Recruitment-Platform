import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";

export async function extractTextFromPDF(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`PDF file not found at path: ${filePath}`);
  }

  const dataBuffer = fs.readFileSync(filePath);
  try {
    const data = await pdf(dataBuffer);
    return data.text || "";
  } catch (err) {
    throw new Error(`Failed to extract text from PDF: ${err.message}`);
  }
}
