"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signInAction, signUpAction, type AuthActionState } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
  nextPath?: string;
};

const initialState: AuthActionState = {};

export function AuthForm({ mode, nextPath = "/" }: AuthFormProps) {
  const isSignUp = mode === "sign-up";
  const [state, action, isPending] = useActionState(isSignUp ? signUpAction : signInAction, initialState);
  const encodedNextPath = encodeURIComponent(nextPath);

  return (
    <main className="mx-auto flex min-h-[72vh] w-full max-w-[1440px] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <section className="w-full max-w-lg rounded-[2rem] border border-canvas-line bg-canvas-subtle p-6 shadow-[0_20px_60px_oklch(0.25_0.04_155_/_0.08)] sm:p-10">
        <Link href="/" aria-label="PuntuApp, inicio" className="text-3xl font-black leading-none tracking-[-0.09em] text-brand">
          PUNTU<span className="text-coral">APP</span>
        </Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          {isSignUp ? "Tu lugar en la comunidad" : "Qué bueno verte"}
        </p>
        <h1 className="mt-3 font-display text-5xl leading-[0.9] tracking-[-0.06em] text-canvas-foreground">
          {isSignUp ? "Crear cuenta" : "Iniciar sesión"}
        </h1>
        <p className="mt-4 text-sm leading-6 text-canvas-muted">
          {isSignUp
            ? "Completá tus datos para guardar historias, compartir reseñas y armar tu biblioteca."
            : "Entrá para continuar con tu biblioteca y tus reseñas."}
        </p>

        <form action={action} className="mt-8 space-y-5">
          <input type="hidden" name="next" value={nextPath} />
          {isSignUp && (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="mb-2 block text-sm font-semibold text-canvas-foreground">Nombre</label>
                  <Input id="firstName" name="firstName" autoComplete="given-name" placeholder="Martina" required maxLength={80} className="h-12 rounded-xl border-canvas-line bg-canvas" />
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-2 block text-sm font-semibold text-canvas-foreground">Apellido</label>
                  <Input id="lastName" name="lastName" autoComplete="family-name" placeholder="García" required maxLength={80} className="h-12 rounded-xl border-canvas-line bg-canvas" />
                </div>
              </div>
              <div>
                <label htmlFor="username" className="mb-2 block text-sm font-semibold text-canvas-foreground">Nombre de usuario</label>
                <div className="relative">
                  <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-semibold text-canvas-muted">@</span>
                  <Input
                    id="username"
                    name="username"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    minLength={3}
                    maxLength={20}
                    pattern="[A-Za-z0-9._]{3,20}"
                    title="Usá entre 3 y 20 letras, números, puntos o guiones bajos."
                    placeholder="martina.garcia"
                    required
                    className="h-12 rounded-xl border-canvas-line bg-canvas pl-10"
                  />
                </div>
                <p className="mt-2 text-xs leading-5 text-canvas-muted">3 a 20 caracteres: letras, números, punto o guion bajo.</p>
              </div>
            </>
          )}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-canvas-foreground">{isSignUp ? "Correo electrónico" : "Email"}</label>
            <Input id="email" name="email" type="email" autoComplete="email" placeholder={isSignUp ? "vos@correo.com" : undefined} required maxLength={254} className="h-12 rounded-xl border-canvas-line bg-canvas" />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-canvas-foreground">Contraseña</label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              minLength={isSignUp ? 8 : 6}
              maxLength={72}
              pattern={isSignUp ? "(?=.*[A-Za-z])(?=.*[0-9]).{8,72}" : undefined}
              title={isSignUp ? "Usá al menos 8 caracteres, con una letra y un número." : undefined}
              placeholder={isSignUp ? "Al menos 8 caracteres" : undefined}
              required
              className="h-12 rounded-xl border-canvas-line bg-canvas"
            />
            {isSignUp && <p className="mt-2 text-xs leading-5 text-canvas-muted">8 caracteres como mínimo, con al menos una letra y un número.</p>}
          </div>
          {state.error && <p role="alert" className="text-sm leading-6 text-coral-foreground">{state.error}</p>}
          {state.message && <p role="status" className="text-sm leading-6 text-brand">{state.message}</p>}
          <Button type="submit" disabled={isPending} className="h-12 w-full rounded-full bg-brand text-brand-foreground hover:bg-brand/85">
            {isPending ? "Un momento…" : isSignUp ? "Crear mi cuenta" : "Ingresar"}
          </Button>
        </form>

        <p className="mt-7 text-sm text-canvas-muted">
          {isSignUp ? "¿Ya tenés cuenta?" : "¿Todavía no tenés cuenta?"}{" "}
          <Link
            href={isSignUp ? `/iniciar-sesion?next=${encodedNextPath}` : `/crear-cuenta?next=${encodedNextPath}`}
            className="font-semibold text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
          >
            {isSignUp ? "Iniciá sesión" : "Crear cuenta"}
          </Link>
        </p>
      </section>
    </main>
  );
}
