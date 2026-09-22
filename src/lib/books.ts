import type { MediaItem } from "@/lib/media";
import { slugify } from "@/lib/slug";

const MAX_RESULTS = 12;
const BOOK_FIELDS = [
  "key",
  "title",
  "author_name",
  "first_publish_year",
  "cover_i",
  "subject",
].join(",");

type OpenLibraryDocument = {
  key?: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
};

type OpenLibraryWork = {
  key?: string;
  title?: string;
  description?: string | { value?: string } | Array<string | { value?: string }>;
  subjects?: string[];
  covers?: number[];
  first_publish_year?: number;
};

function getDescription(work: OpenLibraryWork): string | undefined {
  const raw = work.description;
  if (!raw) return undefined;
  if (typeof raw === "string") return raw.trim() || undefined;
  if (Array.isArray(raw)) {
    const first = raw[0];
    if (typeof first === "string") return first.trim() || undefined;
    if (first && typeof first === "object" && "value" in first) {
      return first.value?.trim() || undefined;
    }
    return undefined;
  }
  if (typeof raw === "object" && "value" in raw) {
    return raw.value?.trim() || undefined;
  }
  return undefined;
}

function getCoverUrl(coverId?: number) {
  if (coverId) {
    return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg?default=false`;
  }
  return "/images/book-placeholder.svg";
}

export function mapOpenLibraryDocument(document: OpenLibraryDocument, index = 0): MediaItem | null {
  if (!document.title) return null;

  const title = document.title;
  const author = document.author_name?.join(", ") ?? "Autor desconocido";
  const workId = document.key?.replace(/^\/works\//, "") ?? `${slugify(title)}-${index}`;

  return {
    id: `book-${workId}`,
    slug: `book-${workId}`,
    type: "book",
    title,
    creatorLabel: "Autor",
    creator: author,
    year: document.first_publish_year?.toString() ?? "—",
    rating: 0,
    genre: document.subject?.[0] ?? "Libro",
    image: getCoverUrl(document.cover_i),
    imageAlt: `Portada de ${title}`,
    tags: [],
  };
}

export async function getOpenLibraryWorkBySlug(slug: string): Promise<MediaItem | null> {
  const match = slug.match(/^book-(.+)$/);
  if (!match) return null;

  const workId = match[1];
  if (!workId || workId.startsWith("libro-")) return null;

  try {
    const response = await fetch(`https://openlibrary.org/works/${workId}.json`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "PuntuApp/0.1 (non-profit portfolio MVP)",
      },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;

    const work = (await response.json()) as OpenLibraryWork;
    const title = work.title ?? "Libro sin título";
    const subjects = work.subjects ?? [];
    const description = getDescription(work);

    let creator = "Autor desconocido";
    let year = "—";

    try {
      const editionResponse = await fetch(
        `https://openlibrary.org/works/${workId}/editions.json?limit=1`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "PuntuApp/0.1 (non-profit portfolio MVP)",
          },
          next: { revalidate: 3600 },
        },
      );
      if (editionResponse.ok) {
        const editions = (await editionResponse.json()) as {
          entries?: Array<{
            contributors?: Array<{ name: string }>;
            publish_date?: string;
            by_statement?: string;
            authors?: Array<{ key: string }>;
          }>;
        };
        const edition = editions.entries?.[0];
        if (edition?.by_statement) {
          creator = edition.by_statement;
        } else if (edition?.contributors?.[0]?.name) {
          creator = edition.contributors[0].name;
        }
        if (edition?.publish_date) {
          const yearMatch = edition.publish_date.match(/\d{4}/);
          if (yearMatch) year = yearMatch[0];
        }
      }
    } catch {
      // Keep defaults if edition lookup fails.
    }

    if (creator === "Autor desconocido") {
      try {
        const authorResponse = await fetch(
          `https://openlibrary.org/works/${workId}/authors.json`,
          {
            headers: {
              Accept: "application/json",
              "User-Agent": "PuntuApp/0.1 (non-profit portfolio MVP)",
            },
            next: { revalidate: 3600 },
          },
        );
        if (authorResponse.ok) {
          const authors = (await authorResponse.json()) as {
            entries?: Array<{ name?: string }>;
          };
          const name = authors.entries?.[0]?.name;
          if (name) creator = name;
        }
      } catch {
        // Keep default author.
      }
    }

    if (year === "—") {
      const published = (work as { publish_date?: string }).publish_date;
      const yearMatch = published?.match(/\d{4}/);
      if (yearMatch) year = yearMatch[0];
    }

    return {
      id: `book-${workId}`,
      slug: `book-${workId}`,
      type: "book",
      title,
      creatorLabel: "Autor",
      creator,
      year,
      rating: 0,
      genre: subjects[0] ?? "Libro",
      image: getCoverUrl(work.covers?.[0]),
      imageAlt: `Portada de ${title}`,
      description,
      tags: [],
    };
  } catch {
    return null;
  }
}

export async function searchOpenLibraryBooks(query: string, limit = MAX_RESULTS): Promise<MediaItem[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3) return [];

  const apiUrl = new URL("https://openlibrary.org/search.json");
  apiUrl.searchParams.set("q", trimmed);
  apiUrl.searchParams.set("lang", "es");
  apiUrl.searchParams.set("limit", String(limit));
  apiUrl.searchParams.set("fields", BOOK_FIELDS);

  const response = await fetch(apiUrl, {
    headers: {
      Accept: "application/json",
      "User-Agent": "PuntuApp/0.1 (non-profit portfolio MVP)",
    },
    next: { revalidate: 3600 },
  });
  if (!response.ok) return [];

  const data = (await response.json()) as { docs?: OpenLibraryDocument[] };
  return (data.docs ?? [])
    .map((document, index) => mapOpenLibraryDocument(document, index))
    .filter((item): item is MediaItem => Boolean(item));
}
