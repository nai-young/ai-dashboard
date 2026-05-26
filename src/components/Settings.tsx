"use client";

import { useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useAIStore } from "@/store/useAIStore";
import { Download, Trash2, FileText, FileCode } from "lucide-react";

export default function Settings(): React.JSX.Element {
  const { theme, setTheme } = useTheme();
  const { sessions, clearHistory } = useAIStore();

  const downloadHistory = useCallback((): void => {
    const data = JSON.stringify(sessions, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-history.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [sessions]);

  const downloadAsText = useCallback((): void => {
    const lines = sessions
      .map(
        (s) =>
          `## ${s.title}\n\n` +
          s.messages.map((m) => `**${m.role}:** ${m.content}`).join("\n\n"),
      )
      .join("\n\n---\n\n");

    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-history.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [sessions]);

  const downloadAsMarkdown = useCallback((): void => {
    const lines = sessions
      .map(
        (s) =>
          `## ${s.title}\n\n` +
          s.messages
            .map((m) => `> **${m.role.toUpperCase()}**\n\n${m.content}`)
            .join("\n\n"),
      )
      .join("\n\n---\n\n");

    const blob = new Blob([lines], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-history.md";
    a.click();
    URL.revokeObjectURL(url);
  }, [sessions]);

  return (
    <div className="p-4 lg:p-6 w-full space-y-6 overflow-y-auto">
      <h1 className="text-xl font-bold">Settings</h1>

      <Card className="p-4 space-y-3">
        <h2 className="font-semibold">Appearance</h2>

        <div className="flex gap-2">
          <Button
            variant={theme === "dark" ? "secondary" : "ghost"}
            onClick={() => setTheme("dark")}
          >
            Dark
          </Button>

          <Button
            variant={theme === "light" ? "secondary" : "ghost"}
            onClick={() => setTheme("light")}
          >
            Light
          </Button>
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <h2 className="font-semibold">AI Information</h2>

        <div className="text-sm text-muted-foreground">
          Provider: OpenRouter (free tier)
        </div>

        <div className="text-sm text-muted-foreground">
          Models: Mistral 7B, Zephyr 7B, OpenChat 7B
        </div>

        <div className="text-sm text-muted-foreground">
          Mode: Request-based with retry fallback
        </div>

        <div className="text-sm text-muted-foreground">
          Rate limit: 3 requests / 2 minutes per IP
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <h2 className="font-semibold">Data</h2>

        <div className="text-sm text-muted-foreground">
          Stored conversations: {sessions.length}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={downloadHistory}>
            <Download className="w-4 h-4 mr-2" />
            JSON
          </Button>

          <Button variant="outline" onClick={downloadAsText}>
            <FileText className="w-4 h-4 mr-2" />
            Text
          </Button>

          <Button variant="outline" onClick={downloadAsMarkdown}>
            <FileCode className="w-4 h-4 mr-2" />
            Markdown
          </Button>

          <Button variant="destructive" onClick={clearHistory}>
            <Trash2 className="w-4 h-4 mr-2" />
            Reset history
          </Button>
        </div>
      </Card>
    </div>
  );
}
