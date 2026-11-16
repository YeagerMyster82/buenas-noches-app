import Stripe from "stripe";
import { upsertPurchaseAccess } from "../../../lib/purchases";

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return new Response(`Webhook error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_details?.email || session.customer_email;
    const { productId, accessKey } = session.metadata || {};

    if (!email || !accessKey) {
      console.error("Missing email or accessKey in session metadata", session.id);
      return new Response("Missing metadata", { status: 400 });
    }

    try {
      await upsertPurchaseAccess({
        email: email.trim().toLowerCase(),
        productId: accessKey,
        orderId: session.id,
        purchaseStatus: "paid",
        rawPayload: session,
      });
      console.log(`Access granted: ${email} → ${accessKey}`);
    } catch (err) {
      console.error("Failed to grant access:", err);
      return new Response("DB error", { status: 500 });
    }
  }

  return new Response("ok", { status: 200 });
}

