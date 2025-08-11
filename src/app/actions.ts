'use server';

import { detectMood } from '@/ai/flows/mood-detection';
import { humanLikeResponse } from '@/ai/flows/human-like-response';
import { calmingRecommendations, CalmingRecommendationsOutput } from '@/ai/flows/calming-recommendations';

export interface BotResponse {
  type: 'botResponse' | 'crisis';
  response: string;
  recommendations: CalmingRecommendationsOutput | null;
}

const crisisKeywords = [
  'suicide', 'kill myself', 'i want to die', 'end my life', 'ending it all',
  'no reason to live', 'take my own life', 'self-harm', 'hopeless and want to end it'
];

function isCrisis(message: string): boolean {
  const lowerCaseMessage = message.toLowerCase();
  return crisisKeywords.some(keyword => lowerCaseMessage.includes(keyword));
}

export async function handleUserMessage(userInput: string): Promise<BotResponse> {
  try {
    if (isCrisis(userInput)) {
      return {
        type: 'crisis',
        response: "It sounds like you are going through a difficult time. Please know that there is help available. You can connect with people who can support you by calling or texting 988 in the US and Canada, or calling 111 in the UK, anytime.",
        recommendations: null,
      };
    }
    
    const [moodResult, humanResponseResult] = await Promise.all([
      detectMood({ text: userInput }),
      humanLikeResponse({ userInput }),
    ]);

    let recommendationsResult: CalmingRecommendationsOutput | null = null;
    const mood = moodResult.mood.toLowerCase();

    if (['sad', 'anxious', 'angry', 'stressed', 'overwhelmed', 'low'].some(m => mood.includes(m))) {
      recommendationsResult = await calmingRecommendations({
        mood: moodResult.mood,
        message: userInput,
      });
    }

    return {
      type: 'botResponse',
      response: humanResponseResult.response,
      recommendations: recommendationsResult,
    };
  } catch (error) {
    console.error('Error handling user message:', error);
    return {
      type: 'botResponse',
      response: 'I apologize, but I encountered an error. Please try again in a moment.',
      recommendations: null,
    };
  }
}
