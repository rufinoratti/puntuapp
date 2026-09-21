"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Film, Gamepad2, Search, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mediaItems, type MediaItem, type MediaType } from "@/lib/media";
import { cn } from "@/lib/utils";

type Filter = "all" | MediaType;

const filterOptions: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "Todo" },
  { value: "movie", label: "Películas" },
  { value: "game", label: "Videojuegos" },
];

function MediaCard({ item, featured = false }: { item: MediaItem; featured?: boolean }) {
  const TypeIcon = item.type === "movie" ? Film : Gamepad2;

  return (
    <Card
      className={cn(
        "group relative min-h-[390px] border-canvas-line bg-canvas-subtle p-0 text-canvas-foreground shadow-none transition duration-300 hover:-translate-y-1 hover:border-brand/70 hover:shadow-[0_18px_60px_color-mix(in_oklch,var(--brand)_12%,transparent)]",
        featured && "md:col-span-2 md:row-span-2 md:min-h-[620px]",
      )}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 768px) 25vw, 100vw"}
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/20 to-transparent" />
        <div className="absolute inset-0 bg-canvas/10 transition group-hover:bg-transparent" />
      </div>

      <CardHeader className="relative z-10 flex h-full min-h-[390px] flex-col justify-end gap-3 p-5 md:min-h-[620px] md:p-7">
        <div className="flex items-center justify-between gap-3">
          <Badge className="border-white/15 bg-canvas/70 text-canvas-foreground backdrop-blur-sm">
            <TypeIcon aria-hidden="true" />
            {item.type === "movie" ? "Película" : "Videojuego"}
          </Badge>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-white/85">
            <Star aria-hidden="true" className="size-3.5 fill-brand text-brand" />
            {item.rating.toFixed(1)}
          </span>
        </div>
        <CardTitle
          className={cn(
            "max-w-[18ch] text-2xl font-semibold tracking-tight text-white",
            featured && "md:text-4xl",
          )}
        >
          {item.title}
        </CardTitle>
        <CardDescription className="text-sm text-white/70">
          {item.genre} <span aria-hidden="true">/</span> {item.year}
        </CardDescription>
        <p className="text-sm text-white/70">
          {item.creatorLabel}: <span className="text-white/90">{item.creator}</span>
        </p>
      </CardHeader>
    </Card>
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
    <main className="min-h-[100dvh] bg-canvas text-canvas-foreground selection:bg-brand selection:text-brand-foreground">
      <a
        href="#catalogo"
        className="sr-only z-50 rounded-md bg-brand px-4 py-3 font-medium text-brand-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Saltar al catálogo
      </a>

      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            aria-label="PuntuApp, inicio"
            className="text-lg font-semibold tracking-[0.22em] text-white transition hover:text-brand"
          >
            PUNTUAPP
          </Link>

          <nav aria-label="Navegación principal" className="hidden items-center gap-8 text-sm text-white/65 md:flex">
            <Link className="transition hover:text-white" href="#catalogo">
              Descubrir
            </Link>
            <Link className="transition hover:text-white" href="#comunidad">
              Comunidad
            </Link>
            <Link className="transition hover:text-white" href="#como-funciona">
              Cómo funciona
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="hidden rounded-full text-white/75 hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              Ingresar
            </Button>
            <Button className="rounded-full bg-brand px-4 text-brand-foreground hover:bg-brand/85">
              Crear cuenta
            </Button>
          </div>
        </div>
      </header>

      <section className="relative isolate overflow-hidden border-b border-canvas-line">
        <Image
          src="/puntuapp-hero.png"
          alt="Rollo de película y control de videojuegos iluminados por una luz coral"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-canvas/65" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-canvas via-canvas/85 to-canvas/35" />

        <div className="relative mx-auto flex min-h-[720px] w-full max-w-7xl items-end px-5 pb-20 pt-32 sm:px-8 lg:min-h-[780px] lg:px-10 lg:pb-28">
          <div className="max-w-2xl">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-brand">
              Cultura para compartir
            </p>
            <h1 className="max-w-[12ch] text-5xl font-semibold leading-[0.94] tracking-[-0.06em] text-white sm:text-7xl lg:text-8xl">
              Lo que viste.
              <span className="block text-white/55">Lo que te marcó.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
              Guardá, puntuá y recomendá películas y videojuegos que merecen una segunda charla.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="#catalogo"
                className={buttonVariants({ className: "h-10 rounded-full bg-brand px-5 text-brand-foreground hover:bg-brand/85" })}
              >
                Explorar catálogo
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Link>
              <Link
                href="#como-funciona"
                className="inline-flex min-h-10 items-center rounded-full border border-white/20 px-5 text-sm font-medium text-white transition hover:border-white/50 hover:bg-white/10"
              >
                Cómo funciona
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="catalogo" className="mx-auto w-full max-w-7xl scroll-mt-10 px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-brand">Descubrir</p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Encontrá algo para sentir.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-canvas-muted">
              Una selección inicial para empezar a construir tu propio mapa de historias.
            </p>
          </div>

          <div className="relative w-full max-w-md">
            <label htmlFor="catalog-search" className="sr-only">
              Buscar películas y videojuegos
            </label>
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-canvas-muted" />
            <Input
              id="catalog-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por título, género o creador"
              className="h-12 rounded-full border-canvas-line bg-canvas-subtle pl-11 text-canvas-foreground placeholder:text-canvas-muted focus-visible:border-brand focus-visible:ring-brand/30"
            />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-2" aria-label="Filtrar catálogo">
          {filterOptions.map((option) => {
            const isActive = filter === option.value;
            const Icon = option.value === "movie" ? Film : option.value === "game" ? Gamepad2 : null;

            return (
              <Button
                key={option.value}
                type="button"
                size="sm"
                variant={isActive ? "default" : "outline"}
                aria-pressed={isActive}
                onClick={() => setFilter(option.value)}
                className={cn(
                  "rounded-full border-canvas-line",
                  isActive
                    ? "bg-brand text-brand-foreground hover:bg-brand/85"
                    : "bg-transparent text-canvas-muted hover:border-brand/60 hover:bg-canvas-subtle hover:text-canvas-foreground",
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

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4" aria-live="polite">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <MediaCard key={item.id} item={item} featured={index === 0 && filter === "all" && query.length === 0} />
            ))
          ) : (
            <div className="col-span-full flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-canvas-line px-6 text-center">
              <Search aria-hidden="true" className="mb-4 size-6 text-brand" />
              <h3 className="text-lg font-semibold text-white">No encontramos ese título</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-canvas-muted">
                Probá con otro nombre, género o creador.
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="como-funciona" className="border-y border-canvas-line bg-canvas-subtle/60">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-20 sm:px-8 md:grid-cols-[0.8fr_1.2fr] md:items-center lg:px-10 lg:py-24">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-brand">Tu criterio importa</p>
            <h2 className="max-w-md text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              Una biblioteca con tu propia voz.
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <span className="text-3xl font-semibold tracking-[-0.04em] text-brand">Registrá</span>
              <h3 className="mt-4 text-base font-semibold text-white">Tu recorrido</h3>
              <p className="mt-2 text-sm leading-6 text-canvas-muted">Todo lo que viste o jugaste, en un solo lugar.</p>
            </div>
            <div>
              <span className="text-3xl font-semibold tracking-[-0.04em] text-brand">Puntuá</span>
              <h3 className="mt-4 text-base font-semibold text-white">A tu manera</h3>
              <p className="mt-2 text-sm leading-6 text-canvas-muted">Dale forma a tu criterio con una escala simple.</p>
            </div>
            <div>
              <span className="text-3xl font-semibold tracking-[-0.04em] text-brand">Compartí</span>
              <h3 className="mt-4 text-base font-semibold text-white">Lo que te marcó</h3>
              <p className="mt-2 text-sm leading-6 text-canvas-muted">Dejá una reseña que le sirva a alguien más.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="comunidad" className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
        <div className="flex flex-col gap-7 rounded-3xl border border-brand/30 bg-brand p-7 text-brand-foreground sm:p-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-brand-foreground/65">Próximamente</p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Encontrá gente que mira como vos.</h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-brand-foreground/75">
              Seguí perfiles, compará gustos y descubrí tu próxima obsesión a través de la comunidad.
            </p>
          </div>
          <Button variant="outline" className="w-fit rounded-full border-brand-foreground/25 bg-transparent text-brand-foreground hover:bg-brand-foreground/10 hover:text-brand-foreground">
            Ver la hoja de ruta
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Button>
        </div>
      </section>

      <footer className="border-t border-canvas-line px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 text-sm text-canvas-muted sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium tracking-[0.16em] text-white">PUNTUAPP</span>
          <span>Un lugar para recordar lo que te dejó algo.</span>
        </div>
      </footer>
    </main>
  );
}
