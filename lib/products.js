// Fill in Stripe Price IDs once you create products in the Stripe dashboard.
// Dashboard → Products → Add product → copy the "Price ID" (starts with price_)
//
// For PayPal: Stripe supports PayPal as a payment method in Checkout.
// Enable it in Stripe Dashboard → Settings → Payment methods → PayPal.

export const PRODUCTS = {
  neuroesencia: {
    id: "neuroesencia",
    name: "NeuroEsencia",
    description: "Reflejos primitivos: evalúa e integra",
    stripePriceId: process.env.STRIPE_PRICE_NEUROESENCIA || null, // e.g. "price_1ABC..."
    accessKey: "neuroesencia", // stored in purchase_access.product_id
  },
  "buenas-noches": {
    id: "buenas-noches",
    name: "Buenas Noches",
    description: "Curso + App de sueño infantil",
    stripePriceId: process.env.STRIPE_PRICE_BUENAS_NOCHES || null,
    accessKey: "buenas_noches_anual",
  },
  bundle: {
    id: "bundle",
    name: "Bundle: NeuroEsencia + Buenas Noches",
    description: "Los dos cursos juntos",
    stripePriceId: process.env.STRIPE_PRICE_BUNDLE || null,
    accessKey: "bundle",
  },
};
