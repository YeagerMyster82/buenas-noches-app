import { getSupabaseServerClient } from "./supabase-server";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function getVapidConfig() {
  const publicKey = process.env.VAPID_PUBLIC_KEY || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:BuenasNochesApp@quirokids.com";

  if (!publicKey || !privateKey) return null;
  return { publicKey, privateKey, subject };
}

async function getWebPush() {
  const config = getVapidConfig();
  if (!config) return null;

  const webPushModule = await import("web-push");
  const webPush = webPushModule.default || webPushModule;
  webPush.setVapidDetails(config.subject, config.publicKey, config.privateKey);
  return webPush;
}

export async function savePushSubscription({ email, role, subscription }) {
  const endpoint = subscription?.endpoint;
  if (!endpoint) {
    throw new Error("Missing push endpoint");
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("push_subscriptions")
    .upsert(
      {
        endpoint,
        parent_email: normalizeEmail(email),
        role: role === "admin" ? "admin" : "user",
        subscription,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "endpoint" }
    )
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function listSubscriptions({ email, role }) {
  const supabase = getSupabaseServerClient();
  let query = supabase
    .from("push_subscriptions")
    .select("id, endpoint, subscription, role, parent_email");

  if (role) query = query.eq("role", role);
  if (email) query = query.eq("parent_email", normalizeEmail(email));

  const { data, error } = await query.limit(200);
  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

async function deleteSubscription(id) {
  const supabase = getSupabaseServerClient();
  await supabase.from("push_subscriptions").delete().eq("id", id);
}

export async function sendPushToSubscriptions(subscriptions, payload) {
  const webPush = await getWebPush();
  if (!webPush || !subscriptions?.length) return { sent: 0, skipped: true };

  const message = JSON.stringify(payload);
  let sent = 0;

  await Promise.all(
    subscriptions.map(async (record) => {
      try {
        await webPush.sendNotification(record.subscription, message);
        sent += 1;
      } catch (error) {
        if (error.statusCode === 404 || error.statusCode === 410) {
          await deleteSubscription(record.id);
        }
      }
    })
  );

  return { sent };
}

export async function notifyAdmins(payload) {
  const subscriptions = await listSubscriptions({ role: "admin" });
  return sendPushToSubscriptions(subscriptions, payload);
}

export async function notifyAllUsers(payload) {
  const subscriptions = await listSubscriptions({ role: "user" });
  return sendPushToSubscriptions(subscriptions, payload);
}

export async function notifyUserByEmail(email, payload) {
  const subscriptions = await listSubscriptions({ email, role: "user" });
  return sendPushToSubscriptions(subscriptions, payload);
}
