'use client';

import { useState, useRef, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useUser } from '@clerk/nextjs';
import { useToast } from "@/hooks/use-toast"
import { handleUserMessage, storeRecordForUser, type BotResponse } from '@/app/actions';
import { MessageList } from './message-list';
import { ChatForm } from './chat-form';

export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string | React.ReactNode;
}

// Extend the Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();
  const { user } = useUser();

  // Track time spent on chat page
  useEffect(() => {
    if (!user?.id) return;
  
    const startTime = Date.now();
    let lastSaveTime = Date.now();
  
    const saveInterval = setInterval(async () => {
      const now = Date.now();
      const timeSpentInSeconds = Math.round((now - lastSaveTime) / 1000);
      if (timeSpentInSeconds > 0) {
        await storeRecordForUser(user.id, timeSpentInSeconds);
        lastSaveTime = now;
      }
    }, 10000); // Save every 10 seconds
  
    const handleBeforeUnload = async () => {
      const endTime = Date.now();
      const timeSpentInSeconds = Math.round((endTime - lastSaveTime) / 1000);
      if (timeSpentInSeconds > 0) {
        await storeRecordForUser(user.id, timeSpentInSeconds);
      }
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      clearInterval(saveInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload(); // Save any remaining time when component unmounts
    };
  }, [user?.id]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setInput(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Speech Recognition Error",
          description: "Could not start speech recognition. Please check your microphone permissions.",
          variant: "destructive",
        })
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
        console.warn("Speech Recognition not supported in this browser.")
    }
  }, [toast]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsRecording(!isRecording);
  };
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const userInput = input;
    setInput('');

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
    };
    setMessages((prev) => [...prev, userMessage]);

    const result = await handleUserMessage(userInput);
    
    const botMessageContent = (
      <div>
        <p>{result.response}</p>
        {result.recommendations && (
          <div className="mt-4 space-y-3">
            {result.recommendations.calmingExercises.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-1">Calming Exercises:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {result.recommendations.calmingExercises.map((ex, i) => <li key={`ex-${i}`}>{ex}</li>)}
                </ul>
              </div>
            )}
            {result.recommendations.cbtPrompts.length > 0 && (
               <div>
                <h4 className="font-semibold text-sm mb-1">Mindful Prompts:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {result.recommendations.cbtPrompts.map((p, i) => <li key={`p-${i}`}>{p}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
    
    const botMessage: Message = {
      id: `${Date.now()}-bot`,
      role: 'bot',
      content: botMessageContent,
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatForm
        input={input}
        isRecording={isRecording}
        isLoading={isLoading}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        toggleRecording={toggleRecording}
      />
    </div>
  );
}
