
"use client";

import { useEffect, useState, useRef, useMemo } from 'react';
import { useGame } from '../game-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Bar {
  line: number;
  y: number;
}

export const LadderGame = () => {
  const { participants, setWinner } = useGame();
  const [animating, setAnimating] = useState(false);
  const [amounts, setAmounts] = useState<string[]>([]);
  const [horizontalBars, setHorizontalBars] = useState<Bar[]>([]);
  const [activePath, setActivePath] = useState<{ x: number, y: number }[]>([]);
  const [targetParticipantIdx, setTargetParticipantIdx] = useState<number | null>(null);

  useEffect(() => {
    setAmounts(participants.map((_, i) => i === 0 ? "전액 결제" : "통과"));
    
    // Generate random horizontal bars
    const bars: Bar[] = [];
    const numLines = participants.length;
    for (let i = 0; i < numLines - 1; i++) {
      const numBars = Math.floor(Math.random() * 2) + 2;
      for (let j = 0; j < numBars; j++) {
        const y = 40 + (Math.random() * 280);
        // Avoid bars being too close to each other
        if (!bars.some(b => Math.abs(b.y - y) < 20)) {
          bars.push({ line: i, y });
        }
      }
    }
    setHorizontalBars(bars.sort((a, b) => a.y - b.y));
  }, [participants.length]);

  const tracePath = (startLine: number) => {
    let currentLine = startLine;
    let currentY = 0;
    const path = [{ x: currentLine, y: 0 }];
    const sortedBars = [...horizontalBars].sort((a, b) => a.y - b.y);

    while (currentY < 400) {
      // Find the next bar that connects to the current line
      const nextBar = sortedBars.find(bar => 
        bar.y > currentY && (bar.line === currentLine || bar.line === currentLine - 1)
      );

      if (nextBar) {
        currentY = nextBar.y;
        path.push({ x: currentLine, y: currentY });
        
        if (nextBar.line === currentLine) {
          currentLine++;
        } else {
          currentLine--;
        }
        path.push({ x: currentLine, y: currentY });
      } else {
        currentY = 400;
        path.push({ x: currentLine, y: currentY });
      }
    }
    return { path, endLine: currentLine };
  };

  const startLadder = () => {
    if (animating) return;
    setAnimating(true);
    
    // Pick a random participant to highlight their path
    const startIdx = Math.floor(Math.random() * participants.length);
    setTargetParticipantIdx(startIdx);
    
    const { path, endLine } = tracePath(startIdx);
    setActivePath(path);

    // Slowly animate the path
    setTimeout(() => {
      setWinner(participants[startIdx], amounts[endLine]);
      setAnimating(false);
    }, 3000); // 3 seconds for visibility
  };

  return (
    <div className="flex flex-col items-center gap-6 h-full w-full max-w-md mx-auto">
      <div className="text-center space-y-1">
        <h3 className="text-2xl font-black text-primary italic">LADDER CHANCE</h3>
        <p className="text-xs font-bold text-muted-foreground">하단에 벌칙이나 금액을 입력하세요!</p>
      </div>
      
      <div className="relative w-full h-[450px] bg-white/50 backdrop-blur-sm rounded-[2.5rem] border-4 border-white shadow-inner p-8 flex flex-col justify-between overflow-hidden">
        {/* Participants at the top */}
        <div className="flex justify-between w-full relative z-10">
          {participants.map((p, idx) => (
            <div key={p.id} className={cn(
              "flex flex-col items-center w-0 overflow-visible transition-all duration-500",
              targetParticipantIdx === idx ? "scale-125" : "opacity-60"
            )}>
              <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/20 flex items-center justify-center font-black text-xs text-primary mb-1">
                {p.name[0]}
              </div>
              <div className="text-[10px] font-black whitespace-nowrap">{p.name}</div>
            </div>
          ))}
        </div>

        {/* The Ladder Grid */}
        <div className="absolute inset-x-8 top-20 bottom-24">
          <svg className="w-full h-full" viewBox={`0 0 ${participants.length - 1} 400`} preserveAspectRatio="none">
            {/* Vertical Lines */}
            {participants.map((_, i) => (
              <line key={i} x1={i} y1="0" x2={i} y2="400" stroke="hsl(var(--primary)/0.2)" strokeWidth="0.05" strokeLinecap="round" />
            ))}
            
            {/* Horizontal Bars */}
            {horizontalBars.map((bar, i) => (
              <line 
                key={i} 
                x1={bar.line} 
                y1={bar.y} 
                x2={bar.line + 1} 
                y2={bar.y} 
                stroke="hsl(var(--primary)/0.4)" 
                strokeWidth="0.05" 
                strokeLinecap="round" 
              />
            ))}

            {/* Active Path Animation */}
            {activePath.length > 0 && (
              <polyline
                points={activePath.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth="0.1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-ladder-draw"
                style={{
                   strokeDasharray: 2000,
                   strokeDashoffset: animating ? 2000 : 0,
                   transition: 'stroke-dashoffset 3s linear'
                }}
              />
            )}
          </svg>
        </div>

        {/* Amount Inputs at the bottom */}
        <div className="flex justify-between w-full relative z-10 mt-auto">
          {amounts.map((amt, idx) => (
            <div key={idx} className="w-12 flex flex-col items-center gap-1">
              <Input
                value={amt}
                onChange={(e) => {
                  const newAmts = [...amounts];
                  newAmts[idx] = e.target.value;
                  setAmounts(newAmts);
                }}
                disabled={animating}
                className="h-8 text-[10px] font-bold p-1 text-center bg-white border-2 border-primary/10 rounded-lg focus:ring-primary"
              />
              <div className="w-2 h-2 rounded-full bg-primary/40" />
            </div>
          ))}
        </div>
      </div>

      <Button 
        onClick={startLadder} 
        disabled={animating}
        className="w-full py-8 text-xl font-black hero-gradient soft-glow rounded-[2rem] animate-float"
      >
        {animating ? '사다리 타는 중...' : '운명의 시작!'}
      </Button>

      <style jsx global>{`
        @keyframes ladder-draw {
          from { stroke-dashoffset: 2000; }
          to { stroke-dashoffset: 0; }
        }
        .animate-ladder-draw {
          animation: ladder-draw 3s linear forwards;
        }
      `}</style>
    </div>
  );
};
