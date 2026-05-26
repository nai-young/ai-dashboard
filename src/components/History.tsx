"use client";

import { useCallback } from "react";
import { useUIStore, View } from "@/store/useUIStore";
import { useAIStore } from "@/store/useAIStore";
import { formatRelativeTime } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

export default function History(): React.JSX.Element {
  const { sessions, activeSessionId, setActiveSession } = useAIStore();
  const { setView } = useUIStore();

  const handleClick = useCallback(
    (id: string): void => {
      setActiveSession(id);
      setView(View.dashboard);
    },
    [setActiveSession, setView],
  );

  return (
    <div className="p-4 lg:p-6 w-full overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">History</h1>

      <div className="space-y-2">
        {sessions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <MessageSquare className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs">Start a new chat from the sidebar</p>
          </div>
        )}

        {sessions.map((session) => {
          const active = activeSessionId === session.id;
          return (
            <div
              key={session.id}
              className={`border rounded-lg p-3 cursor-pointer transition ${
                active
                  ? "bg-primary/5 border-primary/30 ring-1 ring-primary/20"
                  : "hover:bg-muted"
              }`}
              onClick={() => handleClick(session.id)}
            >
              <div className="font-medium line-clamp-1">{session.title}</div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                <span className="capitalize px-1.5 py-0.5 rounded bg-muted text-[10px] font-medium">
                  {session.tool}
                </span>
                <span>·</span>
                <span>{formatRelativeTime(session.createdAt)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
