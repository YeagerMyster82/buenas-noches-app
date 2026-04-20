import { saveSupportMessage } from "../../../lib/community-data";

export async function POST(request) {
  const payload = await request.json();

  try {
    const message = await saveSupportMessage({
      parentEmail: payload.email,
      parentName: payload.parentName,
      childName: payload.childName,
      topic: payload.topic,
      message: payload.message,
    });

    return Response.json({ ok: true, message });
  } catch (error) {
    return Response.json({ error: error.message || "Could not send message" }, { status: 400 });
  }
}
