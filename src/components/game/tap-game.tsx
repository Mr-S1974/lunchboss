"use client";

import { useState, useEffect } from 'react';
import { useGame } from '../game-context';
import { Button } from '@/components/ui/button';
import { Heart, Bomb } from 'lucide-react';

export const TapSurvival = () => {
  const { participants, setWinner } = useGame();
  const [shuffling, setShuffling] = useState(false);
  const [showBlast, setShowBlast] = useState(false);

  const startShuffle = () => {
    setShuffling(true);
    setTimeout(() => {
      setShuffling(false);
      setShowBlast(true);
      const winner = participants[Math.floor(Math.random() * participants.length)];
      setTimeout(() => {
        setWinner(winner);
      }, 1500);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center gap-8 h-full text-center">
      <h3 className="text-xl font-bold neon-text">지목 셔플</h3>
      <p className="text-sm text-muted-foreground">터치 서바이벌! 누가 남을까요?</p>

      <div className="relative w-full max-w-sm h-80 flex flex-wrap justify-center content-center gap-4">
        {participants.map((p, idx) => (
          <div 
            key={p.id} 
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${shuffling ? 'animate-bounce' : ''} ${showBlast ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
            style={{ animationDelay: `${idx * 0.1}s`, backgroundColor: `hsl(var(--primary) / ${0.3 + (idx * 0.1)})` }}
          >
            <Heart className="text-white fill-white" size={24} />
          </div>
        ))}

        {showBlast && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="animate-ping bg-secondary w-32 h-32 rounded-full flex items-center justify-center">
              <Bomb size={64} className="text-black" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="text-4xl font-black text-secondary animate-bounce">꽝!!</div>
            </div>
          </div>
        )}
      </div>

      {!shuffling && !showBlast && (
        <Button onClick={startShuffle} className="px-12 py-6 text-xl font-bold hero-gradient neon-glow">
          동시에 탭!
        </Button>
      )}
    </div>
  );
};