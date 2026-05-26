import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(date: Date | number): string {
  const now = Date.now();
  const then = typeof date === "number" ? date : date.getTime();
  const diff = now - then;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 2) return "1m ago";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 2) return "1h ago";
  if (hours < 24) return `${hours}h ago`;
  if (days < 2) return "yesterday";
  if (days < 7) return `${days}d ago`;

  return new Date(then).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
