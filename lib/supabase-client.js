import { createClient } from "@supabase/supabase-js";

let browserClient;

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // SSR/build stub — never runs in the browser since NEXT_PUBLIC_ vars are always inlined
    const noop = async () => ({ data: null, error: null });
    const chain = () => ({ select: chain, eq: chain, gte: chain, order: chain, limit: chain, single: noop, maybeSingle: noop, upsert: () => ({ select: () => ({ single: noop }) }) });
    return {
      auth: { getSession: noop, signOut: noop, signInWithPassword: noop, onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) },
      from: () => chain(),
    };
  }

  browserClient = createClient(url, key);
  return browserClient;
}
