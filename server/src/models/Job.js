import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    required_skills: {
      type: [String],
      default: [],
    },
    preferred_skills: {
      type: [String],
      default: [],
    },
    min_experience: {
      type: Number,
      default: 0,
    },
    workflow_spec_id: {
      type: String,
      default: "default-hiring-workflow",
    },
    hiring_spec_id: {
      type: String,
      default: "frontend-developer",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["open", "closed", "draft"],
      default: "open",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const Job = mongoose.model("Job", jobSchema);
