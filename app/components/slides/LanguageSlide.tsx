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
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="marquee-container text-[8rem] font-black uppercase tracking-tight whitespace-nowrap"
            style={{ opacity: 1 - i * 0.18 }}
          >
            <div className="marquee-content">
              {marqueeWords.join(" • ")}
            </div>
          </div>
        ))}
      </div>

      {/* Foreground Sticker */}
      <div className="relative z-10 w-full max-w-2xl px-4">
        <Sticker className="p-8 border border-white/20 shadow-[0_0_40px_rgba(255,0,150,0.25)] bg-black/80 backdrop-blur-md">
          <h2 className="text-5xl font-extrabold mb-8 uppercase leading-none text-center bg-linear-to-br from-pink-500 via-purple-500 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,0,200,0.4)]">
            Toxic <br /> Relationships
          </h2>

          {/* Bar Chart */}
          <div className="flex flex-col gap-4 mb-8 w-full">
            {chartData.map((lang, index) => {
              const percentage = totalLines > 0 ? (lang.count / totalLines) * 100 : 0;
              return (
                <div key={lang.name} className="w-full">
                  <div className="flex justify-between items-end mb-1">
                    <span className="font-bold text-lg tracking-wider">{lang.name}</span>
                    <span className="font-mono text-sm opacity-80">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                      viewport={{ once: true }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: lang.fill || "#FF3CA6" }}
                    />
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
            You flirted with{" "}
            <span className="text-blue-300 font-bold">{secondLang}</span>,
            <br />
            but you always went home to{" "}
            <span className="text-pink-400 font-bold">{topLang}</span>.
          </p>
        </Sticker>
      </div>
    </div>
  );
};
