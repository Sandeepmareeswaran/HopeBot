import Link from 'next/link';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { MessageSquarePlus, MessageSquareText } from 'lucide-react';
import type { Chat } from '@/lib/db';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface ChatSidebarProps {
  chats: Chat[];
}

export function ChatSidebar({ chats }: ChatSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-[300px] h-full flex flex-col p-4 bg-card/20 border-r">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Conversations</h2>
        <Button asChild variant="ghost" size="icon">
          <Link href="/chat">
            <MessageSquarePlus className="h-5 w-5" />
            <span className="sr-only">New Chat</span>
          </Link>
        </Button>
      </div>
      <ScrollArea className="flex-1 -mx-4">
        <div className="px-4 space-y-1">
          {chats.map((chat) => (
            <Button
              key={chat.id}
              asChild
              variant={pathname.includes(chat.id) ? 'secondary' : 'ghost'}
              className="w-full justify-start"
            >
              <Link
                href={`/chat/${chat.id}`}
                className="truncate"
                title={chat.title}
              >
                <MessageSquareText className="mr-2 h-4 w-4 flex-shrink-0" />
                {chat.title}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
