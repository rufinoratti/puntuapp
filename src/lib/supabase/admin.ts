import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getSupabaseEnvironment } from "./env";

export function createSupabaseAdminClient() {
  const environment = getSupabaseEnvironment();
  const secretKey = process.env.SUPABASE_SECRET_KEY?.trim();

  if (!environment || !secretKey) {
    throw new Error("Configurá SUPABASE_SECRET_KEY además de las variables públicas para guardar historias en Supabase.");
  }

  return createClient(environment.url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
