"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../../lib/api";
import Navbar from "../../../components/Navbar";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Layers,
  Award,
  Loader2,
  Building2,
  Landmark,
} from "lucide-react";

export default function PublicJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.jobId;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await api.getJob(jobId);
        if (res.success) {
          setJob(res.job);
        } else {
          setError(res.message || "Job requisition not found");
        }
      } catch (err) {
        setError(err.message || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-blue-900 gap-3">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-xs font-bold">Loading official position bulletin...</span>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Job Requisition Bulletin Not Found</h2>
          <p className="text-xs text-slate-600">
            {error || "The position you are looking for does not exist or the recruitment window has closed."}
          </p>
          <Link
            href="/"
            className="inline-block px-4 py-2 rounded bg-blue-900 text-white text-xs font-bold"
          >
            Back to Public Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header Hero */}
        <div className="p-6 sm:p-8 rounded-lg bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-900 text-[11px] font-bold uppercase tracking-wider mb-2">
                <Landmark className="w-3.5 h-3.5" />
                Official Recruitment Notice
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{job.title}</h1>
              <p className="text-xs text-slate-500 mt-1">
                Published by {job.creator?.name || "Talent Assessment Board"} • {job.candidate_count || 0} applications received
              </p>
            </div>

            <Link
              href={`/jobs/${job._id}/apply`}
              className="px-6 py-3 rounded font-bold bg-blue-900 hover:bg-blue-800 text-white text-xs shadow-xs flex items-center justify-center gap-2 transition-colors self-start sm:self-auto"
            >
              <span>Submit Public Application</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Position Overview & Scope</h3>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </div>

          {/* Required Skills */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-900" />
              Mandatory Minimum Qualification Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {(job.required_skills || []).map((skill, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Skills */}
          {job.preferred_skills && job.preferred_skills.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-700" />
                Desirable Secondary Competencies
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {job.preferred_skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.min_experience > 0 && (
            <div className="pt-4 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-700 font-medium">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>
                Minimum Experience Threshold: <strong className="text-slate-900">{job.min_experience} years</strong>
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
