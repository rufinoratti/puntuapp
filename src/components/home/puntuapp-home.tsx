"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Clapperboard,
  Film,
  Gamepad2,
  Search,
  Star,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PuntuappPreloader } from "@/components/ui/skiper-ui/puntuapp-preloader";
import { WatchlistNavLink } from "@/components/watchlist/watchlist-nav-link";
import { mediaItems, type MediaItem, type MediaType } from "@/lib/media";
import { cn } from "@/lib/utils";

const Skiper49 = dynamic(
  () => import("@/components/ui/skiper-ui/skiper49").then((module) => module.Skiper49),
  {
    ssr: false,
    loading: () => <div className="h-[350px] w-full max-w-4xl" aria-hidden="true" />,
  },
);

type Filter = "all" | MediaType;
type CatalogSearchResponse = {
  items?: MediaItem[];
  errors?: Partial<Record<MediaType, string>>;
  error?: string;
};

const filterOptions: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "Todo" },
  { value: "movie", label: "Películas" },
  { value: "game", label: "Videojuegos" },
  { value: "book", label: "Libros" },
];

const categoryFilterOptions: Record<Exclude<Filter, "all">, Array<{ value: string; label: string }>> = {
  movie: [
    { value: "all", label: "Todas" },
    { value: "ciencia-ficcion", label: "Ciencia ficción" },
    { value: "drama", label: "Drama" },
    { value: "terror", label: "Terror" },
    { value: "top", label: "Mejor puntuadas" },
  ],
  game: [
    { value: "all", label: "Todos" },
    { value: "pc", label: "PC" },
    { value: "playstation", label: "PlayStation" },
    { value: "nintendo-switch", label: "Nintendo Switch" },
    { value: "xbox", label: "Xbox" },
    { value: "top", label: "Mejor puntuados" },
  ],
  book: [
    { value: "all", label: "Todos" },
    { value: "ficcion", label: "Ficción" },
    { value: "no-ficcion", label: "No ficción" },
    { value: "clasicos", label: "Clásicos" },
    { value: "top", label: "Mejor puntuados" },
  ],
};

const categoryLabels: Record<Exclude<Filter, "all">, string> = {
  movie: "películas",
  game: "videojuegos",
  book: "libros",
};

const sectionLinkMotion =
  "motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-px";

const journalNotes = [
  {
    item: mediaItems[2],
    eyebrow: "Para volver a mirar",
    title: "Cuando una película te deja pensando todo el día.",
  },
  {
    item: mediaItems[1],
    eyebrow: "En la consola",
    title: "Juegos para perder la noción del tiempo.",
  },
  {
    item: mediaItems[4],
    eyebrow: "Miradas de la comunidad",
    title: "Pequeñas historias, grandes sensaciones.",
  },
];

function TypeIcon({ type }: { type: MediaType }) {
  const Icon = type === "movie" ? Film : type === "game" ? Gamepad2 : BookOpen;

  return <Icon aria-hidden="true" className="size-3.5" />;
}

function mediaTypeLabel(type: MediaType) {
  return type === "movie" ? "Película" : type === "game" ? "Videojuego" : "Libro";
}

function matchesCategoryFilter(item: MediaItem, selectedFilter: string) {
  if (selectedFilter === "all") return true;
  if (selectedFilter === "top") {
    const externalRating = item.externalRating
      ? (item.externalRating.value / item.externalRating.scale) * 5
      : 0;
    return Math.max(item.rating, externalRating) >= 4.7 || item.tags?.includes("top") === true;
  }

  return item.tags?.includes(selectedFilter) === true || item.platforms?.includes(selectedFilter) === true;
}

function MediaCard({ item, featured = false }: { item: MediaItem; featured?: boolean }) {
  const [imageSrc, setImageSrc] = useState(item.image);

  return (
    <Link href={`/contenido/${item.slug}`} className={cn("group block h-full", featured && "md:col-span-2")}>
      <Card className="h-full overflow-hidden rounded-[2rem] border-canvas-line bg-canvas-subtle p-2 text-canvas-foreground shadow-[0_12px_40px_oklch(0.25_0.04_155_/_0.05)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_oklch(0.25_0.04_155_/_0.12)]">
        <div
          className={cn(
            "relative overflow-hidden rounded-[1.55rem] bg-sky",
            featured ? "aspect-[16/10]" : "aspect-[4/5]",
          )}
        >
          <Image
            src={imageSrc}
            alt={item.imageAlt}
            fill
            sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 768px) 25vw, 100vw"}
            className="object-cover transition duration-700 group-hover:scale-105"
            onError={() => setImageSrc(item.type === "book" ? "/images/book-placeholder.svg" : "/puntuapp-hero.png")}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 px-2 pt-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
            <TypeIcon type={item.type} />
            {mediaTypeLabel(item.type)}
          </span>
          <span className="rounded-full bg-coral/15 px-3 py-1.5 text-xs font-semibold text-coral-foreground">{item.year}</span>
          {item.rating > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-canvas-line/70 px-3 py-1.5 text-xs font-semibold text-canvas-foreground">
              <Star aria-hidden="true" className="size-3.5 fill-coral text-coral" />
              {item.rating.toFixed(1)}
            </span>
          )}
          {item.externalRating && item.externalRating.value > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-canvas-line/70 px-3 py-1.5 text-xs font-semibold text-canvas-foreground">
              <Star aria-hidden="true" className="size-3.5 fill-coral text-coral" />
              {item.externalRating.value.toFixed(1)}/{item.externalRating.scale} {item.externalRating.label}
            </span>
          )}
        </div>

        <CardHeader className="gap-2 px-3 pb-3 pt-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand/70">
                {item.genre} <span aria-hidden="true">·</span> {item.year}
              </p>
              <h3 className="mt-1 font-display text-2xl leading-none tracking-[-0.04em] text-canvas-foreground">
                {item.title}
              </h3>
              {item.creator && (
                <p className="mt-2 text-sm text-canvas-muted">
                  {item.creatorLabel ?? "Créditos"}: <span className="text-canvas-foreground/80">{item.creator}</span>
                </p>
              )}
            </div>
            <span
              aria-hidden="true"
              className="mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-canvas-line text-brand transition group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground"
            >
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}

function JournalCard({
  note,
}: {
  note: (typeof journalNotes)[number];
}) {
  return (
    <article data-scroll-reveal className="group relative overflow-hidden rounded-[2rem] bg-brand p-2">
      <div className="relative aspect-[4/4.5] overflow-hidden rounded-[1.55rem]">
        <Image
          src={note.item.image}
          alt={note.item.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand/35 via-transparent to-transparent" />
        <div className="absolute inset-x-3 bottom-3 rounded-[1.4rem] bg-canvas px-4 py-4 shadow-lg">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand/75">{note.eyebrow}</p>
          <h3 className="mt-2 max-w-[18ch] font-display text-2xl leading-[0.98] tracking-[-0.035em] text-canvas-foreground">
            {note.title}
          </h3>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand">
            Ver selección <ArrowRight aria-hidden="true" className="size-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
}

export function PuntuappHome() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [catalogItems, setCatalogItems] = useState<MediaItem[]>([]);
  const [catalogSearchStatus, setCatalogSearchStatus] = useState<"idle" | "loading" | "error">("idle");
  const [catalogSearchError, setCatalogSearchError] = useState("");
  const [catalogSearchWarnings, setCatalogSearchWarnings] = useState<string[]>([]);

  useEffect(() => {
    const normalizedQuery = query.trim();
    const shouldSearch = normalizedQuery.length >= 3;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      if (!shouldSearch) {
        setCatalogItems([]);
        setCatalogSearchStatus("idle");
        setCatalogSearchError("");
        setCatalogSearchWarnings([]);
        return;
      }

      setCatalogItems([]);
      setCatalogSearchStatus("loading");
      setCatalogSearchError("");
      setCatalogSearchWarnings([]);

      try {
        const searchParams = new URLSearchParams({ query: normalizedQuery, type: filter, limit: "12" });
        const response = await fetch(`/api/catalog/search?${searchParams}`, { signal: controller.signal });
        const data = (await response.json()) as CatalogSearchResponse;

        if (!response.ok) throw new Error(data.error ?? "No se pudo consultar el catálogo.");

        setCatalogItems(data.items ?? []);
        setCatalogSearchWarnings(Object.values(data.errors ?? {}));
        setCatalogSearchStatus("idle");
      } catch (error) {
        if (controller.signal.aborted) return;

        setCatalogItems([]);
        setCatalogSearchError(error instanceof Error ? error.message : "No se pudo consultar el catálogo.");
        setCatalogSearchStatus("error");
      }
    }, shouldSearch ? 350 : 0);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [filter, query]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    if (query.trim().length >= 3) {
      return catalogItems.filter((item) => filter === "all" || matchesCategoryFilter(item, categoryFilter));
    }

    return mediaItems.filter((item) => {
      const matchesType = filter === "all" || item.type === filter;
      const matchesCategory = filter === "all" || matchesCategoryFilter(item, categoryFilter);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [item.title, item.creator ?? "", item.genre].some((value) =>
          value.toLocaleLowerCase().includes(normalizedQuery),
        );

      return matchesType && matchesCategory && matchesQuery;
    });
  }, [catalogItems, categoryFilter, filter, query]);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-puntuapp-home]");

    if (
      !root ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const targets = root.querySelectorAll<HTMLElement>("[data-scroll-reveal]");
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        root.classList.add("scroll-reveal-ready");

        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-in-view");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  function handleCategoryChange(nextFilter: Filter) {
    setFilter(nextFilter);
    setCategoryFilter("all");
  }

  return (
    <main
      data-puntuapp-home
      className="min-h-[100dvh] overflow-hidden bg-canvas text-canvas-foreground selection:bg-coral selection:text-coral-foreground"
    >
      <PuntuappPreloader />
      <a
        href="#catalogo"
        className="sr-only z-50 rounded-full bg-brand px-4 py-3 font-medium text-brand-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Saltar al catálogo
      </a>

      <header className="relative z-20">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            aria-label="PuntuApp, inicio"
            className="text-3xl font-black leading-none tracking-[-0.09em] text-brand sm:text-4xl"
          >
            PUNTU<span className="text-coral">APP</span>
          </Link>

          <nav aria-label="Navegación principal" className="hidden items-center gap-8 text-sm font-medium text-canvas-foreground/75 lg:flex">
            <Link className="transition hover:text-brand" href="#catalogo">
              Descubrir
            </Link>
            <Link className="transition hover:text-brand" href="#comunidad">
              Comunidad
            </Link>
            <Link className="transition hover:text-brand" href="#como-funciona">
              Cómo funciona
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <WatchlistNavLink />
            <Link
              href="/iniciar-sesion"
              className={buttonVariants({
                variant: "outline",
                className: "hidden rounded-full border-brand/30 bg-transparent text-brand hover:border-brand hover:bg-brand/5 sm:inline-flex",
              })}
            >
              Ingresar
            </Link>
            <Link
              href="/registro"
              className={buttonVariants({ className: "h-9 rounded-full bg-brand px-4 text-brand-foreground hover:bg-brand/85" })}
            >
              Crear cuenta
            </Link>
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1440px] px-4 pb-14 pt-5 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24 lg:pt-8">
        <div className="grid items-start gap-12 lg:items-center lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-8 xl:gap-12">
          <div className="relative z-10 w-full max-w-[680px] lg:pb-8">
            <p className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand">
              <span className="inline-block size-2 rounded-full bg-coral" />
              Películas + videojuegos + libros
            </p>
            <h1 className="max-w-[12ch] font-display text-6xl leading-[0.86] tracking-[-0.07em] text-brand sm:text-7xl lg:text-[5.9rem] xl:text-[6.4rem]">
              Guardá lo que <span className="text-coral">te mueve.</span>
            </h1>
            <p className="mt-7 max-w-md text-base leading-7 text-canvas-muted sm:text-lg">
              Tu lugar para descubrir, puntuar y dejar por escrito esas historias que se quedan con vos.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="#catalogo"
                className={buttonVariants({
                  className: cn("h-11 rounded-full bg-brand px-5 text-brand-foreground hover:bg-brand/85", sectionLinkMotion),
                })}
              >
                Explorar catálogo
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Link>
              <Link
                href="#como-funciona"
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-full border border-brand/20 px-5 text-sm font-semibold text-brand transition hover:border-brand hover:bg-brand/5",
                  sectionLinkMotion,
                )}
              >
                Cómo funciona <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium uppercase tracking-[0.14em] text-canvas-muted">
              <span>Tu criterio</span>
              <span className="text-coral">·</span>
              <span>Tu biblioteca</span>
              <span className="text-coral">·</span>
              <span>Tu voz</span>
            </div>
          </div>

          <div className="relative min-h-[470px] min-w-0 w-full sm:min-h-[530px] lg:min-h-[610px]" aria-label="Películas y videojuegos en tendencia">
            <div className="mb-3 flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
              <span>Ahora en PuntuApp</span>
              <span className="text-canvas-muted">Deslizá por las portadas</span>
            </div>
            <div className="hero-carousel-frame -mx-4 mt-2 flex min-h-[420px] min-w-0 w-[calc(100%+2rem)] items-center justify-center overflow-visible sm:mx-0 sm:min-h-[480px] sm:w-auto lg:min-h-[550px]">
              <Skiper49 />
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div data-scroll-reveal className="grid overflow-hidden rounded-[2.6rem] border border-canvas-line bg-canvas-subtle md:grid-cols-[1.1fr_0.9fr]">
          <div className="p-7 sm:p-10 lg:p-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Tu criterio, sin algoritmo</p>
            <h2 className="mt-5 max-w-xl font-display text-4xl leading-[0.94] tracking-[-0.055em] text-canvas-foreground sm:text-6xl">
              Armá una biblioteca que se parezca a vos.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-canvas-muted">
              Registrá lo que viste, puntuá con tu propia escala y dejá una reseña para que alguien más encuentre su próxima historia.
            </p>
            <Link
              href="#catalogo"
              className={buttonVariants({
                className: cn(
                  "mt-8 h-11 rounded-full bg-brand px-5 text-brand-foreground hover:bg-brand/85",
                  sectionLinkMotion,
                ),
              })}
            >
              Empezar a explorar <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
            </Link>
          </div>
          <div className="relative min-h-[320px] overflow-hidden bg-sky p-7 sm:p-10">
            <span className="absolute right-8 top-8 font-display text-7xl leading-none text-sky-foreground/20 sm:text-9xl">01</span>
            <div className="absolute bottom-8 left-8 right-8 rotate-[3deg] rounded-[1.8rem] bg-canvas p-5 shadow-[0_20px_50px_oklch(0.25_0.04_155_/_0.14)] sm:bottom-12 sm:left-12 sm:right-12 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-brand text-brand-foreground">
                  <Clapperboard aria-hidden="true" className="size-6" />
                </div>
                <span className="rounded-full bg-coral px-3 py-1.5 text-xs font-bold text-coral-foreground">4.7</span>
              </div>
              <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand/70">Tu última reseña</p>
              <p className="mt-2 font-display text-3xl leading-none tracking-[-0.04em] text-canvas-foreground">No fue perfecta. Fue tuya.</p>
              <div className="mt-5 flex gap-1 text-coral">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} aria-hidden="true" className="size-4 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="catalogo" className="mx-auto w-full max-w-[1440px] scroll-mt-8 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div data-scroll-reveal className="flex flex-col gap-8 border-b border-canvas-line pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Descubrir</p>
            <h2 className="mt-4 font-display text-5xl leading-[0.9] tracking-[-0.06em] text-canvas-foreground sm:text-7xl">
              Historias que merecen otra charla.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-canvas-muted">
              Una selección inicial para empezar a construir el mapa de lo que te gusta.
            </p>
          </div>

          <div className="relative w-full max-w-md">
            <label htmlFor="catalog-search" className="sr-only">
              Buscar películas, videojuegos y libros
            </label>
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-brand" />
            <Input
              id="catalog-search"
              value={query}
              maxLength={100}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar título, género, autor o creador"
              className="h-12 rounded-full border-canvas-line bg-canvas-subtle pl-11 text-canvas-foreground placeholder:text-canvas-muted focus-visible:border-brand focus-visible:ring-brand/20"
            />
          </div>
        </div>

        {query.trim().length >= 3 && (
          <p className="mt-3 text-xs text-canvas-muted">
            Catálogos: {" "}
            <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" className="font-semibold text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand">TMDB</a>
            {" · "}
            <a href="https://rawg.io/" target="_blank" rel="noreferrer" className="font-semibold text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand">RAWG</a>
            {" · "}
            <a href="https://openlibrary.org/" target="_blank" rel="noreferrer" className="font-semibold text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand">Open Library</a>
          </p>
        )}

        <div data-scroll-reveal className="mt-6 flex flex-wrap items-center gap-2" aria-label="Filtrar catálogo">
          {filterOptions.map((option) => {
            const isActive = filter === option.value;
            const Icon =
              option.value === "movie"
                ? Film
                : option.value === "game"
                  ? Gamepad2
                  : option.value === "book"
                    ? BookOpen
                    : null;

            return (
              <Button
                key={option.value}
                type="button"
                size="sm"
                variant="outline"
                aria-pressed={isActive}
                onClick={() => handleCategoryChange(option.value)}
                className={cn(
                  "rounded-full border-canvas-line px-4",
                  isActive
                    ? "bg-brand text-brand-foreground hover:bg-brand/85"
                    : "bg-canvas-subtle text-canvas-muted hover:border-brand/50 hover:bg-brand/5 hover:text-brand",
                )}
              >
                {Icon ? <Icon data-icon="inline-start" aria-hidden="true" /> : null}
                {option.label}
              </Button>
            );
          })}
          <span className="ml-2 text-sm text-canvas-muted" aria-live="polite">
            {catalogSearchStatus === "loading" ? "Buscando…" : `${filteredItems.length} resultados`}
          </span>
        </div>

        {catalogSearchError && (
          <p className="mt-4 text-sm text-coral-foreground" role="alert">
            {catalogSearchError}
          </p>
        )}
        {catalogSearchWarnings.length > 0 && (
          <p className="mt-4 text-sm text-canvas-muted" role="status">
            Algunos catálogos no respondieron: {catalogSearchWarnings.join(" ")}
          </p>
        )}

        {filter !== "all" && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-canvas-line pt-4" aria-label={`Filtros de ${categoryLabels[filter]}`}>
            <span className="mr-1 text-xs font-semibold uppercase tracking-[0.14em] text-canvas-muted">
              Filtrar {categoryLabels[filter]}
            </span>
            {categoryFilterOptions[filter].map((option) => {
              const isActive = categoryFilter === option.value;

              return (
                <Button
                  key={option.value}
                  type="button"
                  size="sm"
                  variant="ghost"
                  aria-pressed={isActive}
                  onClick={() => setCategoryFilter(option.value)}
                  className={cn(
                    "h-8 rounded-full px-3 text-xs",
                    isActive
                      ? "bg-coral text-coral-foreground hover:bg-coral/85"
                      : "text-canvas-muted hover:bg-coral/10 hover:text-coral-foreground",
                  )}
                >
                  {option.label}
                </Button>
              );
            })}
          </div>
        )}

        <div data-scroll-reveal className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4" aria-live="polite">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <MediaCard key={item.id} item={item} featured={index === 0 && filter === "all" && query.length === 0} />
            ))
          ) : (
            <div className="col-span-full flex min-h-72 flex-col items-center justify-center rounded-[2rem] border border-dashed border-canvas-line bg-canvas-subtle px-6 text-center">
              <Search aria-hidden="true" className="mb-4 size-6 text-coral" />
              <h3 className="font-display text-3xl leading-none text-canvas-foreground">
                {catalogSearchStatus === "loading"
                  ? "Buscando en los catálogos…"
                  : query.trim().length < 3
                    ? "Buscá una historia para empezar"
                    : "No encontramos ese título"}
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-canvas-muted">
                {catalogSearchError
                  ? "Revisá la configuración del proveedor o probá de nuevo en unos segundos."
                  : catalogSearchStatus === "loading"
                    ? "Estamos consultando películas, videojuegos y libros."
                  : query.trim().length < 3
                    ? "Escribí al menos tres letras para consultar los catálogos externos."
                    : "Probá con otro nombre, género, autor o creador."}
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="comunidad" className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div data-scroll-reveal className="rounded-[2.6rem] bg-coral p-7 text-coral-foreground sm:p-10 lg:p-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral-foreground/70">Notas de comunidad</p>
              <h2 className="mt-5 font-display text-5xl leading-[0.9] tracking-[-0.06em] sm:text-7xl">
                Lo que te marcó también puede encontrar a alguien más.
              </h2>
            </div>
            <Link
              href="#catalogo"
              className={cn(
                "inline-flex h-11 w-fit items-center gap-2 rounded-full bg-coral-foreground px-5 text-sm font-semibold text-coral transition hover:bg-coral-foreground/85",
                sectionLinkMotion,
              )}
            >
              Ver la selección <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div data-scroll-reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Desde la comunidad</p>
            <h2 className="mt-4 font-display text-5xl leading-[0.9] tracking-[-0.06em] text-canvas-foreground sm:text-6xl">Para seguir mirando.</h2>
          </div>
          <span className="text-sm text-canvas-muted">Ideas para tu próxima sesión</span>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {journalNotes.map((note) => (
            <JournalCard key={note.title} note={note} />
          ))}
        </div>
      </section>

    </main>
  );
}
