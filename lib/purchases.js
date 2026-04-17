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
