import mongoose from "mongoose";

const workflowSchema = new mongoose.Schema(
  {
    candidate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    current_state: {
      type: String,
      default: "resume_parser",
    },
    status: {
      type: String,
      enum: ["pending", "running", "waiting_approval", "completed", "failed"],
      default: "pending",
    },
    retries: {
      type: Number,
      default: 0,
    },
    state_data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    approval_decision: {
      type: String,
      enum: [null, "approved", "rejected"],
      default: null,
    },
    approval_notes: {
      type: String,
      default: "",
    },
    error: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const Workflow = mongoose.model("Workflow", workflowSchema);
