"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageRole, useAIStore } from "@/store/useAIStore";
import { AlertCircle, Loader2 } from "lucide-react";

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

async function callAI(prompt: string, tool: string): Promise<{ content: string; error?: string }> {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, tool }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        content: "",
        error: data.message || data.error || `Error ${res.status}: AI service unavailable`,
      };
    }

    return { content: data.content || "No response received." };
  } catch (err: any) {
    return {
      content: "",
      error: "Network error. Please check your connection and try again.",
    };
  }
}

export default function ToolPanel() {
  const { tool, activeSessionId, createSession, addMessage, isLoading, setLoading } = useAIStore();

  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const runAI = async () => {
    if (!input.trim()) return;

    setError(null);
    let sessionId = activeSessionId;

    if (!sessionId) {
      // createSession already adds the user's first message
      sessionId = createSession(tool, input);
    } else {
      // Only add user message manually when reusing an existing session
      addMessage(sessionId, {
        role: MessageRole.user,
        content: input,
      });
    }

    setLoading(true);

    const response = await callAI(input, tool);

    if (response.error) {
      setError(response.error);
      addMessage(sessionId, {
        role: MessageRole.assistant,
        content: `⚠️ **Error:** ${response.error}\n\nPlease try again in a moment.`,
      });
    } else {
      addMessage(sessionId, {
        role: MessageRole.assistant,
        content: response.content,
      });
    }

    setLoading(false);
    setInput("");
  };

  return (
    <div className="flex-1 p-4 lg:p-6 space-y-4 lg:overflow-y-auto">
      {/* HEADER */}
      <div>
        <h2 className="text-lg font-semibold capitalize">{tool} assistant</h2>
        <p className="text-sm text-muted-foreground">
          Powered by free AI models via OpenRouter
        </p>
      </div>

      {/* EXAMPLES */}
      <div className="flex flex-wrap gap-2">
        {(examplesByTool[tool] || []).map((ex) => (
          <button
            key={ex.label}
            onClick={() => setInput(ex.prompt)}
            className="text-xs px-3 py-1.5 rounded-full border bg-background hover:bg-muted transition"
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">AI Service Error</p>
            <p className="text-red-300/70 text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* INPUT */}
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your request..."
        className="min-h-[160px]"
        disabled={isLoading}
      />

      {/* ACTION */}
      <Button onClick={runAI} disabled={isLoading || !input.trim()} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Generating...
          </>
        ) : (
          "Generate"
        )}
      </Button>

      <p className="text-[10px] text-muted-foreground text-center">
        Rate limit: 3 requests / 2 minutes · Free models via OpenRouter
      </p>
    </div>
  );
}
