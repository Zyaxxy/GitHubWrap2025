import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SlideProps } from '../../types';
import { AlertTriangle, Calendar, Skull, PartyPopper } from 'lucide-react';
import CountUp from '../CountUp';
import { Sticker } from '../ui/Sticker';

export const FridaySlide: React.FC<SlideProps> = ({ data }) => {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef);
    const isSafe = data.fridayDeploys === 0;

    return (
        <div ref={containerRef} className="h-full w-full flex flex-col items-center justify-center p-8 relative overflow-hidden bg-yellow-400 text-black">
            {/* Hazard Stripes Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 20px, transparent 20px, transparent 40px)' }}
            />

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                className="z-10 text-center w-full max-w-2xl"
            >
                {/* Warning Banner */}
                <div className="bg-black text-yellow-400 font-bold uppercase tracking-widest text-xl py-2 mb-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] transform -rotate-2">
                    {isSafe ? "Safety Certificate Issued" : "OSHA Violation Detected"}
                </div>

                <Sticker className="bg-white border-4 border-black p-8 rotate-1 shadow-[12px_12px_0px_0px_#000]">
                    <div className="flex justify-center mb-6">
                        {isSafe ? (
                            <div className="p-4 bg-green-500 rounded-full border-4 border-black animate-bounce">
                                <PartyPopper size={64} className="text-white" />
                            </div>
                        ) : (
                            <div className="p-4 bg-red-600 rounded-full border-4 border-black animate-pulse">
                                <Skull size={64} className="text-white" />
                            </div>
                        )}
                    </div>

                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 leading-none">
                        Friday <br />
                        <span className={isSafe ? "text-green-600" : "text-red-600 underline decoration-8 decoration-black"}>
                            Deploys
                        </span>
                    </h2>

                    <div className="text-8xl font-mono font-black mb-6">
                        <CountUp to={data.fridayDeploys} duration={2} />
                    </div>

                    <p className="text-xl font-bold font-mono uppercase bg-black text-white p-2 inline-block transform -skew-x-12">
                        {isSafe ? "0 Days Since Incident" : "Production is on fire"}
                    </p>

                    <p className="text-lg font-medium mt-6 text-gray-800">
                        {isSafe
                            ? "You respect the Read-Only Friday rule. A true professional."
                            : "You deployed on a Friday. You are the reason we have pagers."}
                    </p>
                </Sticker>
            </motion.div>
        </div>
    );
};
