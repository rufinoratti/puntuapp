import "server-only";

import type { MediaItem } from "@/lib/media";

import {
  CATALOG_REVALIDATE_SECONDS,
  catalogSlug,
  MAX_CATALOG_RESULTS,
  tagsForGenres,
} from "./shared";

const OPEN_LIBRARY_URL = "https://openlibrary.org";
const BOOK_FIELDS = ["key", "title", "author_name", "first_publish_year", "cover_i", "subject"].join(",");

type OpenLibraryDocument = {
  key?: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
};

type OpenLibraryWork = {
  title?: string;
  description?: string | { value?: string };
  first_publish_date?: string;
  covers?: number[];
  subjects?: string[];
  authors?: Array<{ author?: { key?: string } }>;
};

function getCoverUrl(coverId?: number) {
  return coverId && coverId > 0
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg?default=false`
    : "/images/book-placeholder.svg";
}

function getWorkId(key?: string) {
  const workId = key?.match(/\/works\/(OL\d+W)$/i)?.[1];
  return workId?.toUpperCase();
}

function mapBook(document: OpenLibraryDocument): MediaItem | null {
  const workId = getWorkId(document.key);
  if (!workId || !document.title) return null;

  const subjects = document.subject?.slice(0, 10) ?? [];
  const image = getCoverUrl(document.cover_i);

  return {
    id: `openlibrary-${workId}`,
    slug: catalogSlug("openlibrary", workId, document.title),
    type: "book",
    source: "openlibrary",
    providerId: workId,
    sourceUrl: `${OPEN_LIBRARY_URL}/works/${workId}`,
    title: document.title,
    creatorLabel: "Autoría",
    creator: document.author_name?.join(", ") || "Autor desconocido",
    year: document.first_publish_year?.toString() || "—",
    rating: 0,
    genre: subjects[0] || "Libro",
    tags: tagsForGenres(subjects),
    image,
    imageAlt: `Portada de ${document.title}`,
  };
}

export async function searchBooks(query: string, limit = MAX_CATALOG_RESULTS) {
  const url = new URL(`${OPEN_LIBRARY_URL}/search.json`);
  url.searchParams.set("q", query);
  url.searchParams.set("lang", "es");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("fields", BOOK_FIELDS);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "PuntuApp/0.1 (non-profit portfolio MVP)",
    },
    next: { revalidate: CATALOG_REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) throw new Error("Open Library no respondió correctamente.");

  const data = (await response.json()) as { docs?: OpenLibraryDocument[] };
  return (data.docs ?? []).map(mapBook).filter((item): item is MediaItem => Boolean(item)).slice(0, limit);
}

async function getAuthorName(key?: string) {
  const authorId = key?.match(/\/authors\/(OL\d+A)$/i)?.[1];
  if (!authorId) return null;

  const response = await fetch(`${OPEN_LIBRARY_URL}/authors/${authorId.toUpperCase()}.json`, {
    headers: { Accept: "application/json", "User-Agent": "PuntuApp/0.1 (non-profit portfolio MVP)" },
    next: { revalidate: 24 * CATALOG_REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) return null;

  const data = (await response.json()) as { name?: string };
  return data.name || null;
}

export async function getBookById(id: string) {
  const workId = id.toUpperCase();
  const response = await fetch(`${OPEN_LIBRARY_URL}/works/${workId}.json`, {
    headers: { Accept: "application/json", "User-Agent": "PuntuApp/0.1 (non-profit portfolio MVP)" },
    next: { revalidate: 24 * CATALOG_REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(8_000),
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Open Library no respondió correctamente.");

  const work = (await response.json()) as OpenLibraryWork;
  const authors = await Promise.all((work.authors ?? []).slice(0, 3).map((entry) => getAuthorName(entry.author?.key)));
  const subjects = work.subjects?.slice(0, 10) ?? [];
  const cover = getCoverUrl(work.covers?.[0]);
  const description = typeof work.description === "string" ? work.description : work.description?.value;
  const title = work.title || "Libro sin título";

  return {
    id: `openlibrary-${workId}`,
    slug: catalogSlug("openlibrary", workId, title),
    type: "book" as const,
    source: "openlibrary" as const,
    providerId: workId,
    sourceUrl: `${OPEN_LIBRARY_URL}/works/${workId}`,
    title,
    ...(authors.length ? { creatorLabel: authors.length === 1 ? "Autor" : "Autores", creator: authors.filter(Boolean).join(", ") } : {}),
    year: work.first_publish_date?.match(/\d{4}/)?.[0] || "—",
    rating: 0,
    genre: subjects[0] || "Libro",
    tags: tagsForGenres(subjects),
    image: cover,
    imageAlt: `Portada de ${title}`,
    ...(description ? { description } : {}),
  } satisfies MediaItem;
}
