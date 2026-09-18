import "./globals.css";
import { Shield, Building2 } from "lucide-react";

export const metadata = {
  title: "AgentHire | National AI Recruitment & Talent Assessment Portal",
  description:
    "Official Spec-Driven Multi-Agent AI Recruitment Platform for Public Sector and Enterprise Hiring. Powered by LangGraph, Spec-Driven Development, and Human Officer Verification.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased flex flex-col selection:bg-blue-800 selection:text-white">
        {/* Official Top Government Bar */}
        <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 font-semibold text-white">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                Public Talent Assessment & Recruitment Portal
              </span>
              <span className="hidden sm:inline text-slate-500">|</span>
              <span className="hidden sm:inline text-slate-400">
                Official Spec-Driven Autonomous AI Evaluation System
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 text-[10px]">
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                <Shield className="w-3 h-3" />
                Official Public Portal • Secure & Verified
              </span>
              <span className="hidden md:inline text-slate-500">|</span>
              <span className="hidden md:inline">GovTech AI Standard v2.4</span>
            </div>
          </div>
        </div>

        {children}
      </body>
    </html>
  );
}
