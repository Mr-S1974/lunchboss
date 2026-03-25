"use client";

import { useState } from 'react';
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
    <div className="mx-auto flex h-full w-full max-w-xl min-w-0 flex-col items-center gap-6 overflow-hidden text-center">
      <div className="w-full max-w-lg px-2">
        <h3 className="font-headline text-2xl font-bold text-foreground">지목 셔플</h3>
        <p className="mt-2 break-keep text-sm leading-6 text-muted-foreground">터치 서바이벌 방식으로 마지막 결과를 정합니다.</p>
      </div>

      <div className="relative flex h-80 w-full max-w-sm flex-wrap content-center justify-center gap-4 overflow-hidden rounded-[2rem] border border-white/70 bg-white/45 px-4 py-6 backdrop-blur-sm">
        {participants.map((p, idx) => (
          <div
            key={p.id}
            className={(shuffling ? 'animate-bounce ' : '') + (showBlast ? 'scale-0 opacity-0 ' : 'scale-100 opacity-100 ') + 'flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300'}
            style={{ animationDelay: String(idx * 0.1) + 's', backgroundColor: 'hsl(var(--primary) / ' + String(0.3 + idx * 0.1) + ')' }}
          >
            <Heart className="fill-white text-white" size={24} />
          </div>
        ))}

        {showBlast && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-secondary animate-ping">
              <Bomb size={64} className="text-black" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl font-extrabold text-secondary animate-bounce">꽝</div>
            </div>
          </div>
        )}
      </div>

      {shuffling === false && showBlast === false && (
        <Button onClick={startShuffle} className="hero-gradient soft-glow rounded-[1.6rem] px-12 py-6 text-xl font-bold">
          동시에 탭
        </Button>
      )}
    </div>
  );
};
