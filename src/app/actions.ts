'use server';

import { humanLikeResponse, type HumanLikeResponseOutput } from '@/ai/flows/human-like-response';
import { getFirestore, collection, getDocs, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

const db = getFirestore(app);

// This is the primary response object returned to the frontend.
// It matches the 'HumanLikeResponseOutput' from the AI flow.
export type BotResponse = HumanLikeResponseOutput;

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
