"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useWorkflowStore } from "../../../store/workflowStore";
import WorkflowCanvas from "../../../components/WorkflowCanvas";
import ApprovalModal from "../../../components/ApprovalModal";
import {
  GitBranch,
  RefreshCw,
  RotateCcw,
  UserCheck,
  Loader2,
  FileCode,
  ShieldCheck,
  Landmark,
} from "lucide-react";

function WorkflowsContent() {
  const searchParams = useSearchParams();
  const initialWorkflowId = searchParams.get("id");

  const {
    workflows,
    activeWorkflow,
    activeLogs,
    nodeStatesSpec,
    fetchSpecs,
    fetchWorkflows,
    fetchWorkflowById,
    approveCheckpoint,
    retryWorkflow,
    isLoading,
  } = useWorkflowStore();

  const [selectedWorkflowId, setSelectedWorkflowId] = useState(initialWorkflowId || null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    fetchSpecs();
    fetchWorkflows();
  }, [fetchSpecs, fetchWorkflows]);

  useEffect(() => {
    if (workflows.length > 0 && !selectedWorkflowId) {
      setSelectedWorkflowId(workflows[0]._id);
    }
  }, [workflows, selectedWorkflowId]);

  useEffect(() => {
    if (selectedWorkflowId) {
      fetchWorkflowById(selectedWorkflowId);
    }
  }, [selectedWorkflowId, fetchWorkflowById]);

  const handleApprove = async (decision, notes) => {
    if (!selectedWorkflowId) return;
    await approveCheckpoint(selectedWorkflowId, decision, notes);
  };

  const handleRetry = async () => {
    if (!selectedWorkflowId) return;
    setIsRetrying(true);
    try {
      await retryWorkflow(selectedWorkflowId);
    } finally {
      setIsRetrying(false);
    }
  };

  const currentWorkflow = activeWorkflow || workflows.find((w) => w._id === selectedWorkflowId);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            LangGraph Multi-Agent Evaluation DAGs
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time visual state graph, mandatory human officer approval checkpoint, and execution trace logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              fetchWorkflows();
              if (selectedWorkflowId) fetchWorkflowById(selectedWorkflowId);
            }}
            className="p-2 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            title="Refresh workflow state"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-blue-900" : ""}`} />
          </button>

          {currentWorkflow?.status === "waiting_approval" && (
            <button
              onClick={() => setIsApprovalModalOpen(true)}
              className="px-3.5 py-2 rounded font-bold bg-amber-600 hover:bg-amber-700 text-white text-xs shadow-xs flex items-center gap-1.5 transition-colors animate-pulse"
            >
              <UserCheck className="w-4 h-4" />
              Officer Sign-Off Required
            </button>
          )}

          {currentWorkflow?.status === "failed" && (
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="px-3.5 py-2 rounded font-bold bg-rose-700 hover:bg-rose-800 text-white text-xs shadow-xs flex items-center gap-1.5 transition-colors"
            >
              {isRetrying ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
              Retry Node ({currentWorkflow?.current_state})
            </button>
          )}
        </div>
      </div>

      {/* Workflow Selector Tabs */}
      {workflows.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {workflows.map((wf) => (
            <button
              key={wf._id}
              onClick={() => {
                setSelectedWorkflowId(wf._id);
                setSelectedNode(null);
              }}
              className={`px-3 py-2 rounded text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 shadow-xs ${
                selectedWorkflowId === wf._id
                  ? "bg-blue-900 border-blue-900 text-white"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  wf.status === "completed"
                    ? "bg-emerald-500"
                    : wf.status === "waiting_approval"
                    ? "bg-amber-400 animate-ping"
                    : wf.status === "failed"
                    ? "bg-rose-500"
                    : "bg-blue-400"
                }`}
              />
              <span>{wf.candidate_id?.name || "Application"}</span>
              <span className={`text-[10px] font-normal ${selectedWorkflowId === wf._id ? "text-blue-200" : "text-slate-500"}`}>
                ({wf.job_id?.title || "Role"})
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main Workflow View */}
      {currentWorkflow ? (
        <div className="space-y-5">
          {/* React Flow Canvas Card */}
          <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider">Candidate DAG:</span>
                <span className="text-slate-900 font-bold">
                  {currentWorkflow.candidate_id?.name} • {currentWorkflow.job_id?.title}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Execution State:</span>
                <span className="font-bold text-blue-900 uppercase">{currentWorkflow.current_state}</span>
              </div>
            </div>

            <WorkflowCanvas
              workflow={currentWorkflow}
              nodeStatesSpec={nodeStatesSpec}
              onSelectNode={(nodeData) => setSelectedNode(nodeData)}
            />
          </div>

          {/* Node Telemetry and Workflow Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Selected Node Details */}
            <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-900" />
                Selected Agent Node Telemetry
              </h3>

              {selectedNode ? (
                <div className="space-y-2.5 text-xs bg-slate-50 p-4 rounded border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Agent Node:</span>
                    <span className="font-bold text-slate-900">{selectedNode.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Status:</span>
                    <span className="font-bold uppercase text-blue-900">{selectedNode.status}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block mb-0.5">Agent Responsibility:</span>
                    <p className="text-slate-700">{selectedNode.description}</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded border border-slate-200">
                  Click any node in the React Flow canvas above to inspect agent parameters and execution outputs.
                </div>
              )}
            </div>

            {/* Execution Trace Logs */}
            <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-blue-900" />
                LangGraph Execution Trace Logs
              </h3>

              <div className="max-h-64 overflow-y-auto space-y-2 text-xs font-mono pr-1">
                {activeLogs && activeLogs.length > 0 ? (
                  activeLogs.map((log) => (
                    <div
                      key={log._id}
                      className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-start gap-2.5"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                          log.status === "success"
                            ? "bg-emerald-600"
                            : log.status === "waiting_approval"
                            ? "bg-amber-500"
                            : log.status === "failed"
                            ? "bg-rose-600"
                            : "bg-blue-600 animate-pulse"
                        }`}
                      />
                      <div className="flex-1 min-w-0 font-sans">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-900 uppercase font-mono">{log.agent_name}</span>
                          <span className="text-slate-400">{new Date(log.created_at).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 truncate">
                          Status: <strong className="text-slate-800">{log.status}</strong> {log.error ? `• Error: ${log.error}` : ""}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500 text-xs py-4 text-center">No trace logs recorded yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-500 text-xs bg-white rounded-lg border border-slate-200">
          No active workflows. Submit a candidate application to start the autonomous LangGraph pipeline.
        </div>
      )}

      {/* Human Approval Checkpoint Modal */}
      <ApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onApprove={handleApprove}
        workflow={currentWorkflow}
        candidate={currentWorkflow?.candidate_id}
      />
    </div>
  );
}

export default function WorkflowsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 text-xs">
          Loading LangGraph workflows...
        </div>
      }
    >
      <WorkflowsContent />
    </Suspense>
  );
}
