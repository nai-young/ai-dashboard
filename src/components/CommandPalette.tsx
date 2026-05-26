"use client";

import { useCallback } from "react";
import { tools } from "@/lib/tools";
import { useAIStore } from "@/store/useAIStore";

export default function CommandPalette(): React.JSX.Element {
  const { setTool } = useAIStore();

  const handleSelect = useCallback(
    (toolId: string): void => {
      setTool(toolId);
    },
    [setTool],
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-background w-[90vw] max-w-lg rounded-lg p-3 animate-slide-in-right">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleSelect(tool.id)}
            className="w-full text-left p-3 rounded hover:bg-muted transition"
          >
            <div className="font-medium">{tool.label}</div>
            <div className="text-xs text-muted-foreground">
              {tool.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
