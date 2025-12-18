import React from 'react';
import { motion } from 'framer-motion';
import { SlideProps } from '../../types';
import { Flame, Bomb, AlertOctagon } from 'lucide-react';
import CountUp from '../CountUp';

export const DangerSlide: React.FC<SlideProps> = ({ data }) => {
    const count = data.forcePushes;
    const isDangerous = count > 0;

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-8 relative bg-black overflow-hidden">

            {/* Background - Red Flash on Entry */}
            <motion.div
                className="absolute inset-0 bg-red-900/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, repeat: isDangerous ? 3 : 0 }}
            />

            <div className="z-10 flex flex-col items-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="mb-6 p-6 bg-red-600 rounded-full shadow-[0_0_50px_rgba(220,38,38,0.6)]"
                >
                    <Bomb size={64} className="text-white" />
                </motion.div>

                <h2 className="text-3xl md:text-5xl font-black uppercase text-center mb-2 tracking-widest text-red-500">
                    Force Pushes
                    <span className="block text-white text-lg font-normal tracking-normal mt-2 font-mono opacity-60">--no-verify</span>
                </h2>

                <div className="text-[120px] leading-none font-black text-white my-8 flex items-baseline gap-2">
                    <CountUp to={count} duration={2.5} />
                    <span className="text-2xl text-red-500 font-mono">times</span>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="text-center max-w-xl"
                >
                    <p className="text-xl md:text-2xl text-gray-300 font-mono">
                        {count === 0
                            ? "A model citizen. Git history preserved."
                            : count < 5
                                ? "Oops, wrong branch? We've all been there."
                                : "You treat Git history like a suggestion, not a record."}
                    </p>

                    {count > 20 && (
                        <div className="mt-8 flex items-center justify-center gap-2 text-yellow-400 font-bold border-2 border-yellow-400 p-2 uppercase tracking-widest text-sm">
                            <AlertOctagon size={16} />
                            <span>Teammates Hate You</span>
                            <AlertOctagon size={16} />
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};
