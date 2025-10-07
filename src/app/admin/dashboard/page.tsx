
import { getArticles, getContactSubmissions, getProjects, getServices, getTestimonials, getQuoteRequests } from '@/lib/data';
import { DashboardClient } from './_components/dashboard-client';
import type { ContactSubmission, Feedback, QuoteRequest } from '@/lib/mock-data';
import { subDays, format, parseISO, startOfDay } from 'date-fns';

export default async function AdminDashboardPage() {
    const articles = await getArticles();
    const services = await getServices();
    const projects = await getProjects();
    const testimonials = await getTestimonials();
    const inquiries = await getContactSubmissions();
    const quoteRequests = await getQuoteRequests();

    const stats = {
        pendingFeedback: testimonials.filter((t: Feedback) => t.status === 'pending').length,
        totalArticles: articles.length,
        totalServices: services.length,
        newInquiries: inquiries.filter((c: ContactSubmission) => !c.read_status).length,
        totalProjects: projects.length,
        newQuotes: quoteRequests.filter((q: QuoteRequest) => q.status === 'new').length,
    }

    const recentInquiries = inquiries.slice(0, 5);

    // Prepare data for the inquiries chart
    const inquiryStats = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), i);
        return {
            date: format(date, 'MMM d'),
            day: format(date, 'eee'),
            inquiries: 0,
        };
    }).reverse();

    const inquiryDateMap = inquiryStats.reduce((acc, stat) => {
        acc[stat.date] = stat;
        return acc;
    }, {} as Record<string, typeof inquiryStats[0]>);

    inquiries.forEach(inquiry => {
        const inquiryDate = startOfDay(new Date(inquiry.created_at));
        const formattedDate = format(inquiryDate, 'MMM d');
        if (inquiryDateMap[formattedDate]) {
            inquiryDateMap[formattedDate].inquiries++;
        }
    });

    return <DashboardClient stats={stats} recentInquiries={recentInquiries} inquiryStats={inquiryStats} />
}
