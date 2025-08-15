'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message as MessageType } from './chat-interface';
import { Message } from './message';
import type { Translations } from '@/lib/translations';

interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
  translations: Translations['chatInterface'];
}

export function MessageList({ messages, isLoading, translations }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="p-4 md:p-6 space-y-6">
        {messages.map((m) => (
          <Message key={m.id} message={m} translations={translations.message} />
        ))}
        {isLoading && <Message message={{ id: 'loading', role: 'bot', content: '...' }} isLoading />}
      </div>
    </ScrollArea>
  );
}
