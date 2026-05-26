"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUIStore, View } from "@/store/useUIStore";
import { useAIStore } from "@/store/useAIStore";
import { tools } from "@/lib/tools";
import { iconMap } from "@/lib/icons";
import { ThemeToggle } from "./ThemeToggle";
import { ArrowLeft, ArrowRight, Menu, X, Plus } from "lucide-react";

function SidebarNav({
  collapsed,
  onCloseMobile,
}: {
  collapsed: boolean;
  onCloseMobile?: () => void;
}): React.JSX.Element {
  const { view, setView } = useUIStore();
  const { setTool, tool: activeTool, startNewChat } = useAIStore();

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

  const handleNav = useCallback(
    (id: View): void => {
      setView(id);
      onCloseMobile?.();
    },
    [setView, onCloseMobile],
  );

  const handleToolClick = useCallback(
    (toolId: string): void => {
      setTool(toolId);
      setView(View.dashboard);
      onCloseMobile?.();
    },
    [setTool, setView, onCloseMobile],
  );

  const handleNewChat = useCallback((): void => {
    startNewChat();
    setView(View.dashboard);
    onCloseMobile?.();
  }, [startNewChat, setView, onCloseMobile]);

  return (
    <>
      {/* NEW CHAT BUTTON */}
      <Button
        variant="outline"
        className={`w-full gap-2 mb-2 ${collapsed ? "" : "justify-start "}`}
        onClick={handleNewChat}
      >
        <Plus className="w-4 h-4" />
        {!collapsed && "New Chat"}
      </Button>

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
                <div className="absolute left-0 top-0 h-full w-0.75 bg-primary rounded-r-md" />
              )}

              <Button
                variant={active ? "secondary" : "ghost"}
                className={`w-full gap-2 ${active ? "rounded-l-none" : ""} ${collapsed ? "" : "justify-start "}`}
                onClick={() => handleNav(item.id)}
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
      <div className="space-y-4 mt-2 overflow-y-auto overflow-x-hidden">
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
                    {active && (
                      <div className="absolute left-0 top-0 h-full w-0.75 bg-primary rounded-r-md" />
                    )}

                    <Button
                      variant={active ? "secondary" : "ghost"}
                      className={`w-full gap-2 ${active ? "rounded-l-none" : ""} ${collapsed ? "" : "justify-start "}`}
                      onClick={() => handleToolClick(t.id)}
                    >
                      <Icon className="w-4 h-4" />
                      {!collapsed && t.label}
                    </Button>

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
    </>
  );
}

export default function Sidebar(): React.JSX.Element {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleCollapse = useCallback((): void => {
    setCollapsed((prev) => !prev);
  }, []);

  const handleOpenMobile = useCallback((): void => {
    setMobileOpen(true);
  }, []);

  const handleCloseMobile = useCallback((): void => {
    setMobileOpen(false);
  }, []);

  return (
    <>
      {/* Mobile header with hamburger */}
      <div className="lg:hidden flex items-center justify-between p-3 border-b bg-background shrink-0">
        <h1 className="font-bold">FlowAI</h1>
        <Button variant="ghost" size="icon" onClick={handleOpenMobile}>
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCloseMobile}
          />
          <div
            className="absolute right-0 top-0 h-full w-full sm:w-80 border-l bg-background p-4 flex flex-col animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-bold">FlowAI</h1>
              <Button variant="ghost" size="icon" onClick={handleCloseMobile}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <SidebarNav collapsed={false} onCloseMobile={handleCloseMobile} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div
        className={`hidden lg:flex h-screen border-r bg-background p-3 flex-col transition-all ${
          collapsed ? "w-18" : "w-65"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          {!collapsed && <h1 className="font-bold">FlowAI</h1>}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleCollapse}
            className={`${collapsed ? "mx-auto" : ""}`}
          >
            {collapsed ? <ArrowRight /> : <ArrowLeft />}
          </Button>
        </div>
        <SidebarNav collapsed={collapsed} />
      </div>
    </>
  );
}
