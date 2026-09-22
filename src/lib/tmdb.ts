import type { MediaItem } from "@/lib/media";

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const TMDB_GENRES: Record<number, string> = {
  28: "Acción",
  12: "Aventura",
  16: "Animación",
  35: "Comedia",
  80: "Crimen",
  99: "Documental",
  18: "Drama",
  10751: "Familiar",
  14: "Fantasía",
  36: "Historia",
  27: "Terror",
  10402: "Música",
  9648: "Misterio",
  10749: "Romance",
  878: "Ciencia ficción",
  53: "Thriller",
  10752: "Bélica",
  37: "Western",
};

const TMDB_TAG_BY_GENRE: Record<number, string> = {
  878: "ciencia-ficcion",
  18: "drama",
  27: "terror",
  28: "accion",
  35: "comedia",
  14: "fantasia",
};

type TmdbMovieListItem = {
  id: number;
  title?: string;
  original_title?: string;
  overview?: string | null;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string | null;
  vote_average?: number | null;
  genre_ids?: number[];
  popularity?: number | null;
  original_language?: string;
};

type TmdbMovieDetail = TmdbMovieListItem & {
  genres?: Array<{ id: number; name: string }>;
  runtime?: number | null;
  tagline?: string | null;
  credits?: {
    cast?: Array<{ name: string; character?: string }>;
    crew?: Array<{ name: string; job?: string }>;
  };
};

function isTmdbConfigured() {
  return Boolean(process.env.TMDB_READ_ACCESS_TOKEN);
}

function tmdbHeaders() {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
  };
}

async function tmdbFetch<T>(path: string, searchParams?: Record<string, string>): Promise<T | null> {
  if (!isTmdbConfigured()) return null;

  const url = new URL(`${TMDB_BASE}${path}`);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value);
    }
  }

  try {
    const response = await fetch(url, {
      headers: tmdbHeaders(),
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

function formatRuntime(minutes?: number | null) {
  if (!minutes || minutes <= 0) return undefined;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest} min`;
  if (!rest) return `${hours} h`;
  return `${hours} h ${rest} min`;
}

function tagsFromGenreIds(genreIds: number[] | undefined, rating: number) {
  const tags = new Set<string>();
  for (const id of genreIds ?? []) {
    const tag = TMDB_TAG_BY_GENRE[id];
    if (tag) tags.add(tag);
  }
  if (rating >= 4.7) tags.add("top");
  return Array.from(tags);
}

function mapMovieListItem(movie: TmdbMovieListItem): MediaItem | null {
  const title = movie.title || movie.original_title;
  if (!title) return null;

  const genreId = movie.genre_ids?.[0];
  const genreName = (genreId && TMDB_GENRES[genreId]) || "Película";
  const rating = typeof movie.vote_average === "number" ? Math.round(movie.vote_average) / 2 : 0;
  const image = movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : "/images/book-placeholder.svg";

  return {
    id: `movie-${movie.id}`,
    slug: `movie-${movie.id}`,
    type: "movie",
    title,
    creatorLabel: "Director",
    creator: "",
    year: yearFromDate(movie.release_date),
    rating: Number.isFinite(rating) ? rating : 0,
    genre: genreName,
    image,
    imageAlt: `Póster de ${title}`,
    description: movie.overview?.trim() || undefined,
    tags: tagsFromGenreIds(movie.genre_ids, rating),
  };
}

function mapMovieDetail(movie: TmdbMovieDetail): MediaItem | null {
  const base = mapMovieListItem(movie);
  if (!base) return null;

  const director = movie.credits?.crew?.find((member) => member.job === "Director")?.name;
  const cast = (movie.credits?.cast ?? [])
    .slice(0, 6)
    .map((member) => member.name)
    .filter(Boolean);
  const genre =
    movie.genres?.[0]?.name ||
    (movie.genre_ids?.[0] && TMDB_GENRES[movie.genre_ids[0]]) ||
    "Película";
  const tags = new Set(base.tags ?? []);
  for (const item of movie.genres ?? []) {
    const tag = TMDB_TAG_BY_GENRE[item.id];
    if (tag) tags.add(tag);
  }

  return {
    ...base,
    creator: director || "",
    genre,
    description: movie.overview?.trim() || movie.tagline || base.description,
    runtime: formatRuntime(movie.runtime),
    cast: cast.length ? cast : undefined,
    tags: Array.from(tags),
  };
}

export async function getTmdbPopularMovies(limit = 12): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results?: TmdbMovieListItem[] }>("/movie/popular", {
    language: "es-ES",
    page: "1",
  });
  if (!data?.results) return [];

  return data.results
    .map(mapMovieListItem)
    .filter((item): item is MediaItem => Boolean(item))
    .slice(0, limit);
}

export async function searchTmdbMovies(query: string, limit = 12): Promise<MediaItem[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3) return [];

  const data = await tmdbFetch<{ results?: TmdbMovieListItem[] }>("/search/movie", {
    query: trimmed,
    language: "es-ES",
    include_adult: "false",
    page: "1",
  });
  if (!data?.results) return [];

  return data.results
    .map(mapMovieListItem)
    .filter((item): item is MediaItem => Boolean(item))
    .slice(0, limit);
}

export async function getTmdbMovieBySlug(slug: string): Promise<MediaItem | null> {
  const match = slug.match(/^movie-(\d+)$/);
  if (!match) return null;

  const data = await tmdbFetch<TmdbMovieDetail>(`/movie/${match[1]}`, {
    language: "es-ES",
    append_to_response: "credits",
  });
  if (!data) return null;

  return mapMovieDetail(data);
}
