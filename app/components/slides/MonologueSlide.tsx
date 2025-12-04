
import React, { useMemo } from 'react';
import { SlideProps } from '../../types';

export const MonologueSlide: React.FC<SlideProps> = ({ data }) => {
  const { keywordStats, roast } = useMemo(() => {
    const stats = { fix: 0, wip: 0, damn: 0, please: 0, oops: 0, misc: 0 };

    data.commitWords.forEach(msg => {
      const lower = msg.toLowerCase();
      if (lower.includes('fix') || lower.includes('patch')) stats.fix++;
      else if (lower.includes('wip') || lower.includes('work') || lower.includes('temp')) stats.wip++;
      else if (lower.includes('damn') || lower.includes('shit') || lower.includes('fuck') || lower.includes('stupid')) stats.damn++;
      else if (lower.includes('please') || lower.includes('plz')) stats.please++;
      else if (lower.includes('oops') || lower.includes('whoops') || lower.includes('mistake')) stats.oops++;
      else stats.misc++;
    });

    // Determine the roast
    let selectedRoast = { word: 'stuff', text: `You wrote ${data.commitWords.length} commit messages. Mostly meaningless.` };
    let maxCount = 0;

    // Find highest count category
    if (stats.fix > maxCount) { maxCount = stats.fix; selectedRoast = { word: 'fix', text: `You typed "fix" ${stats.fix} times. Creating bugs just to fix them later? That's job security.` }; }
    if (stats.wip > maxCount) { maxCount = stats.wip; selectedRoast = { word: 'wip', text: `You committed "WIP" ${stats.wip} times. Fear of commitment? Or just fear of bad code?` }; }
    if (stats.damn > maxCount) { maxCount = stats.damn; selectedRoast = { word: 'damn', text: `You swore ${stats.damn} times in your commits. HR would like to have a word with you.` }; }
    if (stats.please > maxCount) { maxCount = stats.please; selectedRoast = { word: 'please', text: `You begged your code to work ${stats.please} times. It didn't listen.` }; }
    if (stats.oops > maxCount) { maxCount = stats.oops; selectedRoast = { word: 'oops', text: `You said "oops" ${stats.oops} times. Your git history looks like a crime scene.` }; }

    if (data.commitWords.length === 0) {
      selectedRoast = { word: 'nothing', text: "You have no commit messages. Do you even commit? Or do you just force push zip files?" };
    }

    return { keywordStats: stats, roast: selectedRoast };
  }, [data.commitWords]);

  const marqueeWords = data.commitWords.length > 0
    ? [...data.commitWords, ...data.commitWords].slice(0, 20)
    : ["fix", "wip", "updates", "please work", "oops", "revert"];

  return (
    <div className="flex flex-col items-center justify-center h-full relative z-10 overflow-hidden bg-accent-rose text-black">
      <div className="absolute inset-0 flex flex-col justify-center space-y-8 opacity-20 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="marquee-container text-6xl font-black uppercase">
            <div className="marquee-content">
              {marqueeWords.slice(0, 5).join(" — ")} — {marqueeWords.slice(5, 10).join(" — ")}
            </div>
          </div>
        ))}
      </div>

      <div className="z-10 bg-black text-white p-8 border-4 border-white max-w-lg sticker-shadow text-center">
        <h2 className="text-3xl font-bold mb-4 uppercase">Inner Monologue</h2>
        <p className="font-mono text-xl">
          {roast.text}
        </p>
        <div className="mt-4 border-t border-white pt-4">
          <p className="text-sm text-gray-400">
            Stats: {keywordStats.fix} fixes, {keywordStats.wip} WIPs, {keywordStats.damn} curses.
          </p>
        </div>
      </div>
    </div>
  );
};
