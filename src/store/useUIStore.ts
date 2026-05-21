import { create } from "zustand";

export enum View {
  dashboard = "dashboard",
  settings = "settings",
  history = "history",
}

type UIState = {
  view: View;
  setView: (v: View) => void;
};

export const useUIStore = create<UIState>((set) => ({
  view: View.dashboard,
  setView: (v) => set({ view: v }),
}));
