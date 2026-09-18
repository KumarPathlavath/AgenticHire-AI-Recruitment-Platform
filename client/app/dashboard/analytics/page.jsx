"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Activity,
  Layers,
  RefreshCw,
  Landmark,
  ShieldCheck,
} from "lucide-react";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
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
    fetchAnalytics();
  }, []);

  const overview = analytics?.overview || {};
  const candidateStats = analytics?.candidateStats || {};
  const workflowStats = analytics?.workflowStats || {};
  const agentMetrics = analytics?.agentMetrics || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Recruitment Quality Assurance & Analytics
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Spec compliance metrics, candidate evaluation funnels, and agent execution reliability
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="p-2 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs self-start sm:self-auto"
          title="Refresh analytics data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-900" : ""}`} />
        </button>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Shortlist Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-black text-emerald-700">{overview.shortlistRate || 0}%</div>
          <p className="text-[11px] text-slate-500">Candidates meeting &ge; 80% spec qualification threshold</p>
        </div>

        <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Pipeline Completion</span>
            <Activity className="w-4 h-4 text-blue-900" />
          </div>
          <div className="text-3xl font-black text-blue-900">{overview.completionRate || 0}%</div>
          <p className="text-[11px] text-slate-500">Completed 7-agent execution pipelines</p>
        </div>

        <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Average Match Score</span>
            <ShieldCheck className="w-4 h-4 text-blue-900" />
          </div>
          <div className="text-3xl font-black text-slate-900">{overview.averageMatchScore || 0}%</div>
          <p className="text-[11px] text-slate-500">Mean applicant merit rating across all postings</p>
        </div>
      </div>

      {/* Candidate Funnel & Workflow State Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Candidate Distribution */}
        <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Layers className="w-4 h-4 text-blue-900" />
            Candidate Merit Funnel Breakdown
          </h3>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between text-slate-800 font-semibold mb-1">
                <span>Shortlisted (&ge; 80%)</span>
                <span className="text-emerald-700 font-bold">{candidateStats.shortlisted || 0}</span>
              </div>
              <div className="w-full h-2 rounded bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded"
                  style={{
                    width: `${
                      overview.totalCandidates > 0
                        ? ((candidateStats.shortlisted || 0) / overview.totalCandidates) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-800 font-semibold mb-1">
                <span>On Hold / Manual Review (60 - 79%)</span>
                <span className="text-amber-700 font-bold">{candidateStats.hold || 0}</span>
              </div>
              <div className="w-full h-2 rounded bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded"
                  style={{
                    width: `${
                      overview.totalCandidates > 0
                        ? ((candidateStats.hold || 0) / overview.totalCandidates) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-800 font-semibold mb-1">
                <span>Rejected (&lt; 60%)</span>
                <span className="text-rose-700 font-bold">{candidateStats.rejected || 0}</span>
              </div>
              <div className="w-full h-2 rounded bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-rose-600 rounded"
                  style={{
                    width: `${
                      overview.totalCandidates > 0
                        ? ((candidateStats.rejected || 0) / overview.totalCandidates) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Workflow State Distribution */}
        <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Activity className="w-4 h-4 text-blue-900" />
            Workflow Execution Distribution
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-600 font-medium block mb-1">Completed</span>
              <span className="text-xl font-bold text-emerald-700">{workflowStats.completed || 0}</span>
            </div>
            <div className="p-3.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-600 font-medium block mb-1">Awaiting Sign-off</span>
              <span className="text-xl font-bold text-amber-700">{workflowStats.waiting_approval || 0}</span>
            </div>
            <div className="p-3.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-600 font-medium block mb-1">In Execution</span>
              <span className="text-xl font-bold text-blue-900">{workflowStats.running || 0}</span>
            </div>
            <div className="p-3.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-600 font-medium block mb-1">Failed / Retrying</span>
              <span className="text-xl font-bold text-rose-700">{workflowStats.failed || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Execution Reliability Table */}
      <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <ShieldCheck className="w-4 h-4 text-blue-900" />
          Agent Execution Reliability & Performance Telemetry
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 text-slate-700 bg-slate-50 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-2.5 px-3">Agent Node Name</th>
                <th className="py-2.5 px-3">Total Executions</th>
                <th className="py-2.5 px-3">Success Rate</th>
                <th className="py-2.5 px-3">Logged Failures</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {agentMetrics.map((am, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900 uppercase font-mono">{am.agent}</td>
                  <td className="py-3 px-3 font-medium">{am.executions} runs</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-emerald-700">{am.successRate}%</span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{am.failures}</td>
                </tr>
              ))}

              {agentMetrics.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-500">
                    Agent metrics will record continuously as workflows execute.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
