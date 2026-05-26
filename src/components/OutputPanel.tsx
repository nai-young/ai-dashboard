"use client";

import { useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAIStore } from "@/store/useAIStore";
import { useEffect, useMemo, useRef } from "react";
import { Copy, Check } from "lucide-react";

function SkeletonMessage(): React.JSX.Element {
  return (
    <div className="p-3 border rounded w-full max-w-md space-y-2">
      <div className="h-4 w-3/4 rounded skeleton-shimmer" />
    </div>
  );
}

function CopyButton({ text }: { text: string }): React.JSX.Element {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = useCallback(async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [text]);

  return (
    <Button
      variant="ghost"
      size="sm"
      className="mt-2 h-7 px-2 text-xs gap-1 opacity-60 hover:opacity-100"
      onClick={handleCopy}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          Copied
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          Copy
        </>
      )}
    </Button>
  );
}

export default function OutputPanel(): React.JSX.Element {
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

      <Card className="p-4 min-h-75 lg:min-h-100 max-h-[calc(100%-16px)] space-y-4 lg:overflow-y-auto">
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
            {msg.role === "assistant" && <CopyButton text={msg.content} />}
          </div>
        ))}

        {isLoading && <SkeletonMessage />}

        <div ref={bottomRef} />
      </Card>
    </div>
  );
}
