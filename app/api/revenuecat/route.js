import { createClient } from "../../../lib/supabase-server";

// RevenueCat webhook — mirrors pattern from captivationhub/route.js
// Events: INITIAL_PURCHASE, RENEWAL, CANCELLATION, EXPIRATION, BILLING_ISSUE
export async function POST(request) {
  const secret = request.headers.get("x-revenuecat-secret");

  if (!process.env.REVENUECAT_WEBHOOK_SECRET) {
    return Response.json({ error: "Missing REVENUECAT_WEBHOOK_SECRET env var" }, { status: 500 });
  }

  if (secret !== process.env.REVENUECAT_WEBHOOK_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = await request.json();
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

  const supabase = createClient();

  // Upsert into app_subscriptions table
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

  console.log(`RevenueCat ${eventType} for ${email} → ${subscriptionStatus}`);
  return Response.json({ received: true, status: subscriptionStatus });
}
