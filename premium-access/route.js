import { getPremiumAccessByEmail } from "../../../lib/purchases";

export async function POST(request) {
  const payload = await request.json();
  const email = payload.email?.trim().toLowerCase();

  if (!email) {
    return Response.json({ error: "Missing email" }, { status: 400 });
  }

  const result = await getPremiumAccessByEmail(email);
  return Response.json(result);
}
