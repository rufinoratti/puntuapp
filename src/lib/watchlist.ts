"use client";

import { useEffect, useState } from "react";

import type { MediaItem } from "@/lib/media";

const STORAGE_KEY = "puntuapp.watchlist.v1";
const CHANGE_EVENT = "puntuapp:watchlist:change";

export type WatchlistEntry = {
  item: MediaItem;
  addedAt: number;
};

// Guardamos un snapshot completo del título: los libros vienen de Open Library y
// no existen en `mediaItems`, así la lista puede renderizarse sin resolver slugs.
// Si el almacenamiento falla (p. ej. modo privado), sostenemos la lista en memoria
// durante la sesión para no perder lo que el usuario acaba de guardar.
let memoryFallback: WatchlistEntry[] | null = null;

function isValidEntry(entry: unknown): entry is WatchlistEntry {
  if (typeof entry !== "object" || entry === null) return false;

  const candidate = entry as Partial<WatchlistEntry>;
  const item = candidate.item as Partial<MediaItem> | undefined;

  return (
    typeof item?.slug === "string" &&
    typeof item?.title === "string" &&
    typeof item?.type === "string" &&
    typeof candidate.addedAt === "number"
  );
}

export function getWatchlist(): WatchlistEntry[] {
  if (typeof window === "undefined") return [];
  if (memoryFallback) return memoryFallback;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isValidEntry);
  } catch {
    return [];
  }
}

function writeWatchlist(entries: WatchlistEntry[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    memoryFallback = null;
  } catch {
    // Safari en modo privado puede bloquear localStorage: seguimos en memoria.
    memoryFallback = entries;
  }

  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function isOnWatchlist(slug: string): boolean {
  return getWatchlist().some((entry) => entry.item.slug === slug);
}

export function addToWatchlist(item: MediaItem): boolean {
  const entries = getWatchlist();
  if (entries.some((entry) => entry.item.slug === item.slug)) return false;

  writeWatchlist([{ item, addedAt: Date.now() }, ...entries]);
  return true;
}

export function removeFromWatchlist(slug: string): boolean {
  const entries = getWatchlist();
  const nextEntries = entries.filter((entry) => entry.item.slug !== slug);
  if (nextEntries.length === entries.length) return false;

  writeWatchlist(nextEntries);
  return true;
}

/** Devuelve `true` si el título quedó guardado después del toggle. */
export function toggleWatchlist(item: MediaItem): boolean {
  if (isOnWatchlist(item.slug)) {
    removeFromWatchlist(item.slug);
    return false;
  }

  addToWatchlist(item);
  return true;
}

export function useWatchlist(): WatchlistEntry[] {
  const [entries, setEntries] = useState<WatchlistEntry[]>([]);

  useEffect(() => {
    const sync = () => setEntries(getWatchlist());

    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return entries;
}

export function useIsOnWatchlist(slug: string): boolean {
  const entries = useWatchlist();
  return entries.some((entry) => entry.item.slug === slug);
}
