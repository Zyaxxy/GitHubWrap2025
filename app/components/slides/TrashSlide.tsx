
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

  return (
    <div className="flex flex-col items-center justify-center h-full relative z-10 p-4">
       <h2 className="text-4xl font-bold mb-6 uppercase">Delete Button Glory</h2>
       
       <div className="w-full h-64 max-w-md bg-white p-4 sticker-shadow mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
               <XAxis type="number" hide />
               <YAxis dataKey="name" type="category" tick={{fontFamily: 'DM Mono', fontSize: 14}} width={80} />
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
            +{data.additions} lines. -{data.deletions} lines.<br/>
            Net progress: {net} lines.<br/><br/>
            <span className="text-accent-rose">You basically rewrote the same function 100 times.</span>
          </p>
       </Sticker>
    </div>
  );
};
