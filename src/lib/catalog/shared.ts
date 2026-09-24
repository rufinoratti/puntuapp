import "server-only";

import type { MediaItem, MediaSource } from "@/lib/media";

export const MAX_CATALOG_RESULTS = 12;
export const CATALOG_REVALIDATE_SECONDS = 60 * 60;

export class CatalogProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CatalogProviderError";
  }
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function catalogSlug(source: MediaSource, providerId: string, title: string) {
  const prefix = source === "openlibrary" ? "ol" : source;
  return `${prefix}-${providerId}-${slugify(title) || "contenido"}`;
}

export function parseCatalogSlug(slug: string): { source: MediaSource; providerId: string } | null {
  const match = /^(tmdb|rawg|ol)-([A-Za-z0-9]+)-.+$/.exec(slug);
  if (!match) return null;

  const source: MediaSource = match[1] === "ol" ? "openlibrary" : match[1] as "tmdb" | "rawg";
  const providerId = match[2];

  if ((source === "tmdb" || source === "rawg") && !/^\d+$/.test(providerId)) return null;
  if (source === "openlibrary" && !/^OL\d+W$/i.test(providerId)) return null;

  return { source, providerId };
}

export function tagsForGenres(genres: string[]) {
  const tags = new Set<string>();

  for (const genre of genres) {
    const normalized = slugify(genre);

    if (normalized.includes("science-fiction") || normalized.includes("ciencia-ficcion")) {
      tags.add("ciencia-ficcion");
      tags.add("ficcion");
    }
    if (normalized.includes("drama")) tags.add("drama");
    if (normalized.includes("horror") || normalized.includes("terror")) tags.add("terror");
    if (normalized.includes("role-playing") || normalized === "rpg") tags.add("rpg");
    if (normalized.includes("metroidvania")) tags.add("metroidvania");
    if (normalized.includes("non-fiction") || normalized.includes("no-ficcion")) tags.add("no-ficcion");
    if (normalized.includes("classic") || normalized.includes("clasicos")) tags.add("clasicos");
    if (normalized.includes("fiction") || normalized.includes("ficcion")) tags.add("ficcion");

    if (normalized) tags.add(normalized);
  }

  return [...tags];
}

export function formatRuntime(minutes: number | null | undefined) {
  if (!minutes || minutes < 1) return undefined;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (!hours) return `${minutes} min`;
  return remainingMinutes ? `${hours} h ${remainingMinutes} min` : `${hours} h`;
}

export function getFallbackImage(item: Pick<MediaItem, "type">) {
  return item.type === "book" ? "/images/book-placeholder.svg" : "/puntuapp-hero.png";
}
