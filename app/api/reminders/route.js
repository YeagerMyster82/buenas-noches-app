import { notifyAllUsers } from "../../../lib/push-notifications";

const reminderCopy = {
  routine: {
    title: "Buenas Noches",
    body: "¿Quieres preparar la rutina de esta noche?",
    url: "/?section=home",
  },
  night_wakings: {
    title: "Buenas Noches",
    body: "Registra despertares nocturnos y la hora en que se despertó hoy para mantener su progreso al día.",
    url: "/?section=home",
  },
};

export async function POST(request) {
  const payload = await request.json().catch(() => ({}));
  const expectedSecret = process.env.BUENAS_NOCHES_CRON_SECRET;

  if (expectedSecret && payload.secret !== expectedSecret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reminder = reminderCopy[payload.type] || reminderCopy.routine;

  try {
    const result = await notifyAllUsers(reminder);
    return Response.json({ ok: true, result });
  } catch (error) {
    return Response.json({ error: error.message || "Could not send reminder" }, { status: 400 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const expectedSecret = process.env.BUENAS_NOCHES_CRON_SECRET;

  if (expectedSecret && searchParams.get("secret") !== expectedSecret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reminder = reminderCopy[searchParams.get("type")] || reminderCopy.routine;

  try {
    const result = await notifyAllUsers(reminder);
    return Response.json({ ok: true, result });
  } catch (error) {
    return Response.json({ error: error.message || "Could not send reminder" }, { status: 400 });
  }
}
