
import React, { useMemo } from 'react';
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
      <div className="absolute inset-0 opacity-40 bg-linear-gradient-to-br from-rose-500/20 via-purple-500/20 to-blue-500/20 blur-3xl" />

      <LetterGlitch
        glitchSpeed={50}
        centerVignette={true}
        outerVignette={false}
        smooth={true}
      />

      {/* Avatar */}
      <div className="relative mb-8">
        <img
          src={data.avatarUrl}
          alt="avatar"
          className="w-36 h-36 rounded-full border-4 border-white shadow-xl shadow-rose-500/30"
        />
        <div className="absolute -top-2 -right-2 bg-white text-black font-black px-3 py-1 text-sm rotate-6 border-2 border-black">
          2025
        </div>
      </div>

      {/* Title */}
      <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
        The<br />Roast
      </h1>

      {/* Card */}
      <Sticker className="max-w-xl mt-6 rotate-1 shadow-2xl shadow-black/40">
        <p className="font-mono text-lg md:text-xl leading-relaxed">
          You spent
          <span className="text-accent-rose font-bold">{' '}
            <CountUp
              from={0}
              to={data.totalHours}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text"
            />{' '}
            hours
          </span>{' '}
          coding this year.
          <br />
          {insult}
        </p>
      </Sticker>
    </div>
  );
}
