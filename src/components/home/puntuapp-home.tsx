"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
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
import { CrowdCanvas } from "@/components/ui/skiper-ui/skiper39";
import { Skiper52, type Skiper52Item } from "@/components/ui/skiper-ui/skiper52";
import { mediaItems, type MediaItem, type MediaType } from "@/lib/media";
import { cn } from "@/lib/utils";

type Filter = "all" | MediaType;

const filterOptions: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "Todo" },
  { value: "movie", label: "Películas" },
  { value: "game", label: "Videojuegos" },
];

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

const trendingItems: Skiper52Item[] = mediaItems.slice(0, 5).map((item, index) => ({
  src: item.image,
  alt: item.imageAlt,
  code: `0${index + 1}`,
  title: item.title,
  meta: `${item.type === "movie" ? "Película" : "Videojuego"} · ${item.genre}`,
  rating: item.rating,
}));

function TypeIcon({ type }: { type: MediaType }) {
  const Icon = type === "movie" ? Film : Gamepad2;

  return <Icon aria-hidden="true" className="size-3.5" />;
}

function MediaCard({ item, featured = false }: { item: MediaItem; featured?: boolean }) {
  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-[2rem] border-canvas-line bg-canvas-subtle p-2 text-canvas-foreground shadow-[0_12px_40px_oklch(0.25_0.04_155_/_0.05)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_oklch(0.25_0.04_155_/_0.12)]",
        featured && "md:col-span-2",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-[1.55rem] bg-sky",
          featured ? "aspect-[16/10]" : "aspect-[4/5]",
        )}
      >
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 768px) 25vw, 100vw"}
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-canvas/95 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand shadow-sm backdrop-blur-sm">
            <TypeIcon type={item.type} />
            {item.type === "movie" ? "Película" : "Videojuego"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-canvas/95 px-3 py-1.5 text-sm font-semibold text-canvas-foreground shadow-sm">
            <Star aria-hidden="true" className="size-3.5 fill-coral text-coral" />
            {item.rating.toFixed(1)}
          </span>
        </div>
      </div>

      <CardHeader className="gap-2 px-3 pb-3 pt-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand/70">
              {item.genre} <span aria-hidden="true">·</span> {item.year}
            </p>
            <h3 className="mt-1 font-display text-2xl leading-none tracking-[-0.04em] text-canvas-foreground">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-canvas-muted">
              {item.creatorLabel}: <span className="text-canvas-foreground/80">{item.creator}</span>
            </p>
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
  );
}

function JournalCard({
  note,
}: {
  note: (typeof journalNotes)[number];
}) {
  return (
    <article className="group relative overflow-hidden rounded-[2rem] bg-brand p-2">
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

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return mediaItems.filter((item) => {
      const matchesType = filter === "all" || item.type === filter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [item.title, item.creator, item.genre].some((value) =>
          value.toLocaleLowerCase().includes(normalizedQuery),
        );

      return matchesType && matchesQuery;
    });
  }, [filter, query]);

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-canvas text-canvas-foreground selection:bg-coral selection:text-coral-foreground">
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
            <Button
              variant="outline"
              className="hidden rounded-full border-brand/30 bg-transparent text-brand hover:border-brand hover:bg-brand/5 sm:inline-flex"
            >
              Ingresar
            </Button>
            <Button className="rounded-full bg-brand px-4 text-brand-foreground hover:bg-brand/85">
              Crear cuenta
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1440px] px-4 pb-14 pt-5 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24 lg:pt-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:gap-10 xl:gap-16">
          <div className="relative z-10 w-full max-w-[680px] lg:pb-8">
            <p className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand">
              <span className="inline-block size-2 rounded-full bg-coral" />
              Películas + videojuegos
            </p>
            <h1 className="max-w-[12ch] font-display text-6xl leading-[0.86] tracking-[-0.07em] text-brand sm:text-7xl lg:text-[6.7rem] xl:text-[7.2rem]">
              Guardá lo que <span className="text-coral">te mueve.</span>
            </h1>
            <p className="mt-7 max-w-md text-base leading-7 text-canvas-muted sm:text-lg">
              Tu lugar para descubrir, puntuar y dejar por escrito esas historias que se quedan con vos.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="#catalogo"
                className={buttonVariants({
                  className: "h-11 rounded-full bg-brand px-5 text-brand-foreground hover:bg-brand/85",
                })}
              >
                Explorar catálogo
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Link>
              <Link
                href="#como-funciona"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-brand/20 px-5 text-sm font-semibold text-brand transition hover:border-brand hover:bg-brand/5"
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

          <div className="relative min-h-[380px] lg:min-h-[500px]" aria-label="Películas y videojuegos en tendencia">
            <div className="mb-3 flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
              <span>Ahora en PuntuApp</span>
              <span className="text-canvas-muted">Pasá por las portadas</span>
            </div>
            <Skiper52 items={trendingItems} />
          </div>
        </div>
      </section>

      <section id="como-funciona" className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid overflow-hidden rounded-[2.6rem] border border-canvas-line bg-canvas-subtle md:grid-cols-[1.1fr_0.9fr]">
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
                className: "mt-8 h-11 rounded-full bg-brand px-5 text-brand-foreground hover:bg-brand/85",
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
        <div className="flex flex-col gap-8 border-b border-canvas-line pb-8 lg:flex-row lg:items-end lg:justify-between">
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
              Buscar películas y videojuegos
            </label>
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-brand" />
            <Input
              id="catalog-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar título, género o creador"
              className="h-12 rounded-full border-canvas-line bg-canvas-subtle pl-11 text-canvas-foreground placeholder:text-canvas-muted focus-visible:border-brand focus-visible:ring-brand/20"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2" aria-label="Filtrar catálogo">
          {filterOptions.map((option) => {
            const isActive = filter === option.value;
            const Icon = option.value === "movie" ? Film : option.value === "game" ? Gamepad2 : null;

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
                {Icon ? <Icon data-icon="inline-start" aria-hidden="true" /> : null}
                {option.label}
              </Button>
            );
          })}
          <span className="ml-2 text-sm text-canvas-muted" aria-live="polite">
            {filteredItems.length} resultados
          </span>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4" aria-live="polite">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <MediaCard key={item.id} item={item} featured={index === 0 && filter === "all" && query.length === 0} />
            ))
          ) : (
            <div className="col-span-full flex min-h-72 flex-col items-center justify-center rounded-[2rem] border border-dashed border-canvas-line bg-canvas-subtle px-6 text-center">
              <Search aria-hidden="true" className="mb-4 size-6 text-coral" />
              <h3 className="font-display text-3xl leading-none text-canvas-foreground">No encontramos ese título</h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-canvas-muted">Probá con otro nombre, género o creador.</p>
            </div>
          )}
        </div>
      </section>

      <section id="comunidad" className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="rounded-[2.6rem] bg-coral p-7 text-coral-foreground sm:p-10 lg:p-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral-foreground/70">Notas de comunidad</p>
              <h2 className="mt-5 font-display text-5xl leading-[0.9] tracking-[-0.06em] sm:text-7xl">
                Lo que te marcó también puede encontrar a alguien más.
              </h2>
            </div>
            <Link
              href="#catalogo"
              className="inline-flex h-11 w-fit items-center gap-2 rounded-full bg-coral-foreground px-5 text-sm font-semibold text-coral transition hover:bg-coral-foreground/85"
            >
              Ver la selección <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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

      <footer className="relative isolate min-h-[620px] overflow-hidden border-t border-canvas-line px-4 pb-0 pt-10 sm:px-6 sm:pt-14 lg:min-h-[660px] lg:px-8 lg:pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[500px] overflow-hidden opacity-20 sm:h-[400px] lg:h-[440px]"
        >
          <CrowdCanvas
            src="/images/peeps/all-peeps.png"
            rows={15}
            cols={7}
            color="oklch(0.4 0.13 155)"
            className="lg:translate-y-12"
          />
        </div>
        <div className="relative z-10 mx-auto grid w-full max-w-[1440px] gap-12 pb-[460px] sm:pb-[340px] lg:grid-cols-2 lg:gap-10 lg:pb-[360px] xl:gap-16">
          <div>
            <Link href="/" className="text-6xl font-black leading-none tracking-[-0.1em] text-brand sm:text-8xl">
              PUNTU<span className="text-coral">APP</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-canvas-muted">Un lugar para recordar lo que te dejó algo.</p>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-8 text-sm sm:gap-12">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand">Explorar</p>
                <div className="flex flex-col gap-2 text-canvas-muted">
                  <Link className="transition hover:text-brand" href="#catalogo">Catálogo</Link>
                  <Link className="transition hover:text-brand" href="#comunidad">Comunidad</Link>
                  <Link className="transition hover:text-brand" href="#como-funciona">Cómo funciona</Link>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand">Tu cuenta</p>
                <div className="flex flex-col gap-2 text-canvas-muted">
                  <Link className="transition hover:text-brand" href="#catalogo">Crear perfil</Link>
                  <Link className="transition hover:text-brand" href="#catalogo">Iniciar sesión</Link>
                </div>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
              <p className="max-w-sm text-sm leading-6 text-canvas-muted">Hecho para quienes siempre tienen algo para recomendar.</p>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">© PuntuApp 2026</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
