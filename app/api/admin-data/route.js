import { deleteSupportMessage, getAdminDashboardData } from "../../../lib/community-data";

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

    const data = await getAdminDashboardData();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: error.message || "No pude cargar el panel de admin. Revisa las tablas de Supabase." },
      { status: 500 }
    );
  }
}
