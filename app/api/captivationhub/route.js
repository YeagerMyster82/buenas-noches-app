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
    findFirstValue(payload, [
      "email",
      "contact_email",
      "contactEmail",
      "contact.email",
      "email_address",
    ])
  );
  const productId = findFirstValue(payload, [
    "product_id",
    "productId",
    "offer_id",
    "offerId",
    "product_name",
    "productName",
    "offer_name",
    "offerName",
  ]);
  const purchaseStatus =
    findFirstValue(payload, [
      "purchase_status",
      "purchaseStatus",
      "order_status",
      "orderStatus",
      "status",
    ]) || "paid";

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

function findFirstValue(input, keys) {
  if (!input || typeof input !== "object") return "";

  for (const key of keys) {
    if (typeof input[key] === "string" && input[key].trim()) {
      return input[key].trim();
    }
  }

  for (const value of Object.values(input)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        const nested = findFirstValue(item, keys);
        if (nested) return nested;
      }
      continue;
    }

    if (value && typeof value === "object") {
      const nested = findFirstValue(value, keys);
      if (nested) return nested;
    }
  }

  return "";
}
