"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthActionState = {
  error?: string;
  message?: string;
};

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(6).max(72),
});

const signUpSchema = z.object({
  firstName: z.string().trim().min(2).max(80).regex(/^[\p{L}\p{M}][\p{L}\p{M}'’ -]*$/u),
  lastName: z.string().trim().min(2).max(80).regex(/^[\p{L}\p{M}][\p{L}\p{M}'’ -]*$/u),
  username: z.string().trim().regex(/^[a-zA-Z0-9][a-zA-Z0-9._]{2,19}$/),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(72).regex(/^(?=.*\p{L})(?=.*\d).+$/u),
});

function formString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function safeNextPath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/";
  return value;
}

function getAuthRedirectUrl(nextPath: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
  const url = new URL("/auth/confirm", siteUrl);
  url.searchParams.set("next", nextPath);
  return url.toString();
}

export async function signInAction(_previousState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = credentialsSchema.safeParse({
    email: formString(formData, "email"),
    password: formString(formData, "password"),
  });

  if (!parsed.success) return { error: "Ingresá un email válido y una contraseña de al menos 6 caracteres." };

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch (error) {
    return { error: error instanceof Error ? error.message : "No se pudo conectar con Supabase." };
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "No pudimos iniciar sesión. Revisá el email y la contraseña." };

  revalidatePath("/", "layout");
  redirect(safeNextPath(formString(formData, "next")));
}

export async function signUpAction(_previousState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    firstName: formString(formData, "firstName"),
    lastName: formString(formData, "lastName"),
    username: formString(formData, "username"),
    email: formString(formData, "email"),
    password: formString(formData, "password"),
  });

  if (!parsed.success) {
    return {
      error: "Completá todos los campos. El username debe tener entre 3 y 20 caracteres (letras, números, punto o guion bajo) y la contraseña, al menos 8 caracteres con una letra y un número.",
    };
  }

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch (error) {
    return { error: error instanceof Error ? error.message : "No se pudo conectar con Supabase." };
  }

  const nextPath = safeNextPath(formString(formData, "next"));
  const firstName = parsed.data.firstName;
  const lastName = parsed.data.lastName;
  const username = parsed.data.username.toLowerCase();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: getAuthRedirectUrl(nextPath),
      data: {
        first_name: firstName,
        last_name: lastName,
        username,
        display_name: `${firstName} ${lastName}`,
      },
    },
  });

  if (error) {
    return { error: "No pudimos crear la cuenta. El email o el nombre de usuario puede estar en uso; revisá también la configuración de Auth." };
  }

  if (!data.session) {
    return { message: "Te enviamos un email para confirmar la cuenta. Abrí el enlace para terminar el registro." };
  }

  revalidatePath("/", "layout");
  redirect(nextPath);
}

export async function signOutAction() {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
  } finally {
    redirect("/");
  }
}
