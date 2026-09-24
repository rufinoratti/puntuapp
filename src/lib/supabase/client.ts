"use client";

import { createBrowserClient } from "@supabase/ssr";

import { requireSupabaseEnvironment } from "./env";

export function createSupabaseBrowserClient() {
  const { url, publishableKey } = requireSupabaseEnvironment();
  return createBrowserClient(url, publishableKey);
}
