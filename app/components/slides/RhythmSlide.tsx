
import React from 'react';
import { motion } from 'framer-motion';
import { SlideProps } from '../../types';

export const RhythmSlide: React.FC<SlideProps> = ({ data }) => {
  // Generate mock frequency data based on peak time
  const hour = parseInt(data.peakTime.split(':')[0]);

  // Create equalizer bars
  const bars = [
    { label: '6AM', height: hour >= 5 && hour < 12 ? 90 : 30, color: '#FFB5B5' }, // Morning
    { label: '12PM', height: hour >= 12 && hour < 18 ? 100 : 40, color: '#2E77D0' }, // Day
    { label: '6PM', height: hour >= 18 && hour < 23 ? 95 : 50, color: '#1DB954' }, // Evening
    { label: '12AM', height: hour >= 23 || hour < 5 ? 100 : 60, color: '#EE3124' }, // Night
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full relative z-10 p-4 bg-black overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12 relative z-10"
      >
        <h2 className="text-6xl md:text-8xl font-black mb-2 uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-accent-green via-white to-accent-green animate-pulse">
          Rhythm
        </h2>
        <p className="font-mono text-xl md:text-2xl text-white">
          Your peak flow is at <span className="border-b-4 border-accent-rose text-accent-rose font-bold">{data.peakTime}</span>
        </p>
        <div className="mt-2 text-sm font-mono text-gray-400 bg-white/10 inline-block px-3 py-1 rounded-full border border-white/20">
          Dx: {data.peakTimeCategory}
        </div>
      </motion.div>

      {/* Equalizer Visualization */}
      <div className="flex items-end justify-center gap-4 h-64 w-full max-w-3xl px-8 relative z-10">
        {bars.map((bar, index) => (
          <div key={index} className="flex flex-col items-center gap-4 flex-1 h-full justify-end group">
            {/* Bar */}
            <motion.div
              initial={{ height: "0%" }}
              animate={{ height: [`${bar.height}%`, `${bar.height * 0.8}%`, `${bar.height}%`] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse",
                delay: index * 0.1,
                ease: "easeIn"
              }}
              className="w-full rounded-sm relative shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:brightness-125 transition-all cursor-pointer"
              style={{ backgroundColor: bar.color }}
            >
              {/* Glitch Overlay on Bar */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 animate-pulse" />
            </motion.div>

            {/* Label */}
            <span className="font-mono font-bold text-lg md:text-xl tracking-widest">{bar.label}</span>
          </div>
        ))}
      </div>

      {/* Decorative Bottom Text */}
      <div className="absolute bottom-12 text-center font-mono text-xs text-gray-600 uppercase tracking-widest">
        Audio Frequency Analysis // 2025
      </div>
    </div>
  );
};
