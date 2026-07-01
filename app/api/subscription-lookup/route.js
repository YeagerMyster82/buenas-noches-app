import { getPremiumAccessByEmail } from "../../../lib/purchases";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const adminCode = searchParams.get("adminCode");
  const assistantCode = searchParams.get("assistantCode");

  const validAdmin = String(process.env.BUENAS_NOCHES_ADMIN_CODE || "").trim();
  const validAssistant = String(process.env.BUENAS_NOCHES_ASSISTANT_CODE || "").trim();

  const isAdmin = validAdmin && adminCode === validAdmin;
  const isAssistant = validAssistant && assistantCode === validAssistant;

  if (!isAdmin && !isAssistant) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  if (!email) {
    return Response.json({ error: "Se requiere un email." }, { status: 400 });
  }

  try {
    const result = await getPremiumAccessByEmail(email);
    const sub = result.nativeSubscription;
    const legacy = result.purchases || [];

    return Response.json({
      email,
      plan_type: sub?.plan_type ?? (legacy.length > 0 ? "lifetime" : null),
      subscription_status: sub?.subscription_status ?? (legacy.length > 0 ? "active" : "none"),
      is_active: result.hasAccess,
      expires_at: sub?.expires_at ?? null,
      legacy_access: legacy.length > 0,
    });
  } catch (err) {
    return Response.json({ error: err.message || "Error al buscar suscripción." }, { status: 500 });
  }
}
