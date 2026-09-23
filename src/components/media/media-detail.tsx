"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent, type MouseEvent } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Clapperboard,
  Gamepad2,
  Send,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowIcon } from "@/components/ui/skiper-ui/skiper99";
import { WatchlistButton } from "@/components/watchlist/watchlist-button";
import { WatchlistNavLink } from "@/components/watchlist/watchlist-nav-link";
import type { MediaItem, MediaType } from "@/lib/media";
import { cn } from "@/lib/utils";

const typeLabels: Record<MediaType, string> = {
  movie: "Película",
  game: "Videojuego",
  book: "Libro",
};

const platformLabels: Record<string, string> = {
  "nintendo-switch": "Nintendo Switch",
  pc: "PC",
  playstation: "PlayStation",
  xbox: "Xbox",
};

const sampleReviews = {
  movie: [
    { author: "Mica", rating: 5, text: "Una experiencia enorme que se disfruta tanto por lo que cuenta como por cómo suena y se ve." },
    { author: "Tomás", rating: 4, text: "Tiene una escala increíble, pero sus mejores momentos siguen siendo los más íntimos." },
  ],
  game: [
    { author: "Sofi", rating: 5, text: "De esos juegos que te hacen decir ‘una partida más’ hasta que se hace de día." },
    { author: "Nico", rating: 4, text: "Muchísima personalidad y un ritmo que recompensa volver a empezar." },
  ],
  book: [
    { author: "Lara", rating: 5, text: "Una lectura que se queda dando vueltas mucho después de cerrar el libro." },
    { author: "Julián", rating: 4, text: "Tiene ideas hermosas y una voz que invita a subrayar cada página." },
  ],
};

function TypeIcon({ type }: { type: MediaType }) {
  const Icon = type === "movie" ? Clapperboard : type === "game" ? Gamepad2 : BookOpen;

  return <Icon aria-hidden="true" className="size-4" />;
}

function RatingStars({ value, size = "size-4" }: { value: number; size?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value.toFixed(1)} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className="relative inline-flex">
          <Star aria-hidden="true" className={cn(size, "text-canvas-line")} />
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 overflow-hidden transition-[width] duration-300 ease-out"
            style={{ width: `${Math.min(Math.max(value - index, 0), 1) * 100}%` }}
          >
            <Star aria-hidden="true" className={cn(size, "max-w-none fill-coral text-coral")} />
          </span>
        </span>
      ))}
    </span>
  );
}

function InteractiveRating({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  function handleStarClick(event: MouseEvent<HTMLButtonElement>, index: number) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const clickedLeftHalf = event.clientX - bounds.left < bounds.width / 2;

    onChange(index + (clickedLeftHalf ? 0.5 : 1));
  }

  return (
    <div className="flex gap-1" aria-label="Elegí una puntuación de media estrella a cinco estrellas">
      {Array.from({ length: 5 }).map((_, index) => {
        return (
          <button
            key={index}
            type="button"
            aria-label={`Elegir entre ${index + 0.5} y ${index + 1} estrellas`}
            aria-pressed={value > index && value <= index + 1}
            onClick={(event) => handleStarClick(event, index)}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
                event.preventDefault();
                onChange(Math.max(0.5, value - 0.5));
              }
              if (event.key === "ArrowRight" || event.key === "ArrowUp") {
                event.preventDefault();
                onChange(Math.min(5, value + 0.5));
              }
            }}
            className="relative inline-flex size-8 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
          >
            <span className="relative inline-flex">
              <Star aria-hidden="true" className="size-8 text-brand-foreground/35" />
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 overflow-hidden transition-[width] duration-300 ease-out"
                style={{ width: `${Math.min(Math.max(value - index, 0), 1) * 100}%` }}
              >
                <Star aria-hidden="true" className="size-8 max-w-none fill-coral text-coral" />
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function MediaDetail({ item }: { item: MediaItem }) {
  const [imageSrc, setImageSrc] = useState(item.image);
  const [score, setScore] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const reviews = sampleReviews[item.type];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!score || !review.trim()) return;

    setIsSubmitted(true);
  }

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-canvas text-canvas-foreground selection:bg-coral selection:text-coral-foreground">
      <header className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" aria-label="PuntuApp, inicio" className="text-3xl font-black leading-none tracking-[-0.09em] text-brand sm:text-4xl">
          PUNTU<span className="text-coral">APP</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <WatchlistNavLink />
          <Link
            href="/#catalogo"
            className="inline-flex items-center gap-2 rounded-full border border-brand/20 px-4 py-2 text-sm font-semibold text-brand transition hover:border-brand hover:bg-brand/5"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">Volver al catálogo</span>
            <span className="sm:hidden">Catálogo</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-5 sm:px-6 sm:pb-24 sm:pt-10 lg:px-8">
        <section className="grid gap-10 lg:grid-cols-[minmax(280px,0.7fr)_minmax(0,1.3fr)] lg:items-center lg:gap-16">
          <div className="relative mx-auto w-full max-w-[460px]">
            <div className="pointer-events-none absolute -right-3 top-8 z-0 aspect-[4/5] w-full rounded-[2.4rem] bg-coral/35 sm:-right-5 sm:top-10" />
            <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-[2.4rem] border-8 border-canvas-subtle bg-sky shadow-[0_24px_70px_oklch(0.25_0.04_155_/_0.14)]">
              <Image
                src={imageSrc}
                alt={item.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 35vw, 100vw"
                className="object-cover"
                onError={() => setImageSrc("/images/book-placeholder.svg")}
              />
            </div>
          </div>

          <div className="max-w-3xl">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                <span className="inline-flex items-center gap-2">
                  <TypeIcon type={item.type} />
                  {typeLabels[item.type]}
                </span>
                <span aria-hidden="true" className="h-4 w-px bg-canvas-line" />
                <span className="text-canvas-muted">{item.genre}</span>
              </div>

              {item.rating > 0 && (
                <div
                  className="flex shrink-0 items-center gap-3 border-l border-canvas-line pl-4"
                  aria-label={`Puntuación promedio: ${item.rating.toFixed(1)} de 5`}
                >
                  <Star aria-hidden="true" className="size-5 fill-coral text-coral" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-canvas-muted">Puntuación</p>
                    <p className="mt-0.5 text-xl font-bold leading-none text-canvas-foreground">
                      {item.rating.toFixed(1)} <span className="text-xs font-medium text-canvas-muted">/ 5</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
            <h1 className="mt-5 max-w-4xl font-display text-6xl leading-[0.86] tracking-[-0.07em] text-brand sm:text-7xl lg:text-[7rem]">
              {item.title}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-canvas-muted sm:text-lg sm:leading-8">
              {item.description ?? "Una historia esperando encontrar su lugar en tu biblioteca."}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-6 border-y border-canvas-line py-6 sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-canvas-muted">{item.creatorLabel}</p>
                <p className="mt-2 text-sm font-semibold text-canvas-foreground">{item.creator}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-canvas-muted">Año</p>
                <p className="mt-2 text-sm font-semibold text-canvas-foreground">{item.year}</p>
              </div>
              {item.runtime && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-canvas-muted">
                    {item.type === "book" ? "Extensión" : "Duración"}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-canvas-foreground">{item.runtime}</p>
                </div>
              )}
            </div>

            {item.cast && item.cast.length > 0 && (
              <div className="mt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-canvas-muted">Reparto principal</p>
                <p className="mt-2 text-sm leading-6 text-canvas-foreground/80">{item.cast.join(" · ")}</p>
              </div>
            )}

            {item.platforms && item.platforms.length > 0 && (
              <div className="mt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-canvas-muted">Disponible en</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.platforms.map((platform) => (
                    <span key={platform} className="rounded-full bg-brand/8 px-3 py-1.5 text-xs font-semibold text-brand">
                      {platformLabels[platform] ?? platform}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#puntuar" className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-brand-foreground transition hover:bg-brand/85">
                Puntuar esta historia <Star aria-hidden="true" className="size-4 fill-current" />
              </a>
              <WatchlistButton item={item} />
            </div>
          </div>
        </section>

        <section id="puntuar" className="mt-16 grid gap-8 scroll-mt-8 lg:mt-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
          <div className="rounded-[2rem] bg-brand p-6 text-brand-foreground sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-foreground/65">Tu mirada</p>
                <h2 className="mt-4 max-w-sm font-display text-4xl leading-[0.92] tracking-[-0.05em] sm:text-5xl">¿Qué te dejó?</h2>
              </div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-coral text-coral-foreground">
                <Star aria-hidden="true" className="size-5 fill-current" />
              </div>
            </div>

            <form className="mt-8" onSubmit={handleSubmit}>
              <fieldset>
                <legend className="text-sm font-semibold">Tu puntuación</legend>
                <div className="mt-3 flex items-center gap-4">
                  <InteractiveRating value={score} onChange={setScore} />
                  <span className="text-sm font-semibold text-brand-foreground/70">{score ? score.toFixed(1) : "—"}</span>
                </div>
              </fieldset>

              <label htmlFor="review" className="mt-7 block text-sm font-semibold">Tu reseña</label>
              <Textarea
                id="review"
                value={review}
                onChange={(event) => setReview(event.target.value)}
                placeholder="Escribí eso que te gustaría recomendarle a alguien…"
                className="mt-3 min-h-32 resize-y rounded-2xl border-brand-foreground/20 bg-brand-foreground/10 px-4 py-3 text-brand-foreground placeholder:text-brand-foreground/55 focus-visible:border-coral focus-visible:ring-coral/30"
              />
              <Button
                type="submit"
                disabled={!score || !review.trim()}
                className="mt-4 h-11 rounded-full bg-coral px-5 text-coral-foreground hover:bg-coral/85"
              >
                Publicar reseña <Send data-icon="inline-end" aria-hidden="true" />
              </Button>
              {isSubmitted && (
                <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand-foreground/85" role="status">
                  <Check aria-hidden="true" className="size-4" />
                  Reseña guardada como mock. Después la conectamos con tu usuario.
                </p>
              )}
            </form>
          </div>

          <div>
            <div className="flex items-end justify-between gap-4 border-b border-canvas-line pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">La conversación</p>
                <h2 className="mt-3 font-display text-4xl leading-none tracking-[-0.05em] text-canvas-foreground sm:text-5xl">Lo que dejó en otros.</h2>
              </div>
              <span className="hidden rounded-full bg-coral px-3 py-1.5 text-sm font-bold text-coral-foreground sm:inline-flex">{item.rating.toFixed(1)} / 5</span>
            </div>

            <div className="divide-y divide-canvas-line">
              {reviews.map((reviewItem) => (
                <article key={reviewItem.author} className="py-6 first:pt-7">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-canvas-foreground">{reviewItem.author}</p>
                    <RatingStars value={reviewItem.rating} />
                  </div>
                  <p className="mt-3 max-w-xl font-display text-2xl leading-[1.05] tracking-[-0.03em] text-canvas-foreground/85">
                    “{reviewItem.text}”
                  </p>
                </article>
              ))}
            </div>

            <Link href="/#catalogo" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand transition hover:text-coral">
              Seguir descubriendo <ArrowIcon className="size-5" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
