'use server';
/**
 * @fileOverview Analyzes user input for emotional tone.
 *
 * - detectMood - A function that analyzes the emotional tone of user input.
 * - DetectMoodInput - The input type for the detectMood function.
 * - DetectMoodOutput - The return type for the detectMood function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectMoodInputSchema = z.object({
  text: z.string().describe('The text to analyze for emotional tone.'),
});
export type DetectMoodInput = z.infer<typeof DetectMoodInputSchema>;

const DetectMoodOutputSchema = z.object({
  mood: z.string().describe('The detected mood of the text.'),
  reason: z.string().optional().describe('Possible reasons for the detected mood.'),
  suggestedResponse: z.string().optional().describe('A suggestion for an optimistic or grateful response.'),
});
export type DetectMoodOutput = z.infer<typeof DetectMoodOutputSchema>;

export async function detectMood(input: DetectMoodInput): Promise<DetectMoodOutput> {
  return detectMoodFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectMoodPrompt',
  input: {schema: DetectMoodInputSchema},
  output: {schema: DetectMoodOutputSchema},
  prompt: `You are a mood detection expert. Analyze the following text for its emotional tone.  If the mood seems low, mention possible reasons, and then consider a response with optimism or gratitude.\n\nText: {{{text}}}`,
});

const detectMoodFlow = ai.defineFlow(
  {
    name: 'detectMoodFlow',
    inputSchema: DetectMoodInputSchema,
    outputSchema: DetectMoodOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
