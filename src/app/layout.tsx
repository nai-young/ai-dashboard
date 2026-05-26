import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "FlowAI - AI Assistant Dashboard",
  description:
    "A modern, responsive AI assistant dashboard powered by OpenRouter. Features real-time chat, multiple AI tools, dark/light mode, and conversation history.",
  keywords: [
    "AI",
    "dashboard",
    "assistant",
    "OpenRouter",
    "Next.js",
    "React",
    "portfolio",
  ],
  authors: [{ name: "Naiche" }],
  openGraph: {
    title: "FlowAI - AI Assistant Dashboard",
    description:
      "A modern, responsive AI assistant dashboard powered by OpenRouter.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowAI - AI Assistant Dashboard",
    description:
      "A modern, responsive AI assistant dashboard powered by OpenRouter.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#6366f1" />
      </head>
      <body
        className="h-screen"
        style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
