import { NextResponse } from "next/server";

import { getCatalogItems } from "@/lib/catalog";

export async function GET() {
  try {
    const items = await getCatalogItems();
    return NextResponse.json(
      { items },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "No se pudo cargar el catálogo." }, { status: 502 });
  }
}
