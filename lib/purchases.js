import { getSupabaseServerClient } from "./supabase-server";

export async function upsertPurchaseAccess({ email, productId, orderId, purchaseStatus, rawPayload }) {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("purchase_access")
    .upsert(
      {
        email,
        product_id: productId,
        order_id: orderId,
        purchase_status: purchaseStatus,
        raw_payload: rawPayload,
        premium_unlocked: purchaseStatus === "paid" || purchaseStatus === "active",
      },
      {
        onConflict: "email,product_id",
      }
    )
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getPremiumAccessByEmail(email) {
  const supabase = getSupabaseServerClient();

  // Check purchase_access table (legacy + manual grants + trials + lifetime)
  const { data: legacyData, error: legacyError } = await supabase
    .from("purchase_access")
    .select("email, product_id, purchase_status, premium_unlocked, plan_type, trial_expires_at, updated_at")
    .eq("email", email)
    .order("updated_at", { ascending: false });

  if (legacyError) {
    throw new Error(legacyError.message);
  }

  const now = new Date().toISOString();
  const hasLegacyAccess = legacyData.some(row => {
    if (row.plan_type === "lifetime") return true;
    if (row.plan_type === "trial" && row.trial_expires_at && row.trial_expires_at > now) return true;
    return row.premium_unlocked === true;
  });

  // Also check app_subscriptions table (RevenueCat native IAP)
  const { data: subData } = await supabase
    .from("app_subscriptions")
    .select("email, product_id, subscription_status, is_active, plan_type, expires_at")
    .eq("email", email)
    .eq("is_active", true)
    .maybeSingle();

  const hasNativeSubscription = !!subData;

  return {
    hasAccess: hasLegacyAccess || hasNativeSubscription,
    purchases: legacyData,
    nativeSubscription: subData || null,
  };
}
