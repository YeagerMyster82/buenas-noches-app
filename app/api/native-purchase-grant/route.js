import { getSupabaseServerClient } from "../../../lib/supabase-server";

// Called immediately after a successful native IAP purchase.
// The RevenueCat webhook can be delayed by seconds or minutes, so this
// writes directly to Supabase to grant access right away.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return Response.json({ error: "Missing email" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const now = new Date().toISOString();

  // Upsert into app_subscriptions (same schema the RevenueCat webhook writes)
  const { error: subError } = await supabase
    .from("app_subscriptions")
    .upsert({
      email,
      subscription_status: "active",
      is_active: true,
      plan_type: "unknown",
      revenuecat_event_type: "INITIAL_PURCHASE",
      updated_at: now,
    }, { onConflict: "email" });

  if (subError) {
    console.error("native-purchase-grant sub error", subError);
  }

  // Also upsert into purchase_access for backward compatibility
  const { error: paError } = await supabase
    .from("purchase_access")
    .upsert({
      email,
      premium_unlocked: true,
      purchase_status: "paid",
      source: "native_iap_immediate",
      updated_at: now,
    }, { onConflict: "email" });

  if (paError) {
    console.error("native-purchase-grant pa error", paError);
  }

  return Response.json({ granted: true });
}
