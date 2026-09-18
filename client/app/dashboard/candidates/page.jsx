"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import CandidateModal from "../../../components/CandidateModal";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  FileText,
  Building2,
  ShieldCheck,
} from "lucide-react";

export default function CandidatesListPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await api.getCandidates();
      if (res.success) {
        setCandidates(res.candidates || []);
      }
    } catch (err) {
      console.error("Failed to load candidates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.job_id?.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Candidate Dossiers & Assessments</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Inspect parsed applicant credentials, RAG vector match scores, and AI interview materials
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search candidates by name, email, or applied position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded border border-slate-300 bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 shadow-xs"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 rounded border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-900 shadow-xs font-medium"
        >
          <option value="all">All Statuses</option>
          <option value="shortlisted">Shortlisted (&ge;80%)</option>
          <option value="hold">On Hold (60-79%)</option>
          <option value="rejected">Rejected (&lt;60%)</option>
          <option value="processing">In Processing</option>
        </select>
      </div>

      {/* Candidates Table */}
      <div className="rounded-lg bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Candidate Applicant</th>
                <th className="py-3 px-4">Applied Requisition</th>
                <th className="py-3 px-4">Merit Score</th>
                <th className="py-3 px-4">Evaluation Status</th>
                <th className="py-3 px-4 text-right">Official Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {filteredCandidates.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{c.name}</div>
                    <div className="text-[11px] text-slate-500">{c.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {c.job_id?.title || "Requisition"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-black text-sm ${
                        (c.match_score || 0) >= 80
                          ? "text-emerald-700"
                          : (c.match_score || 0) >= 60
                          ? "text-amber-700"
                          : "text-rose-700"
                      }`}
                    >
                      {c.match_score !== null && c.match_score !== undefined
                        ? `${c.match_score}%`
                        : "Pending"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        c.status === "shortlisted"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : c.status === "hold"
                          ? "bg-amber-50 text-amber-800 border-amber-300"
                          : c.status === "rejected"
                          ? "bg-rose-50 text-rose-800 border-rose-300"
                          : "bg-blue-50 text-blue-900 border-blue-200"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedCandidate(c)}
                      className="px-2.5 py-1.5 rounded bg-white hover:bg-slate-100 text-blue-900 border border-slate-300 font-bold inline-flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Dossier</span>
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No candidate dossiers found matching the criteria. Public applications will appear here automatically.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Inspector Modal */}
      <CandidateModal
        isOpen={Boolean(selectedCandidate)}
        onClose={() => setSelectedCandidate(null)}
        candidate={selectedCandidate}
      />
    </div>
  );
}
