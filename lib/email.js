// Simple email sender via Resend API (no package needed)
// Set RESEND_API_KEY in Vercel env vars (free at resend.com)

const ADMIN_EMAIL = "BuenasNochesApp@quirokids.com";
const FROM_EMAIL = "Buenas Noches <notificaciones@quirokids.com>";

export async function sendAdminEmail({ subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { skipped: true };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Resend error:", err);
    return { error: err };
  }

  return { sent: true };
}
