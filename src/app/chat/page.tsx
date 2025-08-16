'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatInterface } from '@/components/chat/chat-interface';
import { ChatHeader } from '@/components/chat/chat-header';
import { getChatHistory, type Message } from '../actions';
import { Skeleton } from '@/components/ui/skeleton';
import { getTranslations, type Language, type Translations } from '@/lib/translations';


export default function ChatPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>('English');
  const [t, setT] = useState<Translations>(getTranslations('English'));
  const router = useRouter();

  useEffect(() => {
    const storedLang = (localStorage.getItem('hopebot-language') as Language) || 'English';
    setLanguage(storedLang);
    setT(getTranslations(storedLang));

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

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setT(getTranslations(lang));
    localStorage.setItem('hopebot-language', lang);
  };

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
    localStorage.removeItem('hopebot-language');
    router.push('/login');
  };

  return (
    <div className="flex h-full bg-background">
      <ChatSidebar
        userEmail={userEmail}
        onLogout={handleLogout}
        className="hidden md:flex w-[300px]"
        translations={t.chatSidebar}
      />
      <div className="flex flex-1 flex-col">
        <ChatHeader 
          currentLanguage={language}
          onLanguageChange={handleLanguageChange}
        />
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            userEmail={userEmail}
            initialMessages={messages}
            isLoadingHistory={loading}
            language={language}
            translations={t.chatInterface}
          />
        </div>
      </div>
    </div>
  );
}
