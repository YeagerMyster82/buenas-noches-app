import { listPublicReviews, saveAppReview } from "../../../lib/community-data";
import { notifyAdmins } from "../../../lib/push-notifications";

export async function GET() {
  const reviews = await listPublicReviews();
  return Response.json({ reviews });
}

export async function POST(request) {
  const payload = await request.json();

  try {
    const review = await saveAppReview({
      parentEmail: payload.email,
      parentName: payload.parentName,
      childName: payload.childName,
      rating: payload.rating,
      comment: payload.comment,
      improvementFeedback: payload.improvementFeedback,
    });

    try {
      await notifyAdmins({
        title: "Nueva reseña en Buenas Noches",
        body: `${payload.email || "Una familia"} dejó ${payload.rating} estrellas.`,
        url: "/?section=admin",
      });
    } catch {
      // The review should still be saved even if push is not configured yet.
    }

    return Response.json({
      ok: true,
      review,
      public: review.public_approved,
    });
  } catch (error) {
    return Response.json({ error: error.message || "Could not save review" }, { status: 400 });
  }
}
