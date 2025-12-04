import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Label
} from "recharts";
import { SlideProps } from "../../types";
import { Sticker } from "../ui/Sticker";

const marqueeWords = [
  "OBSESSION", "COMMITMENT", "ISSUES", "CONFLICT", "MERGE",
  "PUSH", "PULL", "CLONE", "FORK", "BLAME"
];

export const LanguageSlide: React.FC<SlideProps> = ({ data }) => {
  const topLang = data.topLanguages[0]?.name || "Nothing";
  const secondLang = data.topLanguages[1]?.name || "Also Nothing";

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
      <div className="relative z-10">
        <Sticker className="p-8 max-w-lg border border-white/20 shadow-[0_0_40px_rgba(255,0,150,0.25)]">
          <h2 className="text-5xl font-extrabold mb-6 uppercase leading-none text-center bg-linear-to-br from-pink-500 via-purple-500 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,0,200,0.4)]">
            Toxic <br /> Relationships
          </h2>

          {/* Donut Chart */}
          <div className="relative w-72 h-72 mx-auto my-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {/* Gradient for Chart */}
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FF3CA6" />
                    <stop offset="50%" stopColor="#7B5BFF" />
                    <stop offset="100%" stopColor="#00E6C3" />
                  </linearGradient>
                </defs>

                <Pie
                  data={data.topLanguages}
                  innerRadius="60%"
                  outerRadius="80%"
                  cornerRadius={12}
                  paddingAngle={3}
                  stroke="none"
                  dataKey="count"
                >
                  {data.topLanguages.map((entry, index) => (
                    <Cell key={index} fill={entry.fill || "url(#chartGradient)"} />
                  ))}
                  <Label
                    value="💔"
                    position="center"
                    style={{
                      fontSize: "40px",
                      fontWeight: "bold"
                    }}
                  />
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid #fff",
                    fontFamily: "DM Mono",
                    borderRadius: "8px",
                    color: "#fff"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Language Summary */}
          <p className="font-mono text-center text-lg leading-relaxed">
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
