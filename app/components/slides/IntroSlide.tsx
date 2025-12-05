
import React, { useMemo } from 'react';
import { SlideProps } from '../../types';
import { Sticker } from '../ui/Sticker';

const INSULTS = [
  {
    min: 0,
    max: 20,
    messages: [
      "You opened VS Code exactly once and immediately Alt+F4’d like it owed you money.",
      "Your GitHub is so dead it qualifies for carbon dating.",
      "Your laptop filed a missing persons report on you."
    ]
  },
  {
    min: 20,
    max: 50,
    messages: [
      "You’ve written more “hello world” than actual production code.",
      "Congratulations, you’re now slower than a junior who started yesterday.",
      "Your entire contribution could be replaced by a 2012 CodePen."
    ]
  },
  {
    min: 50,
    max: 100,
    messages: [
      "You’re not a developer, you’re a professional tab hoarder.",
      "Half your hours were spent googling how to exit Vim.",
      "You’ve spent more time picking a font than shipping anything."
    ]
  },
  {
    min: 100,
    max: 150,
    messages: [
      "You’re the reason seniors drink at 10 a.m.",
      "Your pull requests come with a trigger warning.",
      "You’re not learning you’re just accumulating shame at 0.3× speed."
    ]
  },
  {
    min: 150,
    max: 200,
    messages: [
      "Your code smells like week-old ramen and despair.",
      "You’ve personally delayed the team’s velocity by a full sprint.",
      "Senior dev saw your branch and instinctively reached for the flask."
    ]
  },
  {
    min: 200,
    max: 250,
    messages: [
      "You’re a walking CVE waiting to be discovered.",
      "Your ‘refactor’ created three new bugs for every one you allegedly fixed.",
      "You’re the reason we can’t have nice things, like working deploys."
    ]
  },
  {
    min: 250,
    max: 300,
    messages: [
      "300 hours and your biggest flex is still ‘I can read a stack trace now.’",
      "You’ve renamed more variables than you’ve written working features.",
      "You’re not mid-level—you’re mid-crisis with extra copium."
    ]
  },
  {
    min: 300,
    max: Infinity,
    messages: [
      "Three hundred hours in and production still flinches when you push.",
      "You’ve achieved the rare rank of ‘negative impact per hour.’",
      "Welcome to the craft. Your imposter syndrome is the only accurate thing about you."
    ]
  }
];

export const IntroSlide: React.FC<SlideProps> = ({ data }) => {
  const insult = useMemo(() => {
    const category = INSULTS.find(range => data.totalHours >= range.min && data.totalHours < range.max) || INSULTS[INSULTS.length - 1];
    return category.messages[Math.floor(Math.random() * category.messages.length)];
  }, [data.totalHours]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center relative z-10 p-4">
      <div className="mb-8 relative">
        <img src={data.avatarUrl} alt="avatar" className="w-32 h-32 rounded-full border-4 border-accent-green z-10 relative" />
        <div className="absolute -top-2 -right-2 bg-white text-black font-bold px-2 py-1 transform rotate-12 border-2 border-black">
          2025
        </div>
      </div>
      <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase leading-[0.8]">
        The<br />Roast
      </h1>
      <Sticker className="max-w-md transform -rotate-2">
        <p className="font-mono text-lg md:text-xl">
          You spent <span className="text-accent-rose font-bold">{data.totalHours} hours</span> coding this year.
          <br className="my-2" />
          {insult}
        </p>
      </Sticker>
    </div>
  );
};
