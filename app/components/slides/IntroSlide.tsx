
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { SlideProps } from '../../types';
import { Sticker } from '../ui/Sticker';
import CountUp from '../CountUp';
import LetterGlitch from '../LetterGlitch';

const INSULTS = [
  {
    min: 0,
    max: 20,
    messages: [
      "You opened VS Code exactly once and immediately Alt+F4'd like it owed you money.",
      "Your GitHub is so dead it qualifies for carbon dating.",
      "Your laptop filed a missing persons report on you."
    ]
  },
  {
    min: 20,
    max: 50,
    messages: [
      "You've written more 'hello world' than actual production code.",
      "Congratulations, you're now slower than a junior who started yesterday.",
      "Your entire contribution could be replaced by a 2012 CodePen."
    ]
  },
  {
    min: 50,
    max: 100,
    messages: [
      "You're not a developer, you're a professional tab hoarder.",
      "Half your hours were spent googling how to exit Vim.",
      "You've spent more time picking a font than shipping anything."
    ]
  },
  {
    min: 100,
    max: 150,
    messages: [
      "You're the reason seniors drink at 10 a.m.",
      "Your pull requests come with a trigger warning.",
      "You're not learning, you're just accumulating shame at 0.3x speed."
    ]
  },
  {
    min: 150,
    max: 200,
    messages: [
      "Your code smells like week-old ramen and despair.",
      "You've personally delayed the team's velocity by a full sprint.",
      "Senior dev saw your branch and instinctively reached for the flask."
    ]
  },
  // HIGH HOURS: "You could have X, BUT you did Y"
  {
    min: 200,
    max: 250,
    messages: [
      "You could have written a 50,000-word novel, but instead you wrote 50,000 lines of spaghetti code that doesn't compile.",
      "You could have become a certified Sommelier, but you only developed a palette for deprecated dependencies.",
      "You could have learned to solve a Rubik's cube in 15 seconds, but you still can't center a div."
    ]
  },
  {
    min: 250,
    max: 300,
    messages: [
      "You could have built a livable Tiny House from scratch, but you can't even build a stable Docker container.",
      "You could have re-watched The Office four times, but you just spent that time watching a loading spinner.",
      "You could have backpacked across Europe, but you're still stuck on the same merge conflict you started in March."
    ]
  },
  {
    min: 300,
    max: Infinity,
    messages: [
      "You could have raised a human child, but instead you gave birth to a repo that everyone refuses to maintain.",
      "You could have renovated an entire kitchen, but your architecture still leaks memory like a broken pipe.",
      "You could have become a semi-pro chess player, but you're still getting checkmated by a missing semicolon."
    ]
  }
];
export const IntroSlide: React.FC<SlideProps> = ({ data }) => {
  const insult = useMemo(() => {
    const category = INSULTS.find(
      (range) => data.totalHours >= range.min && data.totalHours < range.max
    ) || INSULTS[INSULTS.length - 1];

    return category.messages[Math.floor(Math.random() * category.messages.length)];
  }, [data.totalHours]);

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden bg-black text-white p-6">
      {/* Glow Background */}
      <div className="absolute inset-0 opacity-40 bg-linear-to-br from-rose-500/20 via-purple-500/20 to-blue-500/20 blur-3xl animate-pulse" />

      <div className="absolute inset-0 z-0 opacity-50">
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">

        {/* Avatar */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
        >
          <img
            src={data.avatarUrl}
            alt="avatar"
            className="w-40 h-40 rounded-full border-4 border-white shadow-[0_0_30px_rgba(255,255,255,0.5)]"
          />
          <div className="absolute -top-4 -right-4 bg-accent-green text-black font-black px-4 py-2 text-lg rotate-12 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            2025
          </div>
        </motion.div>

        {/* Title */}
        <div className="relative">
          <h1 className="text-8xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] mix-blend-difference animate-glitch text-transparent bg-clip-text bg-linear-to-b from-white to-gray-400">
            The<br />Roast
          </h1>
          <h1 className="absolute top-0 left-0 text-8xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] text-accent-rose opacity-50 blur-sm animate-shake z-[-1]">
            The<br />Roast
          </h1>
        </div>

        {/* Card */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="w-full max-w-xl mt-12"
        >
          <Sticker className="rotate-2 shadow-[8px_8px_0px_0px_#EE3124] border-2 border-white bg-mixtape-surface">
            <p className="font-mono text-xl md:text-2xl leading-relaxed text-center">
              You wasted
              <span className="text-accent-rose font-bold mx-2 inline-block transform -skew-x-12 bg-white px-2">
                <CountUp
                  from={0}
                  to={data.totalHours}
                  separator=","
                  direction="up"
                  duration={1}
                  className="text-black"
                />
              </span>
              hours
              coding this year.
              <br /><br />
              <span className="text-gray-400 text-lg italic">"{insult}"</span>
            </p>
          </Sticker>
        </motion.div>
      </div>
    </div>
  );
}
