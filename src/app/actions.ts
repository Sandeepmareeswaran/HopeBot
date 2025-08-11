'use server';

import { detectMood, DetectMoodOutput } from '@/ai/flows/mood-detection';
import { humanLikeResponse, HumanLikeResponseOutput } from '@/ai/flows/human-like-response';
import { calmingRecommendations, CalmingRecommendationsOutput } from '@/ai/flows/calming-recommendations';
import { getFirestore, collection, getDocs, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

const db = getFirestore(app);

export interface BotResponse {
  type: 'botResponse' | 'crisis';
  response: string;
  recommendations: CalmingRecommendationsOutput | null;
}

export interface DailyRecord {
  date: string;
  timeSpent: number; // in seconds
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
    
    const [moodResult, humanResponseResult] = await Promise.allSettled([
      detectMood({ text: userInput }),
      humanLikeResponse({ userInput }),
    ]);

    if (humanResponseResult.status === 'rejected') {
      console.error('Error in humanLikeResponse flow:', humanResponseResult.reason);
      throw new Error('Failed to generate a response.');
    }
    
    const responseText = humanResponseResult.value.response;
    let recommendationsResult: CalmingRecommendationsOutput | null = null;
    
    if (moodResult.status === 'fulfilled') {
      const mood = moodResult.value.mood.toLowerCase();
      if (['sad', 'anxious', 'angry', 'stressed', 'overwhelmed', 'low'].some(m => mood.includes(m))) {
        recommendationsResult = await calmingRecommendations({
          mood: moodResult.value.mood,
          message: userInput,
        });
      }
    } else {
        console.error('Error in detectMood flow:', moodResult.reason);
    }


    return {
      type: 'botResponse',
      response: responseText,
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

export async function getRecordsForUser(userEmail: string): Promise<DailyRecord[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'userActivity', userEmail, 'records'));
    const recordsMap = new Map<string, number>();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      recordsMap.set(doc.id, data.timeSpent || 0);
    });

    const allDays: DailyRecord[] = [];
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setDate(today.getDate() - 364);

    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      allDays.push({
        date: dateStr,
        timeSpent: recordsMap.get(dateStr) || 0,
      });
    }
    return allDays;
  } catch (error) {
    console.error("Failed to fetch activity data from Firestore", error);
    return [];
  }
}

export async function getTotalTimeSpentForUser(userEmail: string): Promise<number> {
  if (!userEmail) return 0;
  try {
    const querySnapshot = await getDocs(collection(db, 'userActivity', userEmail, 'records'));
    let totalTime = 0;
    querySnapshot.forEach((doc) => {
      totalTime += doc.data().timeSpent || 0;
    });
    return totalTime;
  } catch (error) {
    console.error("Failed to fetch total time spent from Firestore", error);
    return 0;
  }
}

export async function storeRecordForUser(userEmail: string, timeSpentInSeconds: number) {
  if (!userEmail || timeSpentInSeconds <= 0) return;
  
  const todayStr = new Date().toISOString().split('T')[0];
  const recordRef = doc(db, 'userActivity', userEmail, 'records', todayStr);

  try {
    const docSnap = await getDoc(recordRef);
    if (docSnap.exists()) {
      const newTime = (docSnap.data().timeSpent || 0) + timeSpentInSeconds;
      await updateDoc(recordRef, { timeSpent: newTime });
    } else {
      await setDoc(recordRef, { timeSpent: timeSpentInSeconds, date: todayStr });
    }
  } catch (error) {
    console.error("Failed to save activity data to Firestore", error);
  }
}
