import { getOpenLibraryWorkBySlug } from "@/lib/books";
import type { MediaItem } from "@/lib/media";
import { mediaItems } from "@/lib/media";
import { getRawgGameBySlug, getRawgPopularGames } from "@/lib/rawg";
import { getTmdbMovieBySlug, getTmdbPopularMovies } from "@/lib/tmdb";

export async function getCatalogItems(): Promise<MediaItem[]> {
  const [movies, games] = await Promise.all([
    getTmdbPopularMovies(8),
    getRawgPopularGames(8),
  ]);

  const remote = [...movies, ...games];
  if (remote.length === 0) return mediaItems;

  // Keep a couple of sample books so the default catalog always covers the three types.
  const sampleBooks = mediaItems.filter((item) => item.type === "book").slice(0, 3);
  return [...remote, ...sampleBooks];
}

export async function getItemBySlug(slug: string): Promise<MediaItem | null> {
  const sample = mediaItems.find((item) => item.slug === slug);
  if (sample) return sample;

  if (slug.startsWith("movie-")) return getTmdbMovieBySlug(slug);
  if (slug.startsWith("game-")) return getRawgGameBySlug(slug);
  if (slug.startsWith("book-")) return getOpenLibraryWorkBySlug(slug);

  return null;
}
