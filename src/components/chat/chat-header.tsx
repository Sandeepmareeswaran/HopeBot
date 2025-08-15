'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { HopeBotLogo } from '@/components/icons/hope-bot-logo';
import { ArrowLeft, Languages } from 'lucide-react';

interface ChatHeaderProps {
  language: string;
  setLanguage: (language: string) => void;
}

export function ChatHeader({ language, setLanguage }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between p-2 md:p-4 border-b bg-card/50 backdrop-blur-sm">
      <Button asChild variant="ghost" size="icon">
        <Link href="/" aria-label="Back to home">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </Button>
      <div className="flex items-center space-x-2">
        <HopeBotLogo className="w-8 h-8 text-primary" />
        <span className="text-lg font-semibold text-foreground">HopeBot</span>
      </div>
      <div className="flex items-center space-x-2 w-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Languages className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={language}
              onValueChange={setLanguage}
            >
              <DropdownMenuRadioItem value="English">
                English
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Tamil">Tamil</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Hindi">Hindi</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
