"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import {
  ShieldCheck,
  LogOut,
  User,
  LayoutDashboard,
  Briefcase,
  Users,
  GitBranch,
  BarChart3,
  Landmark,
} from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Official Logo & Agency Title */}
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-3 group py-2">
          <div className="w-10 h-10 rounded-lg bg-blue-900 border border-blue-950 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <Landmark className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                Agent<span className="text-blue-900">Hire</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                Official Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
              National Talent & AI Assessment Board
            </p>
          </div>
        </Link>

        {/* Navigation Links (if logged in) */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                pathname === "/dashboard"
                  ? "bg-blue-900 text-white shadow-xs"
                  : "text-slate-700 hover:text-blue-900 hover:bg-slate-100"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Overview
            </Link>
            <Link
              href="/dashboard/jobs"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                pathname.startsWith("/dashboard/jobs")
                  ? "bg-blue-900 text-white shadow-xs"
                  : "text-slate-700 hover:text-blue-900 hover:bg-slate-100"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Job Requisitions
            </Link>
            <Link
              href="/dashboard/candidates"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                pathname.startsWith("/dashboard/candidates")
                  ? "bg-blue-900 text-white shadow-xs"
                  : "text-slate-700 hover:text-blue-900 hover:bg-slate-100"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Candidate Dossiers
            </Link>
            <Link
              href="/dashboard/workflows"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                pathname.startsWith("/dashboard/workflows")
                  ? "bg-blue-900 text-white shadow-xs"
                  : "text-slate-700 hover:text-blue-900 hover:bg-slate-100"
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              LangGraph Workflows
            </Link>
            <Link
              href="/dashboard/analytics"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                pathname.startsWith("/dashboard/analytics")
                  ? "bg-blue-900 text-white shadow-xs"
                  : "text-slate-700 hover:text-blue-900 hover:bg-slate-100"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Compliance Analytics
            </Link>
          </nav>
        )}

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 border border-slate-200 text-xs text-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-800" />
                <span className="font-semibold text-slate-900">{user?.name || user?.email}</span>
                <span className="text-[10px] text-slate-500 font-medium">(Officer)</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-md text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                title="Sign out of portal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 transition-colors"
              >
                Officer Sign In
              </Link>
              <Link
                href="/signup"
                className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-blue-900 hover:bg-blue-800 text-white shadow-xs transition-colors"
              >
                Register Recruiter
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
