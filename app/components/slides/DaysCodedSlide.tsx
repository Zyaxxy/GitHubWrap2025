import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { SlideProps } from '../../types';
import CountUp from '../CountUp';
import { Sticker } from '../ui/Sticker';

export const DaysCodedSlide: React.FC<SlideProps> = ({ data }) => {
  const stats = useMemo(() => {
    // ... (logic remains same, just ensuring we have data)
    const dates = data.commitDates.map(d => new Date(d));
    if (dates.length === 0) return null;

    const uniqueDays = new Set<string>();
    const dayMap: Record<string, number> = {};
    let weekendCommits = 0;

    dates.forEach(date => {
      const dateStr = date.toDateString();
      uniqueDays.add(dateStr);
      dayMap[dateStr] = (dayMap[dateStr] || 0) + 1;
      const day = date.getDay();
      if (day === 0 || day === 6) weekendCommits++;
    });

    const totalActiveDays = uniqueDays.size;
    const sortedDates = Array.from(uniqueDays).map(d => new Date(d)).sort((a, b) => a.getTime() - b.getTime());

    // Streak logic
    let maxStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    sortedDates.forEach((date) => {
      if (prevDate) {
        const diffTime = Math.abs(date.getTime() - prevDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) tempStreak++;
        else tempStreak = 1;
      } else {
        tempStreak = 1;
      }
      if (tempStreak > maxStreak) maxStreak = tempStreak;
      prevDate = date;
    });

    const lastCommitDate = sortedDates[sortedDates.length - 1];
    const today = new Date();
    const diffToToday = Math.ceil(Math.abs(today.getTime() - lastCommitDate.getTime()) / (1000 * 60 * 60 * 24));
    currentStreak = diffToToday <= 2 ? tempStreak : 0;

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

    return { totalActiveDays, maxStreak, currentStreak, persona, roast };
  }, [data.commitDates]);

  if (!stats) return <div className="bg-black text-white h-full flex items-center justify-center">No Data</div>;

  return (
    <div className="flex flex-col h-full w-full bg-linear-to-b from-gray-900 to-black text-white relative overflow-hidden font-sans p-6 items-center justify-center">

      {/* Background Heatmap Effect */}
      <div className="absolute inset-0 grid grid-cols-12 gap-1 opacity-10 pointer-events-none transform -skew-y-12 scale-150">
        {Array.from({ length: 144 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: Math.random() }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            className={`w-full aspect-square ${Math.random() > 0.7 ? 'bg-accent-green' : 'bg-gray-800'} rounded-sm`}
          />
        ))}
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="z-10 w-full max-w-2xl"
      >
        <Sticker className="bg-mixtape-surface border-4 border-white shadow-[10px_10px_0px_0px_#1DB954] p-8 -rotate-1">
          {/* Top Section */}
          <div className="flex justify-between items-start mb-8 border-b-2 border-dashed border-gray-600 pb-6">
            <div>
              <h2 className="text-xl font-bold uppercase text-gray-400 tracking-wider mb-2">Active Days</h2>
              <div className="flex items-baseline">
                <span className="text-8xl md:text-9xl font-black tracking-tighter text-accent-green leading-none drop-shadow-[0_0_15px_rgba(29,185,84,0.5)]">
                  <CountUp from={0} to={stats.totalActiveDays} duration={1.5} />
                </span>
                <span className="ml-4 text-3xl font-bold text-gray-500 transform -rotate-12"> / 365</span>
              </div>
            </div>
            {/* Streak Badge */}
            <div className="flex flex-col items-center animate-pulse">
              <div className="text-5xl">🔥</div>
              <div className="font-black text-accent-rose text-xl uppercase tracking-tighter">
                {stats.maxStreak} Day Streak
              </div>
            </div>
          </div>

          {/* Persona */}
          <div className="text-center">
            <div className="inline-block bg-white text-black font-black text-3xl uppercase px-4 py-2 transform -skew-x-12 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
              {stats.persona}
            </div>
            <p className="text-xl font-mono text-gray-300 max-w-lg mx-auto leading-relaxed">
              "{stats.roast}"
            </p>
          </div>
        </Sticker>
      </motion.div>
    </div>
  );
};