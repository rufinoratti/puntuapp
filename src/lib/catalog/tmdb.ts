import "server-only";

import type { MediaItem } from "@/lib/media";

import {
  CATALOG_REVALIDATE_SECONDS,
  CatalogProviderError,
  catalogSlug,
  formatRuntime,
  MAX_CATALOG_RESULTS,
  tagsForGenres,
} from "./shared";

const TMDB_API_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

type TmdbMovie = {
  id: number;
  title?: string;
  original_title?: string;
  overview?: string;
  release_date?: string;
  poster_path?: string | null;
  vote_average?: number;
  genre_ids?: number[];
  genres?: Array<{ name: string }>;
  runtime?: number | null;
  credits?: {
    cast?: Array<{ name?: string }>;
    crew?: Array<{ job?: string; name?: string }>;
  };
};

const genreNames: Record<number, string> = {
  12: "Aventura",
  14: "Fantasía",
  16: "Animación",
  18: "Drama",
  27: "Terror",
  28: "Acción",
  35: "Comedia",
  36: "Historia",
  37: "Western",
  53: "Suspenso",
  80: "Crimen",
  99: "Documental",
  878: "Ciencia ficción",
  9648: "Misterio",
  10402: "Música",
  10749: "Romance",
  10751: "Familia",
  10752: "Bélica",
};

function getToken() {
  const token = process.env.TMDB_READ_ACCESS_TOKEN?.trim();
  if (!token) {
    throw new CatalogProviderError("Falta configurar TMDB_READ_ACCESS_TOKEN para buscar películas.");
  }
  return token;
}

async function requestTmdb<T>(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${TMDB_API_URL}${path}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      next: { revalidate: CATALOG_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    throw new CatalogProviderError("No se pudo conectar con TMDB. Probá de nuevo en unos segundos.");
  }

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new CatalogProviderError("TMDB no respondió correctamente. Probá de nuevo en unos segundos.");
  }

  return (await response.json()) as T;
}

function movieGenres(movie: TmdbMovie) {
  if (movie.genres?.length) return movie.genres.map((genre) => genre.name).filter(Boolean);
  return (movie.genre_ids ?? []).map((id) => genreNames[id]).filter((name): name is string => Boolean(name));
}

function mapMovie(movie: TmdbMovie, detail = false): MediaItem {
  const title = movie.title || movie.original_title || "Película sin título";
  const genres = movieGenres(movie);
  const providerId = String(movie.id);
  const poster = movie.poster_path ? `${TMDB_IMAGE_URL}${movie.poster_path}` : undefined;
  const director = movie.credits?.crew?.find((member) => member.job === "Director")?.name;
  const rating = Number(movie.vote_average ?? 0);

  return {
    id: `tmdb-${providerId}`,
    slug: catalogSlug("tmdb", providerId, title),
    type: "movie",
    source: "tmdb",
    providerId,
    sourceUrl: `https://www.themoviedb.org/movie/${providerId}`,
    title,
    ...(detail && director ? { creatorLabel: "Dirección", creator: director } : {}),
    year: movie.release_date?.slice(0, 4) || "—",
    rating: 0,
    ...(rating > 0 ? { externalRating: { value: rating, scale: 10 as const, label: "TMDB" } } : {}),
    genre: genres[0] || "Película",
    tags: tagsForGenres(genres),
    image: poster || "/puntuapp-hero.png",
    imageAlt: poster ? `Afiche de ${title}` : `Imagen de ${title}`,
    ...(detail && movie.overview ? { description: movie.overview } : {}),
    ...(detail && movie.credits?.cast?.length
      ? { cast: movie.credits.cast.map((member) => member.name).filter((name): name is string => Boolean(name)).slice(0, 5) }
      : {}),
    ...(detail && formatRuntime(movie.runtime) ? { runtime: formatRuntime(movie.runtime) } : {}),
  };
}

export async function searchMovies(query: string, limit = MAX_CATALOG_RESULTS) {
  const data = await requestTmdb<{ results?: TmdbMovie[] }>("/search/movie", {
    query,
    language: "es-AR",
    include_adult: "false",
    page: "1",
  });

  return (data?.results ?? []).slice(0, limit).map((movie) => mapMovie(movie));
}

export async function getMovieById(id: string) {
  const data = await requestTmdb<TmdbMovie>(`/movie/${encodeURIComponent(id)}`, {
    language: "es-AR",
    append_to_response: "credits",
  });

  return data ? mapMovie(data, true) : null;
}
