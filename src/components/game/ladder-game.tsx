"use client";

import { useEffect, useState } from 'react';
import { useGame, Participant, GameResult } from '../game-context';
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
  path: { x: number; y: number }[];
  endIndex: number;
  amount: string;
}

export const LadderGame = () => {
  const { participants, setFinalResults } = useGame();
  const [step, setStep] = useState<'setup' | 'playing'>('setup');
  const [amounts, setAmounts] = useState<string[]>([]);
  const [horizontalBars, setHorizontalBars] = useState<Bar[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [finishedPaths, setFinishedPaths] = useState<ParticipantPath[]>([]);
  const [activePath, setActivePath] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    if (participants.length > 0) {
      setAmounts(participants.map(() => ''));

      const bars: Bar[] = [];
      const numLines = participants.length;
      for (let i = 0; i < numLines - 1; i++) {
        const numBars = Math.floor(Math.random() * 3) + 3;
        for (let j = 0; j < numBars; j++) {
          const y = 40 + Math.random() * 300;
          if (bars.some((b) => b.line === i && Math.abs(b.y - y) < 30) === false) {
            bars.push({ line: i, y });
          }
        }
      }
      setHorizontalBars(bars.sort((a, b) => a.y - b.y));
    }
  }, [participants.length]);

  const tracePath = (startLine: number) => {
    let currentLine = startLine;
    let currentY = 0;
    const path = [{ x: currentLine, y: 0 }];
    const sortedBars = [...horizontalBars].sort((a, b) => a.y - b.y);

    while (currentY < 400) {
      const nextBar = sortedBars.find((bar) => bar.y > currentY && (bar.line === currentLine || bar.line === currentLine - 1));

      if (nextBar) {
        currentY = nextBar.y;
        path.push({ x: currentLine, y: currentY });

        if (nextBar.line === currentLine) {
          currentLine += 1;
        } else {
          currentLine -= 1;
        }
        path.push({ x: currentLine, y: currentY });
      } else {
        currentY = 400;
        path.push({ x: currentLine, y: currentY });
      }
    }
    return { path, endIndex: currentLine };
  };

  const formatWithCommas = (val: string) => {
    const numeric = val.replace(/[^0-9]/g, '');
    if (numeric === '') return '';
    return Number(numeric).toLocaleString();
  };

  const startNextParticipant = () => {
    if (animating || currentIndex >= participants.length) return;

    setAnimating(true);
    const traced = tracePath(currentIndex);
    setActivePath(traced.path);

    setTimeout(() => {
      const newPathResult: ParticipantPath = {
        participant: participants[currentIndex],
        path: traced.path,
        endIndex: traced.endIndex,
        amount: amounts[traced.endIndex],
      };

      const updatedFinishedPaths = [...finishedPaths, newPathResult];
      setFinishedPaths(updatedFinishedPaths);
      setActivePath([]);
      setAnimating(false);

      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);

      if (nextIdx === participants.length) {
        setTimeout(() => {
          const finalResults: GameResult[] = updatedFinishedPaths.map((rp) => ({
            participant: rp.participant,
            amount: rp.amount,
          }));
          setFinalResults(finalResults);
        }, 1500);
      }
    }, 2500);
  };

  if (step === 'setup') {
    return (
      <div className="mx-auto flex w-full max-w-xl min-w-0 flex-col gap-6 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
        <div className="px-2 text-center">
          <h3 className="font-headline text-3xl font-extrabold tracking-[-0.04em] text-primary">Ladder Setup</h3>
          <p className="mt-2 break-keep text-sm leading-6 text-muted-foreground">도착 지점마다 배정할 금액을 입력하세요.</p>
        </div>

        <div className="grid gap-3 rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-xl backdrop-blur-md sm:p-6">
          {amounts.map((amt, i) => (
            <div key={i} className="flex min-w-0 items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/10 font-bold text-primary">
                {i + 1}
              </div>
              <Input
                value={amt}
                onChange={(e) => {
                  const newAmts = [...amounts];
                  newAmts[i] = formatWithCommas(e.target.value);
                  setAmounts(newAmts);
                }}
                className="h-12 min-w-0 rounded-xl border-2 border-primary/10 bg-white font-semibold"
                placeholder="금액(원) 입력"
              />
            </div>
          ))}
        </div>

        <Button
          onClick={() => setStep('playing')}
          disabled={amounts.some((a) => a === '')}
          className="hero-gradient soft-glow w-full rounded-[1.6rem] py-7 text-xl font-bold"
        >
          <Play fill="currentColor" /> 사다리 준비 완료
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-xl min-w-0 flex-col items-center gap-6 overflow-hidden animate-in zoom-in-95">
      <div className="w-full max-w-lg px-2 text-center">
        <h3 className="font-headline text-2xl font-bold text-primary">Ladder Running</h3>
        <p className="mt-2 break-keep text-sm leading-6 text-muted-foreground">
          {currentIndex < participants.length
            ? participants[currentIndex].name + '님이 출발할 차례입니다.'
            : '모든 참가자가 도착했습니다. 결과를 확인합니다.'}
        </p>
      </div>

      <div className="relative flex h-[480px] w-full min-w-0 flex-col justify-between overflow-hidden rounded-[2.4rem] border-4 border-white bg-white/50 p-6 shadow-inner backdrop-blur-sm sm:p-8">
        <div className="relative z-10 flex w-full gap-2 px-1 sm:px-2">
          {participants.map((p, idx) => {
            const isDone = finishedPaths.some((fp) => fp.participant.id === p.id);
            return (
              <div
                key={p.id}
                className={cn(
                  'flex min-w-0 flex-1 flex-col items-center transition-all duration-500',
                  currentIndex === idx ? 'translate-y-[-5px] scale-105' : isDone ? 'opacity-40' : 'opacity-100'
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors',
                    currentIndex === idx ? 'border-primary bg-primary text-white shadow-lg' : isDone ? 'border-muted bg-muted text-muted-foreground' : 'border-primary/20 bg-white text-primary'
                  )}
                >
                  {p.name[0]}
                </div>
                <div className="mt-1 max-w-full truncate rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-semibold text-foreground">
                  {p.name}
                </div>
              </div>
            );
          })}
        </div>

        <div className="absolute inset-y-24 left-8 right-8 sm:left-12 sm:right-12">
          <svg className="h-full w-full" viewBox={'0 0 ' + String(participants.length - 1) + ' 400'} preserveAspectRatio="none">
            {participants.map((_, i) => (
              <line key={i} x1={i} y1="0" x2={i} y2="400" stroke="hsl(var(--primary)/0.1)" strokeWidth="0.05" strokeLinecap="round" />
            ))}
            {horizontalBars.map((bar, i) => (
              <line key={i} x1={bar.line} y1={bar.y} x2={bar.line + 1} y2={bar.y} stroke="hsl(var(--primary)/0.2)" strokeWidth="0.05" strokeLinecap="round" />
            ))}
            {finishedPaths.map((fp, i) => (
              <polyline key={i} points={fp.path.map((p) => String(p.x) + ',' + String(p.y)).join(' ')} fill="none" stroke="hsl(var(--secondary)/0.4)" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round" />
            ))}
            {activePath.length > 0 && (
              <polyline
                points={activePath.map((p) => String(p.x) + ',' + String(p.y)).join(' ')}
                fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth="0.15"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-ladder-draw"
                style={{ strokeDasharray: 2500, strokeDashoffset: animating ? 2500 : 0, transition: 'stroke-dashoffset 2.5s linear' }}
              />
            )}
          </svg>
        </div>

        <div className="relative z-10 flex w-full gap-2 px-1 sm:px-2">
          {amounts.map((amt, idx) => {
            const pathResult = finishedPaths.find((fp) => fp.endIndex === idx);
            return (
              <div key={idx} className="flex min-w-0 flex-1 flex-col items-center gap-1 transition-all">
                <div
                  className={cn(
                    'min-w-0 max-w-full rounded-lg border-2 px-2 py-1 text-center text-[10px] font-bold transition-all',
                    pathResult ? 'scale-105 border-secondary bg-secondary text-white' : 'border-primary/10 bg-white text-primary'
                  )}
                >
                  <div className="truncate">{pathResult ? pathResult.participant.name : amt}</div>
                </div>
                {pathResult && <div className="max-w-full truncate text-[9px] font-semibold text-secondary">{amt}</div>}
                <div className={cn('h-3 w-3 rounded-full transition-colors', pathResult ? 'bg-secondary' : 'bg-primary/20')} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full space-y-3">
        {currentIndex < participants.length ? (
          <Button onClick={startNextParticipant} disabled={animating} className="hero-gradient soft-glow w-full rounded-[1.6rem] py-7 text-lg font-bold sm:text-xl">
            {animating ? '이동 중입니다' : <><User size={22} /> {participants[currentIndex].name} 출발하기</>}
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-2 py-4 text-center font-bold text-primary animate-pulse">
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
