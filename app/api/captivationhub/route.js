import { upsertPurchaseAccess } from "../../../lib/purchases";

export async function POST(request) {
  const payload = await request.json();
  const secret = request.headers.get("x-bn-secret");

  if (!process.env.CAPTIVATION_HUB_WEBHOOK_SECRET) {
    return Response.json({ error: "Missing webhook secret" }, { status: 500 });
  }

  if (secret !== process.env.CAPTIVATION_HUB_WEBHOOK_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = payload.email?.trim().toLowerCase();
  const productId = payload.product_id || payload.offer_id || payload.product_name;

  if (!email || !productId) {
    return Response.json({ error: "Missing email or product" }, { status: 400 });
  }

  const result = await upsertPurchaseAccess({
    email,
    productId,
    orderId: payload.order_id || null,
    purchaseStatus: payload.purchase_status || "paid",
    rawPayload: payload,
  });

  return Response.json({ ok: true, result });
}
