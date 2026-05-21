"use client";

import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";
import { useAIStore } from "@/store/useAIStore";

export default function OutputPanel() {
  const { output, loading } = useAIStore();

  return (
    <div className="w-[40%] p-6">
      <h2 className="text-sm text-muted-foreground mb-3">AI Response</h2>

      <Card className="p-4 min-h-[400px]">
        {loading && (
          <p className="text-muted-foreground animate-pulse">Thinking...</p>
        )}

        {!loading && output && (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{output}</ReactMarkdown>
          </div>
        )}

        {!loading && !output && (
          <p className="text-muted-foreground">
            Your response will appear here
          </p>
        )}
      </Card>
    </div>
  );
}
