import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: "",
    },
    resume_url: {
      type: String,
      required: true,
    },
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    parsed_resume_json: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    match_score: {
      type: Number,
      default: null,
    },
    match_details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ["applied", "processing", "shortlisted", "hold", "rejected"],
      default: "applied",
    },
    interview_data: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    email_data: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const Candidate = mongoose.model("Candidate", candidateSchema);
