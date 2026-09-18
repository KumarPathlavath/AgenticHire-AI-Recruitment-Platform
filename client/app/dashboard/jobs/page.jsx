"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../../lib/api";
import {
  Briefcase,
  Plus,
  Copy,
  Check,
  ExternalLink,
  Users,
  Clock,
  Search,
  Building2,
  FileSpreadsheet,
} from "lucide-react";

export default function JobsManagementPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.getJobs();
      if (res.success) {
        setJobs(res.jobs || []);
      }
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const copyApplyLink = (jobId) => {
    const url = `${window.location.origin}/jobs/${jobId}/apply`;
    navigator.clipboard.writeText(url);
    setCopiedId(jobId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (j.required_skills || []).some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Job Requisition Notices</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage open recruitment postings, copy public applicant links, and track candidate submissions
          </p>
        </div>
        <Link
          href="/dashboard/jobs/create"
          className="px-3.5 py-2 rounded bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Requisition
        </Link>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Filter requisitions by title or skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3.5 py-2 rounded border border-slate-300 bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 shadow-xs transition-colors"
        />
      </div>

      {/* Jobs List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job._id}
            className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {job.status || "Active Posting"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyApplyLink(job._id)}
                  className="px-3 py-1.5 rounded text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 flex items-center gap-1.5 transition-colors shadow-xs"
                  title="Copy public candidate apply link"
                >
                  {copiedId === job._id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="text-emerald-700">Link Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-blue-900" />
                      <span>Copy Public Link</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/jobs/${job._id}`}
                  target="_blank"
                  className="p-1.5 rounded bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-300 transition-colors shadow-xs"
                  title="Preview public job posting"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Skills & Experience */}
            <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-600 mr-1">Required Skills:</span>
              {(job.required_skills || []).map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 text-[11px] font-semibold"
                >
                  {skill}
                </span>
              ))}

              {job.min_experience > 0 && (
                <span className="ml-auto text-[11px] text-slate-600 font-medium">
                  Min Experience: <strong className="text-slate-900">{job.min_experience} yrs</strong>
                </span>
              )}
            </div>
          </div>
        ))}

        {!loading && filteredJobs.length === 0 && (
          <div className="p-12 text-center rounded-lg bg-white border border-dashed border-slate-300 text-slate-500 text-xs space-y-3">
            <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
            <p>No job requisitions found matching your filter.</p>
            <Link
              href="/dashboard/jobs/create"
              className="inline-flex items-center gap-1 text-blue-900 hover:underline font-bold"
            >
              Create your first job requisition
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
