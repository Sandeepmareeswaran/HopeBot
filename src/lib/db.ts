// This file is no longer the source of truth for the database.
// Firestore is now used directly via the firebase.ts initialization.
// This file is kept to prevent breaking imports, but it is deprecated.

export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
}

export interface Chat {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

// The 'db' export is now pointing to the Firestore instance,
// but to avoid widespread changes, we keep this file.
// The new implementation uses Firestore functions directly in actions.ts.
class DeprecatedDB {
  getChats(userId: string): Chat[] {
    console.warn('Using deprecated in-memory DB getChats');
    return [];
  }
  getChat(chatId: string): Chat | undefined {
    console.warn('Using deprecated in-memory DB getChat');
    return undefined;
  }
  addMessagesToChat(userId: string, messages: Message[]) {
    console.warn('Using deprecated in-memory DB addMessagesToChat');
  }
}

export const db = new DeprecatedDB();
