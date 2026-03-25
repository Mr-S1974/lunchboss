
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useGame, Participant } from '../game-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Play, ChevronRight, User } from 'lucide-react';

interface Bar {
  line: number;
  y: number;
}

interface ParticipantPath {
  participant: Participant;
  path: { x: number, y: number }[];
  endIndex: number;
}

export const LadderGame = () => {
  const { participants, setWinner } = useGame();
  const [step, setStep] = useState<'setup' | 'playing'>('setup');
  const [amounts, setAmounts] = useState<string[]>([]);
  const [horizontalBars, setHorizontalBars] = useState<Bar[]>([]);
  
  // Game state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [finishedPaths, setFinishedPaths] = useState<ParticipantPath[]>([]);
  const [activePath, setActivePath] = useState<{ x: number, y: number }[]>([]);

  // Initialize amounts and ladder structure
  useEffect(() => {
    if (participants.length > 0) {
      setAmounts(participants.map((_, i) => i === 0 ? "결제(BOSS)" : "통과"));
      
      const bars: Bar[] = [];
      const numLines = participants.length;
      for (let i = 0; i < numLines - 1; i++) {
        const numBars = Math.floor(Math.random() * 3) + 3; // More bars for complexity
        for (let j = 0; j < numBars; j++) {
          const y = 40 + (Math.random() * 300);
          if (!bars.some(b => b.line === i && Math.abs(b.y - y) < 25)) {
            bars.push({ line: i, y });
          }
        }
      }
      setHorizontalBars(bars.sort((a, b) => a.y - b.y));
    }
  }, [participants]);

  const tracePath = (startLine: number) => {
    let currentLine = startLine;
    let currentY = 0;
    const path = [{ x: currentLine, y: 0 }];
    const sortedBars = [...horizontalBars].sort((a, b) => a.y - b.y);

    while (currentY < 400) {
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
    return { path, endIndex: currentLine };
  };

  const startNextParticipant = () => {
    if (animating || currentIndex >= participants.length) return;
    
    setAnimating(true);
    const { path, endIndex } = tracePath(currentIndex);
    setActivePath(path);

    setTimeout(() => {
      setFinishedPaths(prev => [...prev, { 
        participant: participants[currentIndex], 
        path, 
        endIndex 
      }]);
      setActivePath([]);
      setAnimating(false);
      setCurrentIndex(prev => prev + 1);

      // Final Check: All participants finished
      if (currentIndex === participants.length - 1) {
        setTimeout(() => {
          // Find who hit the "BOSS" or the target result
          // For simplicity, we find the one who hit the first amount entry if it's "BOSS"
          // Or just find the one who landed on any "BOSS" string
          const bossResultIndex = amounts.findIndex(a => a.includes("BOSS") || a.includes("결제"));
          const actualBossIdx = bossResultIndex !== -1 ? bossResultIndex : 0;
          
          const bossPath = [...finishedPaths, { participant: participants[currentIndex], path, endIndex }].find(p => p.endIndex === actualBossIdx);
          
          if (bossPath) {
            setWinner(bossPath.participant, amounts[bossPath.endIndex]);
          } else {
             // Fallback
             setWinner(participants[Math.floor(Math.random() * participants.length)], amounts[0]);
          }
        }, 1000);
      }
    }, 2500); // Slower animation as requested
  };

  if (step === 'setup') {
    return (
      <div className="flex flex-col gap-6 w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4">
        <div className="text-center space-y-2">
          <h3 className="text-3xl font-black text-primary italic">LADDER SETUP</h3>
          <p className="text-sm font-bold text-muted-foreground">도착 지점의 결과를 입력하세요!</p>
        </div>

        <div className="grid gap-3 bg-white/60 backdrop-blur-md p-6 rounded-[2.5rem] border-4 border-white shadow-xl">
          {amounts.map((amt, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary border-2 border-primary/20">
                {i + 1}
              </div>
              <Input
                value={amt}
                onChange={(e) => {
                  const newAmts = [...amounts];
                  newAmts[i] = e.target.value;
                  setAmounts(newAmts);
                }}
                className="h-12 rounded-xl border-2 border-primary/10 font-bold focus:ring-primary bg-white"
              />
            </div>
          ))}
        </div>

        <Button 
          onClick={() => setStep('playing')}
          className="w-full py-8 text-2xl font-black hero-gradient soft-glow rounded-[2rem] flex gap-2"
        >
          <Play fill="currentColor" /> 게임 시작!
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 h-full w-full max-w-md mx-auto animate-in zoom-in-95">
      <div className="text-center space-y-1">
        <h3 className="text-2xl font-black text-primary italic">LADDER RUNNING</h3>
        <p className="text-xs font-bold text-muted-foreground">
          {currentIndex < participants.length 
            ? `${participants[currentIndex].name}님이 출발할 차례입니다!` 
            : "모든 참가자가 도착했습니다!"}
        </p>
      </div>
      
      <div className="relative w-full h-[480px] bg-white/50 backdrop-blur-sm rounded-[3rem] border-4 border-white shadow-inner p-10 flex flex-col justify-between overflow-hidden">
        {/* Participants Labels */}
        <div className="flex justify-between w-full relative z-10 px-2">
          {participants.map((p, idx) => (
            <div key={p.id} className={cn(
              "flex flex-col items-center w-0 overflow-visible transition-all duration-500",
              currentIndex === idx ? "scale-125 translate-y-[-5px]" : "opacity-40"
            )}>
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center font-black text-sm border-2 transition-colors",
                currentIndex === idx ? "bg-primary text-white border-primary shadow-lg" : "bg-white text-muted-foreground border-muted/20"
              )}>
                {p.name[0]}
              </div>
              <div className="text-[10px] font-black mt-1 whitespace-nowrap bg-white/80 px-2 py-0.5 rounded-full">{p.name}</div>
            </div>
          ))}
        </div>

        {/* The Ladder Grid */}
        <div className="absolute inset-x-12 top-24 bottom-24">
          <svg className="w-full h-full" viewBox={`0 0 ${participants.length - 1} 400`} preserveAspectRatio="none">
            {/* Vertical Lines */}
            {participants.map((_, i) => (
              <line key={i} x1={i} y1="0" x2={i} y2="400" stroke="hsl(var(--primary)/0.15)" strokeWidth="0.08" strokeLinecap="round" />
            ))}
            
            {/* Horizontal Bars */}
            {horizontalBars.map((bar, i) => (
              <line 
                key={i} 
                x1={bar.line} 
                y1={bar.y} 
                x2={bar.line + 1} 
                y2={bar.y} 
                stroke="hsl(var(--primary)/0.3)" 
                strokeWidth="0.08" 
                strokeLinecap="round" 
              />
            ))}

            {/* Finished Paths */}
            {finishedPaths.map((fp, i) => (
              <polyline
                key={i}
                points={fp.path.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="hsl(var(--secondary)/0.5)"
                strokeWidth="0.12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* Current Active Path Animation */}
            {activePath.length > 0 && (
              <polyline
                points={activePath.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth="0.15"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-ladder-draw"
                style={{
                   strokeDasharray: 2500,
                   strokeDashoffset: animating ? 2500 : 0,
                   transition: 'stroke-dashoffset 2.5s linear'
                }}
              />
            )}
          </svg>
        </div>

        {/* Result Labels at Bottom */}
        <div className="flex justify-between w-full relative z-10 px-2">
          {amounts.map((amt, idx) => {
            const isHit = finishedPaths.some(fp => fp.endIndex === idx);
            return (
              <div key={idx} className="w-0 overflow-visible flex flex-col items-center gap-1 transition-all">
                <div className={cn(
                  "px-2 py-1 min-w-[50px] text-center text-[10px] font-black rounded-lg border-2 transition-all",
                  isHit ? "bg-secondary text-white border-secondary scale-110" : "bg-white text-primary border-primary/10"
                )}>
                  {amt}
                </div>
                <div className={cn("w-3 h-3 rounded-full transition-colors", isHit ? "bg-secondary" : "bg-primary/20")} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full space-y-3">
        {currentIndex < participants.length ? (
          <Button 
            onClick={startNextParticipant} 
            disabled={animating}
            className="w-full py-8 text-xl font-black hero-gradient soft-glow rounded-[2rem] flex gap-2"
          >
            {animating ? (
              <>이동 중...</>
            ) : (
              <>
                <User size={24} /> {participants[currentIndex].name} 출발!
              </>
            )}
          </Button>
        ) : (
          <div className="text-center py-4 text-primary font-black animate-pulse">
            결과를 계산하고 있습니다...
          </div>
        )}
        
        <Button variant="ghost" onClick={() => setStep('setup')} disabled={animating} className="w-full font-bold opacity-60">
          결과 다시 설정하기
        </Button>
      </div>

      <style jsx global>{`
        @keyframes ladder-draw {
          from { stroke-dashoffset: 2500; }
          to { stroke-dashoffset: 0; }
        }
        .animate-ladder-draw {
          animation: ladder-draw 2.5s linear forwards;
        }
      `}</style>
    </div>
  );
};
