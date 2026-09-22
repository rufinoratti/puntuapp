import { NextRequest, NextResponse } from "next/server";

import { searchOpenLibraryBooks } from "@/lib/books";

const MAX_RESULTS = 12;

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim();

  if (!query || query.length < 3) {
    return NextResponse.json({ items: [] });
  }

  const requestedLimit = Number(request.nextUrl.searchParams.get("limit") ?? MAX_RESULTS);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(Math.floor(requestedLimit), 1), MAX_RESULTS)
    : MAX_RESULTS;

  try {
    const items = await searchOpenLibraryBooks(query, limit);
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
