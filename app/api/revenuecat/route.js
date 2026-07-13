import { getSupabaseServerClient } from "../../../lib/supabase-server";

// RevenueCat webhook — mirrors pattern from captivationhub/route.js
// Events: INITIAL_PURCHASE, RENEWAL, CANCELLATION, EXPIRATION, BILLING_ISSUE
export async function POST(request) {
  const sigHeader = request.headers.get("x-revenuecat-webhook-signature");
  const rawBody = await request.text();

  if (process.env.REVENUECAT_WEBHOOK_SECRET && sigHeader) {
    const parts = Object.fromEntries(sigHeader.split(",").map(p => p.split("=")));
    const timestamp = parts["t"];
    const v1 = parts["v1"];
    const { createHmac } = await import("crypto");
    const expected = createHmac("sha256", process.env.REVENUECAT_WEBHOOK_SECRET)
      .update(`${timestamp}.${rawBody}`)
      .digest("hex");
    if (v1 !== expected) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else if (process.env.REVENUECAT_WEBHOOK_SECRET && !sigHeader) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }


  const event = payload?.event;
  if (!event) {
    return Response.json({ error: "No event in payload" }, { status: 400 });
  }

  const email = String(
    event.app_user_id ||
    event.original_app_user_id ||
    event.aliases?.[0] ||
    ""
  ).trim().toLowerCase();

  if (!email) {
    return Response.json({ error: "Could not determine email from event" }, { status: 400 });
  }

  const eventType = String(event.type || "").toUpperCase();
  const productId = String(event.product_id || "");
  const isMonthly = productId.includes("monthly");
  const isAnnual = productId.includes("annual") || productId.includes("yearly");

  // Map RevenueCat event types to subscription status
  const statusMap = {
    INITIAL_PURCHASE: "active",
    RENEWAL: "active",
    CANCELLATION: "canceled",
    EXPIRATION: "expired",
    BILLING_ISSUE: "past_due",
    PRODUCT_CHANGE: "active",
    UNCANCELLATION: "active",
  };

  const subscriptionStatus = statusMap[eventType] || "unknown";
  const isActive = subscriptionStatus === "active";

  const expiresAt = event.expiration_at_ms
    ? new Date(event.expiration_at_ms).toISOString()
    : null;
  const renewsAt = event.renewal_number && expiresAt ? expiresAt : null;

  const supabase = getSupabaseServerClient();

  // Upsert into app_subscriptions table
  const priceUsd = typeof event.price === "number" ? event.price : null;

  const { error: upsertError } = await supabase
    .from("app_subscriptions")
    .upsert({
      email,
      product_id: productId,
      subscription_status: subscriptionStatus,
      is_active: isActive,
      plan_type: isMonthly ? "monthly" : isAnnual ? "annual" : "unknown",
      expires_at: expiresAt,
      renews_at: renewsAt,
      revenuecat_event_type: eventType,
      ...(priceUsd !== null ? { price_usd: priceUsd } : {}),
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "email",
    });

  if (upsertError) {
    console.error("RevenueCat webhook upsert error", upsertError);
    return Response.json({ error: upsertError.message }, { status: 500 });
  }

  // If active, also upsert into purchase_access for backward compatibility
  if (isActive) {
    await supabase
      .from("purchase_access")
      .upsert({
        email,
        product_id: productId,
        premium_unlocked: true,
        purchase_status: "paid",
        source: "revenuecat",
        updated_at: new Date().toISOString(),
      }, { onConflict: "email" })
      .then(({ error }) => {
        if (error) console.error("purchase_access upsert error", error);
      });
  }

  // Notify Captivation Hub on purchase/renewal/cancellation
  const captivationUrl = process.env.CAPTIVATION_HUB_FREE_PROFILE_WEBHOOK_URL;
  if (captivationUrl && ["INITIAL_PURCHASE", "RENEWAL", "CANCELLATION", "EXPIRATION", "UNCANCELLATION"].includes(eventType)) {
    const planLabel = isMonthly ? "mensual" : isAnnual ? "anual" : "unknown";
    fetch(captivationUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        source: "revenuecat_purchase",
        subscription_status: subscriptionStatus,
        plan_type: planLabel,
        event_type: eventType,
        product_id: productId,
      }),
    }).catch((err) => console.error("Captivation Hub notify error", err));
  }

  console.log(`RevenueCat ${eventType} for ${email} → ${subscriptionStatus}`);
  return Response.json({ received: true, status: subscriptionStatus });
}
