import React, { useMemo } from 'react';
import { SlideProps } from '../../types';
import CountUp from '../CountUp';

export const DaysCodedSlide: React.FC<SlideProps> = ({ data }) => {
  const stats = useMemo(() => {
    const dates = data.commitDates.map(d => new Date(d));
    if (dates.length === 0) return null;

    // 1. Unique Days (Normalize to Midnight)
    const uniqueDays = new Set<string>();
    const dayMap: Record<string, number> = {}; // Count commits per day
    let weekendCommits = 0;

    dates.forEach(date => {
      const dateStr = date.toDateString(); // "Fri Apr 10 2025"
      uniqueDays.add(dateStr);
      dayMap[dateStr] = (dayMap[dateStr] || 0) + 1;

      const day = date.getDay();
      if (day === 0 || day === 6) weekendCommits++;
    });

    const totalActiveDays = uniqueDays.size;
    const sortedDates = Array.from(uniqueDays).map(d => new Date(d)).sort((a, b) => a.getTime() - b.getTime());

    // 2. Calculate Streaks
    let maxStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    sortedDates.forEach((date) => {
      if (prevDate) {
        const diffTime = Math.abs(date.getTime() - prevDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }

      if (tempStreak > maxStreak) maxStreak = tempStreak;
      prevDate = date;
    });

    // Check if streak is "current" (active today or yesterday)
    const lastCommitDate = sortedDates[sortedDates.length - 1];
    const today = new Date();
    const diffToToday = Math.ceil(Math.abs(today.getTime() - lastCommitDate.getTime()) / (1000 * 60 * 60 * 24));

    // If last commit was > 2 days ago, current streak is 0
    currentStreak = diffToToday <= 2 ? tempStreak : 0;

    // 3. Determine Persona
    const weekendRatio = weekendCommits / data.commitDates.length;
    let persona = "The Hobbyist";
    let roast = "You code when you feel like it. Which isn't often.";

    if (totalActiveDays > 200) {
      persona = "The Machine";
      roast = "You coded more days than you showered. We respect the hustle, but please take a break.";
    } else if (maxStreak > 14) {
      persona = "The Obsessive";
      roast = `You went ${maxStreak} days without a break. Who hurt you?`;
    } else if (weekendRatio > 0.4) {
      persona = "The Weekend Warrior";
      roast = "Monday to Friday is for the boss. Saturday and Sunday are for the bugs.";
    } else if (currentStreak > 5) {
      persona = "The Hot Hand";
      roast = `Riding a ${currentStreak}-day streak! Don't blow it now.`;
    }

    return {
      totalActiveDays,
      maxStreak,
      currentStreak,
      persona,
      roast,
      firstDate: sortedDates[0],
      lastDate: sortedDates[sortedDates.length - 1]
    };
  }, [data.commitDates]);

  if (!stats) return <div className="bg-black text-white h-full flex items-center justify-center">No Data</div>;

  return (
    <div className="flex flex-col h-full w-full bg-[#F3F4F6] text-black relative overflow-hidden font-sans">

      {/* Background Pattern: A subtle grid representing days */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      />

      <div className="z-10 flex flex-col h-full p-8 justify-between">

        {/* Top Section: The Big Number */}
        <div>
          <h2 className="text-xl font-bold uppercase text-gray-500 tracking-wider">Active Days</h2>
          <div className="flex items-baseline mt-2">
            <span className="text-9xl font-black tracking-tighter text-[#FF4F00]">
              <CountUp
                from={0}
                to={stats.totalActiveDays}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text"
              />
            </span>
            <span className="ml-4 text-2xl font-bold text-gray-400">
              / 365
            </span>
          </div>
        </div>

        {/* Middle Section: The Streak Visual */}
        <div className="flex flex-col items-center justify-center my-8">
          <div className="relative w-full max-w-lg bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-1">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold uppercase text-gray-400">Longest Streak</span>
              <span className="text-4xl font-black">{stats.maxStreak} Days</span>
            </div>

            {/* Streak Bar Visualization */}
            <div className="flex space-x-1 h-12 w-full">
              {Array.from({ length: Math.min(20, stats.maxStreak + 5) }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-sm ${i < stats.maxStreak ? 'bg-[#FF4F00]' : 'bg-gray-200'}`}
                />
              ))}
            </div>
            <p className="text-xs text-right mt-2 font-mono text-gray-400">
              Current Streak: {stats.currentStreak} days
            </p>
          </div>
        </div>

        {/* Bottom Section: The Roast */}
        <div className="text-center mb-12">
          <h3 className="text-4xl font-black uppercase italic leading-none mb-2">
            "{stats.persona}"
          </h3>
          <p className="text-xl font-medium text-gray-600 max-w-md ml-auto mr-auto">
            {stats.roast}
          </p>
        </div>

      </div>
    </div>
  );
};