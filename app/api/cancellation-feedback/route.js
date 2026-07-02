import { getSupabaseServerClient } from "../../../lib/supabase-server";
import { notifyAdmins } from "../../../lib/push-notifications";

export async function POST(request) {
  const payload = await request.json();
  const { email, reason, suggestions, isFirstCancel } = payload;

  try {
    const supabase = getSupabaseServerClient();
    await supabase.from("cancellation_feedback").insert({
      email: email || null,
      reason: reason || null,
      suggestions: suggestions || null,
      is_first_cancel: !!isFirstCancel,
      offered_free_month: !!(isFirstCancel && suggestions?.trim()),
      created_at: new Date().toISOString(),
    });
  } catch {
    // table may not exist yet — don't block the response
  }

  try {
    const freeMonthNote = isFirstCancel && suggestions?.trim() ? " · Ofrecer mes gratis" : "";
    await notifyAdmins({
      title: `Cancelación: ${email || "usuario"}${freeMonthNote}`,
      body: `Razón: ${reason || "—"}. Sugerencias: ${suggestions?.slice(0, 120) || "—"}`,
      url: "/?section=admin",
    });
  } catch {
    // non-blocking
  }

  return Response.json({ ok: true });
}
