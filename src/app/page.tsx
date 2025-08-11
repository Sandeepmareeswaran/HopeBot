import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HopeBotLogo } from '@/components/icons/hope-bot-logo';
import { ArrowRight, Clock } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';
import { getTotalTimeSpentForUser } from '@/app/actions';
import { Card, CardContent } from '@/components/ui/card';

function formatTime(seconds: number) {
  if (seconds < 60) {
    return `${seconds} sec`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (remainingSeconds === 0) {
    return `${minutes} min`;
  }
  return `${minutes} min ${remainingSeconds} sec`;
}

export default async function LandingPage() {
  const { userId } = auth();
  const href = userId ? '/chat' : '/sign-in';
  let totalTimeSpent = 0;

  if (userId) {
    totalTimeSpent = await getTotalTimeSpentForUser(userId);
  }

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

        {userId && totalTimeSpent > 0 && (
          <Card className="bg-secondary/50">
            <CardContent className="p-4">
              <div className="flex items-center text-secondary-foreground">
                <Clock className="mr-2 h-5 w-5" />
                <p className="text-sm">
                  Total time spent in app:{" "}
                  <span className="font-semibold">{formatTime(totalTimeSpent)}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

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
