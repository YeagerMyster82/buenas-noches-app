import { listSupportMessagesForEmail, saveSupportMessage, saveSupportReply } from "../../../lib/community-data";
import { notifyAdmins } from "../../../lib/push-notifications";
import { sendAdminEmail } from "../../../lib/email";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return Response.json({ messages: [] });
  }

  try {
    const messages = await listSupportMessagesForEmail(email);
    return Response.json({ messages });
  } catch (error) {
    return Response.json({ error: error.message || "Could not load messages" }, { status: 400 });
  }
}

export async function POST(request) {
  const payload = await request.json();

  try {
    if (payload.type === "reply") {
      const reply = await saveSupportReply({
        messageId: payload.messageId,
        sender: "user",
        message: payload.message,
      });

      try {
        await notifyAdmins({
          title: "Nuevo mensaje en Buenas Noches",
          body: "Una familia respondió en Contáctanos.",
          url: "/?section=admin",
        });
      } catch {
        // push optional
      }

      await sendAdminEmail({
        subject: "💬 Respuesta de usuario — Buenas Noches",
        html: `
          <h2>Un usuario respondió en Contáctanos</h2>
          <p><strong>Mensaje:</strong></p>
          <blockquote>${payload.message || "—"}</blockquote>
          <p><a href="https://app.quirokids.com/?section=admin">Ver en el panel de admin →</a></p>
        `,
      }).catch(() => {});

      return Response.json({ ok: true, reply });
    }

    const message = await saveSupportMessage({
      parentEmail: payload.email,
      parentName: payload.parentName,
      childName: payload.childName,
      topic: payload.topic,
      message: payload.message,
    });

    try {
      await notifyAdmins({
        title: "Nuevo mensaje en Buenas Noches",
        body: `${payload.email || "Una familia"} envió un mensaje.`,
        url: "/?section=admin",
      });
    } catch {
      // push optional
    }

    await sendAdminEmail({
      subject: `💬 Nuevo mensaje — ${payload.parentName || payload.email || "Usuario"}`,
      html: `
        <h2>Nuevo mensaje de soporte</h2>
        <p><strong>Nombre:</strong> ${payload.parentName || "—"}</p>
        <p><strong>Email:</strong> ${payload.email || "—"}</p>
        <p><strong>Niño:</strong> ${payload.childName || "—"}</p>
        <p><strong>Tema:</strong> ${payload.topic || "—"}</p>
        <p><strong>Mensaje:</strong></p>
        <blockquote>${payload.message || "—"}</blockquote>
        <p><a href="https://app.quirokids.com/?section=admin">Ver en el panel de admin →</a></p>
      `,
    }).catch(() => {});

    return Response.json({ ok: true, message });
  } catch (error) {
    return Response.json({ error: error.message || "Could not send message" }, { status: 400 });
  }
}
