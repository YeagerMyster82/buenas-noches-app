import { getSupabaseServerClient } from "./supabase-server";

export async function saveQuizResult({ parentEmail, answers, primaryProfile, secondaryProfile }) {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("quiz_results")
    .insert({
      parent_email: parentEmail,
      answers,
      primary_profile: primaryProfile,
      secondary_profile: secondaryProfile,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function saveDailyPlan({
  parentEmail,
  wakeTime,
  napTaken,
  napWakeTime,
  dinnerTime,
  routineStart,
  bedtime,
  steps,
}) {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("daily_plans")
    .insert({
      parent_email: parentEmail,
      wake_time: wakeTime,
      nap_taken: napTaken,
      nap_wake_time: napWakeTime || null,
      dinner_time: dinnerTime,
      routine_start: routineStart,
      bedtime,
      steps,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function saveNightlyLog({ parentEmail, logDate, inBedAt, fellAsleepAt, sleepLatencyMinutes, notes, ratings }) {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("nightly_logs")
    .insert({
      parent_email: parentEmail,
      log_date: logDate,
      in_bed_at: inBedAt,
      fell_asleep_at: fellAsleepAt,
      sleep_latency_minutes: sleepLatencyMinutes,
      notes,
      ratings,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getMemberData(parentEmail) {
  const supabase = getSupabaseServerClient();

  const [{ data: quizResults, error: quizError }, { data: dailyPlans, error: planError }, { data: nightlyLogs, error: logError }] =
    await Promise.all([
      supabase
        .from("quiz_results")
        .select("id, answers, primary_profile, secondary_profile, created_at")
        .eq("parent_email", parentEmail)
        .order("created_at", { ascending: false })
        .limit(1),
      supabase
        .from("daily_plans")
        .select("id, wake_time, nap_taken, nap_wake_time, dinner_time, routine_start, bedtime, steps, created_at")
        .eq("parent_email", parentEmail)
        .order("created_at", { ascending: false })
        .limit(1),
      supabase
        .from("nightly_logs")
        .select("id, log_date, in_bed_at, fell_asleep_at, sleep_latency_minutes, notes, ratings, created_at")
        .eq("parent_email", parentEmail)
        .order("log_date", { ascending: false }),
    ]);

  if (quizError || planError || logError) {
    throw new Error(quizError?.message || planError?.message || logError?.message);
  }

  return {
    latestQuizResult: quizResults[0] || null,
    latestDailyPlan: dailyPlans[0] || null,
    nightlyLogs,
  };
}
