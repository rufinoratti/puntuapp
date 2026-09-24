import "server-only";

import type { MediaItem } from "@/lib/media";

import { createSupabaseAdminClient } from "./admin";

export async function getOrCreateMediaItemId(item: MediaItem) {
  const supabase = createSupabaseAdminClient();
  const provider = item.source ?? "sample";
  const providerId = item.providerId ?? item.slug;
  const { data, error } = await supabase
    .from("media_items")
    .insert({
      provider,
      provider_id: providerId,
      media_type: item.type,
      slug: item.slug,
      title: item.title,
      creator_label: item.creatorLabel ?? null,
      creator: item.creator ?? null,
      release_year: item.year,
      description: item.description ?? null,
      genre: item.genre,
      image_url: item.image,
      source_url: item.sourceUrl ?? null,
      external_rating: item.externalRating?.value ?? null,
      external_rating_scale: item.externalRating?.scale ?? null,
      external_rating_label: item.externalRating?.label ?? null,
      runtime: item.runtime ?? null,
      metadata: {
        tags: item.tags ?? [],
        cast: item.cast ?? [],
        platforms: item.platforms ?? [],
      },
    })
    .select("id")
    .maybeSingle();

  if (!error && data) return data.id as string;
  if (error?.code !== "23505") {
    throw new Error("No se pudo guardar esta historia en el catálogo.");
  }

  const existing = await supabase
    .from("media_items")
    .select("id")
    .eq("provider", provider)
    .eq("provider_id", providerId)
    .maybeSingle();

  if (existing.error || !existing.data) throw new Error("No se pudo encontrar esta historia en el catálogo.");
  return existing.data.id as string;
}
