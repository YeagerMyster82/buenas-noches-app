import { upsertPurchaseAccess } from "../../../lib/purchases";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function POST(req) {
  // Verify shared secret
  const secret =
    req.headers.get("x-admin-secret") ||
    new URL(req.url).searchParams.get("secret");

  if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  // Accept a single email or an array of emails
  const emails = Array.isArray(body.email) ? body.email : [body.email];
  const productId = body.productId || "buenas_noches_anual";

  if (!emails.length || !emails[0]) {
    return new Response("email is required", { status: 400 });
  }

  const results = [];
  for (const email of emails) {
    try {
      await upsertPurchaseAccess({
        email: email.trim().toLowerCase(),
        productId,
        orderId: `manual-${Date.now()}`,
        purchaseStatus: "lifetime",
        rawPayload: { source: "manual-grant", grantedAt: new Date().toISOString() },
      });
      results.push({ email, status: "granted" });
      console.log(`Manual lifetime access granted: ${email} → ${productId}`);
    } catch (err) {
      results.push({ email, status: "error", error: err.message });
    }
  }

  return Response.json({ results });
}
