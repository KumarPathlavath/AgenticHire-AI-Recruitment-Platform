import multer from "multer";
import path from "path";
import fs from "fs";
import { env } from "../config/env.js";

// Ensure uploads folder exists
if (!fs.existsSync(env.UPLOADS_PATH)) {
  fs.mkdirSync(env.UPLOADS_PATH, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, env.UPLOADS_PATH);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `resume-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".pdf" || file.mimetype === "application/pdf" || file.mimetype === "application/octet-stream") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are supported for resume upload."), false);
  }
};

export const uploadResumeFile = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
});
