import { FeedbackSection } from "@/components/feedback-section";
import { getApprovedTestimonials, getTestimonials } from "@/lib/data";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feedback & Testimonials',
  description: 'We value your opinion. Share your experience with us or read what others are saying.',
};

export default async function FeedbackPage() {
  const approvedTestimonials = await getApprovedTestimonials();
  const allTestimonials = await getTestimonials(); // This includes pending ones for the form logic

  return (
    <div id="feedback-page-container" className="container mx-auto px-4 py-16">
      <div
        className="text-center mb-12"
      >
        <h1 className="font-headline text-5xl font-bold tracking-tight">Feedback & Testimonials</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          We value your opinion. Share your experience with us or read what others are saying.
        </p>
      </div>
      <FeedbackSection testimonials={allTestimonials} approvedTestimonials={approvedTestimonials} />
    </div>
  );
}
