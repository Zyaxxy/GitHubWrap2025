import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SlideProps } from '../../types';
import { AlertTriangle, Calendar, Skull } from 'lucide-react';
import CountUp from '../CountUp';

export const FridaySlide: React.FC<SlideProps> = ({ data }) => {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef);

    const isSafe = data.fridayDeploys === 0;

    return (
        <div ref={containerRef} className="h-full w-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {/* Background Warning Signs */}
            <div className="absolute inset-0 opacity-10 pointer-events-none grid grid-cols-6 grid-rows-6 gap-8 p-4">
                {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-center">
                        <AlertTriangle size={32} className="text-yellow-500 transform rotate-12" />
                    </div>
                ))}
            </div>

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6 }}
                className="z-10 text-center"
            >
                <div className="mb-4 inline-block p-4 border-4 border-yellow-400 rounded-full bg-black">
                    {isSafe ? <Calendar className="w-16 h-16 text-green-400" /> : <Skull className="w-16 h-16 text-red-500 animate-pulse" />}
                </div>

                <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter">
                    Friday <span className={isSafe ? "text-green-500" : "text-red-500"}>Deploys</span>
                </h2>

                <div className="text-8xl md:text-9xl font-mono font-bold mb-8 text-white relative">
                    <CountUp to={data.fridayDeploys} duration={2} />
                    {data.fridayDeploys > 0 && (
                        <motion.div
                            className="absolute -top-4 -right-8 text-2xl bg-red-600 text-white font-bold px-2 py-1 rotate-12"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 2, type: "spring" }}
                        >
                            WHY?!
                        </motion.div>
                    )}
                </div>

                <p className="text-xl md:text-2xl font-mono text-gray-300 max-w-2xl px-4">
                    {isSafe
                        ? "You value your weekends. Smart choice."
                        : "You like to live dangerously. Or you just hate your future self."}
                </p>

                {data.fridayDeploys > 10 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-8 border border-red-500 text-red-500 px-4 py-2 font-mono text-sm uppercase"
                    >
                        Production Incident Likely
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};
