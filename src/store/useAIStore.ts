import { create } from "zustand";

export enum MessageRole {
  user = "user",
  assistant = "assistant",
}

type Message = {
  role: MessageRole;
  content: string;
};

type Session = {
  id: string;
  title: string;
  tool: string;
  messages: Message[];
  createdAt: number;
};

type AIState = {
  tool: string;
  setTool: (tool: string) => void;
  sessions: Session[];
  activeSessionId: string | null;
  setActiveSession: (id: string) => void;
  createSession: (tool: string, firstMessage: string) => string;
  addMessage: (sessionId: string, msg: Message) => void;
  clearHistory: () => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useAIStore = create<AIState>((set) => ({
  tool: "email",
  setTool: (tool) => set({ tool }),
  sessions: [],
  activeSessionId: null,
  setActiveSession: (id) => set({ activeSessionId: id }),
  createSession: (tool, firstMessage) => {
    const id = crypto.randomUUID();

    const newSession: Session = {
      id,
      tool,
      title: firstMessage.slice(0, 40),
      messages: [{ role: MessageRole.user, content: firstMessage }],
      createdAt: Date.now(),
    };

    set((state) => ({
      sessions: [newSession, ...state.sessions],
      activeSessionId: id,
    }));

    return id;
  },
  addMessage: (sessionId, msg) => {
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId ? { ...s, messages: [...s.messages, msg] } : s,
      ),
    }));
  },
  clearHistory: () =>
    set({
      sessions: [],
      activeSessionId: null,
    }),
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));
