import { upsertPurchaseAccess } from "../../../lib/purchases";

// GoHighLevel sends order webhooks with this shape (verify in GHL → Settings → Webhooks → test payload):
// {
//   "type": "OrderSubmitted",   or "OrderFulfilled"
//   "locationId": "...",
//   "contact": { "email": "...", "firstName": "...", "lastName": "..." },
//   "order": {
//     "id": "...",
//     "contactId": "...",
//     "products": [{ "name": "...", "productId": "..." }]
//   }
// }

const GHL_WEBHOOK_SECRET = process.env.GHL_WEBHOOK_SECRET;

// Map GHL product IDs (or names) to our Supabase access keys
// Fill these in once you know your GHL product IDs
const PRODUCT_ACCESS_MAP = {
  // by product ID:
  // "ghl_product_id_here": "buenas_noches_anual",

  // fallback by name match (case-insensitive substring):
  "buenas noches": "buenas_noches_anual",
  "neuroesencia": "neuroesencia",
  "bundle": "bundle",
};

function resolveAccessKey(products = []) {
  for (const p of products) {
    // Check by product ID first
    if (PRODUCT_ACCESS_MAP[p.productId]) {
      return PRODUCT_ACCESS_MAP[p.productId];
    }
    // Fall back to name match
    const nameLower = (p.name || "").toLowerCase();
    for (const [keyword, accessKey] of Object.entries(PRODUCT_ACCESS_MAP)) {
      if (nameLower.includes(keyword)) {
        return accessKey;
      }
    }
  }
  return null;
}

export async function POST(req) {
  // Optional: verify shared secret sent as a header or query param from GHL
  const secret = req.headers.get("x-ghl-secret") || new URL(req.url).searchParams.get("secret");
  if (GHL_WEBHOOK_SECRET && secret !== GHL_WEBHOOK_SECRET) {
    console.error("GHL webhook: invalid secret");
    return new Response("Unauthorized", { status: 401 });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  console.log("GHL webhook received:", JSON.stringify(payload, null, 2));

  // Extract email — GHL order webhooks put it in contact.email
  const email =
    payload?.contact?.email ||
    payload?.email ||
    payload?.customer?.email;

  if (!email) {
    console.error("GHL webhook: no email found in payload");
    return new Response("No email", { status: 400 });
  }

  // Extract products
  const products =
    payload?.order?.products ||
    payload?.products ||
    [];

  const accessKey = resolveAccessKey(products);

  if (!accessKey) {
    // Log it but return 200 so GHL doesn't keep retrying
    console.warn("GHL webhook: no matching access key for products", products);
    return new Response("ok - no matching product", { status: 200 });
  }

  const orderId = payload?.order?.id || payload?.id || "ghl-" + Date.now();

  try {
    await upsertPurchaseAccess({
      email: email.trim().toLowerCase(),
      productId: accessKey,
      orderId,
      purchaseStatus: "paid",
      rawPayload: payload,
    });
    console.log(`GHL access granted: ${email} → ${accessKey}`);
  } catch (err) {
    console.error("GHL webhook: DB error", err);
    return new Response("DB error", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}
