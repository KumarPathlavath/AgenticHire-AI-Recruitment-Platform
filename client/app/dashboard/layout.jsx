"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "../../store/authStore";
import Navbar from "../../components/Navbar";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  GitBranch,
  BarChart3,
  PlusCircle,
  Loader2,
  FileSpreadsheet,
  ShieldCheck,
  Building2,
  CheckCircle,
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const { isAuthenticated, isLoading, initAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-blue-900 gap-3 p-4">
        <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900 shadow-xs">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-900">Loading Officer Console...</p>
          <p className="text-xs text-slate-500 mt-0.5">Verifying authenticated session credentials</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <div className="max-w-md w-full p-8 rounded-lg bg-white border border-slate-300 space-y-5 shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 mx-auto flex items-center justify-center text-blue-900">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Officer Session Required</h2>
            <p className="text-xs text-slate-600 mt-1">
              Please sign in to access the talent evaluation dashboard, candidate dossiers, and live workflow controls.
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <Link
              href="/login"
              className="w-full py-2.5 rounded font-bold bg-blue-900 hover:bg-blue-800 text-white text-xs shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Go to Officer Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: "Operations Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Job Requisitions", href: "/dashboard/jobs", icon: Briefcase },
    { label: "Candidate Dossiers", href: "/dashboard/candidates", icon: Users },
    { label: "LangGraph Workflows", href: "/dashboard/workflows", icon: GitBranch },
    { label: "Compliance Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-4">
          <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs space-y-4">
            <Link
              href="/dashboard/jobs/create"
              className="w-full py-2.5 px-3.5 rounded font-bold bg-blue-900 hover:bg-blue-800 text-white shadow-xs flex items-center justify-center gap-2 text-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Job Requisition</span>
            </Link>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold transition-colors ${
                      active
                        ? "bg-blue-900 text-white shadow-xs"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? "text-white" : "text-slate-500"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Spec Engine Info Box */}
          <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                Spec-Driven Engine
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                <CheckCircle className="w-3 h-3" />
                Active
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Scoring weights, retry policies, and prompts synchronized with <code className="text-blue-900 font-mono">/specs</code>.
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
