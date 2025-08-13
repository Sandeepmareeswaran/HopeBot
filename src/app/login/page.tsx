'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HopeBotLogo } from '@/components/icons/hope-bot-logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    
    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Please enter a valid email address.');
        return;
    }

    setLoading(true);

    try {
      // For this implementation, we will simply store the email in localStorage
      // as a mock "login" and proceed to the chat.
      // A full implementation would use Firebase Auth (e.g., sendSignInLinkToEmail).
      localStorage.setItem('userEmail', email);

      // Redirect to the chat page
      router.push('/chat');

    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
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
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Enter your email to access your conversations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing In...' : 'Continue with Email'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground pt-8 text-center max-w-sm">
        We use a passwordless sign-in. For this demo, we'll just use your email to identify you and save your chats, without sending a login link.
      </p>
    </main>
  );
}
