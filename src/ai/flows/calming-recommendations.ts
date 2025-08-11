'use server';

/**
 * @fileOverview Recommends calming exercises and CBT prompts based on user mood and message content.
 *
 * - calmingRecommendations - A function that suggests calming exercises and CBT prompts.
 * - CalmingRecommendationsInput - The input type for the calmingRecommendations function.
 * - CalmingRecommendationsOutput - The return type for the calmingRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalmingRecommendationsInputSchema = z.object({
  mood: z.string().describe('The detected mood of the user (e.g., anxious, sad, angry).'),
  message: z.string().describe('The content of the user message.'),
});
export type CalmingRecommendationsInput = z.infer<typeof CalmingRecommendationsInputSchema>;

const CalmingRecommendationsOutputSchema = z.object({
  calmingExercises: z.array(z.string()).describe('A list of calming exercise suggestions.'),
  cbtPrompts: z.array(z.string()).describe('A list of CBT prompt suggestions.'),
});
export type CalmingRecommendationsOutput = z.infer<typeof CalmingRecommendationsOutputSchema>;

export async function calmingRecommendations(input: CalmingRecommendationsInput): Promise<CalmingRecommendationsOutput> {
  return calmingRecommendationsFlow(input);
}

const calmingRecommendationsPrompt = ai.definePrompt({
  name: 'calmingRecommendationsPrompt',
  input: {schema: CalmingRecommendationsInputSchema},
  output: {schema: CalmingRecommendationsOutputSchema},
  prompt: `You are a mental health expert. A user is feeling {{{mood}}} and sent the following message: {{{message}}}.  Based on their mood and message, suggest some calming exercises and CBT (Cognitive Behavioral Therapy) prompts.

Calming Exercises:
- (List calming exercise suggestions)

CBT Prompts:
- (List CBT prompt suggestions)`,
});

const calmingRecommendationsFlow = ai.defineFlow(
  {
    name: 'calmingRecommendationsFlow',
    inputSchema: CalmingRecommendationsInputSchema,
    outputSchema: CalmingRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await calmingRecommendationsPrompt(input);
    return output!;
  }
);
