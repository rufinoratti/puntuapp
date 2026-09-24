import { NextRequest, NextResponse } from "next/server";

import type { MediaItem, MediaType } from "@/lib/media";
import { searchBooks } from "@/lib/catalog/openlibrary";
import { CatalogProviderError, MAX_CATALOG_RESULTS } from "@/lib/catalog/shared";
import { searchGames } from "@/lib/catalog/rawg";
import { searchMovies } from "@/lib/catalog/tmdb";

export const maxDuration = 10;

const searchers: Record<MediaType, (query: string, limit: number) => Promise<MediaItem[]>> = {
  movie: searchMovies,
  game: searchGames,
  book: searchBooks,
};

function providerError(type: MediaType, reason: unknown) {
  if (reason instanceof CatalogProviderError || reason instanceof Error) return reason.message;
  const provider = type === "movie" ? "TMDB" : type === "game" ? "RAWG" : "Open Library";
  return `No se pudo buscar en ${provider}. Probá de nuevo en unos segundos.`;
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim() ?? "";
  const requestedType = request.nextUrl.searchParams.get("type") ?? "all";

  if (!query || query.length < 3) {
    return NextResponse.json({ items: [], errors: {} });
  }
  if (query.length > 100) {
    return NextResponse.json({ error: "La búsqueda no puede superar los 100 caracteres." }, { status: 400 });
  }
  if (requestedType !== "all" && !Object.hasOwn(searchers, requestedType)) {
    return NextResponse.json({ error: "El tipo de contenido solicitado no es válido." }, { status: 400 });
  }

  const requestedLimit = Number(request.nextUrl.searchParams.get("limit") ?? MAX_CATALOG_RESULTS);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(Math.floor(requestedLimit), 1), MAX_CATALOG_RESULTS)
    : MAX_CATALOG_RESULTS;
  const types = requestedType === "all" ? (Object.keys(searchers) as MediaType[]) : [requestedType as MediaType];
  const results = await Promise.allSettled(types.map((type) => searchers[type](query, limit)));
  const items: MediaItem[] = [];
  const errors: Partial<Record<MediaType, string>> = {};
  let successfulProviders = 0;

  results.forEach((result, index) => {
    const type = types[index];
    if (result.status === "fulfilled") {
      successfulProviders += 1;
      items.push(...result.value);
    } else {
      errors[type] = providerError(type, result.reason);
    }
  });

  if (successfulProviders === 0) {
    const errorMessage = Object.values(errors).join(" ") || "No se pudo consultar el catálogo.";
    return NextResponse.json({ items: [], errors, error: errorMessage }, { status: 502 });
  }

  return NextResponse.json(
    { items, errors },
    { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" } },
  );
}
