
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitHubStats, SlideId, SlideProps } from '../types';

import { NoiseOverlay } from './ui/NoiseOverlay';
import { IntroSlide } from './slides/IntroSlide';
import { RhythmSlide } from './slides/RhythmSlide';
import { LanguageSlide } from './slides/LanguageSlide';
import { MonologueSlide } from './slides/MonologueSlide';
import { TrashSlide } from './slides/TrashSlide';
import { SummarySlide } from './slides/SummarySlide';

// --- MAIN DECK ---

const SLIDES: { id: SlideId, component: React.FC<SlideProps> }[] = [
  { id: 'intro', component: IntroSlide },
  { id: 'rhythm', component: RhythmSlide },
  { id: 'languages', component: LanguageSlide },
  { id: 'monologue', component: MonologueSlide },
  { id: 'trash', component: TrashSlide },
  { id: 'summary', component: SummarySlide },
];

export const SlideDeck: React.FC<{ data: GitHubStats }> = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance
  useEffect(() => {
    if (currentIndex === SLIDES.length - 1) return; // Stop at summary

    const duration = 6000;
    const timer = setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const CurrentSlide = SLIDES[currentIndex].component;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-mixtape-black text-white font-sans selection:bg-accent-green selection:text-black">
      <NoiseOverlay />

      {/* Scanline Effect */}
      <div className="scanline"></div>

      {/* Progress Bar */}
      <div className="absolute top-4 left-4 right-4 flex gap-2 z-50">
        {SLIDES.map((_, idx) => (
          <div key={idx} className="h-1 flex-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: "0%" }}
              animate={{ width: idx < currentIndex ? "100%" : idx === currentIndex ? "100%" : "0%" }}
              transition={idx === currentIndex ? { duration: 6, ease: "linear" } : { duration: 0 }}
            />
          </div>
        ))}
      </div>

      {/* Slide Container */}
      <AnimatePresence>
        <motion.div
          key={currentIndex}
          className="w-full h-full"
          initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onClick={handleNext}
        >
          <CurrentSlide data={data} isActive={true} />
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-between items-center px-8 md:px-12 z-50 font-mono uppercase pointer-events-none">
        <button
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="pointer-events-auto text-xl md:text-3xl font-bold text-gray-500 hover:text-white transition-colors p-4"
        >
          Back
        </button>
        <span className="text-sm md:text-base text-gray-600">{currentIndex + 1} / {SLIDES.length}</span>
        <button
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="pointer-events-auto text-xl md:text-3xl font-bold text-gray-500 hover:text-white transition-colors p-4"
        >
          Next
        </button>
      </div>
    </div>
  );
};
