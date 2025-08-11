'use server';

/**
 * @fileOverview An AI agent that provides human-like responses to user input.
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

const HumanLikeResponseOutputSchema = z.object({
  response: z.string().describe('The human-like response to the user input.'),
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
