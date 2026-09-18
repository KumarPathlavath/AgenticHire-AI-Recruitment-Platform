# AgentHire (Agentic-AI Based Recruiter)
### Spec-Driven Multi-Agent Recruitment Platform with LangGraph Orchestration

AgentHire is a full-stack, spec-driven recruitment workspace where recruiters can create jobs, publish public application routes, receive candidate PDF resumes, and orchestrate a 7-agent AI pipeline. The system persists workflow state, pauses at human approval checkpoints, and continues to interview and email generation — all backed by spec files in `/specs`.

---

## 🎯 Architecture Highlights
- **Spec as Single Source of Truth**: All hiring thresholds, retry policies, prompt templates, RAG parameters, email templates, and node colors come from `/specs/*.json` and are dynamically loaded via `specLoader.js`.
- **7 Cooperating AI Agents**:
  1. `resume_parser`: Extracts candidate facts and skills from PDF resumes.
  2. `embedding_agent`: Chunks and indexes resume vectors to Qdrant (BAAI/bge-small-en-v1.5).
  3. `matching_agent`: Evaluates candidate skills against job required/preferred skills and experience.
  4. `shortlisting_agent`: Dynamically calculates candidate decision (shortlisted $\ge 80$, hold $60-79$, rejected $< 60$).
  5. `human_approval`: Pauses workflow execution (`waiting_approval`) for recruiter review.
  6. `interview_agent`: Generates tailored technical questions, coding challenges, and rubrics.
  7. `email_agent`: Dispatches interview invitations or rejection notifications via Resend.
- **Interactive React Flow Visualizer**: Live color-coded workflow execution DAG on the recruiter dashboard with active node telemetry and trace logs.
- **Zero-Friction Local Execution**: Automatic fallback to `mongodb-memory-server` and in-memory vector indexing if external services are not running.

---

## 📁 Project Structure

```
ai-recruitment-platform/
|-- client/               # Next.js 15 App Router + React 19 + Tailwind + React Flow
|   |-- app/
|   |   |-- dashboard/    # Recruiter console (Overview, Jobs, Candidates, Workflows, Analytics)
|   |   |-- jobs/         # Public job view and public candidate apply pages
|   |   |-- login/ & signup/
|   |-- components/       # WorkflowCanvas, ResumeUploader, CandidateModal, ApprovalModal
|   |-- lib/              # API client and formatting utilities
|   |-- store/            # Zustand stores (authStore, workflowStore)
|
|-- server/               # Express.js Modular Architecture (JS ES Modules)
|   |-- src/
|   |   |-- config/       # Environment & Database connections
|   |   |-- routes/       # API endpoints (/auth, /jobs, /candidates, /workflow, /analytics, /specs)
|   |   |-- controllers/  # Request intent parsers
|   |   |-- services/     # Business logic layers
|   |   |-- middleware/   # Auth, roles, uploads, and validation
|   |   |-- models/       # Mongoose schemas (User, Job, Candidate, Workflow, WorkflowLog)
|   |   |-- agents/       # 7 Cooperating AI Agents
|   |   |-- workflows/    # LangGraph workflow engine & checkpointer
|   |   |-- rag/          # Vector store, chunker, embeddings
|   |   |-- emails/       # Resend email dispatcher
|   |   |-- validators/   # Zod request schemas
|   |   |-- utils/        # SpecLoader, ScoreCalculator, PDFParser, Logger
|   |-- uploads/          # Stored PDF resumes
|   |-- logs/             # Workflow telemetry logs
|   |-- tests/            # Jest & Supertest automated test suite
|
|-- specs/                # Source-of-truth business rules & specifications
|   |-- hiring/           # Role requirements & experience thresholds
|   |-- workflow/         # Pipeline order & node state colors
|   |-- evaluation/       # Shortlisting rules & RAG parameters
|   |-- prompts/          # Resume parser, matching, & interview schemas
|   |-- email/            # Interview invite & rejection templates
|   |-- system/           # Retry policy & error classification
|
|-- demo-data/            # Sample resumes (john-react-resume.pdf)
|-- scripts/              # Helper generation scripts
|-- spec.txt              # Project specifications document
|-- .env                  # Root environment configuration
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 20+
- npm 10+

### 2. Backend Setup & Run
```bash
cd server
npm install --legacy-peer-deps
npm start
# Backend runs on http://localhost:5001
```

### 3. Frontend Setup & Run
```bash
cd client
npm install --legacy-peer-deps
npm run dev
# Frontend runs on http://localhost:3000
```

### 4. Running Backend Tests
```bash
cd server
npm test
```

---

## 🧪 End-to-End Verification Flow
1. **Sign In**: Navigate to `http://localhost:3000/login` and log in with recruiter credentials (e.g. `recruiter@agenthire.com` / `password123` or create a new account).
2. **Create a Job**: Go to `/dashboard/jobs/create` and publish a "Frontend Developer" job requisition with required skills `["React", "JavaScript", "CSS"]`.
3. **Candidate Applies**: Copy the public apply link `/jobs/[jobId]/apply`, upload `demo-data/resumes/john-react-resume.pdf`, and submit.
4. **LangGraph Pipeline Runs**: The system parses the PDF, computes RAG embeddings, evaluates match score, shortlists the candidate, and automatically pauses at `human_approval`.
5. **Recruiter Review & Approval**: Open `/dashboard/workflows`, inspect the live React Flow canvas, click **"Recruiter Approval Required"**, and approve the candidate.
6. **Completion**: The pipeline automatically resumes from state, generates interview questions and rubrics, and dispatches the interview invitation email.
7. **Analytics**: Visit `/dashboard/analytics` to view real-time pipeline completion rates, shortlist conversions, and agent telemetry.
