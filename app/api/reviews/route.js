import { listPublicReviews, saveAppReview } from "../../../lib/community-data";

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

    return Response.json({
      ok: true,
      review,
      public: review.public_approved,
    });
  } catch (error) {
    return Response.json({ error: error.message || "Could not save review" }, { status: 400 });
  }
}
