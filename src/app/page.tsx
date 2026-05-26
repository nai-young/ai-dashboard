"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Zap,
  MessageSquare,
  Moon,
  ArrowRight,
  Bot,
} from "lucide-react";

export default function Home(): React.JSX.Element {
  const router = useRouter();

  const handleStart = useCallback((): void => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-chart-3/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 lg:px-12 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">FlowAI</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              GitHub
            </a>
            <Button onClick={handleStart} size="sm">
              Open App
            </Button>
          </div>
        </nav>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-card text-xs font-medium text-muted-foreground mb-6">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Powered by OpenRouter free tier
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
            Your AI
            <span className="text-primary"> assistant</span>
            <br className="hidden sm:block" /> dashboard
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            A modern, responsive AI dashboard built with Next.js 16, Tailwind CSS
            v4 and Zustand. Features real-time chat, multiple AI tools, dark/light
            mode, and conversation history.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button size="lg" onClick={handleStart} className="gap-2">
              Launch Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={handleStart}>
              View Demo
            </Button>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full text-left">
            <FeatureCard
              icon={<Zap className="w-5 h-5 text-primary" />}
              title="Multiple AI Tools"
              description="Email writer, summarizer, content rewriter and idea generator in one place."
            />
            <FeatureCard
              icon={<MessageSquare className="w-5 h-5 text-chart-3" />}
              title="Real-time Chat"
              description="Streaming-like responses with markdown rendering and copy-to-clipboard."
            />
            <FeatureCard
              icon={<Moon className="w-5 h-5 text-chart-2" />}
              title="Dark & Light"
              description="Fully themed with next-themes. Automatic system preference detection."
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 text-center text-xs text-muted-foreground">
          Built with Next.js · Tailwind CSS · Zustand · OpenRouter
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}): React.JSX.Element {
  return (
    <div className="p-5 rounded-xl border bg-card hover:bg-accent/50 transition group">
      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3 group-hover:bg-background transition">
        {icon}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
