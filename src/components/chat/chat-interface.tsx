'use client';

import {
  useState,
  useRef,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from 'react';
import { useToast } from '@/hooks/use-toast';
import { handleUserMessage } from '@/app/actions';
import { MessageList } from './message-list';
import { ChatForm } from './chat-form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Language, Translations } from '@/lib/translations';

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

interface ChatInterfaceProps {
  userEmail: string;
  initialMessages: Message[];
  isLoadingHistory: boolean;
  language: Language;
  translations: Translations['chatInterface'];
}

export function ChatInterface({
  userEmail,
  initialMessages,
  isLoadingHistory,
  language,
  translations,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Map the content to a simple paragraph for initial render.
    const formattedHistory = initialMessages.map((msg) => ({
      ...msg,
      content: <p>{msg.content}</p>,
    }));
    setMessages(formattedHistory);
  }, [initialMessages]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      const langCode = {
        'English': 'en-US',
        'Tamil': 'ta-IN',
        'Hindi': 'hi-IN'
      }
      recognition.lang = langCode[language];

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
          title: translations.speechError.title,
          description: translations.speechError.description,
          variant: 'destructive',
        });
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn('Speech Recognition not supported in this browser.');
    }
  }, [toast, translations, language]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsRecording(!isRecording);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
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

    const result = await handleUserMessage(userInput, userEmail, language);

    if (!result || !result.response) {
      toast({
        title: 'Error',
        description: translations.unexpectedError,
        variant: 'destructive',
      });
      setMessages((prev) => prev.slice(0, prev.length - 1));
      setInput(userInput);
      setIsLoading(false);
      return;
    }

    const botMessageContent = (
      <div>
        <p>{result.response}</p>
        {result.recommendations && (
          <Accordion type="single" collapsible className="w-full mt-4">
            {result.recommendations.calmingExercises.length > 0 && (
              <AccordionItem value="calming-exercises">
                <AccordionTrigger>
                  {translations.recommendations.calmingExercises}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.recommendations.calmingExercises.map(
                      (exercise, index) => (
                        <li key={`calm-${index}`}>{exercise}</li>
                      )
                    )}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}
            {result.recommendations.cbtPrompts.length > 0 && (
              <AccordionItem value="cbt-prompts">
                <AccordionTrigger>
                  {translations.recommendations.cbtPrompts}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.recommendations.cbtPrompts.map((prompt, index) => (
                      <li key={`cbt-${index}`}>{prompt}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
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
      <MessageList messages={messages} isLoading={isLoading || isLoadingHistory} translations={translations} />
      <ChatForm
        input={input}
        isRecording={isRecording}
        isLoading={isLoading}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        toggleRecording={toggleRecording}
        translations={translations.chatForm}
      />
    </div>
  );
}
