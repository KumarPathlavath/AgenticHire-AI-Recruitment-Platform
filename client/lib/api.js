const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request(endpoint, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("agenthire_token") : null;
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.message || data.error || "An error occurred", response.status, data);
  }

  return data;
}

export const api = {
  // Auth
  signup: (userData) =>
    request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  login: (credentials) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  getMe: () => request("/auth/me"),

  // Jobs
  getJobs: () => request("/jobs"),
  getJob: (id) => request(`/jobs/${id}`),
  createJob: (jobData) =>
    request("/jobs", {
      method: "POST",
      body: JSON.stringify(jobData),
    }),
  updateJob: (id, jobData) =>
    request(`/jobs/${id}`, {
      method: "PUT",
      body: JSON.stringify(jobData),
    }),

  // Candidates
  getCandidates: (jobId) => request(jobId ? `/candidates?job_id=${jobId}` : "/candidates"),
  getCandidate: (id) => request(`/candidates/${id}`),
  uploadResume: (formData) =>
    request("/candidates/upload", {
      method: "POST",
      body: formData,
    }),

  // Workflows
  getWorkflow: (id) => request(`/workflow/${id}`),
  listWorkflows: () => request("/workflow"),
  startWorkflow: (candidateId, jobId) =>
    request("/workflow/start", {
      method: "POST",
      body: JSON.stringify({ candidate_id: candidateId, job_id: jobId }),
    }),
  retryWorkflow: (workflowId) =>
    request("/workflow/retry", {
      method: "POST",
      body: JSON.stringify({ workflow_id: workflowId }),
    }),
  approveWorkflow: (workflowId, decision, notes) =>
    request("/workflow/approve", {
      method: "POST",
      body: JSON.stringify({ workflow_id: workflowId, decision, notes }),
    }),

  // Specs
  getSpecs: () => request("/specs"),

  // Analytics
  getAnalytics: () => request("/analytics"),
};
