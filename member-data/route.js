import { getMemberData, saveDailyPlan, saveNightlyLog, saveQuizResult } from "../../../lib/member-data";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim().toLowerCase();

  if (!email) {
    return Response.json({ error: "Missing email" }, { status: 400 });
  }

  const data = await getMemberData(email);
  return Response.json(data);
}

export async function POST(request) {
  const payload = await request.json();
  const email = payload.email?.trim().toLowerCase();

  if (!email || !payload.type) {
    return Response.json({ error: "Missing email or type" }, { status: 400 });
  }

  if (payload.type === "quiz_result") {
    const result = await saveQuizResult({
      parentEmail: email,
      answers: payload.answers || [],
      primaryProfile: payload.primaryProfile,
      secondaryProfile: payload.secondaryProfile || null,
    });
    return Response.json({ ok: true, result });
  }

  if (payload.type === "daily_plan") {
    const result = await saveDailyPlan({
      parentEmail: email,
      wakeTime: payload.wakeTime,
      napTaken: Boolean(payload.napTaken),
      napWakeTime: payload.napWakeTime || null,
      dinnerTime: payload.dinnerTime,
      routineStart: payload.routineStart,
      bedtime: payload.bedtime,
      steps: payload.steps || [],
    });
    return Response.json({ ok: true, result });
  }

  if (payload.type === "nightly_log") {
    const result = await saveNightlyLog({
      parentEmail: email,
      logDate: payload.logDate,
      inBedAt: payload.inBedAt,
      fellAsleepAt: payload.fellAsleepAt,
      sleepLatencyMinutes: payload.sleepLatencyMinutes,
      notes: payload.notes || "",
      ratings: payload.ratings || [],
    });
    return Response.json({ ok: true, result });
  }

  return Response.json({ error: "Unknown type" }, { status: 400 });
}
