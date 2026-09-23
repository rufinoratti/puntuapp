"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight, Bookmark, BookOpen, Clapperboard, Gamepad2, Search, Star, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { mediaItems, type MediaType } from "@/lib/media";
import { removeFromWatchlist, useWatchlist, type WatchlistEntry } from "@/lib/watchlist";
import { cn } from "@/lib/utils";

type TypeFilter = "all" | MediaType;

const typeLabels: Record<MediaType, string> = {
  movie: "Película",
  game: "Videojuego",
  book: "Libro",
};

const filterOptions: Array<{ value: TypeFilter; label: string }> = [
  { value: "all", label: "Todo" },
  { value: "movie", label: "Películas" },
  { value: "game", label: "Videojuegos" },
  { value: "book", label: "Libros" },
];

function TypeIcon({ type }: { type: MediaType }) {
  const Icon = type === "movie" ? Clapperboard : type === "game" ? Gamepad2 : BookOpen;

  return <Icon aria-hidden="true" className="size-3.5" />;
}

function formatAddedAt(addedAt: number) {
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short" }).format(new Date(addedAt));
}

function WatchlistCard({
  entry,
  onRemove,
}: {
  entry: WatchlistEntry;
  onRemove: (entry: WatchlistEntry) => void;
}) {
  const { item, addedAt } = entry;
  const [imageSrc, setImageSrc] = useState(item.image);
  const hasDetailPage = mediaItems.some((mediaItem) => mediaItem.slug === item.slug);

  const cover = (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[1.55rem] bg-sky">
      <Image
        src={imageSrc}
        alt={item.imageAlt}
        fill
        sizes="(min-width: 768px) 25vw, 100vw"
        className="object-cover transition duration-700 group-hover:scale-105"
        onError={() => setImageSrc("/images/book-placeholder.svg")}
      />
    </div>
  );

  return (
    <article className="group h-full rounded-[2rem] border border-canvas-line bg-canvas-subtle p-2 transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_oklch(0.25_0.04_155_/_0.12)]">
      {hasDetailPage ? (
        <Link href={`/contenido/${item.slug}`} tabIndex={-1} aria-hidden="true" className="block">
          {cover}
        </Link>
      ) : (
        cover
      )}

      <div className="flex flex-wrap items-center gap-2 px-2 pt-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
          <TypeIcon type={item.type} />
          {typeLabels[item.type]}
        </span>
        <span className="rounded-full bg-coral/15 px-3 py-1.5 text-xs font-semibold text-coral-foreground">{item.year}</span>
        {item.rating > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-canvas-line/70 px-3 py-1.5 text-xs font-semibold text-canvas-foreground">
            <Star aria-hidden="true" className="size-3.5 fill-coral text-coral" />
            {item.rating.toFixed(1)}
          </span>
        )}
      </div>

      <div className="px-3 pb-3 pt-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand/70">
          {item.genre} <span aria-hidden="true">·</span> Agregado el {formatAddedAt(addedAt)}
        </p>
        <h3 className="mt-1 font-display text-2xl leading-none tracking-[-0.04em] text-canvas-foreground">
          {item.title}
        </h3>
        <p className="mt-2 text-sm text-canvas-muted">
          {item.creatorLabel}: <span className="text-canvas-foreground/80">{item.creator}</span>
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-canvas-line pt-3">
          {hasDetailPage ? (
            <Link
              href={`/contenido/${item.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition hover:text-coral"
            >
              Ver ficha <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          ) : (
            <span className="text-xs text-canvas-muted">Ficha disponible al conectar el catálogo</span>
          )}
          <button
            type="button"
            onClick={() => onRemove(entry)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-canvas-line px-3.5 text-xs font-semibold text-canvas-muted transition hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
          >
            <X aria-hidden="true" className="size-3.5" />
            Quitar
          </button>
        </div>
      </div>
    </article>
  );
}

export function WatchlistView() {
  const entries = useWatchlist();
  const [filter, setFilter] = useState<TypeFilter>("all");
  const [lastRemoved, setLastRemoved] = useState("");

  const activeFilter: TypeFilter =
    filter !== "all" && entries.some((entry) => entry.item.type === filter) ? filter : "all";
  const visibleEntries =
    activeFilter === "all" ? entries : entries.filter((entry) => entry.item.type === activeFilter);

  const countsByType = entries.reduce<Record<MediaType, number>>(
    (acc, entry) => {
      acc[entry.item.type] += 1;
      return acc;
    },
    { movie: 0, game: 0, book: 0 },
  );

  function handleRemove(entry: WatchlistEntry) {
    removeFromWatchlist(entry.item.slug);
    setLastRemoved(`«${entry.item.title}» salió de tu lista de espera.`);
  }

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-canvas text-canvas-foreground selection:bg-coral selection:text-coral-foreground">
      <header className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="PuntuApp, inicio"
          className="text-3xl font-black leading-none tracking-[-0.09em] text-brand sm:text-4xl"
        >
          PUNTU<span className="text-coral">APP</span>
        </Link>
        <Link
          href="/#catalogo"
          className="inline-flex items-center gap-2 rounded-full border border-brand/20 px-4 py-2 text-sm font-semibold text-brand transition hover:border-brand hover:bg-brand/5"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          <span className="hidden sm:inline">Volver al catálogo</span>
          <span className="sm:hidden">Catálogo</span>
        </Link>
      </header>

      <div className="mx-auto w-full max-w-[1440px] px-4 pb-20 pt-5 sm:px-6 sm:pt-10 lg:px-8">
        <section className="border-b border-canvas-line pb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand">
                <span className="inline-block size-2 rounded-full bg-coral" />
                Tu lista de espera
              </p>
              <h1 className="mt-5 font-display text-6xl leading-[0.86] tracking-[-0.07em] text-brand sm:text-7xl lg:text-[6rem]">
                Para ver <span className="text-coral">después.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-canvas-muted">
                {entries.length > 0
                  ? "Historias que guardaste para cuando llegue el momento justo."
                  : "Guardá una película, un videojuego o un libro desde su ficha y va a quedar esperando acá."}
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-[1.6rem] bg-canvas-subtle px-5 py-4 ring-1 ring-canvas-line">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-brand text-brand-foreground">
                <Bookmark aria-hidden="true" className="size-5 fill-coral text-coral" />
              </span>
              <div>
                <p className="font-display text-3xl leading-none text-canvas-foreground">{entries.length}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-canvas-muted">
                  {entries.length === 1 ? "título guardado" : "títulos guardados"}
                </p>
              </div>
            </div>
          </div>

          {entries.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-2" aria-label="Filtrar tu watchlist">
              {filterOptions.map((option) => {
                const isActive = activeFilter === option.value;
                const hiddenCount =
                  option.value === "all" ? entries.length : countsByType[option.value as MediaType];
                if (option.value !== "all" && hiddenCount === 0) return null;

                return (
                  <Button
                    key={option.value}
                    type="button"
                    size="sm"
                    variant="outline"
                    aria-pressed={isActive}
                    onClick={() => setFilter(option.value)}
                    className={cn(
                      "rounded-full border-canvas-line px-4",
                      isActive
                        ? "bg-brand text-brand-foreground hover:bg-brand/85"
                        : "bg-canvas-subtle text-canvas-muted hover:border-brand/50 hover:bg-brand/5 hover:text-brand",
                    )}
                  >
                    {option.label} ({hiddenCount})
                  </Button>
                );
              })}
            </div>
          )}
        </section>

        <p role="status" aria-live="polite" className="mt-4 min-h-5 text-sm font-semibold text-brand">
          {lastRemoved}
        </p>

        <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {visibleEntries.length > 0 ? (
            visibleEntries.map((entry) => (
              <WatchlistCard key={entry.item.id} entry={entry} onRemove={handleRemove} />
            ))
          ) : (
            <div className="col-span-full flex min-h-80 flex-col items-center justify-center rounded-[2rem] border border-dashed border-canvas-line bg-canvas-subtle px-6 text-center">
              <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <Bookmark aria-hidden="true" className="size-6" />
              </span>
              <h2 className="font-display text-4xl leading-none text-canvas-foreground">
                {entries.length > 0 ? "Nada por acá todavía" : "Tu lista de espera está vacía"}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-canvas-muted">
                {entries.length > 0
                  ? "No tenés títulos de este tipo guardados. Probá con otro filtro."
                  : "Entrá a cualquier ficha y elegí “Agregar a mi watchlist”. Va a quedarte guardado para después."}
              </p>
              <Link
                href="/#catalogo"
                className="mt-7 inline-flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-brand-foreground transition hover:bg-brand/85"
              >
                <Search aria-hidden="true" className="size-4" />
                Explorar el catálogo
              </Link>
            </div>
          )}
        </section>

        <p className="mt-8 max-w-xl text-xs leading-5 text-canvas-muted">
          Por ahora tu watchlist se guarda en este dispositivo. Cuando sumemos cuentas, la vamos a
          mover a tu perfil sin que pierdas nada.
        </p>
      </div>
    </main>
  );
}
