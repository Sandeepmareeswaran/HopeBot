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
  mood: z.string().describe('A one or two word description of the detected mood of the text (e.g., "sad", "anxious", "frustrated").'),
});
export type DetectMoodOutput = z.infer<typeof DetectMoodOutputSchema>;

export async function detectMood(input: DetectMoodInput): Promise<DetectMoodOutput> {
  return detectMoodFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectMoodPrompt',
  input: {schema: DetectMoodInputSchema},
  output: {schema: DetectMoodOutputSchema},
  prompt: `Analyze the following text for its primary emotional tone. Describe the mood in one or two words.\n\nText: {{{text}}}`,
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
