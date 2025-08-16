'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HopeBotLogo } from '@/components/icons/hope-bot-logo';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getTranslations, type Translations } from '@/lib/translations';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const href = '/login';
  const [t, setT] = useState<Translations['landingPage']>(
    getTranslations('English').landingPage
  );

  useEffect(() => {
    const storedLang =
      (localStorage.getItem('hopebot-language') as keyof Translations) ||
      'English';
    setT(getTranslations(storedLang).landingPage);
  }, []);

  return (
    <main className="flex h-full w-full flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-lg">
        <HopeBotLogo className="w-24 h-24 bg-gradient-blue-glow from-blue-500 to-cyan-400 text-transparent bg-clip-text" />
        <h1
          className={cn(
            'text-4xl md:text-5xl font-bold tracking-tight',
            'bg-gradient-blue-glow from-blue-500 to-cyan-400 text-transparent bg-clip-text'
          )}
        >
          {t.title}
        </h1>
        <p className="text-lg text-muted-foreground">{t.subtitle}</p>

        <Button asChild size="lg" className="group">
          <Link href={href}>
            {t.getStarted}
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground pt-8">{t.disclaimer}</p>
      </div>
    </main>
  );
}
