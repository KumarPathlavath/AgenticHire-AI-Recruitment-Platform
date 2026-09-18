import { create } from "zustand";
import { api } from "../lib/api";

export const useWorkflowStore = create((set, get) => ({
  workflows: [],
  activeWorkflow: null,
  activeLogs: [],
  nodeStatesSpec: null,
  workflowSpec: null,
  isLoading: false,
  error: null,

  fetchSpecs: async () => {
    try {
      const res = await api.getSpecs();
      if (res.success) {
        set({
          nodeStatesSpec: res.specs.nodeStates,
          workflowSpec: res.specs.defaultWorkflow,
        });
      }
    } catch (err) {
      console.error("Failed to load specs:", err);
    }
  },

  fetchWorkflows: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.listWorkflows();
      if (res.success) {
        set({ workflows: res.workflows || [], isLoading: false });
      } else {
        set({ error: res.message || "Failed to load workflows", isLoading: false });
      }
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchWorkflowById: async (workflowId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.getWorkflow(workflowId);
      if (res.success) {
        set({
          activeWorkflow: res.workflow,
          activeLogs: res.logs || [],
          isLoading: false,
        });
      } else {
        set({ error: res.message, isLoading: false });
      }
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  approveCheckpoint: async (workflowId, decision, notes = "") => {
    try {
      const res = await api.approveWorkflow(workflowId, decision, notes);
      if (res.success) {
        await get().fetchWorkflowById(workflowId);
        await get().fetchWorkflows();
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  retryWorkflow: async (workflowId) => {
    try {
      const res = await api.retryWorkflow(workflowId);
      if (res.success) {
        await get().fetchWorkflowById(workflowId);
        await get().fetchWorkflows();
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
}));
