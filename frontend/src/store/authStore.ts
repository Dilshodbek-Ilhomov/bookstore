// ============================================
// BookStore — Auth Store (Zustand)
// ============================================

import { create } from "zustand";
import type { User } from "@/types";
import { authAPI } from "@/lib/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) =>
    set({ user, isAuthenticated: !!user }),

  login: (user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
    set({ user: null, isAuthenticated: false });
  },

  hydrate: () => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");
    if (stored && token) {
      try {
        const user = JSON.parse(stored) as User;
        set({ user, isAuthenticated: true });
      } catch {
        set({ user: null, isAuthenticated: false });
      }
      authAPI.me()
        .then((freshUser) => {
          if (freshUser && freshUser.id) {
            localStorage.setItem("user", JSON.stringify(freshUser));
            set({ user: freshUser, isAuthenticated: true });
          }
        })
        .catch(() => {
          set({ user: null, isAuthenticated: false });
          if (typeof window !== "undefined") {
            localStorage.removeItem("user");
          }
        });
    } else if (token) {
      authAPI.me()
        .then((freshUser) => {
          if (freshUser && freshUser.id) {
            localStorage.setItem("user", JSON.stringify(freshUser));
            set({ user: freshUser, isAuthenticated: true });
          }
        })
        .catch(() => {
          set({ user: null, isAuthenticated: false });
          if (typeof window !== "undefined") {
            localStorage.removeItem("user");
          }
        });
    }
  },
}));
