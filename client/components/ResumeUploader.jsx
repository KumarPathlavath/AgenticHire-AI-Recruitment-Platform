"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, X, ShieldCheck } from "lucide-react";

export default function ResumeUploader({ onUpload, isSubmitting = false }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError(null);
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith(".pdf")) {
      setError("Please attach a valid PDF document format.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size exceeds the 10 MB document limit.");
      return;
    }

    setFile(selectedFile);
    if (onUpload) {
      onUpload(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
    if (onUpload) onUpload(null);
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-5 sm:p-6 text-center transition-all duration-150 cursor-pointer ${
          dragActive
            ? "border-blue-900 bg-blue-50"
            : file
            ? "border-emerald-400 bg-emerald-50/50"
            : "border-slate-300 hover:border-slate-400 bg-slate-50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handleChange}
          disabled={isSubmitting}
        />

        {file ? (
          <div className="flex items-center justify-between p-3 rounded bg-white border border-slate-300 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-emerald-100 flex items-center justify-center text-emerald-800 flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 truncate max-w-[220px] sm:max-w-xs">{file.name}</p>
                <p className="text-[11px] text-slate-500">{(file.size / 1024).toFixed(1)} KB • PDF Document (Verified)</p>
              </div>
            </div>
            {!isSubmitting && (
              <button
                type="button"
                onClick={removeFile}
                className="p-1 rounded text-slate-400 hover:text-rose-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900 shadow-xs">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                Click to attach resume or drag & drop file here
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Accepted format: PDF up to 10 MB</p>
            </div>
          </div>
        )}

        {isSubmitting && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xs rounded-lg flex items-center justify-center gap-2 text-xs text-blue-900 font-bold">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing document and initializing AI evaluation chain...</span>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-700 font-semibold">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
