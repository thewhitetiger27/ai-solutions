
/**
@fileOverview A real-time AI chatbot flow. */
import { z } from 'zod';

// Define the schema for a single chat message
export const ChatMessageSchema = z.object({ role: z.enum(['user', 'model']), content: z.string(), });

// Define the input schema for the chat flow.
export const ChatInputSchema = z.object({ history: z.array(ChatMessageSchema).describe('The conversation history.'), message: z.string().describe('The latest user message.'), });

export type ChatInput = z.infer<typeof ChatInputSchema>;

// Define the output schema for the chat flow.
export const ChatOutputSchema = z.object({ response: z.string().describe('The AI-generated response.'), });

export type ChatOutput = z.infer<typeof ChatOutputSchema>;
