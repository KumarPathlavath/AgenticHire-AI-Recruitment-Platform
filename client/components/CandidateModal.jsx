"use client";

import React, { useState } from "react";
import { X, CheckCircle2, XCircle, Mail, HelpCircle, FileText, Award, Calendar, Briefcase, Landmark } from "lucide-react";

export default function CandidateModal({ isOpen, onClose, candidate }) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!isOpen || !candidate) return null;

  const parsed = candidate.parsed_resume_json || {};
  const matchDetails = candidate.match_details || {};
  const interview = candidate.interview_data || {};
  const emailData = candidate.email_data || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-lg bg-white border border-slate-300 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded bg-blue-900 flex items-center justify-center text-white font-bold text-base shadow-xs">
              {candidate.name?.charAt(0) || "C"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{candidate.name}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-200">
                  Official Dossier
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {candidate.email} • {candidate.phone || "No phone provided"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-black text-slate-900">
                <span className={candidate.match_score >= 80 ? "text-emerald-700" : candidate.match_score >= 60 ? "text-amber-700" : "text-rose-700"}>
                  {candidate.match_score || 0}%
                </span>
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Merit Score
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-5 bg-white">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === "overview"
                ? "border-blue-900 text-blue-900"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Overview & Qualifications
          </button>
          <button
            onClick={() => setActiveTab("interview")}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === "interview"
                ? "border-blue-900 text-blue-900"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Structured Interview Questions ({interview.questions?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("email")}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === "email"
                ? "border-blue-900 text-blue-900"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Official Notification Output
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50">
          {activeTab === "overview" && (
            <div className="space-y-5">
              {/* Summary */}
              {parsed.summary && (
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-900" />
                    Professional Background Summary
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">{parsed.summary}</p>
                </div>
              )}

              {/* Skills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Matched Required Skills */}
                <div className="p-4 rounded-lg bg-white border border-emerald-300 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Verified Matched Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(matchDetails.matched_required_skills || parsed.skills || []).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="p-4 rounded-lg bg-white border border-rose-300 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5 mb-2.5">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Unmatched / Missing Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(matchDetails.missing_skills || []).length > 0 ? (
                      matchDetails.missing_skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-emerald-700 font-semibold italic">All required criteria satisfied</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Experience and Education */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
                  <h4 className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-2">
                    <Briefcase className="w-4 h-4 text-blue-900" />
                    Experience & Education Record
                  </h4>
                  <p className="text-slate-700">
                    <span className="font-bold text-slate-900">Total Experience:</span> {parsed.years_of_experience || 0} years
                  </p>
                  {parsed.education && parsed.education.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100 space-y-0.5">
                      <p className="text-slate-900 font-bold">{parsed.education[0].degree}</p>
                      <p className="text-slate-500">{parsed.education[0].institution}</p>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
                  <h4 className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-2">
                    <Award className="w-4 h-4 text-amber-700" />
                    Spec Scoring Weight Breakdown
                  </h4>
                  <div className="space-y-1 text-slate-700 font-medium">
                    <p>Required Skills (Weight: 50%): <strong className="text-slate-900">{matchDetails.breakdown?.required_skills_score || 0}%</strong></p>
                    <p>Preferred Skills (Weight: 25%): <strong className="text-slate-900">{matchDetails.breakdown?.preferred_skills_score || 0}%</strong></p>
                    <p>Experience Score (Weight: 25%): <strong className="text-slate-900">{matchDetails.breakdown?.experience_score || 0}%</strong></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "interview" && (
            <div className="space-y-4">
              {interview.questions && interview.questions.length > 0 ? (
                interview.questions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-900 border border-blue-200">
                        {q.category}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Topic: {q.topic}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900">{q.question}</p>
                    {q.expected_answer_points && (
                      <div className="mt-2 pt-2 border-t border-slate-100">
                        <p className="text-[11px] font-bold text-slate-700 mb-1">Evaluation Rubric & Benchmark Criteria:</p>
                        <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5">
                          {q.expected_answer_points.map((pt, pIdx) => (
                            <li key={pIdx}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs bg-white rounded-lg border border-slate-200">
                  Interview questions will generate automatically once the Human Officer checkpoint is approved.
                </div>
              )}
            </div>
          )}

          {activeTab === "email" && (
            <div>
              {emailData.email_payload ? (
                <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-3 font-mono text-xs shadow-xs">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-sans font-bold">Recipient:</span>
                    <span className="text-slate-900 font-semibold">{emailData.recipient}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-sans font-bold">Subject:</span>
                    <span className="text-blue-900 font-semibold">{emailData.email_payload.subject}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-sans font-bold">Delivery Provider:</span>
                    <span className="text-emerald-700 font-semibold">{emailData.provider}</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-slate-700 block mb-1 font-sans font-bold">Message Content:</span>
                    <pre className="whitespace-pre-wrap font-sans text-slate-800 text-xs bg-slate-50 p-4 rounded border border-slate-200 leading-relaxed">
                      {emailData.email_payload.text}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs bg-white rounded-lg border border-slate-200">
                  Official candidate notification will be generated when the email_agent node completes.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
