"use client";

import React, { useState } from "react";
import { UserCheck, CheckCircle, XCircle, AlertTriangle, Loader2, X, Landmark, ShieldCheck } from "lucide-react";

export default function ApprovalModal({ isOpen, onClose, onApprove, workflow, candidate }) {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAction = async (decision) => {
    setIsSubmitting(true);
    try {
      await onApprove(decision, notes);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-lg bg-white border border-slate-300 shadow-xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200">
          <div className="w-10 h-10 rounded bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Official Officer Approval Checkpoint</h3>
            <p className="text-xs text-slate-500">Mandatory human-in-the-loop review and sign-off decision</p>
          </div>
        </div>

        {/* Candidate Context */}
        <div className="p-4 rounded bg-slate-50 border border-slate-200 mb-4 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Candidate Name:</span>
            <span className="font-bold text-slate-900">{candidate?.name || "Applicant"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">AI Evaluated Match:</span>
            <span className="font-black text-emerald-700">{candidate?.match_score || "N/A"}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Spec Recommendation:</span>
            <span className="capitalize font-bold text-blue-900">{candidate?.status || "Shortlisted"}</span>
          </div>
        </div>

        {/* Recruiter Notes */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Officer Audit Notes & Interview Instructions (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter any specific directives or focus areas for the interview generation agent..."
            rows={3}
            className="w-full px-3 py-2 rounded border border-slate-300 bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={() => handleAction("rejected")}
            disabled={isSubmitting}
            className="px-3.5 py-2 rounded text-xs font-bold bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            Reject Dossier
          </button>
          <button
            type="button"
            onClick={() => handleAction("approved")}
            disabled={isSubmitting}
            className="px-4 py-2 rounded text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            )}
            Sign-Off & Authorize Interview Generation
          </button>
        </div>
      </div>
    </div>
  );
}
