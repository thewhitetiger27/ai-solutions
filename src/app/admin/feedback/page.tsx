
import { getTestimonials } from "@/lib/data";
import { FeedbackClient } from "./_components/feedback-client";

export default async function AdminFeedbackPage() {
  const testimonials = await getTestimonials();

  return <FeedbackClient initialFeedback={testimonials} />;
}
