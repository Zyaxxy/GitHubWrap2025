import React from 'react';
import { motion } from 'framer-motion';
import { SlideProps } from '../../types';
import { Sticker } from '../ui/Sticker';
import { Trash2 } from 'lucide-react';

export const TrashSlide: React.FC<SlideProps> = ({ data }) => {
  const net = data.additions - data.deletions;
  const totalChurn = data.additions + data.deletions;

  // Dynamic roast logic
  const getNetInsult = () => {
    if (net < -500) return "Your best contribution was pressing Backspace.";
    if (data.additions > data.deletions * 4 && totalChurn > 1000) return "Refactoring is for cowards. You just pile more garbage on top.";
    if (totalChurn > 1000 && Math.abs(net) < (totalChurn * 0.1)) return "You ran a marathon just to end up exactly where you started.";
    if (totalChurn < 100) return "I've seen READMEs with more complexity than your entire year.";
    if (net < 0) return "Less code, fewer bugs? No, just less functionality.";
    return "You basically rewrote the same function 100 times.";
  };

  return (
    <div className="flex flex-col items-center justify-center h-full relative z-10 p-4 bg-gray-200 text-black overflow-hidden">

      {/* Background Crumpled Paper Effect */}
      <div className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
          filter: 'contrast(150%) brightness(90%)'
        }}
      />

      <motion.div
        initial={{ scale: 0.9, rotate: -2, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-lg"
      >
        <div className="bg-white p-8 shadow-xl transform rotate-1 border border-gray-300 relative">
          {/* Torn Paper Header */}
          <div className="absolute -top-6 left-0 right-0 h-8 bg-gray-800 -rotate-1 flex items-center justify-center text-white font-mono text-xs uppercase tracking-widest">
            /dev/null
          </div>

          <div className="flex justify-between items-center mb-8 mt-2">
            <Trash2 size={40} className="text-gray-400" />
            <div className="text-right">
              <h2 className="text-4xl font-black uppercase tracking-tighter">Code Waste</h2>
              <span className="font-mono text-xs text-gray-500">Volume Analysis</span>
            </div>
          </div>

          <div className="flex gap-4 h-64 items-end mb-8 border-b-2 border-black pb-4">
            {/* Additions Bar */}
            <div className="flex-1 flex flex-col justify-end h-full">
              <span className="font-mono text-xs text-center mb-1 text-green-600 font-bold">+{data.additions}</span>
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${Math.min(100, (data.additions / totalChurn) * 100)}%` }}
                className="w-full bg-black relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-green-500 opacity-50" />
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#000_5px,#000_10px)] opacity-10" />
              </motion.div>
              <span className="text-center font-bold uppercase mt-2">Added</span>
            </div>

            {/* Deletions Bar */}
            <div className="flex-1 flex flex-col justify-end h-full">
              <span className="font-mono text-xs text-center mb-1 text-red-600 font-bold">-{data.deletions}</span>
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${Math.min(100, (data.deletions / totalChurn) * 100)}%` }}
                className="w-full bg-black relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-red-500 opacity-50" />
                <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_5px,#000_5px,#000_10px)] opacity-10" />
              </motion.div>
              <span className="text-center font-bold uppercase mt-2">Deleted</span>
            </div>
          </div>

          <div className="bg-gray-100 p-4 border-l-4 border-black">
            <p className="font-mono text-sm leading-relaxed text-gray-800 italic">
              "{getNetInsult()}"
            </p>
            <div className="mt-2 text-xs font-bold uppercase text-gray-400 text-right">
              Net: {net > 0 ? '+' : ''}{net} Lines
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};