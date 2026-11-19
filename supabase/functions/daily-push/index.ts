/**
 * daily-push Edge Function
 *
 * Runs every 5 minutes via pg_cron:
 *   SELECT cron.schedule('daily-push', '*/5 * * * *', $$
 *     SELECT net.http_post(
 *       url := 'https://<project>.supabase.co/functions/v1/daily-push',
 *       headers := '{"Authorization": "Bearer <service_role_key>"}',
 *       body := '{}'
 *     );
 *   $$);
 *
 * What it sends:
 *
 * NeuroEsencia:
 *   - ne_enabled = true
 *   - Current UTC time matches ne_hour:ne_minute (Mexico City local → UTC-6 / UTC-5 DST)
 *   - Message: "🧠 Ejercicios de hoy — Recuerda hacer los ejercicios de NeuroEsencia"
 *
 * Buenas Noches:
 *   - bn_enabled = true
 *   - Current UTC time is 10 min before bn_routine_hour:bn_routine_minute
 *   - OR: it's 7pm local and they haven't logged a nightly_log for today
 *   - Message: "🌙 Rutina de esta noche — Ya casi es hora de empezar la rutina"
 *            or "🌙 Sin rutina configurada — ¿Ya preparaste la rutina de esta noche?"
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
const VAPID_PUBLIC_KEY = Deno.env.get("NEXT_PUBLIC_VAPID_PUBLIC_KEY")!;
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") ?? "mailto:hola@quirokids.com";

// Mexico City: UTC-6 (CST) / UTC-5 (CDT Apr–Oct last Sun)
// We pick -6 for simplicity; most of the year is -6.
const MX_OFFSET_HOURS = -6;

function localHour(utcDate: Date): number {
  return (utcDate.getUTCHours() + 24 + MX_OFFSET_HOURS) % 24;
}
function localMinute(utcDate: Date): number {
  return utcDate.getUTCMinutes();
}

// ── VAPID signing (manual implementation using SubtleCrypto) ──────────────────

function base64urlEncode(buf: Uint8Array): string {
  return btoa(String.fromCharCode(...buf))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function base64urlDecode(str: string): Uint8Array {
  const padding = "=".repeat((4 - (str.length % 4)) % 4);
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/") + padding;
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

async function importVapidPrivateKey(privateKeyBase64: string): Promise<CryptoKey> {
  const rawKey = base64urlDecode(privateKeyBase64);
  return crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    ["deriveKey", "deriveBits"]
  ).catch(async () => {
    // Try importing as PKCS8 if raw fails
    return crypto.subtle.importKey(
      "pkcs8",
      rawKey,
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["sign"]
    );
  });
}

async function signVapidJWT(audience: string): Promise<string> {
  const header = { typ: "JWT", alg: "ES256" };
  const payload = {
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 12 * 3600,
    sub: VAPID_SUBJECT,
  };
  const enc = new TextEncoder();
  const headerB64 = base64urlEncode(enc.encode(JSON.stringify(header)));
  const payloadB64 = base64urlEncode(enc.encode(JSON.stringify(payload)));
  const signingInput = `${headerB64}.${payloadB64}`;

  const rawKey = base64urlDecode(VAPID_PRIVATE_KEY);
  const key = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  ).catch(async () => {
    // fallback: wrap raw key in PKCS8 manually isn't trivial; use JWK approach
    return crypto.subtle.importKey(
      "jwk",
      {
        kty: "EC", crv: "P-256", ext: true,
        d: VAPID_PRIVATE_KEY,
        x: VAPID_PUBLIC_KEY.slice(0, 43),
        y: VAPID_PUBLIC_KEY.slice(43),
      },
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["sign"]
    );
  });

  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    enc.encode(signingInput)
  );
  return `${signingInput}.${base64urlEncode(new Uint8Array(signature))}`;
}

// ── Web Push send ─────────────────────────────────────────────────────────────

interface PushSubscription {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

async function sendWebPush(sub: PushSubscription, payload: object): Promise<boolean> {
  const url = new URL(sub.endpoint);
  const audience = `${url.protocol}//${url.host}`;
  const jwt = await signVapidJWT(audience);

  // Encrypt payload using ECDH + HKDF + AES-GCM (RFC 8291)
  // For simplicity, we use the plaintext approach via the "aesgcm" encoding
  // which is widely supported. Full RFC 8291 encryption is complex to implement
  // in Deno from scratch. Here we use the web-push npm package via esm.sh.
  const { default: webpush } = await import("https://esm.sh/web-push@3.6.7");

  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

  try {
    await webpush.sendNotification(sub, JSON.stringify(payload));
    return true;
  } catch (e: any) {
    // 410 Gone = subscription expired/unsubscribed
    if (e?.statusCode === 410 || e?.statusCode === 404) return false;
    throw e;
  }
}

// ── Main handler ──────────────────────────────────────────────────────────────

Deno.serve(async (_req) => {
  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
  const now = new Date();
  const lh = localHour(now);
  const lm = localMinute(now);
  const todayMx = new Date(now.getTime() + MX_OFFSET_HOURS * 3600000)
    .toISOString().slice(0, 10);

  // Fetch all subscriptions that have at least one product enabled
  const { data: subs } = await sb
    .from("push_subscriptions")
    .select("*")
    .or("ne_enabled.eq.true,bn_enabled.eq.true");

  if (!subs?.length) return new Response("ok", { status: 200 });

  const staleIds: string[] = [];

  await Promise.allSettled(subs.map(async (row: any) => {
    const pushSub: PushSubscription = row.subscription;
    const tasks: Array<{ title: string; body: string; url: string }> = [];

    // ── NeuroEsencia ──────────────────────────────────────────────────────
    if (row.ne_enabled) {
      const targetH = row.ne_hour ?? 10;
      const targetM = row.ne_minute ?? 0;
      // Send if within the current 5-minute bucket
      const diffMin = (lh * 60 + lm) - (targetH * 60 + targetM);
      if (diffMin >= 0 && diffMin < 5) {
        tasks.push({
          title: "🧠 Ejercicios de hoy",
          body: "No olvides hacer los ejercicios de NeuroEsencia.",
          url: "/neuroesencia",
        });
      }
    }

    // ── Buenas Noches ─────────────────────────────────────────────────────
    if (row.bn_enabled) {
      const routineH = row.bn_routine_hour ?? 20;
      const routineM = row.bn_routine_minute ?? 0;
      // Notify 10 min before routine
      const notifyMin = routineH * 60 + routineM - 10;
      const nowMin = lh * 60 + lm;
      const diffMin = nowMin - notifyMin;

      if (diffMin >= 0 && diffMin < 5) {
        // Check if they already have a nightly log for today
        const { data: logs } = await sb
          .from("nightly_logs")
          .select("id")
          .eq("parent_email", row.parent_email)
          .eq("log_date", todayMx)
          .limit(1);

        if (!logs?.length) {
          tasks.push({
            title: "🌙 Rutina de esta noche",
            body: "Ya casi es hora. Prepara la rutina de Buenas Noches.",
            url: "/buenas-noches",
          });
        }
        // If they already logged, no nudge needed — they did the routine
      }

      // Fallback nudge: if it's 7pm local and no log yet today and no routine time set
      const isDefaultNudge = lh === 19 && lm >= 0 && lm < 5;
      if (isDefaultNudge && !row.bn_routine_hour) {
        const { data: logs } = await sb
          .from("nightly_logs")
          .select("id")
          .eq("parent_email", row.parent_email)
          .eq("log_date", todayMx)
          .limit(1);
        if (!logs?.length) {
          tasks.push({
            title: "🌙 Rutina de esta noche",
            body: "¿Ya preparaste la rutina de Buenas Noches de esta noche?",
            url: "/buenas-noches",
          });
        }
      }
    }

    for (const task of tasks) {
      const ok = await sendWebPush(pushSub, task).catch(() => false);
      if (!ok) staleIds.push(row.id);
    }
  }));

  // Remove expired subscriptions
  if (staleIds.length) {
    await sb.from("push_subscriptions").delete().in("id", staleIds);
  }

  return new Response(JSON.stringify({ sent: subs.length, stale: staleIds.length }), {
    headers: { "Content-Type": "application/json" },
  });
});
