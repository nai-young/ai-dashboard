"use client";

import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";
import { useAIStore } from "@/store/useAIStore";
import { useEffect, useMemo, useRef } from "react";

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 p-3 border rounded w-fit">
      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  );
}

export default function OutputPanel() {
  const { sessions, activeSessionId, isLoading } = useAIStore();

  const session = sessions.find((s) => s.id === activeSessionId);
  const messages = useMemo(() => session?.messages || [], [session]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 p-4 lg:p-6 lg:overflow-y-auto">
      <h2 className="text-sm text-muted-foreground mb-3">Conversation</h2>

      <Card className="p-4 min-h-[300px] lg:min-h-[400px] max-h-[calc(100%-16px)] space-y-4 lg:overflow-y-auto">
        {messages.length === 0 && !isLoading && (
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

        {isLoading && <TypingIndicator />}

        <div ref={bottomRef} />
      </Card>
    </div>
  );
}
