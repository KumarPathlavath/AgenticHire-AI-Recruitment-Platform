import { z } from "zod";

export const uploadCandidateSchema = z.object({
  name: z.string().min(2, "Candidate name must be at least 2 characters"),
  email: z.string().email("Valid candidate email is required"),
  phone: z.string().optional().default(""),
  job_id: z.string().min(1, "Job ID is required"),
});
