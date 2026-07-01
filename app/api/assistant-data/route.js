import { getAdminDashboardData, saveSupportReply } from "../../../lib/community-data";
import { notifyUserByEmail } from "../../../lib/push-notifications";
import { sendAdminEmail } from "../../../lib/email";

export async function POST(request) {
  const payload = await request.json();
  const expectedCode = String(process.env.BUENAS_NOCHES_ASSISTANT_CODE || "").trim();
  const submitted = String(payload.assistantCode || "").trim();

  if (!expectedCode) {
    return Response.json({ error: "Falta BUENAS_NOCHES_ASSISTANT_CODE en Vercel." }, { status: 500 });
  }
  if (!submitted || submitted !== expectedCode) {
    return Response.json({ error: "Codigo de asistente incorrecto." }, { status: 401 });
  }

  if (payload.type === "reply_message") {
    const reply = await saveSupportReply({
      messageId: payload.messageId,
      sender: "admin",
      message: payload.message,
    });

    if (payload.email) {
      await notifyUserByEmail(payload.email, {
        title: "Buenas Noches",
        body: "Tienes una respuesta en Contactanos.",
        url: "/?section=contact",
      }).catch(() => {});

      await sendAdminEmail({
        subject: "Respuesta enviada por asistente",
        html: `<p>Asistente respondio a <strong>${payload.email}</strong>:</p><blockquote>${payload.message}</blockquote>`,
      }).catch(() => {});
    }

    return Response.json({ ok: true, reply });
  }

  // Default: return messages list only (no KPIs, no user data)
  const data = await getAdminDashboardData();
  return Response.json({ messages: data.messages || [] });
}
