'use client';

import { Button } from '../ui/button';
import { LogOut, MessageSquareText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface ChatSidebarProps {
  userEmail: string;
  onLogout: () => void;
  className?: string;
}

export function ChatSidebar({
  userEmail,
  onLogout,
  className,
}: ChatSidebarProps) {
  return (
    <div
      className={cn(
        'h-full flex flex-col p-4 bg-card/20 border-r',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Conversation</h2>
      </div>
      <div className="flex-1 -mx-4">
        <div className="px-4 space-y-1">
          {/* Static conversation item */}
          <Button
            variant="secondary"
            className="w-full justify-start"
          >
            <MessageSquareText className="mr-2 h-4 w-4 flex-shrink-0" />
            My Conversation
          </Button>
        </div>
      </div>
      <div className="mt-auto">
        <div className="flex items-center gap-3 mb-2 p-2 rounded-lg">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://api.dicebear.com/8.x/bottts/svg?seed=${userEmail}`} alt="User Avatar" />
            <AvatarFallback>{userEmail.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{userEmail}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            aria-label="Logout"
            className='shrink-0'
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
