import "server-only";

import type { MediaItem, MediaReview } from "@/lib/media";

import { getSupabaseEnvironment } from "./env";
import { createSupabaseServerClient } from "./server";

export async function getMediaCommunity(item: MediaItem) {
  if (!getSupabaseEnvironment()) {
    return { reviews: [] as MediaReview[], isInLibrary: false, isAuthenticated: false };
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const provider = item.source ?? "sample";
  const providerId = item.providerId ?? item.slug;
  const { data: media } = await supabase
    .from("media_items")
    .select("id")
    .eq("provider", provider)
    .eq("provider_id", providerId)
    .maybeSingle();

  if (!media) {
    return { reviews: [] as MediaReview[], isInLibrary: false, isAuthenticated: Boolean(user) };
  }

  const { data: reviewRows } = await supabase
    .from("reviews")
    .select("id, author_name, score, content, created_at")
    .eq("media_item_id", media.id)
    .order("created_at", { ascending: false })
    .limit(30);

  const reviews: MediaReview[] = (reviewRows ?? []).map((review) => ({
    id: review.id as string,
    author: review.author_name as string,
    rating: Number(review.score),
    text: review.content as string,
    createdAt: review.created_at as string,
  }));

  let isInLibrary = false;
  if (user) {
    const { data: libraryItem } = await supabase
      .from("user_library")
      .select("id")
      .eq("media_item_id", media.id)
      .maybeSingle();
    isInLibrary = Boolean(libraryItem);
  }

  return { reviews, isInLibrary, isAuthenticated: Boolean(user) };
}
