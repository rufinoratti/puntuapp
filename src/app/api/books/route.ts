import { NextRequest, NextResponse } from "next/server";

const MAX_RESULTS = 12;
const BOOK_FIELDS = [
  "key",
  "title",
  "author_name",
  "first_publish_year",
  "cover_i",
  "isbn",
  "subject",
].join(",");

type OpenLibraryDocument = {
  key?: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  isbn?: string[];
  subject?: string[];
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getCoverUrl(document: OpenLibraryDocument) {
  if (document.cover_i) {
    return `https://covers.openlibrary.org/b/id/${document.cover_i}-L.jpg?default=false`;
  }

  const isbn = document.isbn?.find((value) => value.length === 13) ?? document.isbn?.[0];
  return isbn
    ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`
    : "/images/book-placeholder.svg";
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim();

  if (!query || query.length < 3) {
    return NextResponse.json({ items: [] });
  }

  const requestedLimit = Number(request.nextUrl.searchParams.get("limit") ?? MAX_RESULTS);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(Math.floor(requestedLimit), 1), MAX_RESULTS)
    : MAX_RESULTS;
  const apiUrl = new URL("https://openlibrary.org/search.json");
  apiUrl.searchParams.set("q", query);
  apiUrl.searchParams.set("lang", "es");
  apiUrl.searchParams.set("limit", String(limit));
  apiUrl.searchParams.set("fields", BOOK_FIELDS);

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "PuntuApp/0.1 (non-profit portfolio MVP)",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Open Library no respondió correctamente." }, { status: 502 });
    }

    const data = (await response.json()) as { docs?: OpenLibraryDocument[] };
    const items = (data.docs ?? [])
      .filter((document) => document.title)
      .map((document, index) => {
        const title = document.title ?? "Libro sin título";
        const author = document.author_name?.join(", ") ?? "Autor desconocido";
        const sourceId = document.key?.replace(/^\//, "").replaceAll("/", "-") ?? `${slugify(title)}-${index}`;

        return {
          id: `open-library-${sourceId}-${index}`,
          slug: `libro-${slugify(title)}-${index}`,
          type: "book" as const,
          title,
          creatorLabel: "Autor",
          creator: author,
          year: document.first_publish_year?.toString() ?? "—",
          rating: 0,
          genre: document.subject?.[0] ?? "Libro",
          image: getCoverUrl(document),
          imageAlt: `Portada de ${title}`,
        };
      });

    return NextResponse.json(
      { items },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "No se pudo consultar Open Library." }, { status: 502 });
  }
}
