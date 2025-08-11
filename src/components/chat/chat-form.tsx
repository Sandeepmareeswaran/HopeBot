'use client';

import { type ChangeEvent, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, SendHorizonal, Square } from 'lucide-react';

interface ChatFormProps {
  input: string;
  isRecording: boolean;
  isLoading: boolean;
  handleInputChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  toggleRecording: () => void;
}

export function ChatForm({
  input,
  isRecording,
  isLoading,
  handleInputChange,
  handleSubmit,
  toggleRecording,
}: ChatFormProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-card/80 backdrop-blur-sm border-t"
    >
      <div className="relative">
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="How are you feeling today?"
          rows={1}
          maxRows={5}
          className="w-full pr-24 py-3 resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
            }
          }}
          disabled={isLoading || isRecording}
          aria-label="Chat input"
        />
        <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center space-x-2">
          <Button
            type="button"
            size="icon"
            variant={isRecording ? 'destructive' : 'secondary'}
            onClick={toggleRecording}
            disabled={isLoading}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isRecording ? (
              <Square className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
          <Button type="submit" size="icon" disabled={!input.trim() || isLoading} aria-label="Send message">
            <SendHorizonal className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </form>
  );
}
