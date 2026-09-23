"use client";

import { useEffect, useRef, useState } from "react";
import { Bookmark } from "lucide-react";

import type { MediaItem } from "@/lib/media";
import { toggleWatchlist, useIsOnWatchlist } from "@/lib/watchlist";
import { cn } from "@/lib/utils";

type WatchlistButtonProps = {
  item: MediaItem;
  className?: string;
};

export function WatchlistButton({ item, className }: WatchlistButtonProps) {
  const isSaved = useIsOnWatchlist(item.slug);
  const [feedback, setFeedback] = useState("");
  const feedbackTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => window.clearTimeout(feedbackTimer.current);
  }, []);

  function handleToggle() {
    const nowSaved = toggleWatchlist(item);

    setFeedback(
      nowSaved
        ? `«${item.title}» quedó en tu lista de espera.`
        : `Sacamos «${item.title}» de tu lista.`,
    );

    window.clearTimeout(feedbackTimer.current);
    feedbackTimer.current = window.setTimeout(() => setFeedback(""), 3500);
  }

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-pressed={isSaved}
        onClick={handleToggle}
        className={cn(
          "inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition",
          isSaved
            ? "border-brand/60 bg-brand/8 text-brand"
            : "border-brand/20 text-brand hover:border-brand hover:bg-brand/5",
          className,
        )}
      >
        <Bookmark
          aria-hidden="true"
          className={cn("size-4 transition", isSaved && "fill-coral text-coral")}
        />
        {isSaved ? "En tu watchlist" : "Agregar a mi watchlist"}
      </button>
      <span
        role="status"
        aria-live="polite"
        className="absolute left-2 top-full z-10 mt-1.5 max-w-[min(20rem,calc(100vw-3rem))] text-xs font-medium leading-5 text-canvas-muted"
      >
        {feedback}
      </span>
    </span>
  );
}
