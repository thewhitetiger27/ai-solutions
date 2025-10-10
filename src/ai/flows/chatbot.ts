
'use server';

/**
@fileOverview A real-time AI chatbot flow. */
import { ai } from '../genkit';
import {
  ChatInputSchema,
  ChatOutputSchema,
  type ChatInput,
  type ChatOutput,
} from './chat-types';
import { getServices, getProjects, getArticles, getEvents, getGalleryImages, getApprovedTestimonials } from '@/lib/data';

const chatFlow = ai.defineFlow( { name: 'chatbotFlow', inputSchema: ChatInputSchema, outputSchema: ChatOutputSchema, }, async input => { const { history, message } = input;

const filteredHistory = history.length > 0 && history[0].role !== 'user'
    ? history.slice(1)
    : history;

const geminiHistory = filteredHistory.map(
  (msg) => ({
    role: msg.role,
    text: msg.content,
  })
);

// Fetch website data for context
const services = await getServices();
const projects = await getProjects();
const articles = await getArticles();
const events = await getEvents();
const galleryImages = await getGalleryImages();
const testimonials = await getApprovedTestimonials();

const servicesSummary = services.map(s => `${s.title}: ${s.short_description}`).join('; ');
const projectsSummary = projects.map(p => `${p.title}: ${p.summary}`).join('; ');
const articlesSummary = articles.map(a => `${a.title}: ${a.excerpt}`).join('; ');
const eventsSummary = events.map(e => `${e.title}: ${e.date} at ${e.location} - ${e.description.substring(0, 100)}...`).join('; ');
const gallerySummary = galleryImages.map(g => `${g.title}: ${g.caption} (${g.category})`).join('; ');
const testimonialsSummary = testimonials.map(t => `"${t.message.substring(0, 100)}..." - ${t.name}, ${t.company}`).join('; ');

const contactInfo = "Contact Information: Email: info@ai-solutions.com | Visit /contact for inquiries, quotes, and more. We are based in the USA and serve clients worldwide.";

const context = `Company Information - Services: ${servicesSummary}. Projects: ${projectsSummary}. Articles: ${articlesSummary}. Events: ${eventsSummary}. Gallery: ${gallerySummary}. Testimonials: ${testimonialsSummary}. ${contactInfo} You are an AI assistant for AI-Solutions, a company specializing in intelligent automation solutions.`;

const messages = [
  { role: 'system', content: [{ text: `${context} Your goal is to answer user questions about the company, its services, projects, articles, events, gallery, testimonials, contact information, and general AI topics. Keep answers concise, accurate, and helpful. If you don't know something, say so clearly.` }] },
  ...geminiHistory.map(msg => ({ role: msg.role, content: [{ text: msg.text }] })),
  { role: 'user', content: [{ text: message }] }
];

const response = await ai.generate({
  model: 'googleai/gemini-2.5-flash',
  messages,
  config: {
    temperature: 0.7,
    maxOutputTokens: 1024,
  },
});

const { text } = response;

return { response: text };

} );

export async function chat(input: ChatInput): Promise<ChatOutput> { return chatFlow(input); }
