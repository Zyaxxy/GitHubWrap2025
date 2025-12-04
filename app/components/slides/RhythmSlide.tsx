
import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { SlideProps, COLORS } from '../../types';

export const RhythmSlide: React.FC<SlideProps> = ({ data }) => {
  // Generate mock radar data centered around peak time
  const hour = parseInt(data.peakTime.split(':')[0]);
  const radarData = [
    { subject: 'Morning', A: hour >= 5 && hour < 12 ? 100 : 20 },
    { subject: 'Day', A: hour >= 12 && hour < 18 ? 100 : 40 },
    { subject: 'Evening', A: hour >= 18 && hour < 23 ? 100 : 50 },
    { subject: 'Night', A: hour >= 23 || hour < 5 ? 100 : 80 },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full relative z-10 p-4">
      <h2 className="text-4xl font-bold mb-2 uppercase tracking-tight text-accent-green">Circadian Rhythm</h2>
      <p className="font-mono mb-8 text-center max-w-lg">
        Your brain peaks at <span className="border-b-2 border-white">{data.peakTime}</span>.
        <br/>Diagnosis: {data.peakTimeCategory}.
      </p>
      
      <div className="w-full h-64 md:h-80 max-w-md bg-mixtape-surface border-4 border-white sticker-shadow p-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
            <PolarGrid stroke="#333" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: 'white', fontFamily: 'DM Mono', fontSize: 12 }} />
            <Radar name="Activity" dataKey="A" stroke={COLORS.green} fill={COLORS.green} fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
