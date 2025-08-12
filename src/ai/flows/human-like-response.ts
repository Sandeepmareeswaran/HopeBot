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
import {z} from 'genkit';

const HumanLikeResponseInputSchema = z.object({
  userInput: z.string().describe('The user input to respond to.'),
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
  prompt: `You are a mental health companion named HopeBot. Your goal is to provide supportive and empathetic responses. Use a conversational and caring tone.

Analyze the user's input. 
- First, formulate a direct, empathetic response to what they've said.
- Second, if you detect that the user is feeling sad, anxious, angry, or otherwise distressed, generate a few calming exercises and a few cognitive behavioral therapy (CBT) prompts that are relevant to their message. Place these in the 'recommendations' object. 
- If the user's mood seems neutral or positive, leave the 'recommendations' field as null.

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
    const {output} = await prompt(input, { model: 'gemini-1.5-flash' });
    return output!;
  }
);
