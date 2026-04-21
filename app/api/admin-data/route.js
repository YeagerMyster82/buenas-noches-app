import { deleteSupportMessage, getAdminDashboardData, saveSupportReply } from "../../../lib/community-data";
import { notifyUserByEmail } from "../../../lib/push-notifications";

export async function POST(request) {
  try {
    const payload = await request.json();
    const expectedCode = String(process.env.BUENAS_NOCHES_ADMIN_CODE || "").trim();
    const submittedCode = String(payload.adminCode || "").trim();

    if (!expectedCode) {
      return Response.json({ error: "Falta configurar BUENAS_NOCHES_ADMIN_CODE en Vercel Production." }, { status: 500 });
    }

    if (!submittedCode || submittedCode !== expectedCode) {
      return Response.json({ error: "Código de admin incorrecto." }, { status: 401 });
    }

    if (payload.type === "delete_message") {
      const result = await deleteSupportMessage({ messageId: payload.messageId });
      return Response.json({ ok: true, result });
    }

    if (payload.type === "reply_message") {
      const reply = await saveSupportReply({
        messageId: payload.messageId,
        sender: "admin",
        message: payload.message,
      });

      if (payload.email) {
        try {
          await notifyUserByEmail(payload.email, {
            title: "Tienes una respuesta de Buenas Noches",
            body: "Joline respondió tu mensaje.",
            url: "/?section=contact",
          });
        } catch {
          // The reply should still be saved even if push is not configured yet.
        }
      }

      return Response.json({ ok: true, reply });
    }

    const data = await getAdminDashboardData();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: error.message || "No pude cargar el panel de admin. Revisa las tablas de Supabase." },
      { status: 500 }
    );
  }
}
