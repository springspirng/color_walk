import React, { useEffect, useState, useRef } from 'react';
import { COLORS, REEL_ITEM_HEIGHT, MIN_LOOPS, SPIN_DURATION } from '../constants';
import { ColorOption } from '../types';
import { IconRenderer } from './IconRenderer';

interface SlotReelProps {
  isSpinning: boolean;
  onSpinEnd: (winningColor: ColorOption) => void;
  triggerSpin: number; // Increment to trigger
}

export const SlotReel: React.FC<SlotReelProps> = ({ isSpinning, onSpinEnd, triggerSpin }) => {
  const [currentTranslateY, setCurrentTranslateY] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(false);
  const [winningColor, setWinningColor] = useState<ColorOption | null>(null);
  
  // We keep track of the logical index to avoid floating point drift or logic errors
  const currentIndexRef = useRef(0);

  // Generate a long list of items to simulate the reel
  // 3 sets: Previous context, Active set (where we land), Future buffer
  // Actually, for the "infinite" illusion, we just need a repeatable pattern.
  // We will render the COLORS array repeated 30 times.
  const REPEAT_COUNT = 40; 
  const displayList = Array(REPEAT_COUNT).fill(COLORS).flat();

  useEffect(() => {
    if (triggerSpin > 0) {
      handleSpin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerSpin]);

  const handleSpin = () => {
    // 1. Reset Position Logic (The Infinite Illusion)
    // To allow continuous spinning, we effectively "teleport" back to a low index 
    // that matches the visual appearance of the current position before starting a new spin.
    // Since we landed on `currentIndexRef.current`, we calculate the equivalent index 
    // in the first "set" of colors to reset our scroll position safely.
    
    const colorsLength = COLORS.length;
    const currentVisualIndex = currentIndexRef.current % colorsLength;
    
    // Disable transition to jump instantly
    setTransitionEnabled(false);
    
    // Jump to the start of the list (plus a small buffer so we aren't at the very top edge)
    const resetIndex = currentVisualIndex + colorsLength; 
    const resetTranslate = resetIndex * REEL_ITEM_HEIGHT;
    
    setCurrentTranslateY(resetTranslate);
    currentIndexRef.current = resetIndex;

    // 2. Calculate Destination
    // Force browser reflow to ensure the instant jump happened
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            // Pick a random winner
            const randomIndex = Math.floor(Math.random() * colorsLength);
            const winner = COLORS[randomIndex];
            setWinningColor(winner);
            
            // Calculate how many items to scroll past
            // We want at least MIN_LOOPS full rotations
            const deltaItems = (MIN_LOOPS * colorsLength) + ((randomIndex - (currentIndexRef.current % colorsLength) + colorsLength) % colorsLength);
            
            const targetIndex = currentIndexRef.current + deltaItems;
            const targetTranslate = targetIndex * REEL_ITEM_HEIGHT;

            // Start Animation
            setTransitionEnabled(true);
            setCurrentTranslateY(targetTranslate);
            currentIndexRef.current = targetIndex;

            // Notify parent after animation
            setTimeout(() => {
                onSpinEnd(winner);
            }, SPIN_DURATION);
        });
    });
  };

  return (
    <div className="relative w-full max-w-md mx-auto perspective-1000">
      {/* Machine Bezel/Frame */}
      <div className="bg-slate-800 rounded-xl p-4 shadow-2xl border-4 border-slate-700 relative z-10 overflow-hidden">
        
        {/* The Window */}
        <div 
          className="relative overflow-hidden bg-slate-900 rounded-lg shadow-inner border-2 border-slate-950"
          style={{ height: `${REEL_ITEM_HEIGHT}px` }}
        >
           {/* Center Highlight Line (Glass Reflection) */}
           <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/10 to-transparent z-20 pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/20 to-transparent z-20 pointer-events-none"></div>
           
           {/* The actual moving strip */}
           <div
            className="w-full flex flex-col items-center"
            style={{
                transform: `translateY(-${currentTranslateY}px)`,
                transition: transitionEnabled ? `transform ${SPIN_DURATION}ms cubic-bezier(0.25, 1, 0.5, 1)` : 'none'
            }}
           >
                {displayList.map((color, index) => (
                    <div 
                        key={index}
                        className={`w-full flex items-center justify-center border-b border-slate-800/50 box-border`}
                        style={{ height: `${REEL_ITEM_HEIGHT}px` }}
                    >
                        <div className={`
                            w-3/4 h-3/4 rounded-2xl shadow-lg flex items-center justify-center
                            ${color.twBg} text-white
                            transform transition-transform duration-300
                            ${!isSpinning && winningColor?.id === color.id && index === currentIndexRef.current ? 'scale-110 ring-4 ring-white/50' : 'scale-95'}
                        `}>
                            <div className="text-center">
                                <IconRenderer iconName={color.icon} className="w-12 h-12 mx-auto mb-2 drop-shadow-md" />
                                <span className="font-bold text-xl uppercase tracking-wider drop-shadow-md">{color.name.split(' ')[0]}</span>
                            </div>
                        </div>
                    </div>
                ))}
           </div>
        </div>

        {/* Decorative Arrows */}
        <div className="absolute top-1/2 left-2 -translate-y-1/2 text-slate-500/30 z-20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
        </div>
        <div className="absolute top-1/2 right-2 -translate-y-1/2 text-slate-500/30 z-20 rotate-180">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
        </div>
      </div>
      
      {/* Reflection effect under the machine */}
      <div className="absolute -bottom-8 left-4 right-4 h-4 bg-black/20 blur-xl rounded-full"></div>
    </div>
  );
};