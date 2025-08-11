'use server';

import { humanLikeResponse, type HumanLikeResponseOutput } from '@/ai/flows/human-like-response';

// This is the primary response object returned to the frontend.
// It matches the 'HumanLikeResponseOutput' from the AI flow.
export type BotResponse = HumanLikeResponseOutput;

// A list of keywords that might indicate a user is in crisis.
// This is a basic check and should not be considered a comprehensive safety system.
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
    // Immediately check for crisis keywords. This is a critical safety feature.
    if (isCrisis(userInput)) {
      return {
        response: "It sounds like you are going through a difficult time. Please know that there is help available. You can connect with people who can support you by calling or texting 988 in the US and Canada, or calling 111 in the UK, anytime.",
        recommendations: null,
      };
    }

    // Call the single, consolidated AI flow.
    const result = await humanLikeResponse({ userInput });
    
    // Ensure the result and its properties are not null before returning.
    // The AI flow is designed to always return this structure, but this is a defensive check.
    if (!result || !result.response) {
       throw new Error("AI flow returned an invalid response.");
    }

    return {
        response: result.response,
        recommendations: result.recommendations,
    };

  } catch (error) {
    console.error('Fatal error in handleUserMessage:', error);
    // This is the ultimate fallback. If anything in the try block fails,
    // we return a safe, static response, ensuring the server action never crashes.
    return {
      response: "I'm having a little trouble formulating a full response right now, but I'm still here to listen. Could you tell me more about what's on your mind?",
      recommendations: null,
    };
  }
}
