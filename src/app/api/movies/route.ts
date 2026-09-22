import { NextRequest, NextResponse } from "next/server";

import { searchTmdbMovies } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim() ?? "";
  const requestedLimit = Number(request.nextUrl.searchParams.get("limit") ?? 12);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(Math.floor(requestedLimit), 1), 12)
    : 12;

  if (query.length < 3) {
    return NextResponse.json({ items: [] });
  }

  if (!process.env.TMDB_READ_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: "Falta TMDB_READ_ACCESS_TOKEN en el entorno." },
      { status: 503 },
    );
  }

  try {
    const items = await searchTmdbMovies(query, limit);
    return NextResponse.json(
      { items },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "No se pudo consultar TMDB." }, { status: 502 });
  }
}
