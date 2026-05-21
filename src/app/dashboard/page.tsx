"use client";

import Sidebar from "@/components/Sidebar";
import ToolPanel from "@/components/ToolPanel";
import OutputPanel from "@/components/OutputPanel";
import { useUIStore } from "@/store/useUIStore";
import Settings from "@/components/Settings";
import History from "@/components/History";
import { useAIStore } from "@/store/useAIStore";
import ChatView from "@/components/ChatView";

export default function Dashboard() {
  const { view } = useUIStore();
  const { activeSessionId } = useAIStore();

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      {view === "dashboard" && (
        <>
          {activeSessionId ? <ChatView /> : null}
          <ToolPanel />
          <OutputPanel />
        </>
      )}
      {view === "history" && <History />}
      {view === "settings" && <Settings />}{" "}
    </div>
  );
}
