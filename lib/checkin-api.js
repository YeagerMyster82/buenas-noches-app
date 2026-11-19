import { getSupabaseBrowserClient } from "./supabase-client";

const sb = getSupabaseBrowserClient();

export async function getTodayCheckin(email) {
  const today = new Date().toISOString().split("T")[0];
  const { data } = await sb
    .from("daily_checkins")
    .select("*")
    .eq("parent_email", email)
    .eq("checkin_date", today)
    .maybeSingle();
  return data;
}

export async function upsertCheckin(email, fields) {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await sb
    .from("daily_checkins")
    .upsert(
      { parent_email: email, checkin_date: today, ...fields },
      { onConflict: "parent_email,checkin_date" }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getCheckinHistory(email, days = 30) {
  const since = new Date(Date.now() - days * 86400000).toISOString().split("T")[0];
  const { data } = await sb
    .from("daily_checkins")
    .select("*")
    .eq("parent_email", email)
    .gte("checkin_date", since)
    .order("checkin_date", { ascending: false });
  return data || [];
}

export async function getNEStreak(email) {
  const history = await getCheckinHistory(email, 90);
  const doneSet = new Set(
    history.filter(r => r.ne_exercises_done).map(r => r.checkin_date)
  );
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 90; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    if (doneSet.has(key)) streak++;
    else break;
  }
  return streak;
}

export async function getNightlyLogs(email, days = 30) {
  const since = new Date(Date.now() - days * 86400000).toISOString().split("T")[0];
  const { data } = await sb
    .from("nightly_logs")
    .select("*")
    .eq("user_email", email)
    .gte("log_date", since)
    .order("log_date", { ascending: false });
  return data || [];
}
