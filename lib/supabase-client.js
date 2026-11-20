import { createClient } from "@supabase/supabase-js";

// Only cache on the client side — SSR must never cache the stub as the real client
let browserClient;

export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // SSR/build-time stub — returns a fresh stub each call so it never gets cached
    const noop = async () => ({ data: null, error: null });
    const chain = () => ({ select: chain, eq: chain, gte: chain, order: chain, limit: chain, single: noop, maybeSingle: noop, upsert: () => ({ select: () => ({ single: noop }) }) });
    return {
      auth: { getSession: noop, signOut: noop, signInWithPassword: noop, onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) },
      from: () => chain(),
    };
  }

  // Real client — only cache when we have real env vars
  if (!browserClient) {
    browserClient = createClient(url, key);
  }
  return browserClient;
}
