import { getSupabaseServerClient } from "./supabase-server";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

async function attachRepliesToMessages(supabase, messages) {
  const messageList = messages || [];
  const messageIds = messageList.map((message) => message.id).filter(Boolean);

  if (messageIds.length === 0) {
    return messageList.map((message) => ({ ...message, replies: [] }));
  }

  const { data: replies, error } = await supabase
    .from("support_message_replies")
    .select("id, message_id, sender, message, read_at, created_at")
    .in("message_id", messageIds)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const repliesByMessage = (replies || []).reduce((grouped, reply) => {
    grouped[reply.message_id] = grouped[reply.message_id] || [];
    grouped[reply.message_id].push(reply);
    return grouped;
  }, {});

  return messageList.map((message) => ({
    ...message,
    replies: repliesByMessage[message.id] || [],
  }));
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

export async function saveSupportReply({ messageId, sender, message }) {
  const cleanMessage = String(message || "").trim();
  if (!messageId || !cleanMessage) {
    throw new Error("Missing reply");
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("support_message_replies")
    .insert({
      message_id: messageId,
      sender: sender === "admin" ? "admin" : "user",
      message: cleanMessage,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const { error: updateError } = await supabase
    .from("support_messages")
    .update({ status: sender === "admin" ? "answered" : "new" })
    .eq("id", messageId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return data;
}

export async function listSupportMessagesForEmail(email) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("support_messages")
    .select("id, parent_email, parent_name, child_name, topic, message, status, created_at")
    .eq("parent_email", normalizeEmail(email))
    .order("created_at", { ascending: false })
    .limit(25);

  if (error) {
    throw new Error(error.message);
  }

  return attachRepliesToMessages(supabase, data || []);
}

export async function deleteSupportMessage({ messageId }) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("support_messages")
    .delete()
    .eq("id", messageId);

  if (error) {
    throw new Error(error.message);
  }

  return { id: messageId };
}

export async function getAdminDashboardData() {
  const supabase = getSupabaseServerClient();
  const [
    { data: children, error: childrenError },
    { data: quizResults, error: quizResultsError },
    { data: logs, error: logsError },
    { data: messages, error: messagesError },
    { data: reviews, error: reviewsError },
    { data: purchases, error: purchasesError },
  ] = await Promise.all([
    supabase
      .from("children")
      .select("id, parent_email, child_name, age_years, primary_profile, secondary_profile, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("quiz_results")
      .select("id, parent_email, child_id, answers, primary_profile, secondary_profile, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
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
    supabase
      .from("purchase_access")
      .select("id, email, product_id, purchase_status, premium_unlocked, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  if (childrenError || quizResultsError || logsError || messagesError || reviewsError || purchasesError) {
    throw new Error(
      childrenError?.message ||
        quizResultsError?.message ||
        logsError?.message ||
        messagesError?.message ||
        reviewsError?.message ||
        purchasesError?.message
    );
  }

  const { data: events, error: eventsError } = await supabase
    .from("admin_activity_events")
    .select("id, parent_email, child_id, event_type, event_label, metadata, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const messagesWithReplies = await attachRepliesToMessages(supabase, messages || []);

  return {
    children: children || [],
    quizResults: quizResults || [],
    logs: logs || [],
    messages: messagesWithReplies,
    reviews: reviews || [],
    purchases: purchases || [],
    events: eventsError ? [] : events || [],
    eventsWarning: eventsError?.message || "",
  };
}
