import type { MediaItem } from "@/lib/media";

const RAWG_BASE = "https://api.rawg.io/api";

type RawgGameListItem = {
  id: number;
  name?: string;
  background_image?: string | null;
  released?: string | null;
  rating?: number | null;
  genres?: Array<{ id: number; name: string }>;
  platforms?: Array<{ platform: { id: number; name: string; slug: string } }>;
  developers?: Array<{ id: number; name: string }>;
  short_description?: string | null;
  description?: string | null;
  playtime?: number | null;
};

function isRawgConfigured() {
  return Boolean(process.env.RAWG_API_KEY);
}

function rawgUrl(path: string, params?: Record<string, string>) {
  const url = new URL(`${RAWG_BASE}${path}`);
  url.searchParams.set("key", process.env.RAWG_API_KEY ?? "");
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }
  return url;
}

async function rawgFetch<T>(path: string, params?: Record<string, string>): Promise<T | null> {
  if (!isRawgConfigured()) return null;

  try {
    const response = await fetch(rawgUrl(path, params), {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function yearFromDate(value?: string | null) {
  if (!value) return "—";
  return value.slice(0, 4);
}

function platformTags(platforms: RawgGameListItem["platforms"]) {
  const allowed = new Set(["pc", "playstation", "xbox", "nintendo-switch"]);
  const tags: string[] = [];
  for (const entry of platforms ?? []) {
    const slug = entry.platform?.slug;
    if (slug && allowed.has(slug) && !tags.includes(slug)) {
      tags.push(slug);
    }
  }
  return tags;
}

function mapGameListItem(game: RawgGameListItem): MediaItem | null {
  if (!game.id || !game.name) return null;

  const rating = typeof game.rating === "number" ? Math.round(game.rating * 10) / 10 : 0;
  const genre = game.genres?.[0]?.name ?? "Videojuego";
  const tags = [
    ...platformTags(game.platforms),
    ...(rating >= 4.7 ? ["top"] : []),
  ];
  const description = game.short_description?.trim() || undefined;

  return {
    id: `game-${game.id}`,
    slug: `game-${game.id}`,
    type: "game",
    title: game.name,
    creatorLabel: "Desarrollador",
    creator: game.developers?.[0]?.name ?? "",
    year: yearFromDate(game.released),
    rating,
    genre,
    image: game.background_image || "/images/book-placeholder.svg",
    imageAlt: `Arte de ${game.name}`,
    description,
    tags,
    platforms: platformTags(game.platforms),
  };
}

function mapGameDetail(game: RawgGameListItem): MediaItem | null {
  const base = mapGameListItem(game);
  if (!base) return null;

  const description =
    game.description?.replace(/<[^>]+>/g, " ").trim() || base.description;
  const hours = game.playtime && game.playtime > 0 ? `${game.playtime} h` : undefined;

  return {
    ...base,
    creator: game.developers?.[0]?.name ?? base.creator,
    description: description || base.description,
    runtime: hours,
  };
}

export async function getRawgPopularGames(limit = 12): Promise<MediaItem[]> {
  const data = await rawgFetch<{ results?: RawgGameListItem[] }>("/games", {
    page_size: String(limit),
    ordering: "-added",
  });
  if (!data?.results) return [];

  return data.results
    .map(mapGameListItem)
    .filter((item): item is MediaItem => Boolean(item))
    .slice(0, limit);
}

export async function searchRawgGames(query: string, limit = 12): Promise<MediaItem[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3) return [];

  const data = await rawgFetch<{ results?: RawgGameListItem[] }>("/games", {
    search: trimmed,
    page_size: String(limit),
  });
  if (!data?.results) return [];

  return data.results
    .map(mapGameListItem)
    .filter((item): item is MediaItem => Boolean(item))
    .slice(0, limit);
}

export async function getRawgGameBySlug(slug: string): Promise<MediaItem | null> {
  const match = slug.match(/^game-(\d+)$/);
  if (!match) return null;

  const data = await rawgFetch<RawgGameListItem>(`/games/${match[1]}`);
  if (!data) return null;

  return mapGameDetail(data);
}
