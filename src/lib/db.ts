// This is a simple in-memory database for demonstration purposes.
// In a real application, you would use a persistent database like Firestore, PostgreSQL, etc.

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

interface Database {
  users: Map<string, { email?: string; id: string }>;
  chats: Map<string, Chat>;
}

// In-memory store
const store: Database = {
  users: new Map(),
  chats: new Map(),
};

class InMemoryDB {
  // Get all chats for a user, sorted by most recent
  getChats(userId: string): Chat[] {
    return Array.from(store.chats.values())
      .filter((chat) => chat.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Get a specific chat by its ID
  getChat(chatId: string): Chat | undefined {
    return store.chats.get(chatId);
  }

  // Add messages to a chat. If no chat exists, create a new one.
  addMessagesToChat(userId: string, messages: Message[]) {
    // For simplicity, we'll have one continuous chat per user.
    // In a real app, you'd manage multiple chat sessions.
    const chatId = `chat_${userId}`;

    let chat = store.chats.get(chatId);

    if (!chat) {
      // Create a new chat
      const newChat: Chat = {
        id: chatId,
        userId,
        title: messages[0]?.content.substring(0, 30) || 'New Chat',
        messages: [],
        createdAt: new Date(),
      };
      store.chats.set(chatId, newChat);
      chat = newChat;
    }

    chat.messages.push(...messages);
  }
}

export const db = new InMemoryDB();
