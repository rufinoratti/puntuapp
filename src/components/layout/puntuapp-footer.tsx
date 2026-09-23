import Link from "next/link";

import { CrowdCanvas } from "@/components/ui/skiper-ui/skiper39";

export function PuntuappFooter() {
  return (
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
                <Link className="transition hover:text-brand" href="/#catalogo">Catálogo</Link>
                <Link className="transition hover:text-brand" href="/#comunidad">Comunidad</Link>
                <Link className="transition hover:text-brand" href="/#como-funciona">Cómo funciona</Link>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand">Tu cuenta</p>
              <div className="flex flex-col gap-2 text-canvas-muted">
                <Link className="transition hover:text-brand" href="/watchlist">Mi watchlist</Link>
                <Link className="transition hover:text-brand" href="/#catalogo">Crear perfil</Link>
                <Link className="transition hover:text-brand" href="/#catalogo">Iniciar sesión</Link>
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
  );
}
