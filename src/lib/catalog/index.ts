import "server-only";

import { mediaItems, type MediaItem } from "@/lib/media";

import { getBookById } from "./openlibrary";
import { getGameById } from "./rawg";
import { getMovieById } from "./tmdb";
import { parseCatalogSlug } from "./shared";

export async function getCatalogItemFromSlug(slug: string) {
  const parsed = parseCatalogSlug(slug);
  if (!parsed) return null;

  switch (parsed.source) {
    case "tmdb":
      return getMovieById(parsed.providerId);
    case "rawg":
      return getGameById(parsed.providerId);
    case "openlibrary":
      return getBookById(parsed.providerId);
  }
}

export async function getMediaItemBySlug(slug: string): Promise<MediaItem | null> {
  return mediaItems.find((item) => item.slug === slug) ?? getCatalogItemFromSlug(slug);
}
