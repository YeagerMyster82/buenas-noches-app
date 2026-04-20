import {
  deleteQuizProfile,
  getMemberData,
  saveDailyPlan,
  saveNightlyLog,
  saveQuizResult,
  updateNightWakings,
  updateQuizProfile,
} from "../../../lib/member-data";

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
      clientChildId: payload.childId || null,
      childName: payload.childName || "",
      childBirthday: payload.childBirthday || "",
      childGender: payload.childGender || "boy",
      answers: payload.answers || [],
      primaryProfile: payload.primaryProfile,
      secondaryProfile: payload.secondaryProfile || null,
    });
    return Response.json({ ok: true, result });
  }

  if (payload.type === "update_child_profile") {
    const result = await updateQuizProfile({
      parentEmail: email,
      quizResultId: payload.childId,
      childName: payload.childName || "",
      childBirthday: payload.childBirthday || "",
      childGender: payload.childGender || "boy",
    });
    return Response.json({ ok: true, result });
  }

  if (payload.type === "delete_child_profile") {
    const result = await deleteQuizProfile({
      parentEmail: email,
      quizResultId: payload.childId,
    });
    return Response.json({ ok: true, result });
  }

  if (payload.type === "daily_plan") {
    const result = await saveDailyPlan({
      parentEmail: email,
      childId: payload.childId || null,
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
      childId: payload.childId || null,
      logDate: payload.logDate,
      routineStartTime: payload.routineStartTime || null,
      inBedAt: payload.inBedAt,
      fellAsleepAt: payload.fellAsleepAt,
      sleepLatencyMinutes: payload.sleepLatencyMinutes,
      nightWakings: payload.nightWakings || "0",
      notes: payload.notes || "",
      ratings: payload.ratings || [],
    });
    return Response.json({ ok: true, result });
  }

  if (payload.type === "update_night_wakings") {
    const result = await updateNightWakings({
      parentEmail: email,
      childId: payload.childId,
      logDate: payload.logDate,
      nightWakings: payload.nightWakings || "0",
    });
    return Response.json({ ok: true, result });
  }

  return Response.json({ error: "Unknown type" }, { status: 400 });
}
