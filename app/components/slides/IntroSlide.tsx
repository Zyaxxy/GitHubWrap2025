
import React from 'react';
import { SlideProps } from '../../types';
import { Sticker } from '../ui/Sticker';

export const IntroSlide: React.FC<SlideProps> = ({ data }) => (
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
        You could have learned to fly a plane. Instead, you centered a div.
      </p>
    </Sticker>
  </div>
);
