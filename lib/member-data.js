import { getSupabaseServerClient } from "./supabase-server";

export async function saveQuizResult({ parentEmail, childName, childBirthday, childGender, answers, primaryProfile, secondaryProfile }) {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("quiz_results")
    .insert({
      parent_email: parentEmail,
      answers: {
        childName,
        childBirthday,
        childGender,
        responses: answers,
      },
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

export async function updateQuizProfile({ parentEmail, quizResultId, childName, childBirthday, childGender }) {
  const supabase = getSupabaseServerClient();

  const { data: existing, error: readError } = await supabase
    .from("quiz_results")
    .select("answers")
    .eq("id", quizResultId)
    .eq("parent_email", parentEmail)
    .single();

  if (readError) {
    throw new Error(readError.message);
  }

  const currentAnswers = Array.isArray(existing.answers) ? { responses: existing.answers } : existing.answers || {};

  const { data, error } = await supabase
    .from("quiz_results")
    .update({
      answers: {
        ...currentAnswers,
        childName,
        childBirthday,
        childGender,
      },
    })
    .eq("id", quizResultId)
    .eq("parent_email", parentEmail)
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
        .limit(25),
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
    quizResults,
    latestDailyPlan: dailyPlans[0] || null,
    nightlyLogs,
  };
}
