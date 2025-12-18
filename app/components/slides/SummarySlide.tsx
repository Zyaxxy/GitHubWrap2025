
import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Github, RefreshCw, Share2 } from 'lucide-react';
import { SlideProps } from '../../types';

export const SummarySlide: React.FC<SlideProps> = ({ data }) => {
   const cardRef = useRef<HTMLDivElement>(null);
   const x = useMotionValue(0);
   const y = useMotionValue(0);

   const rotateX = useTransform(y, [-100, 100], [10, -10]);
   const rotateY = useTransform(x, [-100, 100], [-10, 10]);

   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (rect) {
         const centerX = rect.left + rect.width / 2;
         const centerY = rect.top + rect.height / 2;
         x.set(e.clientX - centerX);
         y.set(e.clientY - centerY);
      }
   };

   const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
   };

   return (
      <div
         className="flex flex-col items-center justify-center h-full relative z-10 p-4 bg-black overflow-hidden perspective-1000"
         onMouseMove={handleMouseMove}
         onMouseLeave={handleMouseLeave}
      >
         {/* Dynamic Background */}
         <div className="absolute inset-0 bg-linear-to-br from-gray-900 to-black pointer-events-none" />
         <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none filter contrast-150 brightness-100" />

         <motion.div
            ref={cardRef}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="w-full max-w-sm bg-black border-8 border-gray-800 relative group cursor-pointer"
         >
            {/* Holo Foil Overlay */}
            <div className="absolute inset-0 z-20 opacity-30 mix-blend-overlay bg-linear-to-br from-transparent via-white to-transparent pointer-events-none animate-pulse" />
            <div className="absolute inset-0 z-20 opacity-20 mix-blend-color-dodge bg-linear-to-tr from-purple-500 via-green-500 to-red-500 pointer-events-none" />

            {/* Top Label */}
            <div className="bg-gray-800 text-white font-mono text-center text-xs py-1 uppercase tracking-widest border-b border-gray-700">
               GitWrapped 2025 • Limited Edition
            </div>

            <div className="p-6 relative z-10 bg-black/90">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-20 h-20 border-2 border-white overflow-hidden relative shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                     <img src={data.avatarUrl} className="w-full h-full object-cover grayscale contrast-125" alt="user" />
                     <div className="absolute inset-0 bg-accent-green opacity-20 mix-blend-overlay" />
                  </div>
                  <div className="text-right">
                     <div className="text-4xl font-black text-white italic tracking-tighter shadow-black drop-shadow-lg">{data.username}</div>
                     <div className="inline-block bg-accent-rose text-black font-bold px-2 text-xs uppercase transform rotate-2">
                        Garbage Collector
                     </div>
                  </div>
               </div>

               {/* Stats Grid */}
               <div className="grid grid-cols-2 gap-4 mb-6 font-mono text-sm border-t border-b border-gray-800 py-4">
                  <div className="text-gray-400">Total Hours</div>
                  <div className="text-right font-bold text-accent-green">{data.totalHours}</div>

                  <div className="text-gray-400">Top Language</div>
                  <div className="text-right font-bold text-accent-blue">{data.topLanguages[0]?.name}</div>

                  <div className="text-gray-400">F-Pushes</div>
                  <div className="text-right font-bold text-accent-rose">{data.forcePushes}</div>

                  <div className="text-gray-400">Rank</div>
                  <div className="text-right font-black text-2xl text-white">F</div>
               </div>

               <div className="text-center">
                  <div className="text-xs font-mono text-gray-500 mb-1 uppercase">Special Ability</div>
                  <div className="font-bold text-white uppercase italic tracking-wider">
                     "{data.archetype.name}"
                  </div>
                  <div className="text-xs text-gray-400 mt-1">"{data.archetype.quote}"</div>
               </div>
            </div>

            {/* Bottom ID Bar */}
            <div className="bg-gray-900 h-8 flex items-center justify-between px-4 font-mono text-[10px] text-gray-500 uppercase">
               <span>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
               <Github size={14} />
            </div>
         </motion.div>

         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex gap-4 z-50 pointer-events-auto"
         >
            <button className="bg-white text-black font-black py-4 px-8 uppercase tracking-widest hover:bg-accent-green transition-colors clip-path-button" onClick={() => window.location.reload()}>
               Replay
            </button>
            <button className="bg-transparent border-2 border-white text-white font-black py-4 px-8 uppercase tracking-widest hover:bg-white hover:text-black transition-colors" onClick={() => alert("Screenshot captured! (Not really, just PrtScn it)")}>
               Share
            </button>
         </motion.div>
      </div>
   );
};
