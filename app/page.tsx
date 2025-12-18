'use client'

import React, { useState } from 'react';
import { SlideDeck } from './components/SlideDeck';
import { fetchGitHubData } from './services/github';
import { GitHubStats } from './types';
import { Github, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import LoginButton from './components/LoginButton';

import LiquidEther from './components/LiquidEther';

function App() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GitHubStats | null>(null);
  const { data: session } = useSession();

  // Auto-fill username if logged in
  React.useEffect(() => {
    if (session?.user?.username) {
      setUsername(session.user.username);
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setLoading(true);
    const token = session?.accessToken;
    const stats = await fetchGitHubData(username, token);
    setData(stats);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/26n6WywJyh39n1pBu/giphy.gif')] bg-cover opacity-10 mix-blend-overlay"></div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={64} className="text-accent-green" />
        </motion.div>
        <p className="mt-8 font-mono text-xl animate-pulse text-center">
          Analyzing your questionable commits...<br />
          <span className="text-sm text-gray-500">Calculating time wasted on aligning buttons</span>
        </p>
      </div>
    );
  }

  if (data) {
    return <SlideDeck data={data} />;
  }

  return (
    <>


      <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white p-4 relative overflow-hidden font-sans">
        {/* Background Decor */}
        <div className="absolute inset-0">
          <LiquidEther
            colors={['#FF9F00', '#2DE0E6', '#46CC44']}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>


        <div className="relative z-10 max-w-2xl w-full flex flex-col items-center">
          <div className="mb-8 border-4 border-white p-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] bg-mixtape-surface transform -rotate-2">
            <Github size={48} className="mb-4 text-white" />
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-2">
              GitWrapped<br /><span className="text-accent-green">2025</span>
            </h1>
            <p className="font-mono text-lg text-gray-300">The Roast Edition</p>
          </div>

          <div className="w-full flex justify-center mb-8">
            <LoginButton />
          </div>

          <div className="w-full flex items-center justify-center gap-4 mb-8">
            <div className="h-px bg-white/20 w-1/4"></div>
            <span className="font-mono text-zinc-500 text-sm">OR PUBLIC SEARCH</span>
            <div className="h-px bg-white/20 w-1/4"></div>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4 relative">
            <div className="relative group">
              <input
                type="text"
                placeholder="GitHub Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black border-2 border-white p-4 font-mono text-xl text-white placeholder-gray-600 focus:outline-none focus:border-accent-green transition-colors"
              />
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 pointer-events-none top-1 left-1 -z-10 transition-all"></div>
            </div>

            <button
              type="submit"
              disabled={!username}
              className="bg-white text-black font-bold text-xl p-4 border-2 border-white hover:bg-accent-green hover:border-accent-green hover:text-white transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ROAST ME <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-8 text-xs font-mono text-gray-600 max-w-sm text-center">
            *Not affiliated with GitHub or Spotify. We just want to judge your commit history.
            <br />Uses public API data only.
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
