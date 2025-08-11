'use client';

import React, { useEffect, useState } from 'react';
import { UserProfile, useUser, SignOutButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Activity, LogOut, User } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Mock data for daily records and streaks
const mockDailyRecords = Array.from({ length: 365 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  return {
    date: date.toISOString().split('T')[0],
    timeSpent: Math.random() > 0.3 ? Math.floor(Math.random() * 60) + 1 : 0,
  };
}).reverse();

function calculateStreaks(records: { date: string; timeSpent: number }[]) {
  if (records.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const recordsMap = new Map<string, boolean>();
  records.forEach(r => {
    if (r.timeSpent > 0) {
      recordsMap.set(r.date, true);
    }
  });

  const sortedDates = Array.from(recordsMap.keys()).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
  if(sortedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  let longestStreak = 0;
  let currentStreak = 0;

  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i]);
    currentDate.setHours(0,0,0,0);

    if (i > 0) {
      const prevDate = new Date(sortedDates[i-1]);
      prevDate.setHours(0,0,0,0);
      const diffDays = (currentDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24);
      if (diffDays === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
  }
  
  let todayStreak = 0;
  const today = new Date();
  today.setHours(0,0,0,0);
  const todayStr = today.toISOString().split('T')[0];
  
  if (recordsMap.has(todayStr)) {
      todayStreak = 1;
      let yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      while(recordsMap.has(yesterday.toISOString().split('T')[0])) {
          todayStreak++;
          yesterday.setDate(yesterday.getDate() - 1);
      }
  }


  return { currentStreak: todayStreak, longestStreak };
}


const StreakChart = ({
  data,
}: {
  data: { date: string; timeSpent: number }[];
}) => {
  if (!data || data.length === 0) {
      return <div className="text-center text-muted-foreground">No activity data to display.</div>
  }
  const weeks = [];
  // Ensure we start on a Sunday
  const startDate = new Date(data[0].date);
  const dayOfWeek = startDate.getDay();
  // Create empty placeholders for days before the start date in that week
  for (let i = 0; i < dayOfWeek; i++) {
    weeks.push({ date: `empty-${i}`, timeSpent: -1 });
  }

  for (const record of data) {
    weeks.push(record);
  }

  const getTooltipText = (record: { date: string; timeSpent: number }) => {
    const date = new Date(record.date);
    if (isNaN(date.getTime())) return "Invalid date";
    
    if (record.timeSpent > 0) {
      return `${record.timeSpent} minutes on ${date.toLocaleDateString()}`;
    }
    return `No activity on ${date.toLocaleDateString()}`;
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-7 gap-1 md:grid-cols-53 md:grid-rows-7 md:grid-flow-col">
        {weeks.map((record) =>
          record.date.startsWith('empty') ? (
            <div key={record.date} className="w-4 h-4" />
          ) : (
            <Tooltip key={record.date}>
              <TooltipTrigger asChild>
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{
                    backgroundColor:
                      record.timeSpent > 0 ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                    opacity: record.timeSpent > 0 ? Math.min(1, 0.2 + record.timeSpent/60) : 1,
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{getTooltipText(record)}</p>
              </TooltipContent>
            </Tooltip>
          )
        )}
      </div>
    </TooltipProvider>
  );
};


function ProfilePage() {
  const { user } = useUser();
  const [streaks, setStreaks] = useState({ currentStreak: 0, longestStreak: 0 });
  const [dailyRecords, setDailyRecords] = useState<{date: string, timeSpent: number}[]>([]);

  useEffect(() => {
    // In a real app, you would fetch this data from your backend
    setDailyRecords(mockDailyRecords);
    setStreaks(calculateStreaks(mockDailyRecords));
  }, []);
  
  // Track time spent
  useEffect(() => {
    const startTime = Date.now();
    const handleBeforeUnload = () => {
      const endTime = Date.now();
      const timeSpentInSeconds = Math.round((endTime - startTime) / 1000);
      // In a real app, you would send this to your backend
      console.log(`Time spent: ${timeSpentInSeconds} seconds`);
      // Example of what a backend call could look like:
      // await fetch('/api/track-time', {
      //   method: 'POST',
      //   body: JSON.stringify({ userId: user?.id, timeSpent: timeSpentInSeconds })
      // });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Profile</h1>
        <SignOutButton>
          <Button variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </SignOutButton>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2" />
                User Information
              </CardTitle>
              <CardDescription>Your Clerk user profile.</CardDescription>
            </CardHeader>
            <CardContent>
               <UserProfile routing="hash" />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2" />
                Activity
              </CardTitle>
              <CardDescription>Your engagement with the application.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="bg-secondary p-4 rounded-lg">
                  <h3 className="text-lg font-semibold">Current Streak</h3>
                  <p className="text-3xl font-bold">{streaks.currentStreak} days</p>
                </div>
                <div className="bg-secondary p-4 rounded-lg">
                  <h3 className="text-lg font-semibold">Longest Streak</h3>
                  <p className="text-3xl font-bold">{streaks.longestStreak} days</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Daily Activity (Last Year)</h3>
              <div className="overflow-x-auto pb-4">
                 <StreakChart data={dailyRecords} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
