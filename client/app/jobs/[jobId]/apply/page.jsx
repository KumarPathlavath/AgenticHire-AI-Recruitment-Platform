"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../../../lib/api";
import Navbar from "../../../../components/Navbar";
import ResumeUploader from "../../../../components/ResumeUploader";
import {
  Briefcase,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  Mail,
  Phone,
  Landmark,
  ShieldCheck,
  FileCheck,
} from "lucide-react";

export default function CandidateApplyPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.jobId;

  const [job, setJob] = useState(null);
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe.dev@example.com");
  const [phone, setPhone] = useState("(555) 234-5678");
  const [resumeFile, setResumeFile] = useState(null);

  const [loadingJob, setLoadingJob] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      setLoadingJob(true);
      try {
        const res = await api.getJob(jobId);
        if (res.success) {
          setJob(res.job);
        } else {
          setError(res.message || "Job requisition not found");
        }
      } catch (err) {
        setError(err.message || "Failed to load position");
      } finally {
        setLoadingJob(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!resumeFile) {
      setError("Please attach your PDF resume to submit your application.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("job_id", jobId);
      formData.append("resume", resumeFile);

      const res = await api.uploadResume(formData);
      if (res.success) {
        setSubmissionResult(res);
      } else {
        setError(res.message || "Failed to process application");
      }
    } catch (err) {
      setError(err.message || "An error occurred during application processing");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-8 space-y-5">
        <Link
          href={`/jobs/${jobId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Position Bulletin
        </Link>

        {submissionResult ? (
          <div className="p-6 sm:p-8 rounded-lg bg-white border border-slate-300 text-center space-y-5 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 mx-auto flex items-center justify-center text-emerald-800">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Official Application Lodged Successfully
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Your credentials for <strong className="text-slate-900">{job?.title || "the position"}</strong> have been securely received by the evaluation system.
              </p>
            </div>

            <div className="p-4 rounded bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-2.5 text-left max-w-md mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Position Bulletin:</span>
                <span className="font-bold text-slate-900">{job?.title || "Requisition"}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Applicant Name:</span>
                <span className="font-bold text-slate-900">{submissionResult.candidate?.name || name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Notification Address:</span>
                <span className="font-bold text-blue-900">{submissionResult.candidate?.email || email}</span>
              </div>
            </div>

            <div className="p-3.5 rounded bg-blue-50 border border-blue-200 max-w-md mx-auto text-left flex items-start gap-2.5">
              <FileCheck className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-blue-950 leading-relaxed">
                The autonomous multi-agent pipeline is parsing your resume and calculating match metrics according to <code className="font-mono font-bold">/specs</code>. You will receive an official notification with interview materials if your profile passes the threshold.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/dashboard/jobs"
                className="inline-block px-4 py-2 rounded bg-blue-900 text-white text-xs font-bold hover:bg-blue-800 transition-colors shadow-xs"
              >
                Browse Other Public Openings
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 rounded-lg bg-white border border-slate-200 shadow-xs space-y-6">
            <div className="space-y-1 pb-4 border-b border-slate-200">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-900 text-[10px] font-bold uppercase tracking-wider mb-1">
                <Landmark className="w-3 h-3" />
                Public Candidate Application Portal
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Apply for {job?.title || "Position"}
              </h1>
              <p className="text-xs text-slate-600">
                Submit your credentials and verified PDF resume for AI qualification assessment
              </p>
            </div>

            {error && (
              <div className="p-3 rounded bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Full Legal Name <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Email Address <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                    placeholder="(555) 000-0000"
                  />
                </div>
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Candidate Resume (PDF Document Format) <span className="text-rose-600">*</span>
                </label>
                <ResumeUploader onUpload={(file) => setResumeFile(file)} isSubmitting={submitting} />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded font-bold bg-blue-900 hover:bg-blue-800 text-white text-xs shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Orchestrating Spec-Driven AI Assessment...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Submit Official Application</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
