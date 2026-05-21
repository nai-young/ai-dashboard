import { create } from "zustand";

type View = "dashboard" | "history" | "settings";

type UIState = {
  view: View;
  setView: (v: View) => void;
};

export const useUIStore = create<UIState>((set) => ({
  view: "dashboard",
  setView: (v) => set({ view: v }),
}));
