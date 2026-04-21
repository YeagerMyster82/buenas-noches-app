import { savePushSubscription } from "../../../lib/push-notifications";

export async function POST(request) {
  const payload = await request.json();

  try {
    const subscription = await savePushSubscription({
      email: payload.email,
      role: payload.role,
      subscription: payload.subscription,
    });

    return Response.json({ ok: true, subscription });
  } catch (error) {
    return Response.json({ error: error.message || "Could not save push subscription" }, { status: 400 });
  }
}
