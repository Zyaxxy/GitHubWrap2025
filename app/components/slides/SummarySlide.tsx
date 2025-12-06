
import React from 'react';
import { Github, RefreshCw, Share2 } from 'lucide-react';
import { SlideProps } from '../../types';

export const SummarySlide: React.FC<SlideProps> = ({ data }) => (
   <div className="flex flex-col items-center justify-center h-full relative z-10 p-4">
      <div className="w-full max-w-md bg-mixtape-surface border-4 border-white sticker-shadow p-6 flex flex-col gap-4 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-accent-green to-transparent opacity-20 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>

         <div className="flex justify-between items-start border-b-2 border-white pb-4">
            <div>
               <h3 className="text-xs font-mono uppercase text-gray-400">GitWrapped 2025</h3>
               <h2 className="text-3xl font-black uppercase tracking-tighter">{data.username}</h2>
            </div>
            <div className="bg-white text-black font-bold px-2 py-1 text-xs font-mono">
               RANK: F
            </div>
         </div>

         <div className="flex gap-4 items-center">
            <div className="w-24 h-32 bg-gray-800 border-2 border-white flex items-center justify-center overflow-hidden relative">
               {/* Mock "Holo" effect */}
               <div className="absolute inset-0 bg-linear-to-t from-accent-rose via-transparent to-accent-blue opacity-30 mix-blend-overlay"></div>
               <img src={data.avatarUrl} className="w-full h-full object-cover grayscale contrast-125" alt="user" />
            </div>
            <div className="flex-1 space-y-2 font-mono text-sm">
               <div className="flex justify-between">
                  <span>Hours</span>
                  <span className="text-accent-green">{data.totalHours}</span>
               </div>
               <div className="flex justify-between">
                  <span>Top Lang</span>
                  <span className="text-accent-blue">{data.topLanguages[0]?.name}</span>
               </div>
               <div className="flex justify-between">
                  <span>Danger</span>
                  <span className="text-accent-rose">{data.forcePushes} F-Pushes</span>
               </div>
            </div>
         </div>

         <div className="bg-white text-black p-4 mt-2">
            <h4 className="font-bold uppercase text-sm mb-1">Archetype: {data.archetype.name}</h4>
            <p className="font-mono text-xs italic">"{data.archetype.quote}"</p>
         </div>

         <div className="absolute bottom-2 right-2 opacity-50">
            <Github size={24} />
         </div>
      </div>

      <div className="mt-8 flex gap-4">
         <button className="bg-accent-green text-black font-bold py-3 px-6 rounded-none border-2 border-white hover:bg-white transition-colors flex items-center gap-2" onClick={() => window.location.reload()}>
            <RefreshCw size={18} /> Replay
         </button>
         <button className="bg-accent-blue text-white font-bold py-3 px-6 rounded-none border-2 border-white hover:bg-white hover:text-black transition-colors flex items-center gap-2" onClick={() => alert("Screenshot this and shame yourself on Twitter.")}>
            <Share2 size={18} /> Share
         </button>
      </div>
   </div>
);
