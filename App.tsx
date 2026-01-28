import React, { useState, useCallback } from 'react';
import { SlotReel } from './components/SlotReel';
import { Confetti } from './components/Confetti';
import { ColorOption } from './types';
import { Sparkles, Dices, RotateCw } from 'lucide-react';

const App: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinTrigger, setSpinTrigger] = useState(0);
  const [lastWinner, setLastWinner] = useState<ColorOption | null>(null);

  // Handlers
  const handleSpinClick = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);
    setLastWinner(null); // Clear previous result visual
    setSpinTrigger(prev => prev + 1); // Signal the Reel component
  }, [isSpinning]);

  const handleSpinEnd = useCallback((winner: ColorOption) => {
    setIsSpinning(false);
    setLastWinner(winner);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col overflow-hidden relative selection:bg-pink-500 selection:text-white">

      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 pt-8 pb-4 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 drop-shadow-sm">
          Prismatic Slots
        </h1>
        <p className="text-slate-400 font-medium">Test your luck with the colors of the spectrum</p>
      </header>

      {/* Main Game Area */}
      <main className="flex-grow flex flex-col items-center justify-center relative z-10 px-4 pb-12">

        {/* Result Announcement */}
        <div className="h-24 mb-6 flex items-center justify-center w-full">
          {lastWinner && !isSpinning ? (
            <div className={`animate-bounce-in text-center px-6 py-3 rounded-2xl bg-slate-800/80 backdrop-blur border border-slate-700 shadow-xl ring-2 ${lastWinner.twText.replace('text-', 'ring-')}/50`}>
              <div className={`text-sm uppercase tracking-widest font-bold ${lastWinner.twText} mb-1`}>Winner</div>
              <div className="text-3xl font-black text-white">{lastWinner.name}</div>
              <div className="text-xs text-slate-400 mt-1">{lastWinner.message}</div>
            </div>
          ) : (
            <div className={`text-slate-600 font-bold tracking-widest uppercase text-sm ${isSpinning ? 'animate-pulse' : ''}`}>
              {isSpinning ? 'Spinning...' : 'Ready to Spin'}
            </div>
          )}
        </div>

        {/* The Machine */}
        <SlotReel
          isSpinning={isSpinning}
          triggerSpin={spinTrigger}
          onSpinEnd={handleSpinEnd}
        />

        {/* Controls */}
        <div className="mt-12 w-full max-w-md flex flex-col gap-4">
          <button
            onClick={handleSpinClick}
            disabled={isSpinning}
            className={`
                    group relative w-full h-20 rounded-2xl font-black text-2xl uppercase tracking-wider
                    transition-all duration-200 transform
                    flex items-center justify-center gap-3
                    ${isSpinning
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed translate-y-2'
                : 'bg-gradient-to-b from-indigo-500 to-indigo-700 text-white shadow-[0_8px_0_rgb(55,48,163)] hover:shadow-[0_4px_0_rgb(55,48,163)] hover:translate-y-1 active:shadow-none active:translate-y-2'
              }
                `}
          >
            {/* Button Shine Effect */}
            {!isSpinning && <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl pointer-events-none"></div>}

            {isSpinning ? (
              <>
                <RotateCw className="animate-spin w-8 h-8" />
                <span>Luck is turning...</span>
              </>
            ) : (
              <>
                <Dices className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                <span>Spin to Win</span>
                <Sparkles className="w-6 h-6 text-yellow-300 absolute right-8 animate-pulse" />
              </>
            )}
          </button>

          <div className="text-center text-slate-500 text-xs mt-4 flex flex-col gap-1">
            <div>Powered by React & Tailwind CSS</div>
            <div className="opacity-50">v1.1.1-extreme-ios</div>
          </div>
        </div>
      </main>

      {/* Global Effects */}
      <Confetti active={!!lastWinner && !isSpinning} colorHex={lastWinner?.hex || '#ffffff'} />

    </div>
  );
};

export default App;