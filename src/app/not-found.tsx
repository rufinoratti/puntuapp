import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Clapperboard } from "lucide-react";

export default function NotFound() {
  return (
    <main
      data-not-found
      aria-labelledby="not-found-title"
      className="not-found-page flex w-full flex-1 items-center justify-center px-3 py-3 sm:px-5 sm:py-5 lg:px-8 lg:py-8"
    >
      <section className="not-found-panel relative isolate grid w-full max-w-[1440px] items-center overflow-hidden rounded-[2rem] border border-canvas-line/70 bg-canvas-subtle px-6 py-9 shadow-[0_24px_80px_oklch(0.25_0.04_155_/_0.07)] sm:px-10 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:rounded-[2.8rem] lg:px-14 xl:px-20">
        <div aria-hidden="true" className="not-found-orbit not-found-orbit-one" />
        <div aria-hidden="true" className="not-found-orbit not-found-orbit-two" />

        <div className="not-found-art not-found-enter relative order-1 mx-auto w-full max-w-[590px] lg:order-none">
          <svg
            aria-hidden="true"
            className="block h-auto w-full overflow-visible"
            fill="none"
            viewBox="0 0 560 440"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <clipPath id="not-found-screen-clip">
                <rect height="188" rx="18" width="292" x="112" y="112" />
              </clipPath>
              <filter
                colorInterpolationFilters="sRGB"
                height="150%"
                id="not-found-shadow"
                width="150%"
                x="-25%"
                y="-15%"
              >
                <feDropShadow dx="0" dy="20" floodColor="var(--brand)" floodOpacity="0.15" stdDeviation="12" />
              </filter>
            </defs>

            <ellipse cx="287" cy="389" fill="var(--brand)" opacity=".08" rx="198" ry="19" />

            <g className="not-found-tv" filter="url(#not-found-shadow)">
              <path d="M184 95 156 43M205 94l34-56" stroke="var(--canvas-foreground)" strokeLinecap="round" strokeWidth="8" />
              <circle cx="153" cy="38" fill="var(--coral)" r="9" />
              <circle cx="242" cy="34" fill="var(--sky)" r="9" />

              <rect fill="var(--brand)" height="282" rx="42" width="426" x="67" y="75" />
              <rect fill="var(--canvas-subtle)" height="268" rx="35" width="412" x="74" y="82" />
              <rect fill="var(--canvas-line)" height="204" rx="25" width="312" x="102" y="104" />
              <rect fill="#172820" height="188" rx="18" width="292" x="112" y="112" />

              <g clipPath="url(#not-found-screen-clip)">
                <path d="M112 112h42v119h-42z" fill="#EF7565" />
                <path d="M154 112h42v119h-42z" fill="#F4A95D" />
                <path d="M196 112h42v119h-42z" fill="#E8D96F" />
                <path d="M238 112h42v119h-42z" fill="#7ABF78" />
                <path d="M280 112h42v119h-42z" fill="#54B8AE" />
                <path d="M322 112h42v119h-42z" fill="#7199D6" />
                <path d="M364 112h40v119h-40z" fill="#A58CD0" />
                <path d="M112 219h292v81H112z" fill="#172820" />
                <path d="M129 239h8v8h-8zm15 0h8v8h-8zm15 0h8v8h-8z" fill="var(--coral)" />
                <text
                  fill="var(--canvas-subtle)"
                  fontFamily="var(--font-mono)"
                  fontSize="37"
                  fontWeight="700"
                  letterSpacing="-2"
                  x="240"
                  y="279"
                >
                  404
                </text>
                <path d="M126 265h31" stroke="var(--canvas-subtle)" strokeLinecap="round" strokeOpacity=".52" strokeWidth="3" />
                <path d="M126 275h21" stroke="var(--canvas-subtle)" strokeLinecap="round" strokeOpacity=".3" strokeWidth="3" />
              </g>

              <path d="M127 326h245" stroke="var(--canvas-line)" strokeWidth="2" />
              <rect fill="var(--brand)" height="6" rx="3" width="42" x="135" y="343" />
              <circle cx="461" cy="149" fill="var(--canvas-subtle)" r="22" stroke="var(--canvas-line)" strokeWidth="5" />
              <circle cx="461" cy="149" fill="var(--coral)" r="8" />
              <circle cx="461" cy="216" fill="var(--canvas-subtle)" r="15" stroke="var(--canvas-line)" strokeWidth="5" />
              <path d="M450 277h22m-22 9h22m-22 9h22m-22 9h22" stroke="var(--canvas-line)" strokeLinecap="round" strokeWidth="3" />
              <circle cx="489" cy="331" fill="var(--coral)" r="5" />
            </g>

            <g className="not-found-sparkle" fill="var(--coral)">
              <path d="m469 54 6 15 15 6-15 6-6 15-6-15-15-6 15-6 6-15Z" />
              <circle cx="83" cy="198" r="5" />
            </g>
            <path d="m455 359 13 14m0-14-13 14" stroke="var(--sky)" strokeLinecap="round" strokeWidth="4" />
          </svg>

          <div className="absolute left-[11%] top-[5%] -rotate-6 rounded-full border border-canvas-line bg-canvas px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand shadow-sm sm:left-[13%] sm:top-[3%]">
            PuntuApp · fuera de señal
          </div>
        </div>

        <div className="not-found-copy relative z-10 order-2 mx-auto w-full max-w-[480px] pt-3 text-center lg:order-none lg:mx-0 lg:pt-0 lg:text-left">
          <p className="not-found-enter inline-flex items-center gap-2 rounded-full bg-coral/20 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-coral-foreground sm:text-xs">
            <Clapperboard aria-hidden="true" className="size-3.5" />
            Error 404 <span aria-hidden="true">·</span> fin de la escena
          </p>

          <h1
            id="not-found-title"
            className="not-found-enter mt-5 font-display text-[clamp(2.75rem,7vw,5.8rem)] leading-[0.92] tracking-[-0.065em] text-canvas-foreground sm:mt-6"
          >
            Uy, esta página se perdió.
          </h1>

          <p className="not-found-enter mx-auto mt-5 max-w-[36ch] text-base leading-7 text-canvas-muted sm:text-lg sm:leading-8 lg:mx-0">
            No encontramos lo que buscabas. Puede que el enlace haya cambiado de lugar. Volvé al inicio y seguimos buscando una buena historia.
          </p>

          <div className="not-found-enter mt-7 flex flex-col items-center justify-center gap-4 sm:mt-8 sm:flex-row lg:justify-start">
            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-[0_10px_24px_oklch(0.4_0.13_155_/_0.18)] transition-colors duration-200 hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Volver al inicio
            </Link>

            <Link
              href="/#catalogo"
              className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm font-semibold text-brand underline decoration-brand/30 underline-offset-4 transition-colors duration-200 hover:text-coral-foreground hover:decoration-coral focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              Explorar el catálogo
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <p className="not-found-enter mt-8 text-xs font-medium text-canvas-muted/75">
            Si llegaste acá siguiendo un enlace, capaz la historia cambió de estante.
          </p>
        </div>
      </section>
    </main>
  );
}
