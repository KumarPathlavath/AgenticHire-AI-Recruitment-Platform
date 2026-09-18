"use client";

import React, { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  FileText,
  Binary,
  GitCompare,
  Filter,
  UserCheck,
  HelpCircle,
  Mail,
  Loader2,
} from "lucide-react";

// Agent node icon mapping
const AGENT_ICONS = {
  resume_parser: FileText,
  embedding_agent: Binary,
  matching_agent: GitCompare,
  shortlisting_agent: Filter,
  human_approval: UserCheck,
  interview_agent: HelpCircle,
  email_agent: Mail,
};

// Custom React Flow Node Component (Light Institutional Theme)
function AgentNodeComponent({ data }) {
  const Icon = AGENT_ICONS[data.id] || FileText;
  const isCurrent = data.isCurrent;
  const status = data.status || "pending";
  const stateSpec = data.stateSpec || {};

  // Status visual attributes based on node-states.json for light theme
  const statusColor = stateSpec.color || "#1e3a8a";
  const statusBg = stateSpec.background || "#ffffff";
  const statusBorder = stateSpec.border || "#cbd5e1";
  const badgeText = stateSpec.badge || status;

  return (
    <div
      className={`relative min-w-[210px] p-3.5 rounded-lg border transition-all duration-200 shadow-xs cursor-pointer ${
        isCurrent ? "ring-2 ring-blue-900 shadow-md" : ""
      }`}
      style={{
        backgroundColor: statusBg,
        borderColor: isCurrent ? "#1e3a8a" : statusBorder,
      }}
      onClick={() => data.onSelect?.(data)}
    >
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 bg-slate-400" />

      <div className="flex items-center justify-between gap-2 mb-2">
        <div
          className="w-7 h-7 rounded flex items-center justify-center text-white"
          style={{ backgroundColor: statusColor }}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
          style={{
            color: statusColor,
            borderColor: `${statusColor}40`,
            backgroundColor: `${statusColor}15`,
          }}
        >
          {badgeText}
        </span>
      </div>

      <div className="text-xs font-bold text-slate-900 tracking-tight">{data.label}</div>
      <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">{data.description}</div>

      {isCurrent && (
        <div className="mt-2 flex items-center gap-1 text-[10px] text-blue-900 font-bold">
          <Loader2 className="w-3 h-3 animate-spin" />
          Active Execution Node
        </div>
      )}

      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 bg-slate-400" />
    </div>
  );
}

const nodeTypes = {
  agentNode: AgentNodeComponent,
};

export default function WorkflowCanvas({ workflow, nodeStatesSpec, onSelectNode }) {
  const workflowSteps = useMemo(() => {
    return [
      { id: "resume_parser", label: "Resume Parser", description: "Extracts structured facts from PDF" },
      { id: "embedding_agent", label: "Embedding Agent", description: "Embeds & chunks to Qdrant" },
      { id: "matching_agent", label: "Matching Agent", description: "Evaluates skills against job specs" },
      { id: "shortlisting_agent", label: "Shortlisting Agent", description: "Applies spec score thresholds" },
      { id: "human_approval", label: "Human Approval", description: "Recruiter checkpoint decision" },
      { id: "interview_agent", label: "Interview Agent", description: "Generates tailored questions" },
      { id: "email_agent", label: "Email Agent", description: "Sends candidate notification" },
    ];
  }, []);

  const currentState = workflow?.current_state || "pending";
  const workflowStatus = workflow?.status || "pending";

  const { nodes, edges } = useMemo(() => {
    const calculatedNodes = [];
    const calculatedEdges = [];

    const defaultStates = nodeStatesSpec || {
      pending: { color: "#64748b", background: "#f8fafc", border: "#cbd5e1", badge: "Pending" },
      running: { color: "#1e3a8a", background: "#eff6ff", border: "#93c5fd", badge: "Running" },
      waiting_approval: { color: "#d97706", background: "#fffbeb", border: "#fde68a", badge: "Waiting Approval" },
      success: { color: "#16a34a", background: "#f0fdf4", border: "#bbf7d0", badge: "Completed" },
      failed: { color: "#dc2626", background: "#fef2f2", border: "#fecaca", badge: "Failed" },
    };

    let currentIndex = workflowSteps.findIndex((s) => s.id === currentState);
    if (workflowStatus === "completed") {
      currentIndex = workflowSteps.length;
    }

    workflowSteps.forEach((step, index) => {
      let nodeStatus = "pending";
      let isCurrent = false;

      if (workflowStatus === "completed") {
        nodeStatus = "success";
      } else if (index < currentIndex) {
        nodeStatus = "success";
      } else if (index === currentIndex) {
        if (workflowStatus === "waiting_approval" && step.id === "human_approval") {
          nodeStatus = "waiting_approval";
        } else if (workflowStatus === "failed") {
          nodeStatus = "failed";
        } else {
          nodeStatus = "running";
        }
        isCurrent = true;
      }

      calculatedNodes.push({
        id: step.id,
        type: "agentNode",
        position: { x: index * 250 + 20, y: 100 },
        data: {
          id: step.id,
          label: step.label,
          description: step.description,
          status: nodeStatus,
          isCurrent,
          stateSpec: defaultStates[nodeStatus] || defaultStates.pending,
          onSelect: onSelectNode,
        },
      });

      if (index < workflowSteps.length - 1) {
        calculatedEdges.push({
          id: `e-${step.id}-${workflowSteps[index + 1].id}`,
          source: step.id,
          target: workflowSteps[index + 1].id,
          animated: nodeStatus === "running" || nodeStatus === "waiting_approval",
          style: {
            stroke: index < currentIndex ? "#16a34a" : index === currentIndex ? "#1e3a8a" : "#cbd5e1",
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: index < currentIndex ? "#16a34a" : index === currentIndex ? "#1e3a8a" : "#cbd5e1",
          },
        });
      }
    });

    return { nodes: calculatedNodes, edges: calculatedEdges };
  }, [workflowSteps, currentState, workflowStatus, nodeStatesSpec, onSelectNode]);

  return (
    <div className="w-full h-[320px] rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shadow-inner">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#cbd5e1" gap={18} size={1} />
        <Controls className="bg-white border-slate-200 fill-slate-700 text-slate-700 shadow-xs" />
      </ReactFlow>
    </div>
  );
}
