"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getMediaItemBySlug } from "@/lib/catalog";
import { getOrCreateMediaItemId } from "@/lib/supabase/catalog";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type MediaActionState = {
  error?: string;
  message?: string;
  isSaved?: boolean;
};

const mediaSlugSchema = z.string().min(1).max(300).regex(/^[a-zA-Z0-9-]+$/);

function readSlug(formData: FormData) {
  const value = formData.get("slug");
  return typeof value === "string" ? mediaSlugSchema.safeParse(value) : mediaSlugSchema.safeParse("");
}

async function getSignedInUser(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function submitReviewAction(_previousState: MediaActionState, formData: FormData): Promise<MediaActionState> {
  const slug = readSlug(formData);
  const score = z.coerce.number().min(0.5).max(5).refine((value) => Number.isInteger(value * 2)).safeParse(formData.get("score"));
  const content = z.string().trim().min(1).max(5000).safeParse(formData.get("review"));

  if (!slug.success || !score.success || !content.success) {
    return { error: "Elegí una puntuación y escribí una reseña de hasta 5.000 caracteres." };
  }

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch (error) {
    return { error: error instanceof Error ? error.message : "No se pudo conectar con Supabase." };
  }

  const user = await getSignedInUser(supabase);
  if (!user) return { error: "Iniciá sesión para publicar una reseña." };

  try {
    const item = await getMediaItemBySlug(slug.data);
    if (!item) return { error: "No encontramos esta historia en el catálogo." };

    const mediaItemId = await getOrCreateMediaItemId(item);
    const { data: profileData } = await supabase
      .from("profiles")
      .select("first_name, last_name, username")
      .eq("id", user.id)
      .maybeSingle();
    const profile = profileData as { first_name: string | null; last_name: string | null; username: string | null } | null;
    const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim();
    const metadataName = typeof user.user_metadata?.display_name === "string" ? user.user_metadata.display_name.trim() : "";
    const authorName = (profile?.username ? `@${profile.username}` : fullName || metadataName || user.email?.split("@")[0] || "Usuario").slice(0, 80);
    const { error } = await supabase.from("reviews").upsert(
      {
        user_id: user.id,
        media_item_id: mediaItemId,
        author_name: authorName,
        score: score.data,
        content: content.data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,media_item_id" },
    );

    if (error) return { error: "No pudimos guardar la reseña. Revisá la conexión con la base de datos." };
  } catch {
    return { error: "No pudimos guardar la reseña. Probá de nuevo en unos segundos." };
  }

  revalidatePath(`/contenido/${slug.data}`);
  revalidatePath("/mi-cuenta");
  return { message: "Tu reseña quedó guardada." };
}

export async function toggleLibraryAction(previousState: MediaActionState, formData: FormData): Promise<MediaActionState> {
  const slug = readSlug(formData);
  if (!slug.success) return { error: "La historia solicitada no es válida.", isSaved: previousState.isSaved };

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch (error) {
    return { error: error instanceof Error ? error.message : "No se pudo conectar con Supabase.", isSaved: previousState.isSaved };
  }

  const user = await getSignedInUser(supabase);
  if (!user) return { error: "Iniciá sesión para guardar historias.", isSaved: previousState.isSaved };

  try {
    const item = await getMediaItemBySlug(slug.data);
    if (!item) return { error: "No encontramos esta historia en el catálogo.", isSaved: previousState.isSaved };

    const mediaItemId = await getOrCreateMediaItemId(item);
    const { data: libraryItem, error: lookupError } = await supabase
      .from("user_library")
      .select("id")
      .eq("media_item_id", mediaItemId)
      .maybeSingle();

    if (lookupError) return { error: "No pudimos leer tu biblioteca.", isSaved: previousState.isSaved };

    if (libraryItem) {
      const { error } = await supabase.from("user_library").delete().eq("id", libraryItem.id);
      if (error) return { error: "No pudimos quitar esta historia de tu biblioteca.", isSaved: true };
      revalidatePath(`/contenido/${slug.data}`);
      revalidatePath("/mi-cuenta");
      return { message: "Quitamos la historia de tu biblioteca.", isSaved: false };
    }

    const { error } = await supabase.from("user_library").insert({
      user_id: user.id,
      media_item_id: mediaItemId,
      status: "planned",
    });
    if (error) return { error: "No pudimos guardar esta historia en tu biblioteca.", isSaved: false };

    revalidatePath(`/contenido/${slug.data}`);
    revalidatePath("/mi-cuenta");
    return { message: "Guardamos la historia en tu biblioteca.", isSaved: true };
  } catch {
    return { error: "No pudimos actualizar tu biblioteca. Probá de nuevo en unos segundos.", isSaved: previousState.isSaved };
  }
}
