'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HopeBotLogo } from '@/components/icons/hope-bot-logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getTranslations, type Translations } from '@/lib/translations';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [t, setT] = useState<Translations['loginPage']>(
    getTranslations('English').loginPage
  );

  useEffect(() => {
    const storedLang =
      (localStorage.getItem('hopebot-language') as keyof Translations) ||
      'English';
    setT(getTranslations(storedLang).loginPage);
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!email) {
      setError(t.errorMessages.emailRequired);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t.errorMessages.invalidEmail);
      return;
    }

    setLoading(true);

    try {
      localStorage.setItem('userEmail', email);
      router.push('/chat');
    } catch (err) {
      console.error(err);
      setError(t.errorMessages.unexpected);
      setLoading(false);
    }
  };

  return (
    <main className="flex h-full w-full flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <HopeBotLogo className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-2xl">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.emailLabel}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t.loadingButton : t.buttonText}
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground pt-8 text-center max-w-sm">
        {t.disclaimer}
      </p>
    </main>
  );
}
