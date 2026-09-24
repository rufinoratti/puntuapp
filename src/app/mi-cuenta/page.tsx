import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { signOutAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type LibraryEntry = {
  id: string;
  status: "planned" | "in_progress" | "completed";
  created_at: string;
  media_items: { title: string; slug: string; media_type: "movie" | "game" | "book" } | null;
};

type UserReview = {
  id: string;
  score: number;
  content: string;
  updated_at: string;
  media_items: { title: string; slug: string; media_type: "movie" | "game" | "book" } | null;
};

type UserProfile = {
  first_name: string | null;
  last_name: string | null;
  username: string | null;
};

const mediaTypeLabels = { movie: "Película", game: "Videojuego", book: "Libro" };
const libraryStatusLabels = { planned: "Pendiente", in_progress: "En curso", completed: "Completada" };

export default async function AccountPage() {
  await cookies();

  if (!isSupabaseConfigured()) {
    return (
      <main className="mx-auto flex min-h-[65vh] w-full max-w-[1440px] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <section className="max-w-xl rounded-[2rem] border border-canvas-line bg-canvas-subtle p-8 text-center sm:p-12">
          <h1 className="font-display text-5xl leading-[0.9] tracking-[-0.06em] text-canvas-foreground">Conectá Supabase para abrir tu cuenta.</h1>
          <p className="mt-5 text-sm leading-6 text-canvas-muted">Agregá la URL del proyecto y la publishable key en `.env.local`.</p>
          <Link href="/iniciar-sesion" className="mt-7 inline-flex h-11 items-center rounded-full bg-brand px-5 text-sm font-semibold text-brand-foreground">Ir a iniciar sesión</Link>
        </section>
      </main>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/iniciar-sesion?next=%2Fmi-cuenta");

  const [
    { data: profileData },
    { data: libraryData, error: libraryError },
    { data: reviewData, error: reviewsError },
  ] = await Promise.all([
    supabase.from("profiles").select("first_name, last_name, username").eq("id", user.id).maybeSingle(),
    supabase
      .from("user_library")
      .select("id, status, created_at, media_items!inner(title, slug, media_type)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("reviews")
      .select("id, score, content, updated_at, media_items!inner(title, slug, media_type)")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(50),
  ]);
  const profile = profileData as UserProfile | null;
  const library = (libraryData ?? []) as unknown as LibraryEntry[];
  const reviews = (reviewData ?? []) as unknown as UserReview[];
  const firstName = profile?.first_name || (typeof user.user_metadata?.first_name === "string" ? user.user_metadata.first_name : "");
  const displayName = typeof user.user_metadata?.display_name === "string" ? user.user_metadata.display_name : "";

  return (
    <main className="mx-auto flex min-h-[65vh] w-full max-w-[1440px] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl">
        <section className="flex flex-wrap items-end justify-between gap-6 rounded-[2rem] border border-canvas-line bg-canvas-subtle p-8 sm:p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Tu cuenta</p>
            <h1 className="mt-4 font-display text-5xl leading-[0.9] tracking-[-0.06em] text-canvas-foreground">Hola{firstName ? `, ${firstName}` : displayName ? `, ${displayName}` : ""}.</h1>
            <p className="mt-5 text-sm leading-6 text-canvas-muted">Sesión iniciada con {user.email}.</p>
            {profile?.username && <p className="mt-2 text-sm font-semibold text-brand">@{profile.username}</p>}
          </div>
          <form action={signOutAction}>
            <Button type="submit" variant="outline" className="rounded-full border-brand/30 text-brand hover:bg-brand/5">Cerrar sesión</Button>
          </form>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section className="rounded-[2rem] border border-canvas-line bg-canvas-subtle p-6 sm:p-8">
            <div className="flex items-baseline justify-between gap-4 border-b border-canvas-line pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Tus historias</p>
                <h2 className="mt-3 font-display text-4xl leading-none tracking-[-0.05em] text-canvas-foreground">Mi biblioteca</h2>
              </div>
              <span className="text-sm text-canvas-muted">{library.length}</span>
            </div>
            {libraryError ? (
              <p className="pt-6 text-sm leading-6 text-coral-foreground" role="alert">No pudimos cargar tu biblioteca. Revisá la conexión con la base de datos.</p>
            ) : library.length ? (
              <ul className="divide-y divide-canvas-line">
                {library.map((entry) => entry.media_items && (
                  <li key={entry.id} className="py-4 first:pt-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-canvas-muted">{mediaTypeLabels[entry.media_items.media_type]}</p>
                        <Link href={`/contenido/${entry.media_items.slug}`} className="mt-1 inline-block font-display text-2xl leading-tight tracking-[-0.03em] text-canvas-foreground underline decoration-brand/20 underline-offset-4 hover:text-brand">
                          {entry.media_items.title}
                        </Link>
                      </div>
                      <span className="shrink-0 rounded-full bg-brand/8 px-3 py-1.5 text-xs font-semibold text-brand">{libraryStatusLabels[entry.status]}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="pt-6 text-sm leading-6 text-canvas-muted">Todavía no guardaste historias. Explorá el catálogo y sumá alguna a tu biblioteca.</p>
            )}
          </section>

          <section className="rounded-[2rem] border border-canvas-line bg-canvas-subtle p-6 sm:p-8">
            <div className="flex items-baseline justify-between gap-4 border-b border-canvas-line pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Lo que compartiste</p>
                <h2 className="mt-3 font-display text-4xl leading-none tracking-[-0.05em] text-canvas-foreground">Mis reseñas</h2>
              </div>
              <span className="text-sm text-canvas-muted">{reviews.length}</span>
            </div>
            {reviewsError ? (
              <p className="pt-6 text-sm leading-6 text-coral-foreground" role="alert">No pudimos cargar tus reseñas. Revisá la conexión con la base de datos.</p>
            ) : reviews.length ? (
              <ul className="divide-y divide-canvas-line">
                {reviews.map((review) => review.media_items && (
                  <li key={review.id} className="py-4 first:pt-5">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-canvas-muted">{mediaTypeLabels[review.media_items.media_type]} · {Number(review.score).toFixed(1)} / 5</p>
                      <Link href={`/contenido/${review.media_items.slug}#puntuar`} className="text-xs font-semibold text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand">Ver historia</Link>
                    </div>
                    <Link href={`/contenido/${review.media_items.slug}`} className="mt-1 inline-block font-display text-2xl leading-tight tracking-[-0.03em] text-canvas-foreground hover:text-brand">
                      {review.media_items.title}
                    </Link>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-canvas-muted">{review.content}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="pt-6 text-sm leading-6 text-canvas-muted">Todavía no publicaste reseñas. Dejá tu opinión desde la página de una película, videojuego o libro.</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
