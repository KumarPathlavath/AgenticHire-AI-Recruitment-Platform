import { create } from "zustand";
import { api } from "../lib/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("agenthire_token") : null,
  isAuthenticated: false,
  isLoading: true,

  initAuth: async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("agenthire_token") : null;
    if (!token) {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      // 3 second fetch timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await api.getMe();
      clearTimeout(timeoutId);

      if (response && response.success && response.user) {
        set({ user: response.user, token, isAuthenticated: true, isLoading: false });
      } else {
        get().logout();
      }
    } catch (err) {
      console.warn("[Auth] Session verification failed, clearing stale token:", err.message);
      get().logout();
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await api.login({ email, password });
      if (response.success && response.token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("agenthire_token", response.token);
        }
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };
      }
      set({ isLoading: false });
      return { success: false, message: response.message || "Login failed" };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, message: err.message || "Login failed" };
    }
  },

  signup: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const response = await api.signup({ name, email, password, role: "recruiter" });
      if (response.success && response.token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("agenthire_token", response.token);
        }
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };
      }
      set({ isLoading: false });
      return { success: false, message: response.message || "Signup failed" };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, message: err.message || "Signup failed" };
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("agenthire_token");
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },
}));
