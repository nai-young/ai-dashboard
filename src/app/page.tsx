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
      <div className="flex flex-col lg:flex-row h-screen bg-background text-foreground overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
          {view === "dashboard" && (
            <>
              <ToolPanel />
              <OutputPanel />
            </>
          )}
          {view === "history" && <History />}
          {view === "settings" && <Settings />}
        </main>
      </div>
    </Mounted>
  );
}
