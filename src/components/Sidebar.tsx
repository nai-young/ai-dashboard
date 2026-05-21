"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUIStore, View } from "@/store/useUIStore";
import { useAIStore } from "@/store/useAIStore";
import { tools } from "@/lib/tools";
import { iconMap } from "@/lib/icons";
import { ThemeToggle } from "./ThemeToggle";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Sidebar() {
  const { view, setView } = useUIStore();
  const { setTool, tool: activeTool } = useAIStore();

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const grouped = tools.reduce(
    (acc, t) => {
      if (!acc[t.category]) acc[t.category] = [];
      acc[t.category].push(t);
      return acc;
    },
    {} as Record<string, typeof tools>,
  );

  const navItems = [
    { id: View.dashboard, label: "Dashboard" },
    { id: View.history, label: "History" },
    { id: View.settings, label: "Settings" },
  ];

  return (
    <div
      className={`h-screen border-r bg-background p-3 flex flex-col transition-all ${
        collapsed ? "w-18" : "w-65"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        {!collapsed && <h1 className="font-bold">FlowAI</h1>}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ArrowRight /> : <ArrowLeft />}
        </Button>
      </div>

      {/* GLOBAL NAV */}
      <div className="space-y-1 mb-4">
        {navItems.map((item) => {
          const Icon = iconMap[item.id] as React.ComponentType<{
            className: string;
          }>;
          const active = view === item.id;

          return (
            <div key={item.id} className="relative group">
              {active && (
                <div className="absolute left-0 top-0 h-full w-[3px] bg-primary rounded" />
              )}

              <Button
                variant={active ? "secondary" : "ghost"}
                className="w-full justify-start gap-2"
                onClick={() => setView(item.id)}
              >
                <Icon className="w-4 h-4" />
                {!collapsed && item.label}
              </Button>

              {collapsed && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t my-2" />

      {/* AI TOOLS */}
      <div className="space-y-4 mt-2">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            {!collapsed && (
              <p className="text-xs text-muted-foreground mb-2">{category}</p>
            )}

            <div className="flex flex-col gap-1">
              {items.map((t) => {
                const Icon = iconMap[t.id] as React.ComponentType<{
                  className: string;
                }>;
                const active = activeTool === t.id;

                return (
                  <div key={t.id} className="relative group">
                    {/* ACTIVE BAR (Linear style) */}
                    {active && (
                      <div className="absolute left-0 top-0 h-full w-0.75 bg-primary rounded" />
                    )}

                    <Button
                      variant={active ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        setTool(t.id);
                        setView(View.dashboard);
                      }}
                    >
                      <Icon className="w-4 h-4" />
                      {!collapsed && t.label}
                    </Button>

                    {/* TOOLTIP WHEN COLLAPSED */}
                    {collapsed && (
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
                        {t.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto flex justify-center pb-4">
        <ThemeToggle />
      </div>
    </div>
  );
}
