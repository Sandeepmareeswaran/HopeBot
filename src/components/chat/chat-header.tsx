import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HopeBotLogo } from '@/components/icons/hope-bot-logo';
import { ArrowLeft } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

export function ChatHeader() {
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
      <div className="flex items-center space-x-2">
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
