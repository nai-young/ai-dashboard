"use client";

import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";
import { useAIStore } from "@/store/useAIStore";
import { useEffect, useMemo, useRef } from "react";

export default function OutputPanel() {
  const { sessions, activeSessionId } = useAIStore();

  const session = sessions.find((s) => s.id === activeSessionId);
  const messages = useMemo(() => session?.messages || [], [session]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-[40%] p-6">
      <h2 className="text-sm text-muted-foreground mb-3">Conversation</h2>

      <Card className="p-4 min-h-100 max-h-[calc(100%-16px)] space-y-4 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-muted-foreground">
            Start a conversation to see AI responses
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded ${
              msg.role === "user" ? "bg-muted ml-auto w-fit" : "border"
            }`}
          >
            {msg.role === "assistant" ? (
              <div className="prose max-w-none">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            ) : (
              <p>{msg.content}</p>
            )}
          </div>
        ))}

        <div ref={bottomRef} />
      </Card>
    </div>
  );
}
