"use client";

import { useState } from 'react';
import { useGame } from '../game-context';
import { Button } from '@/components/ui/button';

export const RouletteGame = () => {
  const { participants, setWinner } = useGame();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    
    const extraSpins = 5 + Math.random() * 5;
    const finalRotation = rotation + extraSpins * 360;
    setRotation(finalRotation);

    setTimeout(() => {
      setSpinning(false);
      // Logic to find winner based on rotation
      const sliceSize = 360 / participants.length;
      const normalizedRotation = (finalRotation % 360);
      const winnerIndex = Math.floor(((360 - normalizedRotation) % 360) / sliceSize);
      setWinner(participants[winnerIndex]);
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center gap-8 h-full">
      <h3 className="text-xl font-bold neon-text">영수증 룰렛</h3>
      
      <div className="relative w-64 h-64 sm:w-80 sm:h-80">
        {/* Needle */}
        <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-secondary z-20" />
        
        {/* Wheel */}
        <div 
          className="w-full h-full rounded-full border-8 border-primary/20 overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.15, 0, 0.15, 1) relative shadow-2xl"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {participants.map((p, i) => {
            const angle = 360 / participants.length;
            const rotate = i * angle;
            const skew = 90 - angle;
            return (
              <div 
                key={p.id}
                className="absolute w-full h-full origin-center"
                style={{ 
                  transform: `rotate(${rotate}deg)`,
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.tan((angle * Math.PI) / 360)}% 0%)`,
                  backgroundColor: i % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'
                }}
              >
                <div 
                  className="absolute left-1/2 top-4 -translate-x-1/2 font-bold text-xs sm:text-sm text-black whitespace-nowrap"
                  style={{ transform: `rotate(${angle / 2}deg)` }}
                >
                  {p.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Button 
        onClick={spin} 
        disabled={spinning}
        className="px-12 py-6 text-xl font-bold hero-gradient neon-glow"
      >
        {spinning ? '돌아가는 중...' : '돌려라!'}
      </Button>
    </div>
  );
};