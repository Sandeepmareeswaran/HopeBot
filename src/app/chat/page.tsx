import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatInterface } from '@/components/chat/chat-interface';
import { ChatHeader } from '@/components/chat/chat-header';
import { getChatsForUser } from '../actions';

export default async function ChatPage() {
  const chats = await getChatsForUser();

  return (
    <div className="flex h-full bg-background">
      <ChatSidebar chats={chats} />
      <div className="flex flex-1 flex-col">
        <ChatHeader />
        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
