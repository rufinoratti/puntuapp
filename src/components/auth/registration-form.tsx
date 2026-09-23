"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CircleAlert,
  Film,
  Gamepad2,
  LockKeyhole,
  Mail,
  UserRound,
  Eye,
  EyeOff,
} from "lucide-react";

type RegistrationField = "firstName" | "lastName" | "username" | "email" | "password";

type RegistrationValues = Record<RegistrationField, string>;
type FormStatus = { kind: "error" | "preview"; message: string };

const initialValues: RegistrationValues = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
};

const fieldNames: RegistrationField[] = ["firstName", "lastName", "username", "email", "password"];

function validate(values: RegistrationValues): Partial<Record<RegistrationField, string>> {
  const errors: Partial<Record<RegistrationField, string>> = {};
  const firstName = values.firstName.trim();
  const lastName = values.lastName.trim();
  const username = values.username.trim();
  const email = values.email.trim();

  if (!firstName) errors.firstName = "Escribí tu nombre.";
  else if (firstName.length < 2) errors.firstName = "Usá al menos 2 caracteres.";
  else if (!/^[\p{L}\p{M}][\p{L}\p{M}'’ -]*$/u.test(firstName)) {
    errors.firstName = "Usá letras, espacios, apóstrofes o guiones.";
  }

  if (!lastName) errors.lastName = "Escribí tu apellido.";
  else if (lastName.length < 2) errors.lastName = "Usá al menos 2 caracteres.";
  else if (!/^[\p{L}\p{M}][\p{L}\p{M}'’ -]*$/u.test(lastName)) {
    errors.lastName = "Usá letras, espacios, apóstrofes o guiones.";
  }

  if (!username) errors.username = "Elegí un nombre de usuario.";
  else if (!/^[a-zA-Z0-9][a-zA-Z0-9._]{2,19}$/.test(username)) {
    errors.username = "Usá entre 3 y 20 caracteres: letras, números, punto o guion bajo.";
  }

  if (!email) errors.email = "Escribí tu correo electrónico.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Revisá el formato del correo. Ejemplo: hola@correo.com.";
  }

  if (!values.password) errors.password = "Creá una contraseña.";
  else if (values.password.length < 8) errors.password = "Necesita al menos 8 caracteres.";
  else if (!/\p{L}/u.test(values.password) || !/\d/.test(values.password)) {
    errors.password = "Sumá al menos una letra y un número.";
  }

  return errors;
}

function Field({
  id,
  label,
  value,
  placeholder,
  autoComplete,
  error,
  hint,
  startIcon,
  onChange,
  onBlur,
  inputMode,
}: {
  id: RegistrationField;
  label: string;
  value: string;
  placeholder: string;
  autoComplete: string;
  error?: string;
  hint?: string;
  startIcon: ReactNode;
  onChange: (value: string) => void;
  onBlur: () => void;
  inputMode?: "email" | "text";
}) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-canvas-foreground">
        {label}
      </label>
      <div className="relative">
        <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-canvas-muted">
          {startIcon}
        </span>
        <input
          id={id}
          type={id === "email" ? "email" : "text"}
          inputMode={inputMode}
          autoComplete={autoComplete}
          required
          value={value}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          className={`h-12 w-full rounded-xl border bg-canvas-subtle pl-11 pr-4 text-base text-canvas-foreground outline-none transition placeholder:text-canvas-muted/75 focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand/10 lg:h-[2.875rem] lg:text-[15px] ${
            error ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/10" : "border-canvas-line"
          }`}
        />
      </div>
      {hint ? (
        <p id={hintId} className="mt-1 text-xs leading-4 text-canvas-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-1 flex items-start gap-1.5 text-xs leading-4 text-destructive" role="alert">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

function PasswordField({
  value,
  error,
  touched,
  visible,
  onChange,
  onBlur,
  onToggleVisibility,
}: {
  value: string;
  error?: string;
  touched: boolean;
  visible: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
  onToggleVisibility: () => void;
}) {
  const errorId = "password-error";
  const hintId = "password-hint";
  const hasMinimumLength = value.length >= 8;
  const hasLetterAndNumber = /\p{L}/u.test(value) && /\d/.test(value);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor="password" className="text-sm font-semibold text-canvas-foreground">
          Contraseña
        </label>
        <span className="text-[11px] font-medium text-canvas-muted">Privada y segura</span>
      </div>
      <div className="relative">
        <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-canvas-muted">
          <LockKeyhole className="size-[18px]" />
        </span>
        <input
          id="password"
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          required
          value={value}
          placeholder="Al menos 8 caracteres"
          aria-invalid={Boolean(error)}
          aria-describedby={`${hintId}${error ? ` ${errorId}` : ""}`}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          className={`h-12 w-full rounded-xl border bg-canvas-subtle pl-11 pr-14 text-base text-canvas-foreground outline-none transition placeholder:text-canvas-muted/75 focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand/10 lg:h-[2.875rem] lg:text-[15px] ${
            error ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/10" : "border-canvas-line"
          }`}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={visible}
          className="absolute right-1 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-xl text-canvas-muted transition-colors duration-150 hover:bg-brand/5 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          {visible ? <EyeOff aria-hidden="true" className="size-[18px]" /> : <Eye aria-hidden="true" className="size-[18px]" />}
        </button>
      </div>
      <div id={hintId} className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs" aria-live={touched ? "polite" : undefined}>
        <PasswordRule valid={hasMinimumLength} label="8 caracteres como mínimo" />
        <PasswordRule valid={hasLetterAndNumber} label="Una letra y un número" />
      </div>
      {error ? (
        <p id={errorId} className="mt-1 flex items-start gap-1.5 text-xs leading-4 text-destructive" role="alert">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

function PasswordRule({ valid, label }: { valid: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${valid ? "text-brand" : "text-canvas-muted"}`}>
      <span className={`inline-flex size-4 items-center justify-center rounded-full ${valid ? "bg-brand/10" : "bg-canvas-line/60"}`}>
        {valid ? <Check aria-hidden="true" className="size-3" /> : <span aria-hidden="true" className="size-1 rounded-full bg-current" />}
      </span>
      {label}
    </span>
  );
}

function StoryPanel() {
  return (
    <aside className="relative flex min-h-[calc(100dvh-2rem)] flex-col justify-between overflow-hidden rounded-[2rem] bg-brand p-8 text-brand-foreground xl:p-12">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-foreground/75">PuntuApp · Tu biblioteca personal</p>

      <div className="my-auto py-16">
        <span aria-hidden="true" className="mb-7 block h-0.5 w-9 rounded-full bg-coral" />
        <h2 className="max-w-[11ch] font-display text-[2.8rem] leading-[1.02] tracking-[-0.035em] xl:text-6xl">
          Tus historias, en un solo lugar.
        </h2>
        <p className="mt-5 max-w-sm text-sm leading-6 text-brand-foreground/80">
          Películas, videojuegos y libros en una colección que habla de vos.
        </p>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-brand-foreground/20 pt-5 text-sm font-medium text-brand-foreground/90">
        <span className="inline-flex items-center gap-2"><Film aria-hidden="true" className="size-4" />Películas</span>
        <span className="inline-flex items-center gap-2"><Gamepad2 aria-hidden="true" className="size-4" />Videojuegos</span>
        <span className="inline-flex items-center gap-2"><BookOpen aria-hidden="true" className="size-4" />Libros</span>
      </div>
    </aside>
  );
}

export function RegistrationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<RegistrationValues>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<RegistrationField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus | null>(null);

  const errors = validate(values);
  const visibleErrors = Object.fromEntries(
    fieldNames.map((field) => [field, submitted || touched[field] ? errors[field] : undefined]),
  ) as Partial<Record<RegistrationField, string>>;

  function updateField(field: RegistrationField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setFormStatus(null);
  }

  function markTouched(field: RegistrationField) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    const firstInvalidField = fieldNames.find((field) => errors[field]);
    if (firstInvalidField) {
      setFormStatus({ kind: "error", message: "Revisá los campos marcados para continuar." });
      window.requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      });
      return;
    }

    setFormStatus({
      kind: "preview",
      message: "Todo está listo. La validación se hizo en este navegador; todavía no se envió ningún dato ni se creó una cuenta.",
    });
  }

  return (
    <main data-auth-screen className="min-h-[100dvh] bg-canvas text-canvas-foreground selection:bg-coral selection:text-coral-foreground">
      <div className="mx-auto grid min-h-[100dvh] w-full max-w-[1600px] lg:grid-cols-[minmax(0,1.08fr)_minmax(400px,0.92fr)]">
        <section className="flex min-h-[100dvh] flex-col px-5 py-5 sm:px-8 sm:py-6 lg:px-10 lg:py-5 xl:px-16">
          <header className="flex items-center justify-between gap-4">
            <Link href="/" aria-label="PuntuApp, inicio" className="inline-flex min-h-11 items-center text-[1.65rem] font-black leading-none tracking-[-0.08em] text-brand">
              PUNTU<span className="text-coral">APP</span>
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-2.5 text-xs font-semibold text-canvas-muted transition-colors duration-150 hover:bg-brand/5 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <ArrowLeft aria-hidden="true" className="size-3.5" />
              Volver al inicio
            </Link>
          </header>

          <div className="flex flex-1 items-center justify-center py-8 sm:py-10 lg:py-2">
            <div className="w-full max-w-[520px]">
              <h1 className="font-display text-[2.25rem] leading-[0.98] tracking-[-0.035em] text-brand sm:text-[2.75rem] lg:text-[2.5rem]">
                Creá tu cuenta.
                <span className="block text-canvas-foreground">Guardá lo que te mueve.</span>
              </h1>
              <p className="mt-3 max-w-md text-sm leading-5 text-canvas-muted sm:text-[15px] sm:leading-6">
                Un perfil para reunir tus películas, videojuegos y libros favoritos en un solo lugar.
              </p>

              <form ref={formRef} method="post" noValidate onSubmit={handleSubmit} className="mt-6 space-y-3 sm:mt-7 sm:space-y-3.5 lg:mt-6 lg:space-y-2.5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    id="firstName"
                    label="Nombre"
                    value={values.firstName}
                    placeholder="Martina"
                    autoComplete="given-name"
                    error={visibleErrors.firstName}
                    startIcon={<UserRound aria-hidden="true" className="size-[18px]" />}
                    onChange={(value) => updateField("firstName", value)}
                    onBlur={() => markTouched("firstName")}
                  />
                  <Field
                    id="lastName"
                    label="Apellido"
                    value={values.lastName}
                    placeholder="García"
                    autoComplete="family-name"
                    error={visibleErrors.lastName}
                    startIcon={<UserRound aria-hidden="true" className="size-[18px]" />}
                    onChange={(value) => updateField("lastName", value)}
                    onBlur={() => markTouched("lastName")}
                  />
                </div>

                <Field
                  id="username"
                  label="Nombre de usuario"
                  value={values.username}
                  placeholder="martina.garcia"
                  autoComplete="username"
                  hint="3 a 20 caracteres: letras, números, punto o guion bajo."
                  error={visibleErrors.username}
                  startIcon={<span className="text-base font-semibold leading-none">@</span>}
                  onChange={(value) => updateField("username", value)}
                  onBlur={() => markTouched("username")}
                />

                <Field
                  id="email"
                  label="Correo electrónico"
                  value={values.email}
                  placeholder="vos@correo.com"
                  autoComplete="email"
                  inputMode="email"
                  error={visibleErrors.email}
                  startIcon={<Mail aria-hidden="true" className="size-[18px]" />}
                  onChange={(value) => updateField("email", value)}
                  onBlur={() => markTouched("email")}
                />

                <PasswordField
                  value={values.password}
                  error={visibleErrors.password}
                  touched={Boolean(touched.password || submitted)}
                  visible={passwordVisible}
                  onChange={(value) => updateField("password", value)}
                  onBlur={() => markTouched("password")}
                  onToggleVisibility={() => setPasswordVisible((current) => !current)}
                />

                <div className="pt-0.5">
                  <button
                    type="submit"
                    className="group inline-flex h-[3.25rem] w-full items-center justify-center gap-2 rounded-[1.1rem] bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-[0_8px_20px_oklch(0.4_0.13_155_/_0.12)] transition-[transform,background-color] duration-150 ease-out hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20 active:scale-[0.98]"
                  >
                    Crear mi cuenta
                    <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>

                <div
                  role={formStatus ? (formStatus.kind === "error" ? "alert" : "status") : undefined}
                  aria-live={formStatus?.kind === "error" ? "assertive" : "polite"}
                  className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-xs leading-4 ${
                    formStatus
                      ? formStatus.kind === "error"
                        ? "border-destructive/20 bg-destructive/5 text-destructive"
                        : "border-brand/20 bg-brand/5 text-brand"
                      : "border-canvas-line bg-canvas-subtle text-canvas-muted"
                  }`}
                >
                  <span className={`mt-1 size-2 shrink-0 rounded-full ${formStatus?.kind === "error" ? "bg-destructive" : "bg-brand"}`} />
                  <p>
                    <strong className="font-semibold">Estado del sistema: </strong>
                    {formStatus?.message ?? "Validación local activa. El alta todavía no está conectada y tus datos no se envían."}
                  </p>
                </div>
              </form>

            </div>
          </div>
        </section>

        <div className="hidden p-4 lg:block lg:py-4 lg:pr-4">
          <StoryPanel />
        </div>
      </div>
    </main>
  );
}
