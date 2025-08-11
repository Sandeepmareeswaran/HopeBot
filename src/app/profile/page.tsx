'use client';

import React from 'react';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function ProfilePage() {
  const { user } = useUser();

  return (
    <div className="flex flex-col h-full">
      <header className="flex-shrink-0 flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Profile</h1>
        <SignOutButton>
          <Button variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </SignOutButton>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2" />
                  Your Profile
                </CardTitle>
                <CardDescription>View your profile information.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                    <p>Hello, {user?.firstName || 'friend'}!</p>
                    <p>Email: {user?.primaryEmailAddress?.toString()}</p>
                </div>
              </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
