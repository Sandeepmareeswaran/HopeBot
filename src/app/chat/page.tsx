import { ChatInterface } from '@/components/chat/chat-interface';
import { ChatHeader } from '@/components/chat/chat-header';

export default function ChatPage() {
  return (
    <div className="flex flex-col h-full bg-background">
      <ChatHeader />
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
