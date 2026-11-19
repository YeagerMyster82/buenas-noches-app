import { getSupabaseBrowserClient } from "./supabase-client";

// ── Children ─────────────────────────────────────────────────────────────────

export async function getChildren(email) {
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb
    .from("children")
    .select("id, child_name, age_years, created_at")
    .eq("parent_email", email.toLowerCase())
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createChild(email, name, ageYears) {
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb
    .from("children")
    .insert({ parent_email: email.toLowerCase(), child_name: name.trim(), age_years: ageYears || null })
    .select("id, child_name, age_years, created_at")
    .single();
  if (error) throw error;
  return data;
}

// ── Symptom ratings ───────────────────────────────────────────────────────────

export async function saveRatings(email, childId, ratings) {
  // ratings: [{ symptom_id, section_id, frequency, life_impact }]
  const sb = getSupabaseBrowserClient();
  const rows = ratings.map(r => ({
    parent_email: email.toLowerCase(),
    child_id: childId,
    symptom_id: r.symptom_id,
    section_id: r.section_id,
    course: "neuroesencia",
    frequency: r.frequency,
    life_impact: r.life_impact,
    notes: r.notes || null,
    rated_at: new Date().toISOString(),
  }));
  const { error } = await sb.from("symptom_ratings").insert(rows);
  if (error) throw error;
}

export async function getRatingsForChild(childId) {
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb
    .from("symptom_ratings")
    .select("id, symptom_id, section_id, frequency, life_impact, rated_at")
    .eq("child_id", childId)
    .eq("course", "neuroesencia")
    .order("rated_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

export const FREQ_LABELS = ["", "Rara vez", "A veces", "Frecuente", "Casi siempre"];
export const IMPACT_LABELS = ["", "Poco", "Algo", "Bastante", "Mucho"];
export const FREQ_COLOR = ["", "#a8d5a2", "#f7c59f", "#f4a261", "#e63946"];
export const IMPACT_COLOR = ["", "#a8d5a2", "#f7c59f", "#f4a261", "#e63946"];
