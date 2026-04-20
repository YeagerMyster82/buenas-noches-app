import { getSupabaseServerClient } from "./supabase-server";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export async function listPublicReviews() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("app_reviews")
    .select("id, parent_name, child_name, rating, comment, created_at")
    .eq("public_approved", true)
    .order("created_at", { ascending: false })
    .limit(25);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function saveAppReview({
  parentEmail,
  parentName,
  childName,
  rating,
  comment,
  improvementFeedback,
}) {
  const numericRating = Number(rating);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    throw new Error("Invalid rating");
  }

  const supabase = getSupabaseServerClient();
  const isPublicWin = numericRating === 5;
  const { data, error } = await supabase
    .from("app_reviews")
    .insert({
      parent_email: normalizeEmail(parentEmail),
      parent_name: String(parentName || "").trim(),
      child_name: String(childName || "").trim(),
      rating: numericRating,
      comment: String(comment || "").trim(),
      improvement_feedback: String(improvementFeedback || "").trim(),
      public_approved: isPublicWin,
      needs_follow_up: !isPublicWin,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function saveSupportMessage({
  parentEmail,
  parentName,
  childName,
  message,
  topic,
}) {
  const cleanMessage = String(message || "").trim();
  if (!cleanMessage) {
    throw new Error("Missing message");
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("support_messages")
    .insert({
      parent_email: normalizeEmail(parentEmail),
      parent_name: String(parentName || "").trim(),
      child_name: String(childName || "").trim(),
      topic: String(topic || "support").trim(),
      message: cleanMessage,
      status: "new",
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getAdminDashboardData() {
  const supabase = getSupabaseServerClient();
  const [
    { data: children, error: childrenError },
    { data: logs, error: logsError },
    { data: messages, error: messagesError },
    { data: reviews, error: reviewsError },
  ] = await Promise.all([
    supabase
      .from("children")
      .select("id, parent_email, child_name, age_years, primary_profile, secondary_profile, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("nightly_logs")
      .select("id, parent_email, child_id, log_date, routine_start_time, in_bed_at, fell_asleep_at, sleep_latency_minutes, night_wakings, notes, created_at")
      .order("log_date", { ascending: false })
      .limit(200),
    supabase
      .from("support_messages")
      .select("id, parent_email, parent_name, child_name, topic, message, status, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("app_reviews")
      .select("id, parent_email, parent_name, child_name, rating, comment, improvement_feedback, public_approved, needs_follow_up, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  if (childrenError || logsError || messagesError || reviewsError) {
    throw new Error(childrenError?.message || logsError?.message || messagesError?.message || reviewsError?.message);
  }

  return {
    children: children || [],
    logs: logs || [],
    messages: messages || [],
    reviews: reviews || [],
  };
}
