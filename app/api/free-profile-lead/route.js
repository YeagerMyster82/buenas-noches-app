export async function POST(request) {
  const payload = await request.json();
  const webhookUrl = process.env.CAPTIVATION_HUB_FREE_PROFILE_WEBHOOK_URL;

  if (!payload.email || !payload.parentName || !payload.sleepProfile) {
    return Response.json({ error: "Missing required lead fields" }, { status: 400 });
  }

  if (!webhookUrl) {
    return Response.json({ ok: true, skipped: true });
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_name: payload.parentName,
      email: payload.email,
      child_name: payload.childName,
      child_gender: payload.childGender,
      child_age: payload.childAge,
      sleep_profile: payload.sleepProfile,
      primary_profile: payload.primaryProfile,
      secondary_profile: payload.secondaryProfile,
      source: "buenas_noches_free_profile",
    }),
  });

  if (!response.ok) {
    return Response.json({ error: "Captivation Hub webhook failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
