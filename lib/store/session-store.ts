// lib/stores/session-store.ts
import { create } from "zustand";

export type SessionUser = {
  userId: number;
  role: string;
  firstName: string;
  lastName: string;
};

type SessionStore = {
  user: SessionUser | null;
  setSession: (user: SessionUser) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionStore>((set) => ({
  user: null,
  setSession: (user) => set({ user }),
  clearSession: () => set({ user: null }),
}));