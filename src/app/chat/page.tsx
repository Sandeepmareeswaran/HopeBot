'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatInterface } from '@/components/chat/chat-interface';
import { ChatHeader } from '@/components/chat/chat-header';
import { getChatHistory, type Message } from '../actions';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChatPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('English');
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    } else {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (userEmail) {
      const fetchHistory = async () => {
        setLoading(true);
        const history = await getChatHistory(userEmail);
        setMessages(history);
        setLoading(false);
      };
      fetchHistory();
    }
  }, [userEmail]);

  if (!userEmail) {
    // Render a loading state or redirect will be handled by the effect
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  return (
    <div className="flex h-full bg-background">
      <ChatSidebar
        userEmail={userEmail}
        onLogout={handleLogout}
        className="hidden md:flex w-[300px]"
      />
      <div className="flex flex-1 flex-col">
        <ChatHeader language={language} setLanguage={setLanguage} />
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            userEmail={userEmail}
            initialMessages={messages}
            isLoadingHistory={loading}
            language={language}
          />
        </div>
      </div>
    </div>
  );
}
