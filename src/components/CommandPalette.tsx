import { tools } from "@/lib/tools";
import { useAIStore } from "@/store/useAIStore";

export default function CommandPalette() {
  const { setTool } = useAIStore();

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-background w-[500px] rounded-lg p-3">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setTool(tool.id)}
            className="w-full text-left p-3 rounded hover:bg-muted"
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
