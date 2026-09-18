import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  description: z.string().min(10, "Description must be at least 10 characters"),
  required_skills: z.array(z.string()).min(1, "At least one required skill is required"),
  preferred_skills: z.array(z.string()).optional().default([]),
  min_experience: z.number().nonnegative().optional().default(0),
  workflow_spec_id: z.string().optional().default("default-hiring-workflow"),
  hiring_spec_id: z.string().optional().default("frontend-developer"),
});

export const updateJobSchema = createJobSchema.partial();
