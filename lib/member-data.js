import { getSupabaseServerClient } from "./supabase-server";
import { calculateAgeFromBirthday } from "./routine";

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ""));
}

export async function saveQuizResult({
  parentEmail,
  clientChildId,
  childName,
  childBirthday,
  childGender,
  parentName,
  sleepGoal,
  takesNap,
  createdAt,
  isFreeProfile,
  answers,
  primaryProfile,
  secondaryProfile,
}) {
  const supabase = getSupabaseServerClient();
  let childId = isUuid(clientChildId) ? clientChildId : null;
  const answerMetadata = Array.isArray(answers) ? { responses: answers } : answers || {};

  if (childId) {
    const { data: child, error: childError } = await supabase
      .from("children")
      .upsert(
        {
          id: childId,
          parent_email: parentEmail,
          child_name: childName,
          age_years: calculateAgeFromBirthday(childBirthday),
          primary_profile: primaryProfile,
          secondary_profile: secondaryProfile || null,
        },
        { onConflict: "id" }
      )
      .select("id")
      .single();

    if (childError) {
      throw new Error(childError.message);
    }

    childId = child.id;
  } else {
    const { data: child, error: childError } = await supabase
      .from("children")
      .insert({
        parent_email: parentEmail,
        child_name: childName,
        age_years: calculateAgeFromBirthday(childBirthday),
        primary_profile: primaryProfile,
        secondary_profile: secondaryProfile || null,
      })
      .select("id")
      .single();

    if (childError) {
      throw new Error(childError.message);
    }

    childId = child.id;
  }

  const { data, error } = await supabase
    .from("quiz_results")
    .insert({
      parent_email: parentEmail,
      child_id: childId,
      answers: {
        ...answerMetadata,
        parentName,
        childName,
        childBirthday,
        childGender,
        sleepGoal,
        takesNap,
        createdAt,
        isFreeProfile,
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

export async function updateQuizProfile({ parentEmail, quizResultId, childName, childBirthday, childGender, sleepGoal, takesNap }) {
  const supabase = getSupabaseServerClient();

  const { data: existing, error: readError } = await supabase
    .from("quiz_results")
    .select("id, child_id, answers")
    .or(`id.eq.${quizResultId},child_id.eq.${quizResultId}`)
    .eq("parent_email", parentEmail)
    .single();

  if (readError) {
    throw new Error(readError.message);
  }

  const currentAnswers = Array.isArray(existing.answers) ? { responses: existing.answers } : existing.answers || {};

  if (existing.child_id) {
    const { error: childError } = await supabase
      .from("children")
      .update({
        child_name: childName,
        age_years: calculateAgeFromBirthday(childBirthday),
      })
      .eq("id", existing.child_id)
      .eq("parent_email", parentEmail);

    if (childError) {
      throw new Error(childError.message);
    }
  }

  const { data, error } = await supabase
    .from("quiz_results")
    .update({
      answers: {
        ...currentAnswers,
        childName,
        childBirthday,
        childGender,
        sleepGoal,
        takesNap,
      },
    })
    .eq("id", existing.id)
    .eq("parent_email", parentEmail)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await saveAdminEvent({
    parentEmail,
    childId: existing.child_id || quizResultId,
    eventType: "profile_updated",
    eventLabel: "Child profile updated",
    metadata: {
      childName,
      childBirthday,
      childGender,
      sleepGoal,
      takesNap,
    },
  });

  return data;
}

export async function deleteQuizProfile({ parentEmail, quizResultId }) {
  const supabase = getSupabaseServerClient();

  const { data: existing, error: readError } = await supabase
    .from("quiz_results")
    .select("id, child_id")
    .or(`id.eq.${quizResultId},child_id.eq.${quizResultId}`)
    .eq("parent_email", parentEmail);

  if (readError) {
    throw new Error(readError.message);
  }

  const childId = existing?.[0]?.child_id;
  const quizIds = existing?.map((entry) => entry.id) || [];

  if (childId) {
    const { error } = await supabase
      .from("children")
      .delete()
      .eq("id", childId)
      .eq("parent_email", parentEmail);

    if (error) {
      throw new Error(error.message);
    }

    await saveAdminEvent({
      parentEmail,
      childId,
      eventType: "profile_deleted",
      eventLabel: "Child profile deleted",
      metadata: {
        quizResultId,
        quizIds,
      },
    });

    return { id: quizResultId };
  }

  const { error } = await supabase
    .from("quiz_results")
    .delete()
    .in("id", quizIds.length ? quizIds : [quizResultId])
    .eq("parent_email", parentEmail);

  if (error) {
    throw new Error(error.message);
  }

  await saveAdminEvent({
    parentEmail,
    childId: quizResultId,
    eventType: "profile_deleted",
    eventLabel: "Child profile deleted",
    metadata: {
      quizResultId,
      quizIds,
    },
  });

  return { id: quizResultId };
}

export async function saveAdminEvent({ parentEmail, childId, eventType, eventLabel, metadata }) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("admin_activity_events")
    .insert({
      parent_email: parentEmail,
      child_id: childId || null,
      event_type: eventType,
      event_label: eventLabel,
      metadata: metadata || {},
    });

  if (error) {
    throw new Error(error.message);
  }
}

export async function saveDailyPlan({
  parentEmail,
  childId,
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
      child_id: childId || null,
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

  await saveAdminEvent({
    parentEmail,
    childId,
    eventType: "daily_plan_created",
    eventLabel: "Daily routine plan created",
    metadata: {
      wakeTime,
      napTaken,
      napWakeTime,
      dinnerTime,
      routineStart,
      bedtime,
    },
  });

  return data;
}

export async function saveNightlyLog({
  parentEmail,
  childId,
  logDate,
  routineStartTime,
  inBedAt,
  fellAsleepAt,
  sleepLatencyMinutes,
  nightWakings,
  notes,
  ratings,
}) {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("nightly_logs")
    .upsert({
      parent_email: parentEmail,
      child_id: childId || null,
      log_date: logDate,
      routine_start_time: routineStartTime || null,
      in_bed_at: inBedAt,
      fell_asleep_at: fellAsleepAt,
      sleep_latency_minutes: sleepLatencyMinutes,
      night_wakings: nightWakings,
      notes,
      ratings,
    }, { onConflict: "child_id,log_date" })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await saveAdminEvent({
    parentEmail,
    childId,
    eventType: "nightly_log_saved",
    eventLabel: "Night data saved or updated",
    metadata: {
      logDate,
      routineStartTime,
      inBedAt,
      fellAsleepAt,
      sleepLatencyMinutes,
      nightWakings,
    },
  });

  return data;
}

export async function updateNightWakings({ parentEmail, childId, logDate, nightWakings, wakeTime }) {
  const supabase = getSupabaseServerClient();
  const { data: existing } = await supabase
    .from("nightly_logs")
    .select("ratings, fell_asleep_at")
    .eq("parent_email", parentEmail)
    .eq("child_id", childId)
    .eq("log_date", logDate)
    .single();

  const currentRatings = existing?.ratings || [];
  const nextRatings = wakeTime
    ? [
        ...currentRatings.filter((rating) => rating?.type !== "morning_report"),
        {
          type: "morning_report",
          wakeTime,
        },
      ]
    : currentRatings;

  const { data, error } = await supabase
    .from("nightly_logs")
    .update({ night_wakings: nightWakings, ratings: nextRatings })
    .eq("parent_email", parentEmail)
    .eq("child_id", childId)
    .eq("log_date", logDate)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getMemberData(parentEmail) {
  const supabase = getSupabaseServerClient();

  const [
    { data: quizResults, error: quizError },
    { data: dailyPlans, error: planError },
    { data: nightlyLogs, error: logError },
  ] = await Promise.all([
      supabase
        .from("quiz_results")
        .select("id, child_id, answers, primary_profile, secondary_profile, created_at")
        .eq("parent_email", parentEmail)
        .order("created_at", { ascending: false })
        .limit(25),
      supabase
        .from("daily_plans")
        .select("id, child_id, wake_time, nap_taken, nap_wake_time, dinner_time, routine_start, bedtime, steps, created_at")
        .eq("parent_email", parentEmail)
        .order("created_at", { ascending: false })
        .limit(1),
      supabase
        .from("nightly_logs")
        .select(
          "id, child_id, log_date, routine_start_time, in_bed_at, fell_asleep_at, sleep_latency_minutes, night_wakings, notes, ratings, created_at"
        )
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
