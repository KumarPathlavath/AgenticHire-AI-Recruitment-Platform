import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testUpload() {
  const resumePath = path.resolve(__dirname, "../demo-data/resumes/john-react-resume.pdf");
  const fileBuffer = fs.readFileSync(resumePath);
  const blob = new Blob([fileBuffer], { type: "application/pdf" });

  // Get jobs
  const jobsRes = await fetch("http://localhost:5001/api/jobs");
  const jobsData = await jobsRes.json();
  console.log("Jobs found:", jobsData.jobs?.length);
  const jobId = jobsData.jobs[0]?._id;

  const formData = new FormData();
  formData.append("name", "John Doe");
  formData.append("email", "john.doe.dev@example.com");
  formData.append("phone", "(555) 234-5678");
  formData.append("job_id", jobId);
  formData.append("resume", blob, "john-react-resume.pdf");

  const res = await fetch("http://localhost:5001/api/candidates/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  console.log("Upload result:", data);
}

testUpload().catch(console.error);
