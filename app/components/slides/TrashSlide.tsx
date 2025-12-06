import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell } from 'recharts';
import { SlideProps, COLORS } from '../../types';
import { Sticker } from '../ui/Sticker';

export const TrashSlide: React.FC<SlideProps> = ({ data }) => {
  const chartData = [
    { name: 'Added', amt: data.additions, fill: COLORS.green },
    { name: 'Deleted', amt: data.deletions, fill: COLORS.rose },
  ];
  const net = data.additions - data.deletions;
  const totalChurn = data.additions + data.deletions;

  // Dynamic roast logic based on additions vs deletions
  const getNetInsult = () => {
    // 1. The Destroyer (Deleted way more than added)
    if (net < -500) {
      return "Your best contribution to this project was pressing the Backspace key.";
    }

    // 2. The Bloater (Added way more than deleted)
    if (data.additions > data.deletions * 4 && totalChurn > 1000) {
      return "Refactoring is for cowards. You just pile more garbage on top.";
    }

    // 3. The Churner (High activity, almost 0 net change)
    // Checks if net change is less than 10% of total work done
    if (totalChurn > 1000 && Math.abs(net) < (totalChurn * 0.1)) {
      return "You ran a marathon just to end up exactly where you started.";
    }

    // 4. The Minimalist (Very low volume)
    if (totalChurn < 100) {
      return "I've seen README files with more complexity than your entire year.";
    }

    // 5. The Net Negative (Slightly more deleted)
    if (net < 0) {
      return "Less code, fewer bugs? No, just less functionality.";
    }

    // Default
    return "You basically rewrote the same function 100 times.";
  };

  return (
    <div className="flex flex-col items-center justify-center h-full relative z-10 p-4">
      <h2 className="text-4xl font-bold mb-6 uppercase">Delete Button Glory</h2>

      <div className="w-full h-64 max-w-md bg-white p-4 sticker-shadow mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" tick={{ fontFamily: 'DM Mono', fontSize: 14 }} width={80} />
            <Bar dataKey="amt" barSize={40}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Sticker className="max-w-md transform -rotate-1 bg-black text-white border-white">
        <p className="font-mono">
          <span className="text-accent-green">+{data.additions}</span> / <span className="text-accent-rose">-{data.deletions}</span>
          <br />
          Net progress: {net > 0 ? '+' : ''}{net} lines.
          <br /><br />
          <span className="text-accent-rose font-bold block mt-2 border-t border-gray-700 pt-2">
            {getNetInsult()}
          </span>
        </p>
      </Sticker>
    </div>
  );
};