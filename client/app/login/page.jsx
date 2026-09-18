"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import Navbar from "../../components/Navbar";
import { ShieldCheck, Lock, Mail, Loader2, AlertCircle, Landmark, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("recruiter@agenthire.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push("/dashboard");
      } else {
        setError(res.message || "Invalid officer credentials");
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md bg-white p-8 rounded-lg border border-slate-300 shadow-sm space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-lg bg-blue-900 mx-auto flex items-center justify-center text-amber-300 shadow-xs">
              <Landmark className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Recruiter & Officer Sign In
            </h1>
            <p className="text-xs text-slate-600">
              Access the National Talent Assessment & LangGraph Console
            </p>
          </div>

          {/* Official Security Notice */}
          <div className="p-3 rounded bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-800 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Authorized Portal Access:</strong> For certified recruitment officers, hiring managers, and assessment evaluators.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Official Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded border border-slate-300 bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-colors"
                  placeholder="recruiter@agenthire.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Officer Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded border border-slate-300 bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded font-bold bg-blue-900 hover:bg-blue-800 text-white text-xs shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In to Portal"}
            </button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                setError(null);
                let res = await login("recruiter@agenthire.com", "password123");
                if (!res.success) {
                  const signupRes = await useAuthStore
                    .getState()
                    .signup("Alex Recruiter", "recruiter@agenthire.com", "password123");
                  if (signupRes.success) {
                    router.push("/dashboard");
                    return;
                  }
                } else {
                  router.push("/dashboard");
                  return;
                }
                setLoading(false);
              }}
              className="w-full py-2 rounded font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-900" />
              <span>1-Click Sign In (Official Demo Account)</span>
            </button>

            <div className="text-center text-xs text-slate-600">
              Need a recruiter account?{" "}
              <Link href="/signup" className="text-blue-900 font-bold hover:underline">
                Register as Recruiter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
