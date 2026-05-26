"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useAIStore } from "@/store/useAIStore";

export default function Settings() {
  const { theme, setTheme } = useTheme();

  const { sessions, clearHistory } = useAIStore();

  const downloadHistory = () => {
    const data = JSON.stringify(sessions, null, 2);

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-history.json";
    a.click();

    URL.revokeObjectURL(url);
  };

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

        <div className="text-sm text-muted-foreground">Provider: OpenRouter (free tier)</div>

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

        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadHistory}>
            Download history
          </Button>

          <Button variant="destructive" onClick={clearHistory}>
            Reset history
          </Button>
        </div>
      </Card>
    </div>
  );
}
