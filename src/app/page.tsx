import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HopeBotLogo } from '@/components/icons/hope-bot-logo';
import { ArrowRight } from 'lucide-react';

export default async function LandingPage() {
  const href = '/chat';

  return (
    <main className="flex h-full w-full flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-lg">
        <HopeBotLogo className="w-24 h-24 text-primary" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Welcome to HopeBot
        </h1>
        <p className="text-lg text-muted-foreground">
          Your friendly, AI-powered companion for mental wellness. Here to listen, support, and guide you through challenging moments.
        </p>

        <Button asChild size="lg" className="group">
          <Link href={href}>
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground pt-8">
          HopeBot is an AI assistant and not a replacement for professional medical advice. If you are in crisis, please contact a local emergency service.
        </p>
      </div>
    </main>
  );
}
