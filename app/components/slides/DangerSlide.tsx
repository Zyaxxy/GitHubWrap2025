import React from 'react';
import { motion } from 'framer-motion';
import { SlideProps } from '../../types';
import { Bomb, AlertOctagon, TriangleAlert } from 'lucide-react';
import CountUp from '../CountUp';

export const DangerSlide: React.FC<SlideProps> = ({ data }) => {
    const count = data.forcePushes;
    const isDangerous = count > 0;

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-8 relative bg-black overflow-hidden text-red-600">

            {/* Strobe Background */}
            {isDangerous && (
                <motion.div
                    className="absolute inset-0 bg-red-600 pointer-events-none mix-blend-overlay"
                    animate={{ opacity: [0, 0.4, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                />
            )}

            {/* Glitch Overlay */}
            <div className="absolute inset-0 opacity-30 pointer-events-none"
                style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #ff0000 2px, #ff0000 4px)' }}
            />

            <div className="z-10 flex flex-col items-center w-full max-w-3xl border-4 border-red-600 p-8 md:p-12 relative bg-black/80 backdrop-blur-sm">
                {/* Warning Tape */}
                <div className="absolute -top-6 left-0 right-0 h-12 bg-yellow-400 text-black font-black flex items-center overflow-hidden uppercase tracking-widest text-sm border-y-4 border-black">
                    <div className="whitespace-nowrap animate-marquee">
                        WARNING • FORCE PUSH DETECTED • HISTORY REWRITTEN • REALITY COMPROMISED •
                        WARNING • FORCE PUSH DETECTED • HISTORY REWRITTEN • REALITY COMPROMISED •
                    </div>
                </div>

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="mb-8 mt-4"
                >
                    <div className="relative">
                        <Bomb size={80} className="text-red-500 animate-bounce" />
                        <motion.div
                            className="absolute inset-0 text-white blur-lg"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 0.2, repeat: Infinity }}
                        >
                            <Bomb size={80} />
                        </motion.div>
                    </div>
                </motion.div>

                <h2 className="text-4xl md:text-6xl font-black uppercase text-center mb-2 tracking-[0.2em] text-white drop-shadow-[0_0_10px_rgba(255,0,0,1)]">
                    Force <br /> Pushes
                </h2>

                <div className="text-[100px] md:text-[140px] leading-none font-black text-red-600 my-4 flex items-baseline gap-2 filter drop-shadow-[0_0_20px_rgba(255,0,0,0.8)]">
                    <CountUp to={count} duration={2.5} />
                </div>

                <p className="font-mono text-center text-red-400 text-lg uppercase tracking-widest border-t border-b border-red-900 py-2 w-full">
                    Run: <span className="text-white">git push --force</span>
                </p>

                <p className="mt-8 text-xl text-center text-gray-400 max-w-lg font-bold">
                    {count === 0
                        ? <span className="text-green-500">History Verified. You are safe.</span>
                        : count < 5
                            ? "A few little accidents. We won't tell Linus."
                            : "You are a menace to society and version control."}
                </p>

            </div>
        </div>
    );
};
