'use server';

/**
 * @fileOverview An AI agent that provides human-like responses to user input,
 * incorporating calming exercises and CBT prompts when appropriate.
 *
 * - humanLikeResponse - A function that generates a human-like response.
 * - HumanLikeResponseInput - The input type for the humanLikeResponse function.
 * - HumanLikeResponseOutput - The return type for the humanLikeResponse function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const HumanLikeResponseInputSchema = z.object({
  userInput: z.string().describe('The user input to respond to.'),
  language: z.string().describe('The language for the response (e.g., "English", "Tamil", "Hindi").'),
});
export type HumanLikeResponseInput = z.infer<typeof HumanLikeResponseInputSchema>;

const CalmingRecommendationsSchema = z.object({
  calmingExercises: z.array(z.string()).describe('A list of calming exercise suggestions.'),
  cbtPrompts: z.array(z.string()).describe('A list of CBT prompt suggestions.'),
});

const HumanLikeResponseOutputSchema = z.object({
  response: z.string().describe('The human-like response to the user input.'),
  recommendations: CalmingRecommendationsSchema.nullable().describe('Calming recommendations if the user seems distressed, otherwise null.'),
});
export type HumanLikeResponseOutput = z.infer<typeof HumanLikeResponseOutputSchema>;


export async function humanLikeResponse(input: HumanLikeResponseInput): Promise<HumanLikeResponseOutput> {
  return humanLikeResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'humanLikeResponsePrompt',
  input: {schema: HumanLikeResponseInputSchema},
  output: {schema: HumanLikeResponseOutputSchema},
  model: googleAI.model('gemini-1.5-flash'),
  prompt: `You are a compassionate mental health companion. Always respond in a warm, natural, and human-like way, like a caring friend. Your role is to listen, empathize, and provide comfort, not to diagnose or give medical advice. Keep responses supportive, encouraging, and conversational. If the user expresses severe distress or suicidal thoughts, gently encourage them to seek immediate help from a professional or call a helpline. Limit the response to 3-4 lines.

You MUST respond in the following language: {{{language}}}.

Respond to the following user input:{{{userInput}}}`
});

const humanLikeResponseFlow = ai.defineFlow(
  {
    name: 'humanLikeResponseFlow',
    inputSchema: HumanLikeResponseInputSchema,
    outputSchema: HumanLikeResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
