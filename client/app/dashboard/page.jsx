"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../lib/api";
import {
  Briefcase,
  Users,
  GitBranch,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Plus,
  ShieldCheck,
  Building2,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.getAnalytics();
      if (res.success) {
        setAnalytics(res.analytics);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const overview = analytics?.overview || {
    totalJobs: 0,
    totalCandidates: 0,
    totalWorkflows: 0,
    shortlistRate: 0,
    completionRate: 0,
  };

  const statCards = [
    {
      title: "Active Job Requisitions",
      value: overview.totalJobs,
      icon: Briefcase,
      color: "text-blue-900",
      bg: "bg-blue-50",
      border: "border-slate-200",
    },
    {
      title: "Registered Candidates",
      value: overview.totalCandidates,
      icon: Users,
      color: "text-blue-900",
      bg: "bg-blue-50",
      border: "border-slate-200",
    },
    {
      title: "LangGraph Pipelines",
      value: overview.totalWorkflows,
      icon: GitBranch,
      color: "text-blue-900",
      bg: "bg-blue-50",
      border: "border-slate-200",
    },
    {
      title: "Spec Shortlist Rate",
      value: `${overview.shortlistRate}%`,
      icon: CheckCircle2,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-slate-200",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Recruitment Operations & Candidate Assessment
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
              Live Console
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Spec-governed scoring, officer checkpoints, and autonomous LangGraph evaluation DAGs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchStats}
            className="p-2 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-900" : ""}`} />
          </button>
          <Link
            href="/dashboard/jobs/create"
            className="px-3.5 py-2 rounded bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Job
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-lg bg-white border ${stat.border} shadow-xs space-y-2`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">{stat.title}</span>
                <div className={`w-8 h-8 rounded ${stat.bg} flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Multi-Agent Workflows Section */}
      <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-blue-900" />
            <h2 className="text-sm font-bold text-slate-900">Recent Candidate Evaluation Workflows</h2>
          </div>
          <Link
            href="/dashboard/workflows"
            className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
          >
            <span>Inspect in React Flow</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {analytics?.recentWorkflows && analytics.recentWorkflows.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {analytics.recentWorkflows.map((wf) => (
              <div key={wf._id} className="py-3 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      wf.status === "completed"
                        ? "bg-emerald-600"
                        : wf.status === "waiting_approval"
                        ? "bg-amber-500 animate-pulse"
                        : wf.status === "failed"
                        ? "bg-rose-600"
                        : "bg-blue-600 animate-pulse"
                    }`}
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900">
                      {wf.candidate_id?.name || "Candidate Application"}
                    </span>
                    <span className="text-[11px] text-slate-500 ml-2">
                      for <strong className="text-slate-700">{wf.job_id?.title || "Requisition"}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 border border-slate-200 text-slate-700">
                    Step: {wf.current_state}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    Score:{" "}
                    <span className="text-emerald-700">
                      {wf.candidate_id?.match_score !== null && wf.candidate_id?.match_score !== undefined
                        ? `${wf.candidate_id.match_score}%`
                        : "Evaluating"}
                    </span>
                  </span>
                  <Link
                    href={`/dashboard/workflows?id=${wf._id}`}
                    className="px-2.5 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200 transition-colors"
                  >
                    Inspect Trace
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs">
            No active workflows logged. Create a job and submit a candidate resume to trigger the LangGraph pipeline.
          </div>
        )}
      </div>
    </div>
  );
}
