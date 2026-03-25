
"use client";

import { useEffect, useState } from 'react';
import { useGame, Participant } from '../game-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Play, User, CheckCircle2 } from 'lucide-react';

interface Bar {
  line: number;
  y: number;
}

interface ParticipantPath {
  participant: Participant;
  path: { x: number, y: number }[];
  endIndex: number;
  amount: string;
}

export const LadderGame = () => {
  const { participants, setWinner } = useGame();
  const validParticipants = participants.filter(p => p.name.trim() !== "");
  const [step, setStep] = useState<'setup' | 'playing'>('setup');
  const [amounts, setAmounts] = useState<string[]>([]);
  const [horizontalBars, setHorizontalBars] = useState<Bar[]>([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [finishedPaths, setFinishedPaths] = useState<ParticipantPath[]>([]);
  const [activePath, setActivePath] = useState<{ x: number, y: number }[]>([]);

  useEffect(() => {
    if (validParticipants.length > 0) {
      setAmounts(validParticipants.map(() => ""));
      
      const bars: Bar[] = [];
      const numLines = validParticipants.length;
      for (let i = 0; i < numLines - 1; i++) {
        const numBars = Math.floor(Math.random() * 3) + 3;
        for (let j = 0; j < numBars; j++) {
          const y = 40 + (Math.random() * 300);
          if (!bars.some(b => b.line === i && Math.abs(b.y - y) < 30)) {
            bars.push({ line: i, y });
          }
        }
      }
      setHorizontalBars(bars.sort((a, b) => a.y - b.y));
    }
  }, [validParticipants.length]);

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

  const parseAmount = (str: string) => {
    const val = parseInt(str.replace(/[^0-9]/g, '')) || 0;
    return val;
  };

  const formatWithCommas = (val: string) => {
    const numeric = val.replace(/[^0-9]/g, '');
    if (!numeric) return "";
    return Number(numeric).toLocaleString();
  };

  const startNextParticipant = () => {
    if (animating || currentIndex >= validParticipants.length) return;
    
    setAnimating(true);
    const { path, endIndex } = tracePath(currentIndex);
    setActivePath(path);

    setTimeout(() => {
      const newPathResult: ParticipantPath = { 
        participant: validParticipants[currentIndex], 
        path, 
        endIndex,
        amount: amounts[endIndex]
      };
      
      const updatedFinishedPaths = [...finishedPaths, newPathResult];
      setFinishedPaths(updatedFinishedPaths);
      setActivePath([]);
      setAnimating(false);
      
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);

      if (nextIdx === validParticipants.length) {
        setTimeout(() => {
          let maxVal = -1;
          let winnerResult = updatedFinishedPaths[0];

          updatedFinishedPaths.forEach(rp => {
            const val = parseAmount(rp.amount);
            if (val > maxVal) {
              maxVal = val;
              winnerResult = rp;
            }
          });

          setWinner(winnerResult.participant, formatWithCommas(winnerResult.amount));
        }, 1500);
      }
    }, 2500);
  };

  if (step === 'setup') {
    return (
      <div className="flex flex-col gap-6 w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4">
        <div className="text-center space-y-2">
          <h3 className="text-3xl font-black text-primary italic">LADDER SETUP</h3>
          <p className="text-sm font-bold text-muted-foreground">도착 지점마다 배정할 금액을 입력하세요!</p>
        </div>

        <div className="grid gap-3 bg-white/60 backdrop-blur-md p-6 rounded-[2.5rem] border-4 border-white shadow-xl">
          {amounts.map((amt, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary border-2 border-primary/20 shrink-0">
                {i + 1}
              </div>
              <Input
                value={amt}
                onChange={(e) => {
                  const newAmts = [...amounts];
                  newAmts[i] = formatWithCommas(e.target.value);
                  setAmounts(newAmts);
                }}
                className="h-12 rounded-xl border-2 border-primary/10 font-bold focus:ring-primary bg-white"
                placeholder="금액(원) 입력"
              />
            </div>
          ))}
        </div>

        <Button 
          onClick={() => setStep('playing')}
          disabled={amounts.some(a => !a)}
          className="w-full py-8 text-2xl font-black hero-gradient soft-glow rounded-[2rem] flex gap-2"
        >
          <Play fill="currentColor" /> 사다리 준비 완료!
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 h-full w-full max-w-md mx-auto animate-in zoom-in-95">
      <div className="text-center space-y-1">
        <h3 className="text-2xl font-black text-primary italic">LADDER RUNNING</h3>
        <p className="text-xs font-bold text-muted-foreground">
          {currentIndex < validParticipants.length 
            ? `${validParticipants[currentIndex].name}님이 출발할 차례입니다!` 
            : "모든 참가자가 도착했습니다! 결과를 확인합니다."}
        </p>
      </div>
      
      <div className="relative w-full h-[480px] bg-white/50 backdrop-blur-sm rounded-[3rem] border-4 border-white shadow-inner p-10 flex flex-col justify-between overflow-hidden">
        <div className="flex justify-between w-full relative z-10 px-2">
          {validParticipants.map((p, idx) => {
            const isDone = finishedPaths.some(fp => fp.participant.id === p.id);
            return (
              <div key={p.id} className={cn(
                "flex flex-col items-center w-0 overflow-visible transition-all duration-500",
                currentIndex === idx ? "scale-125 translate-y-[-5px]" : isDone ? "opacity-40" : "opacity-100"
              )}>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-black text-xs border-2 transition-colors",
                  currentIndex === idx ? "bg-primary text-white border-primary shadow-lg" : isDone ? "bg-muted text-muted-foreground border-muted" : "bg-white text-primary border-primary/20"
                )}>
                  {p.name[0]}
                </div>
                <div className="text-[10px] font-black mt-1 whitespace-nowrap bg-white/80 px-2 py-0.5 rounded-full">{p.name}</div>
              </div>
            );
          })}
        </div>

        <div className="absolute inset-x-12 top-24 bottom-24">
          <svg className="w-full h-full" viewBox={`0 0 ${validParticipants.length - 1} 400`} preserveAspectRatio="none">
            {validParticipants.map((_, i) => (
              <line key={i} x1={i} y1="0" x2={i} y2="400" stroke="hsl(var(--primary)/0.1)" strokeWidth="0.05" strokeLinecap="round" />
            ))}
            {horizontalBars.map((bar, i) => (
              <line key={i} x1={bar.line} y1={bar.y} x2={bar.line + 1} y2={bar.y} stroke="hsl(var(--primary)/0.2)" strokeWidth="0.05" strokeLinecap="round" />
            ))}
            {finishedPaths.map((fp, i) => (
              <polyline key={i} points={fp.path.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="hsl(var(--secondary)/0.4)" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round" />
            ))}
            {activePath.length > 0 && (
              <polyline points={activePath.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="hsl(var(--accent))" strokeWidth="0.15" strokeLinecap="round" strokeLinejoin="round" className="animate-ladder-draw" style={{ strokeDasharray: 2500, strokeDashoffset: animating ? 2500 : 0, transition: 'stroke-dashoffset 2.5s linear' }} />
            )}
          </svg>
        </div>

        <div className="flex justify-between w-full relative z-10 px-2">
          {amounts.map((amt, idx) => {
            const pathResult = finishedPaths.find(fp => fp.endIndex === idx);
            return (
              <div key={idx} className="w-0 overflow-visible flex flex-col items-center gap-1 transition-all">
                <div className={cn(
                  "px-2 py-1 min-w-[50px] text-center text-[10px] font-black rounded-lg border-2 transition-all",
                  pathResult ? "bg-secondary text-white border-secondary scale-110" : "bg-white text-primary border-primary/10"
                )}>
                  {pathResult ? pathResult.participant.name : amt}
                </div>
                {pathResult && <div className="text-[9px] font-black text-secondary-foreground mt-1">{amt}</div>}
                <div className={cn("w-3 h-3 rounded-full transition-colors", pathResult ? "bg-secondary" : "bg-primary/20")} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full space-y-3">
        {currentIndex < validParticipants.length ? (
          <Button onClick={startNextParticipant} disabled={animating} className="w-full py-8 text-xl font-black hero-gradient soft-glow rounded-[2rem] flex gap-2">
            {animating ? <>이동 중 (눈 크게 뜨고 보세요! 👀)</> : <><User size={24} /> {validParticipants[currentIndex].name} 출발하기!</>}
          </Button>
        ) : (
          <div className="text-center py-4 text-primary font-black animate-pulse flex items-center justify-center gap-2">
            <CheckCircle2 /> 결과 분석 및 보스 선정 중...
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes ladder-draw { from { stroke-dashoffset: 2500; } to { stroke-dashoffset: 0; } }
        .animate-ladder-draw { animation: ladder-draw 2.5s linear forwards; }
      `}</style>
    </div>
  );
};
