'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HopeBotLogo } from '@/components/icons/hope-bot-logo';
import { ArrowLeft, Check, Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Language } from '@/lib/translations';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function ChatHeader({
  currentLanguage,
  onLanguageChange,
}: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between p-2 md:p-4 border-b bg-card/50 backdrop-blur-sm">
      <Button asChild variant="ghost" size="icon">
        <Link href="/" aria-label="Back to home">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </Button>
      <div className="flex items-center space-x-2">
        <HopeBotLogo className="w-8 h-8 bg-gradient-blue-glow from-blue-500 to-cyan-400 text-transparent bg-clip-text" />
        <span
          className={cn(
            'text-lg font-semibold',
            'bg-gradient-blue-glow from-blue-500 to-cyan-400 text-transparent bg-clip-text'
          )}
        >
          HopeBot
        </span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Change language">
            <Languages className="h-5 w-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => onLanguageChange('English')}>
            <span className="flex-1">English</span>
            {currentLanguage === 'English' && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onLanguageChange('Tamil')}>
            <span className="flex-1">தமிழ்</span>
            {currentLanguage === 'Tamil' && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onLanguageChange('Hindi')}>
            <span className="flex-1">हिंदी</span>
            {currentLanguage === 'Hindi' && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
