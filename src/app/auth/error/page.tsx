import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <main className="mx-auto flex min-h-[65vh] w-full max-w-[1440px] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <section className="max-w-xl rounded-[2rem] border border-canvas-line bg-canvas-subtle p-8 text-center sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-foreground">Enlace vencido o inválido</p>
        <h1 className="mt-4 font-display text-5xl leading-[0.9] tracking-[-0.06em] text-canvas-foreground">No pudimos confirmar tu cuenta.</h1>
        <p className="mt-5 text-sm leading-6 text-canvas-muted">Volvé a crear tu cuenta para recibir un nuevo enlace de confirmación.</p>
        <Link href="/crear-cuenta" className="mt-7 inline-flex h-11 items-center rounded-full bg-brand px-5 text-sm font-semibold text-brand-foreground transition hover:bg-brand/85">
          Crear cuenta
        </Link>
      </section>
    </main>
  );
}
