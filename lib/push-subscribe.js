import { getSupabaseBrowserClient } from "./supabase-client";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

export async function getOrRegisterServiceWorker() {
  if (!("serviceWorker" in navigator)) throw new Error("Service workers not supported");
  const existing = await navigator.serviceWorker.getRegistration("/");
  if (existing) return existing;
  return navigator.serviceWorker.register("/sw.js");
}

export async function requestPushPermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  const result = await Notification.requestPermission();
  return result;
}

export async function subscribeToPush() {
  const reg = await getOrRegisterServiceWorker();
  const existing = await reg.pushManager.getSubscription();
  if (existing) return existing;
  return reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });
}

export async function unsubscribeFromPush() {
  const reg = await navigator.serviceWorker?.getRegistration("/");
  if (!reg) return;
  const sub = await reg.pushManager.getSubscription();
  if (sub) await sub.unsubscribe();
}

// ── Supabase helpers ───────────────────────────────────────────────────────────

export async function getMySubscription(email) {
  const sb = getSupabaseBrowserClient();
  const { data } = await sb
    .from("push_subscriptions")
    .select("*")
    .eq("parent_email", email.toLowerCase())
    .maybeSingle();
  return data;
}

export async function saveSubscription(email, pushSub, overrides = {}) {
  const sb = getSupabaseBrowserClient();
  const existing = await getMySubscription(email);
  const row = {
    parent_email: email.toLowerCase(),
    subscription: pushSub.toJSON(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
  if (existing) {
    const { error } = await sb
      .from("push_subscriptions")
      .update(row)
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await sb.from("push_subscriptions").insert(row);
    if (error) throw error;
  }
}

export async function updateSubscriptionPrefs(email, prefs) {
  const sb = getSupabaseBrowserClient();
  const { error } = await sb
    .from("push_subscriptions")
    .update({ ...prefs, updated_at: new Date().toISOString() })
    .eq("parent_email", email.toLowerCase());
  if (error) throw error;
}
