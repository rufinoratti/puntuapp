import "server-only";

import type { MediaItem } from "@/lib/media";

import {
  CATALOG_REVALIDATE_SECONDS,
  CatalogProviderError,
  catalogSlug,
  MAX_CATALOG_RESULTS,
  tagsForGenres,
} from "./shared";

const RAWG_API_URL = "https://api.rawg.io/api";

type RawgPlatform = { platform?: { name?: string; slug?: string } };
type RawgGame = {
  id: number;
  name?: string;
  slug?: string;
  description?: string;
  description_raw?: string;
  released?: string | null;
  background_image?: string | null;
  rating?: number;
  genres?: Array<{ name?: string; slug?: string }>;
  developers?: Array<{ name?: string }>;
  platforms?: RawgPlatform[];
  playtime?: number;
};

function getApiKey() {
  const apiKey = process.env.RAWG_API_KEY?.trim();
  if (!apiKey) {
    throw new CatalogProviderError("Falta configurar RAWG_API_KEY para buscar videojuegos.");
  }
  return apiKey;
}

async function requestRawg<T>(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${RAWG_API_URL}${path}`);
  url.searchParams.set("key", getApiKey());
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: CATALOG_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    throw new CatalogProviderError("No se pudo conectar con RAWG. Probá de nuevo en unos segundos.");
  }

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new CatalogProviderError("RAWG no respondió correctamente. Probá de nuevo en unos segundos.");
  }

  return (await response.json()) as T;
}

function plainText(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function mapGame(game: RawgGame, detail = false): MediaItem {
  const title = game.name || "Videojuego sin título";
  const genres = game.genres?.map((genre) => genre.name || genre.slug || "").filter(Boolean) ?? [];
  const platforms = game.platforms?.map((entry) => entry.platform?.slug || entry.platform?.name || "").filter(Boolean) ?? [];
  const developers = game.developers?.map((developer) => developer.name).filter((name): name is string => Boolean(name)) ?? [];
  const providerId = String(game.id);
  const image = game.background_image || "/puntuapp-hero.png";
  const description = game.description_raw || (game.description ? plainText(game.description) : undefined);
  const rating = Number(game.rating ?? 0);

  return {
    id: `rawg-${providerId}`,
    slug: catalogSlug("rawg", providerId, title),
    type: "game",
    source: "rawg",
    providerId,
    sourceUrl: `https://rawg.io/games/${game.slug || providerId}`,
    title,
    ...(developers[0] ? { creatorLabel: "Desarrollador", creator: developers.join(", ") } : {}),
    year: game.released?.slice(0, 4) || "—",
    rating: 0,
    ...(rating > 0 ? { externalRating: { value: rating, scale: 5 as const, label: "RAWG" } } : {}),
    genre: genres[0] || "Videojuego",
    tags: tagsForGenres(genres),
    image,
    imageAlt: game.background_image ? `Imagen de ${title}` : `Imagen de ${title}`,
    ...(detail && description ? { description } : {}),
    ...(detail && game.playtime ? { runtime: `${game.playtime} h promedio` } : {}),
    ...(platforms.length ? { platforms } : {}),
  };
}

export async function searchGames(query: string, limit = MAX_CATALOG_RESULTS) {
  const data = await requestRawg<{ results?: RawgGame[] }>("/games", {
    search: query,
    page_size: String(limit),
  });

  return (data?.results ?? []).slice(0, limit).map((game) => mapGame(game));
}

export async function getGameById(id: string) {
  const data = await requestRawg<RawgGame>(`/games/${encodeURIComponent(id)}`);
  return data ? mapGame(data, true) : null;
}
