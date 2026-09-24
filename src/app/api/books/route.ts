import { NextRequest, NextResponse } from "next/server";

import { searchBooks } from "@/lib/catalog/openlibrary";
import { MAX_CATALOG_RESULTS } from "@/lib/catalog/shared";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim();

  if (!query || query.length < 3) {
    return NextResponse.json({ items: [] });
  }

  const requestedLimit = Number(request.nextUrl.searchParams.get("limit") ?? MAX_CATALOG_RESULTS);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(Math.floor(requestedLimit), 1), MAX_CATALOG_RESULTS)
    : MAX_CATALOG_RESULTS;

  try {
    const items = await searchBooks(query, limit);

    return NextResponse.json(
      { items },
      {
        headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" },
      },
    );
  } catch {
    return NextResponse.json({ error: "No se pudo consultar Open Library." }, { status: 502 });
  }
}
