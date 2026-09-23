"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";

import { useWatchlist } from "@/lib/watchlist";
import { cn } from "@/lib/utils";

export function WatchlistNavLink({ className }: { className?: string }) {
  const entries = useWatchlist();
  const count = entries.length;

  return (
    <Link
      href="/watchlist"
      aria-label={
        count > 0
          ? `Mi watchlist, ${count} ${count === 1 ? "título" : "títulos"} para ver después`
          : "Mi watchlist, lista de espera vacía"
      }
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full border border-brand/20 px-3.5 text-sm font-semibold text-brand transition hover:border-brand hover:bg-brand/5",
        className,
      )}
    >
      <Bookmark aria-hidden="true" className={cn("size-4", count > 0 && "fill-coral text-coral")} />
      <span className="hidden sm:inline">Mi watchlist</span>
      {count > 0 && (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-coral px-1.5 py-0.5 text-[11px] font-bold leading-none text-coral-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}
