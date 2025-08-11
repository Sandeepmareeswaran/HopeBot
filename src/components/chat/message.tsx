'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { HopeBotLogo } from '@/components/icons/hope-bot-logo';
import { Volume2, VolumeX } from 'lucide-react';
import type { Message as MessageType } from './chat-interface';

interface MessageProps {
  message: MessageType;
  isLoading?: boolean;
}

function extractTextFromReactNode(node: React.ReactNode): string {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(extractTextFromReactNode).join(' ');
    if (node && typeof node === 'object' && 'props' in node && node.props.children) {
      return extractTextFromReactNode(node.props.children);
    }
    return '';
}

export function Message({ message, isLoading = false }: MessageProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isBot = message.role === 'bot';

  const handleTextToSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    
    const textToSpeak = extractTextFromReactNode(message.content);
    if (textToSpeak && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={cn('flex items-start gap-3', isBot ? 'justify-start' : 'justify-end')}>
      {isBot && (
        <Avatar className="h-9 w-9 border">
          <AvatarImage asChild src="/placeholder.svg">
             <HopeBotLogo className="p-1.5 text-primary" />
          </AvatarImage>
          <AvatarFallback>HB</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-md rounded-2xl p-3.5',
          isBot
            ? 'bg-card text-card-foreground rounded-tl-none'
            : 'bg-primary text-primary-foreground rounded-br-none'
        )}
      >
        {isLoading ? (
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-2 bg-current rounded-full animate-pulse [animation-delay:-0.3s]" />
            <span className="h-2 w-2 bg-current rounded-full animate-pulse [animation-delay:-0.15s]" />
            <span className="h-2 w-2 bg-current rounded-full animate-pulse" />
          </div>
        ) : (
          <div className="text-sm break-words whitespace-pre-wrap">{message.content}</div>
        )}
      </div>
      {isBot && !isLoading && (
        <Button
          size="icon"
          variant="ghost"
          className="h-9 w-9 shrink-0 text-muted-foreground"
          onClick={handleTextToSpeech}
          aria-label={isSpeaking ? "Stop speech" : "Read message aloud"}
        >
          {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
      )}
    </div>
  );
}
