"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import Navbar from "../components/Navbar";
import {
  ShieldCheck,
  ArrowRight,
  GitBranch,
  UserCheck,
  Layers,
  FileCode,
  Building2,
  CheckCircle2,
  FileSpreadsheet,
  Award,
  Search,
  Lock,
  Landmark,
  Scale,
  FileText,
} from "lucide-react";

export default function HomePage() {
  const { isAuthenticated, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* Official Hero Banner Section */}
        <section className="bg-white border-b border-slate-200 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider">
                  <Landmark className="w-3.5 h-3.5 text-blue-800" />
                  National Recruitment & AI Evaluation Framework
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Public Sector & Enterprise Talent Assessment Portal
                </h1>

                <p className="text-base text-slate-700 leading-relaxed">
                  The official centralized platform for receiving candidate credentials, running transparent spec-driven multi-agent AI assessments, enforcing human officer approval checkpoints, and managing structured hiring funnels.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <Link
                    href={isAuthenticated ? "/dashboard" : "/signup"}
                    className="px-6 py-3 rounded-md font-bold bg-blue-900 hover:bg-blue-800 text-white text-sm shadow-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>{isAuthenticated ? "Access Officer Console" : "Recruiter Portal Sign In"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/dashboard/jobs"
                    className="px-6 py-3 rounded-md font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Search className="w-4 h-4 text-blue-900" />
                    <span>View Public Job Bulletins</span>
                  </Link>
                </div>

                {/* Quick Security & Compliance Note */}
                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1 text-slate-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Spec-Driven Architecture
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 text-slate-700">
                    <Scale className="w-4 h-4 text-blue-700" />
                    Mandatory Human Checkpoint
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 text-slate-700">
                    <Award className="w-4 h-4 text-amber-600" />
                    Audit-Logged Telemetry
                  </span>
                </div>
              </div>

              {/* Official Portal Notice Card */}
              <div className="lg:col-span-5">
                <div className="p-6 rounded-lg bg-slate-50 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-200 text-slate-900 font-bold text-sm uppercase tracking-wide">
                    <Building2 className="w-4 h-4 text-blue-900" />
                    Official Portal Services
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded bg-white border border-slate-200 flex items-start gap-3">
                      <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-900 flex-shrink-0 font-bold text-xs">
                        1
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Job Bulletin Publication</h4>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          Create requisitions governed by strict qualification criteria defined in <code className="text-blue-900 font-mono">/specs</code>.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded bg-white border border-slate-200 flex items-start gap-3">
                      <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-900 flex-shrink-0 font-bold text-xs">
                        2
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Public Application Submission</h4>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          Candidates submit resumes via secure public routes for automated OCR and semantic RAG matching.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded bg-white border border-slate-200 flex items-start gap-3">
                      <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-900 flex-shrink-0 font-bold text-xs">
                        3
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Human Officer Approval Gate</h4>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          Autonomous pipelines halt at the human approval node for official officer sign-off before interview dispatch.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7-Agent Standard Workflow Section */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Standard Multi-Agent Assessment Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Every candidate dossier is evaluated across 7 sequential agents orchestrated by LangGraph and spec configurations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded bg-blue-50 text-blue-900 flex items-center justify-center font-bold text-xs mb-3">
                01
              </div>
              <h3 className="text-sm font-bold text-slate-900">1. Resume Parser</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Extracts verified work history, educational credentials, and skill sets directly from candidate PDF files.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded bg-blue-50 text-blue-900 flex items-center justify-center font-bold text-xs mb-3">
                02
              </div>
              <h3 className="text-sm font-bold text-slate-900">2. Embedding Agent</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generates high-dimensional vector embeddings using BAAI/bge-small and stores chunks into Qdrant.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded bg-blue-50 text-blue-900 flex items-center justify-center font-bold text-xs mb-3">
                03
              </div>
              <h3 className="text-sm font-bold text-slate-900">3. Matching Agent</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compares applicant experience against job required and preferred skills using spec-governed scoring weights.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded bg-blue-50 text-blue-900 flex items-center justify-center font-bold text-xs mb-3">
                04
              </div>
              <h3 className="text-sm font-bold text-slate-900">4. Shortlisting Agent</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Categorizes candidate status (Shortlisted $\ge$80%, Hold 60-79%, Rejected &lt;60%) strictly from spec rules.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white border-2 border-amber-300 bg-amber-50/40 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs mb-3">
                05
              </div>
              <h3 className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-amber-700" />
                5. Human Approval
              </h3>
              <p className="text-xs text-amber-950/80 leading-relaxed">
                <strong>Mandatory Checkpoint:</strong> Pipeline halts automatically and waits for recruiter officer review and notes.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded bg-blue-50 text-blue-900 flex items-center justify-center font-bold text-xs mb-3">
                06
              </div>
              <h3 className="text-sm font-bold text-slate-900">6. Interview Agent</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Constructs 3 structured, role-specific interview questions along with an objective scoring rubric.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded bg-blue-50 text-blue-900 flex items-center justify-center font-bold text-xs mb-3">
                07
              </div>
              <h3 className="text-sm font-bold text-slate-900">7. Email Agent</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generates formal candidate dispatch notifications and dispatches via configured email delivery.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-blue-900 text-white shadow-xs space-y-2 flex flex-col justify-center">
              <h3 className="text-sm font-bold">Ready to Start?</h3>
              <p className="text-xs text-blue-200">
                Log into the recruiter portal to publish positions and inspect real-time agent execution DAGs.
              </p>
              <Link
                href="/login"
                className="mt-2 inline-block px-3.5 py-2 rounded bg-white hover:bg-slate-100 text-blue-950 text-xs font-bold text-center transition-colors"
              >
                Sign In as Officer &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Public Sector Notice & Compliance Section */}
        <section className="bg-slate-100 border-t border-b border-slate-200 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-6 rounded-lg border border-slate-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded bg-blue-900 text-white flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Fairness, Transparency & Spec-Driven Governance
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    All hiring thresholds, retry policies, prompt templates, and evaluation criteria are strictly declared in machine-readable <code className="text-blue-900 bg-slate-100 px-1 py-0.5 rounded font-mono">/specs</code>. No arbitrary logic is embedded in application controllers.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  Audit Verified
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Official Government Footer */}
      <footer className="bg-white border-t border-slate-200 text-xs text-slate-600 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-blue-900" />
              <span className="font-bold text-slate-900">AgentHire</span>
              <span>— National AI Recruitment & Talent Assessment Board</span>
            </div>
            <div className="flex items-center gap-4 text-slate-500 text-[11px]">
              <Link href="/login" className="hover:text-blue-900">
                Officer Portal
              </Link>
              <span>•</span>
              <Link href="/dashboard/jobs" className="hover:text-blue-900">
                Job Notices
              </Link>
              <span>•</span>
              <span className="text-slate-400">Accessibility Standards</span>
              <span>•</span>
              <span className="text-slate-400">Privacy & Terms</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>© 2026 AgentHire Public Sector Talent Platform. All official rights reserved.</p>
            <p>Spec-Driven Multi-Agent Architecture • LangGraph Engine</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
