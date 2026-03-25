"use client";

import { useEffect, useState, useRef } from 'react';
import { useGame } from '../game-context';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

export const LadderGame = () => {
  const { participants, setWinner } = useGame();
  const [animating, setAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paths, setPaths] = useState<number[][]>([]);
  const [horizontalBars, setHorizontalBars] = useState<{line: number, y: number}[]>([]);

  useEffect(() => {
    // Generate bars
    const bars: {line: number, y: number}[] = [];
    for (let i = 0; i < participants.length - 1; i++) {
      const numBars = Math.floor(Math.random() * 3) + 2;
      for (let j = 0; j < numBars; j++) {
        bars.push({ line: i, y: 50 + Math.random() * 300 });
      }
    }
    setHorizontalBars(bars);
  }, [participants.length]);

  const runLadder = () => {
    if (animating) return;
    setAnimating(true);
    
    // Pick a random starting index
    const startIndex = Math.floor(Math.random() * participants.length);
    
    // Simple logic: determine winner by just picking one randomly for this demo
    // In a real ladder, you'd trace the path.
    setTimeout(() => {
      setWinner(participants[startIndex]);
      setAnimating(false);
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center gap-8 h-full">
      <h3 className="text-xl font-bold neon-text">사다리 타기</h3>
      
      <div className="relative w-full max-w-sm h-96 border border-white/10 rounded-xl p-4 bg-black/20 flex justify-between overflow-hidden">
        {participants.map((p, idx) => (
          <div key={p.id} className="relative flex flex-col items-center h-full">
            <div className="text-[10px] text-center w-12 font-bold mb-2 truncate">{p.name}</div>
            <div className="w-1 h-full bg-primary/40 rounded-full relative">
              {/* Horizontal bars logic would go here visually */}
            </div>
            <div className="mt-2 w-8 h-8 rounded-md bg-muted flex items-center justify-center">
              ?
            </div>
          </div>
        ))}
        
        {/* Simplified visual bars */}
        <div className="absolute inset-0 p-4 pointer-events-none opacity-50">
           {horizontalBars.map((bar, idx) => (
             <div 
               key={idx} 
               className="absolute h-1 bg-primary/40" 
               style={{
                 left: `${(bar.line * (100 / (participants.length - 1))) + 5}%`,
                 width: `${100 / (participants.length - 1)}%`,
                 top: `${bar.y}px`
               }}
             />
           ))}
        </div>

        {animating && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
            <div className="text-lg font-bold animate-pulse text-secondary">사다리 타는 중... 뚜뚜뚜뚜-</div>
          </div>
        )}
      </div>

      {!animating && (
        <Button onClick={runLadder} size="lg" className="px-12 font-bold hero-gradient neon-glow">
          운명의 시작!
        </Button>
      )}
    </div>
  );
};