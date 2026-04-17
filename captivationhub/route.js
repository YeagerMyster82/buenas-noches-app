import { upsertPurchaseAccess } from "../../../lib/purchases";

export async function POST(request) {
  const secret = request.headers.get("x-bn-secret");

  if (!process.env.CAPTIVATION_HUB_WEBHOOK_SECRET) {
    return Response.json({ error: "Missing webhook secret" }, { status: 500 });
  }

  if (secret !== process.env.CAPTIVATION_HUB_WEBHOOK_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await parsePayload(request);
  console.log("captivationhub webhook payload", payload);
  const email = normalizeEmail(
    payload.email ||
      payload.contact_email ||
      payload.contactEmail ||
      payload["contact.email"] ||
      payload.email_address
  );
  const productId =
    payload.product_id ||
    payload.productId ||
    payload.offer_id ||
    payload.offerId ||
    payload.product_name ||
    payload.productName ||
    payload.offer_name ||
    payload.offerName;
  const purchaseStatus =
    payload.purchase_status ||
    payload.purchaseStatus ||
    payload.order_status ||
    payload.orderStatus ||
    "paid";

  if (!email || !productId) {
    console.log("captivationhub missing required fields", {
      email,
      productId,
      receivedKeys: Object.keys(payload),
    });
    return Response.json(
      {
        error: "Missing email or product",
        receivedKeys: Object.keys(payload),
      },
      { status: 400 }
    );
  }

  const result = await upsertPurchaseAccess({
    email,
    productId,
    orderId: payload.order_id || payload.orderId || null,
    purchaseStatus,
    rawPayload: payload,
  });

  return Response.json({ ok: true, result });
}

async function parsePayload(request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return await request.json();
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    return Object.fromEntries(form.entries());
  }

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    return Object.fromEntries(form.entries());
  }

  const rawText = await request.text();
  if (!rawText) return {};

  try {
    return JSON.parse(rawText);
  } catch {
    const params = new URLSearchParams(rawText);
    const entries = Object.fromEntries(params.entries());
    return entries;
  }
}

function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}
