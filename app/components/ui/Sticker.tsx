
import React from 'react';

export const Sticker = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-mixtape-surface border-4 border-white p-6 sticker-shadow ${className}`}>
    {children}
  </div>
);
