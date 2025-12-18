import React from "react";
import { motion } from "framer-motion";
import { SlideProps } from "../../types";
import { Sticker } from "../ui/Sticker";

const marqueeWords = [
  "OBSESSION", "COMMITMENT", "ISSUES", "CONFLICT", "MERGE",
  "PUSH", "PULL", "CLONE", "FORK", "BLAME"
];

export const LanguageSlide: React.FC<SlideProps> = ({ data }) => {
  const topLanguages = data.topLanguages || [];
  const topLang = topLanguages[0]?.name || "Nothing";
  const secondLang = topLanguages[1]?.name || "Also Nothing";

  const totalLines = topLanguages.reduce((acc, curr) => acc + curr.count, 0);

  // Take top 5 for the chart
  const chartData = topLanguages.slice(0, 5);

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden bg-black text-white">
      {/* Animated Marquee Background */}
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="marquee-container text-[6rem] md:text-[9rem] font-black uppercase tracking-tight whitespace-nowrap leading-[0.8]"
            style={{ opacity: 1 - i * 0.15, transform: `rotate(${i % 2 === 0 ? 2 : -2}deg) translateY(${i * -20}px)` }}
          >
            <div className="marquee-content text-transparent bg-clip-text bg-linear-to-r from-gray-700 to-gray-900 stroke-text">
              {marqueeWords.join(" • ")}
            </div>
          </div>
        ))}
      </div>

      {/* Foreground Sticker */}
      <motion.div
        initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="relative z-10 w-full max-w-2xl px-4"
      >
        <Sticker className="p-8 border-2 border-white shadow-[8px_8px_0px_0px_rgba(255,0,222,1)] bg-black">
          <h2 className="text-5xl md:text-7xl font-black mb-8 uppercase leading-[0.9] text-center">
            Toxic <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse">
              Love Affair
            </span>
          </h2>

          {/* Bar Chart */}
          <div className="flex flex-col gap-4 mb-8 w-full">
            {chartData.map((lang, index) => {
              const percentage = totalLines > 0 ? (lang.count / totalLines) * 100 : 0;
              return (
                <div key={lang.name} className="w-full relative group">
                  <div className="flex justify-between items-end mb-1 z-10 relative">
                    <span className="font-bold text-lg tracking-wider mix-blend-difference z-10">{lang.name}</span>
                    <span className="font-mono text-sm opacity-80 z-10">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-6 w-full bg-white/5 rounded-none overflow-hidden border border-white/20 relative">
                    {/* Glitch Effect on Bar */}
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 animate-glitch z-20" />

                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                      viewport={{ once: true }}
                      className="h-full relative"
                      style={{ backgroundColor: lang.fill || "#FF3CA6" }}
                    >
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-white opacity-50" />
                    </motion.div>
                  </div>
                </div>
              );
            })}
            {chartData.length === 0 && (
              <div className="text-center text-gray-400 font-mono py-8">
                No languages found... are you a ghost? 👻
              </div>
            )}
          </div>

          {/* Language Summary */}
          <p className="font-mono text-center text-lg leading-relaxed mt-6">
            You ignored calls to hang out with{" "}
            <span className="text-blue-300 font-bold border-b-2 border-dashed border-blue-300">{secondLang}</span>...
            <br />
            ...just so you could stay home with{" "}
            <span className="bg-white text-black font-bold px-1">{topLang}</span>.
          </p>
        </Sticker>
      </motion.div>
    </div>
  );
};
