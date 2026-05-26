"use client";

import { useCallback, useState, useRef, type KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageRole, useAIStore } from "@/store/useAIStore";
import { AlertCircle, Loader2 } from "lucide-react";

const toolMeta: Record<
  string,
  { label: string; gradient: string; icon: string }
> = {
  email: {
    label: "Email Assistant",
    gradient: "from-blue-500 to-indigo-500",
    icon: "✉️",
  },
  summary: {
    label: "Text Summarizer",
    gradient: "from-emerald-500 to-teal-500",
    icon: "📝",
  },
  rewrite: {
    label: "Content Rewriter",
    gradient: "from-violet-500 to-purple-500",
    icon: "✨",
  },
  ideas: {
    label: "Idea Generator",
    gradient: "from-amber-500 to-orange-500",
    icon: "💡",
  },
};

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

async function callAI(
  prompt: string,
  tool: string,
): Promise<{ content: string; error?: string }> {
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
        error:
          data.message ||
          data.error ||
          `Error ${res.status}: AI service unavailable`,
      };
    }

    return { content: data.content || "No response received." };
  } catch {
    return {
      content: "",
      error: "Network error. Please check your connection and try again.",
    };
  }
}

export default function ToolPanel(): React.JSX.Element {
  const {
    tool,
    activeSessionId,
    createSession,
    addMessage,
    isLoading,
    setLoading,
  } = useAIStore();

  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const runAI = useCallback(async (): Promise<void> => {
    if (!input.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      textareaRef.current?.focus();
      return;
    }

    setError(null);
    let sessionId = activeSessionId;

    if (!sessionId) {
      sessionId = createSession(tool, input);
    } else {
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
  }, [input, activeSessionId, tool, createSession, addMessage, setLoading]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>): void => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void runAI();
      }
    },
    [runAI],
  );

  const meta = toolMeta[tool] || {
    label: tool,
    gradient: "from-slate-500 to-gray-500",
    icon: "🤖",
  };

  return (
    <div className="flex-1 p-4 lg:p-6 space-y-4 lg:overflow-y-auto">
      {/* HEADER with gradient badge */}
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shrink-0 shadow-lg`}
        >
          <span className="text-lg">{meta.icon}</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold">{meta.label}</h2>
          <p className="text-sm text-muted-foreground">
            Powered by free AI models via OpenRouter
          </p>
        </div>
      </div>

      {/* EXAMPLES */}
      <div className="flex flex-wrap gap-2">
        {(examplesByTool[tool] || []).map((ex) => (
          <button
            key={ex.label}
            onClick={() => setInput(ex.prompt)}
            title={ex.prompt}
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
      <div className={shake ? "animate-shake" : ""}>
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your request... (Enter to send, Shift+Enter for new line)"
          className="min-h-[160px] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          disabled={isLoading}
        />
      </div>

      {/* ACTION */}
      <Button
        onClick={runAI}
        disabled={isLoading || !input.trim()}
        className="w-full"
      >
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
