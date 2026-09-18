"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../../../lib/api";
import {
  Briefcase,
  ArrowLeft,
  Plus,
  X,
  Loader2,
  AlertCircle,
  Landmark,
  ShieldCheck,
} from "lucide-react";

export default function CreateJobPage() {
  const router = useRouter();

  const [title, setTitle] = useState("Frontend Developer");
  const [description, setDescription] = useState(
    "We are seeking an experienced Frontend Developer to build high-performance React and Next.js user interfaces with stateful AI agent workflows."
  );
  const [requiredSkills, setRequiredSkills] = useState(["React", "JavaScript", "CSS"]);
  const [preferredSkills, setPreferredSkills] = useState(["Next.js", "Tailwind CSS", "TypeScript"]);
  const [minExperience, setMinExperience] = useState(2);
  const [newRequiredSkill, setNewRequiredSkill] = useState("");
  const [newPreferredSkill, setNewPreferredSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addRequiredSkill = () => {
    if (newRequiredSkill.trim() && !requiredSkills.includes(newRequiredSkill.trim())) {
      setRequiredSkills([...requiredSkills, newRequiredSkill.trim()]);
      setNewRequiredSkill("");
    }
  };

  const removeRequiredSkill = (skill) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill));
  };

  const addPreferredSkill = () => {
    if (newPreferredSkill.trim() && !preferredSkills.includes(newPreferredSkill.trim())) {
      setPreferredSkills([...preferredSkills, newPreferredSkill.trim()]);
      setNewPreferredSkill("");
    }
  };

  const removePreferredSkill = (skill) => {
    setPreferredSkills(preferredSkills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (requiredSkills.length === 0) {
      setError("Please specify at least one required skill for this requisition.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.createJob({
        title,
        description,
        required_skills: requiredSkills,
        preferred_skills: preferredSkills,
        min_experience: Number(minExperience),
        workflow_spec_id: "default-hiring-workflow",
        hiring_spec_id: "frontend-developer",
      });

      if (res.success) {
        router.push("/dashboard/jobs");
      } else {
        setError(res.message || "Failed to create job requisition");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Back Link */}
      <Link
        href="/dashboard/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Requisitions
      </Link>

      <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Create Job Requisition Notice</h1>
            <p className="text-xs text-slate-600">
              Declare qualification criteria and experience thresholds for spec-driven AI matching
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Position Title <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
              placeholder="e.g. Senior Systems Analyst"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Position Description & Scope <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 leading-relaxed"
              placeholder="Describe the duties, responsibilities, and expected technical proficiencies..."
            />
          </div>

          {/* Required Skills */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Mandatory Required Skills (Spec Matching Weight: 50%)
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={newRequiredSkill}
                onChange={(e) => setNewRequiredSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addRequiredSkill();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded border border-slate-300 bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900"
                placeholder="Type skill and press Add or Enter (e.g. React)..."
              />
              <button
                type="button"
                onClick={addRequiredSkill}
                className="px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[30px]">
              {requiredSkills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeRequiredSkill(skill)}
                    className="hover:text-rose-700 text-slate-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Skills */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Preferred / Secondary Qualifications (Spec Matching Weight: 25%)
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={newPreferredSkill}
                onChange={(e) => setNewPreferredSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addPreferredSkill();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded border border-slate-300 bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900"
                placeholder="Type preferred skill and press Add or Enter..."
              />
              <button
                type="button"
                onClick={addPreferredSkill}
                className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[30px]">
              {preferredSkills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removePreferredSkill(skill)}
                    className="hover:text-rose-700 text-slate-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Minimum Experience */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Minimum Required Experience (Years)
            </label>
            <input
              type="number"
              min={0}
              max={25}
              value={minExperience}
              onChange={(e) => setMinExperience(e.target.value)}
              className="w-full sm:w-40 px-3 py-2 rounded border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-900"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <Link
              href="/dashboard/jobs"
              className="px-4 py-2 rounded text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded font-bold bg-blue-900 hover:bg-blue-800 text-white text-xs shadow-xs flex items-center gap-2 transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publish Official Requisition"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
