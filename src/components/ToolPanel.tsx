"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageRole, useAIStore } from "@/store/useAIStore";

const examplesByTool: Record<string, { label: string; prompt: string }[]> = {
  email: [
    {
      label: "Follow-up email after interview",
      prompt:
        "Write a polite follow-up email after a job interview. Keep it concise and professional.",
    },
    {
      label: "Improve email tone",
      prompt:
        "Improve the tone of this email to sound more confident and clear.",
    },
  ],

  summary: [
    {
      label: "Summarize article",
      prompt: "Summarize this text into key bullet points:",
    },
    {
      label: "Summarize CV",
      prompt: "Summarize this CV into a short professional profile:",
    },
  ],

  rewrite: [
    {
      label: "Improve clarity",
      prompt:
        "Rewrite this text to improve clarity and flow while keeping meaning.",
    },
    {
      label: "Make it more impactful",
      prompt: "Rewrite this text to make it more impactful and professional.",
    },
  ],

  ideas: [
    {
      label: "Portfolio ideas",
      prompt:
        "Give me creative frontend portfolio project ideas for a mid-senior developer.",
    },
    {
      label: "SaaS ideas",
      prompt:
        "Give me realistic SaaS ideas a solo frontend developer can build.",
    },
  ],
};

async function fakeClaudeAPI(prompt: string) {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve("🤖 AI Response: " + prompt);
    }, 1200);
  });
}

export default function ToolPanel() {
  const { tool, activeSessionId, createSession, addMessage } = useAIStore();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const runAI = async () => {
    if (!input.trim()) return;

    let sessionId = activeSessionId;

    if (!sessionId) {
      sessionId = createSession(tool, input);
    }

    addMessage(sessionId, {
      role: MessageRole.user,
      content: input,
    });

    setLoading(true);

    const response = await fakeClaudeAPI(input);

    addMessage(sessionId, {
      role: MessageRole.assistant,
      content: response,
    });

    setLoading(false);
    setInput("");
  };

  return (
    <div className="w-full p-6 space-y-4">
      {/* HEADER */}
      <div>
        <h2 className="text-lg font-semibold capitalize">{tool} assistant</h2>

        <p className="text-sm text-muted-foreground">
          Select a suggestion or write your own prompt
        </p>
      </div>

      {/* EXAMPLES */}
      <div className="flex flex-wrap gap-2">
        {(examplesByTool[tool] || []).map((ex) => (
          <button
            key={ex.label}
            onClick={() => setInput(ex.prompt)}
            className="text-xs px-3 py-1 rounded-full border bg-background hover:bg-muted transition"
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* INPUT */}
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your request..."
        className="min-h-[160px]"
      />

      {/* ACTION */}
      <Button onClick={runAI} disabled={loading} className="w-full">
        {loading ? "Generating..." : "Generate"}
      </Button>
    </div>
  );
}
