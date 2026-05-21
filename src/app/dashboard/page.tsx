"use client";

import Sidebar from "@/components/Sidebar";
import ToolPanel from "@/components/ToolPanel";
import OutputPanel from "@/components/OutputPanel";
import { useUIStore } from "@/store/useUIStore";
import Settings from "@/components/Settings";
import History from "@/components/History";
import { Mounted } from "@/components/Mounted";

export default function Dashboard() {
  const { view } = useUIStore();

  return (
    <Mounted>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar />
        {view === "dashboard" && (
          <>
            <ToolPanel />
            <OutputPanel />
          </>
        )}
        {view === "history" && <History />}
        {view === "settings" && <Settings />}
      </div>
    </Mounted>
  );
}
