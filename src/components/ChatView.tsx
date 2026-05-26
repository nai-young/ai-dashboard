"use client";

import { useAIStore } from "@/store/useAIStore";

export default function ChatView() {
  const { sessions, activeSessionId } = useAIStore();

  const session = sessions.find((s) => s.id === activeSessionId);

  if (!session) {
    return (
      <div className="p-6 text-muted-foreground">
        Select a conversation from history
      </div>
    );
  }

  return (
    <div className="p-6 w-full space-y-4">
      <h2 className="text-lg font-bold">{session.title}</h2>

      <div className="space-y-3">
        {session.messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded max-w-[85%] sm:max-w-[80%] ${
              msg.role === "user" ? "ml-auto bg-muted" : "border bg-background"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
}
