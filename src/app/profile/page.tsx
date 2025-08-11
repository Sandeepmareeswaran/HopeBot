'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useUser, SignOutButton } from '@clerk/nextjs';
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
import { Skeleton } from '@/components/ui/skeleton';
import { DailyRecord, getRecordsForUser, storeRecordForUser } from '@/app/actions';

function calculateStreaks(records: DailyRecord[]) {
    if (!records || records.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const activeDays = new Set(records.filter(r => r.timeSpent > 0).map(r => r.date));
  if (activeDays.size === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }
  
  const sortedDates = Array.from(activeDays).sort();

  let longestStreak = 0;
  let currentStreakForLongest = 0;
  for (let i = 0; i < sortedDates.length; i++) {
    if (i > 0) {
      const currentDate = new Date(sortedDates[i]);
      const prevDate = new Date(sortedDates[i - 1]);
      const diffDays = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays === 1) {
        currentStreakForLongest++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreakForLongest);
        currentStreakForLongest = 1;
      }
    } else {
      currentStreakForLongest = 1;
    }
  }
  longestStreak = Math.max(longestStreak, currentStreakForLongest);

  let currentStreak = 0;
  const today = new Date();
  
  if (activeDays.has(today.toISOString().split('T')[0])) {
      let tempDate = new Date(today);
      while(activeDays.has(tempDate.toISOString().split('T')[0])) {
          currentStreak++;
          tempDate.setDate(tempDate.getDate() - 1);
      }
  }
  
  return { currentStreak, longestStreak };
}

const StreakChart = ({ data, isLoading }: { data: DailyRecord[]; isLoading: boolean }) => {
  if (isLoading) {
    return (
        <div className="grid grid-cols-7 gap-1 md:grid-cols-[repeat(53,minmax(0,1fr))] md:grid-rows-7 md:grid-flow-col">
            {Array.from({ length: 365 }).map((_, i) => (
                <Skeleton key={i} className="w-4 h-4 rounded-sm" />
            ))}
        </div>
    );
  }

  if (!data || data.length === 0) {
    return <div className="text-center text-muted-foreground">No activity data to display.</div>;
  }
  
  const weeks: (DailyRecord | { date: string; timeSpent: number })[] = [];
  const startDate = new Date(data[0].date);
  const dayOfWeek = startDate.getDay();
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
      return `${Math.ceil(record.timeSpent / 60)} minutes on ${date.toLocaleDateString()}`;
    }
    return `No activity on ${date.toLocaleDateString()}`;
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-7 gap-1 md:grid-cols-[repeat(53,minmax(0,1fr))] md:grid-rows-7 md:grid-flow-col">
        {weeks.map((record, index) =>
          record.date.startsWith('empty') ? (
            <div key={record.date} className="w-4 h-4" />
          ) : (
            <Tooltip key={`${record.date}-${index}`}>
              <TooltipTrigger asChild>
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{
                    backgroundColor: record.timeSpent > 0 ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                    opacity: record.timeSpent > 0 ? Math.min(1, 0.2 + (record.timeSpent / 3600)) : 1,
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
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async (userId: string) => {
    setIsLoading(true);
    const records = await getRecordsForUser(userId);
    setDailyRecords(records);
    setStreaks(calculateStreaks(records));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadData(user.id);
    }
  }, [user?.id, loadData]);

  // Track time spent
  useEffect(() => {
    if (!user?.id) return;

    const startTime = Date.now();
    const handleBeforeUnload = async () => {
      const endTime = Date.now();
      const timeSpentInSeconds = Math.round((endTime - startTime) / 1000);
      if (timeSpentInSeconds > 0) {
        await storeRecordForUser(user.id, timeSpentInSeconds);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user?.id]);

  return (
    <div className="flex flex-col h-full">
      <header className="flex-shrink-0 flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Profile & Activity</h1>
        <SignOutButton>
          <Button variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </SignOutButton>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2" />
                  Your Profile
                </CardTitle>
                <CardDescription>Manage your account settings.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="[&_.cl-internal-w4f4o5]:hidden">
                    <user-profile />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2" />
                  Your Activity
                </CardTitle>
                <CardDescription>Track your engagement and streaks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-secondary p-4 rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-secondary-foreground">Current Streak</h3>
                    {isLoading ? <Skeleton className="h-10 w-1/2 mx-auto mt-1" /> : <p className="text-4xl font-bold text-primary">{streaks.currentStreak} days</p>}
                  </div>
                  <div className="bg-secondary p-4 rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-secondary-foreground">Longest Streak</h3>
                    {isLoading ? <Skeleton className="h-10 w-1/2 mx-auto mt-1" /> : <p className="text-4xl font-bold text-primary">{streaks.longestStreak} days</p>}
                  </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Daily Activity (Last Year)</h3>
                    <div className="overflow-x-auto pb-4">
                      <StreakChart data={dailyRecords} isLoading={isLoading} />
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
