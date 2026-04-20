import { deleteSupportMessage, getAdminDashboardData } from "../../../lib/community-data";

export async function POST(request) {
  const payload = await request.json();
  const expectedCode = process.env.BUENAS_NOCHES_ADMIN_CODE;
  const submittedCode = String(payload.adminCode || "").trim();

  if (!expectedCode) {
    return Response.json({ error: "Missing admin code environment variable" }, { status: 500 });
  }

  if (!submittedCode || submittedCode !== expectedCode) {
    return Response.json({ error: "Invalid admin code" }, { status: 401 });
  }

  if (payload.type === "delete_message") {
    const result = await deleteSupportMessage({ messageId: payload.messageId });
    return Response.json({ ok: true, result });
  }

  const data = await getAdminDashboardData();
  return Response.json(data);
}
