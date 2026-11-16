import Stripe from "stripe";
import { PRODUCTS } from "../../../lib/products";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://mi.quirokids.com";

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const { productId, email } = await req.json();

    const product = PRODUCTS[productId];
    if (!product) {
      return Response.json({ error: "Producto no encontrado" }, { status: 400 });
    }
    if (!product.stripePriceId) {
      return Response.json({ error: "Precio no configurado aún" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: product.stripePriceId, quantity: 1 }],
      customer_email: email || undefined,
      metadata: { productId, accessKey: product.accessKey },
      success_url: `${BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/checkout/${productId}?cancelled=1`,
      payment_method_types: ["card"], // add "paypal" once enabled in Stripe dashboard
      locale: "es",
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return Response.json({ error: "Error al crear el pago" }, { status: 500 });
  }
}
