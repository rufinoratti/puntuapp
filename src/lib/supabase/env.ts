export function getSupabaseEnvironment() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !publishableKey) return null;
  return { url, publishableKey };
}

export function isSupabaseConfigured() {
  return getSupabaseEnvironment() !== null;
}

export function requireSupabaseEnvironment() {
  const environment = getSupabaseEnvironment();
  if (!environment) {
    throw new Error("Configurá NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY para conectar Supabase.");
  }
  return environment;
}
