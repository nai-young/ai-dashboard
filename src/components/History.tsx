"use client";

import { useAIStore } from "@/store/useAIStore";

export default function History() {
  const { sessions, setActiveSession } = useAIStore();

  return (
    <div className="p-4 lg:p-6 w-full overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">History</h1>

      <div className="space-y-2">
        {sessions.length === 0 && (
          <p className="text-sm text-muted-foreground">No conversations yet</p>
        )}

        {sessions.map((session) => (
          <div
            key={session.id}
            className="border rounded p-3 cursor-pointer hover:bg-muted"
            onClick={() => setActiveSession(session.id)}
          >
            <div className="font-medium">{session.title}</div>

            <div className="text-xs text-muted-foreground">
              {session.tool} · {new Date(session.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
