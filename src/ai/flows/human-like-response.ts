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
  prompt: `You are HopeBot, a friendly and empathetic companion. Your goal is to be a warm, supportive friend. Talk like a real person, not a robot. Use a conversational, caring, and gentle tone. Avoid clinical language and generic AI phrases like "As an AI..." or "I can see you're feeling...".

You MUST respond in the following language: {{{language}}}. All parts of your response, including recommendations, must be in this language.

Analyze the user's input.
- First, write a direct, empathetic, and natural response as if you were talking to a friend. Be present with them.
- Second, if you sense the user is feeling sad, anxious, angry, or distressed, gently offer a few relevant calming exercises and CBT prompts. Frame them as simple ideas or things to think about, not prescriptions. Place these in the 'recommendations' object.
- If the user's mood seems neutral or positive, just focus on the conversation and leave the 'recommendations' field as null.

Respond to the following user input:
{{{userInput}}}`,
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
