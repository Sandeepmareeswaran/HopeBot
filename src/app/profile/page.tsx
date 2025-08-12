import React from 'react';

interface StreakData {
  date: string;
  hours: number;
}

const dummyStreaks: StreakData[] = Array.from({ length: 365 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  return {
    date: date.toISOString().split('T')[0],
    hours: Math.floor(Math.random() * 5) // Random hours between 0 and 4
  };
}).reverse(); // Display chronologically

const ProfilePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="grid grid-cols-7 gap-1">
        {dummyStreaks.map((streak, index) => (
          <div
            key={index}
            className={`w-5 h-5 rounded-sm ${streak.hours > 0 ? 'bg-green-500' : 'bg-gray-200'}`}
            title={`${streak.date}: ${streak.hours} hours`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;