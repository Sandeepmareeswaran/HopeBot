'use server';

import {
  humanLikeResponse,
  type HumanLikeResponseOutput,
} from '@/ai/flows/human-like-response';
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

// This is the primary response object returned to the frontend.
// It matches the 'HumanLikeResponseOutput' from the AI flow.
export type BotResponse = {
  response: string;
  recommendations: null;
};

export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
}

export async function handleUserMessage(
  userInput: string,
  userEmail: string
): Promise<BotResponse> {
  try {
    // Call the local Flask backend
    const backendResponse = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userInput }),
    });

    if (!backendResponse.ok) {
      throw new Error('Failed to fetch from backend');
    }

    const result = await backendResponse.json();
    const botReply = result.reply || "Sorry, I didn't get a response.";

    // Save the conversation to Firestore
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
    };
    const botMessage: Message = {
      id: `${Date.now()}-bot`,
      role: 'bot',
      content: botReply, // Storing the text content from Flask
    };

    const chatDocRef = doc(db, 'chats', userEmail);
    const chatDoc = await getDoc(chatDocRef);

    if (chatDoc.exists()) {
      await updateDoc(chatDocRef, {
        history: arrayUnion(userMessage, botMessage),
      });
    } else {
      await setDoc(chatDocRef, {
        email: userEmail,
        history: [userMessage, botMessage],
        createdAt: new Date(),
      });
    }

    revalidatePath('/chat');

    return {
      response: botReply,
      recommendations: null,
    };
  } catch (error) {
    console.error('Fatal error in handleUserMessage:', error);
    // This is the ultimate fallback. If anything in the try block fails,
    // we return a safe, static response, ensuring the server action never crashes.
    return {
      response:
        "I'm having a little trouble connecting to the backend right now. Please make sure the Python server is running.",
      recommendations: null,
    };
  }
}

export async function getChatHistory(userEmail: string): Promise<Message[]> {
  try {
    const chatDocRef = doc(db, 'chats', userEmail);
    const chatDoc = await getDoc(chatDocRef);

    if (chatDoc.exists()) {
      return chatDoc.data().history || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
}
