"use client";

import { useState, useEffect } from 'react';
import { useGame, GameResult } from '../game-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Target, User, CheckCircle2, Play } from 'lucide-react';

export const RouletteGame = () => {
  const { participants, setFinalResults } = useGame();
  const [step, setStep] = useState<'setup' | 'playing'>('setup');
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [amounts, setAmounts] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<GameResult[]>([]);

  useEffect(() => {
    if (participants.length > 0) {
      setAmounts(participants.map(() => ''));
    }
  }, [participants.length]);

  const formatWithCommas = (val: string) => {
    const numeric = val.replace(/[^0-9]/g, '');
    if (numeric === '') return '';
    return Number(numeric).toLocaleString();
  };

  const totalSlices = participants.length * 2;

  const spinRoulette = () => {
    if (isSpinning || currentIndex >= participants.length) return;

    setIsSpinning(true);
    const extraSpins = 5 + Math.random() * 5;
    const spinAmount = extraSpins * 360;
    const newRotation = rotation + spinAmount;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);

      const sliceSize = 360 / totalSlices;
      const normalizedRotation = newRotation % 360;
      const hitSliceIndex = Math.floor(((360 - normalizedRotation) % 360) / sliceSize);
      const hitAmountIndex = hitSliceIndex % participants.length;

      const currentResult: GameResult = {
        participant: participants[currentIndex],
        amount: amounts[hitAmountIndex],
      };

      const updatedResults = [...results, currentResult];
      setResults(updatedResults);

      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);

      if (nextIdx === participants.length) {
        setTimeout(() => {
          setFinalResults(updatedResults);
        }, 1500);
      }
    }, 4000);
  };

  const getSlicePath = (index: number, total: number) => {
    const angle = 360 / total;
    const startAngle = index * angle;
    const endAngle = (index + 1) * angle;

    const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
    const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
    const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
    const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);
    const largeArcFlag = angle > 180 ? 1 : 0;

    return 'M 50 50 L ' + x1 + ' ' + y1 + ' A 50 50 0 ' + largeArcFlag + ' 1 ' + x2 + ' ' + y2 + ' Z';
  };

  if (step === 'setup') {
    return (
      <div className="mx-auto flex w-full max-w-xl min-w-0 flex-col gap-6 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
        <div className="px-2 text-center">
          <h3 className="font-headline text-3xl font-extrabold tracking-[-0.04em] text-secondary">Roulette Setup</h3>
          <p className="mt-2 break-keep text-sm leading-6 text-muted-foreground">룰렛의 각 금액을 먼저 정해주세요.</p>
        </div>

        <div className="grid gap-3 rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-xl backdrop-blur-md sm:p-6">
          {amounts.map((amt, i) => (
            <div key={i} className="flex min-w-0 items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-secondary/20 bg-secondary/10 font-bold text-secondary">
                {i + 1}
              </div>
              <Input
                value={amt}
                onChange={(e) => {
                  const newAmts = [...amounts];
                  newAmts[i] = formatWithCommas(e.target.value);
                  setAmounts(newAmts);
                }}
                className="h-12 min-w-0 rounded-xl border-2 border-secondary/10 bg-white font-semibold"
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
          <Play fill="currentColor" /> 룰렛 준비 완료
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-xl min-w-0 flex-col items-center gap-6 overflow-hidden">
      <div className="w-full max-w-lg px-2 text-center">
        <h3 className="font-headline text-2xl font-bold text-secondary">복불복 룰렛</h3>
        <p className="mt-2 break-keep text-sm leading-6 text-muted-foreground">
          {currentIndex < participants.length ? participants[currentIndex].name + '님이 룰렛을 돌릴 차례입니다.' : '모든 결과를 분석 중입니다.'}
        </p>
      </div>

      <div className="relative flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
        <div className="absolute left-1/2 top-[-25px] z-30 -translate-x-1/2">
          <div className="h-0 w-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-accent drop-shadow-md" />
        </div>

        <div
          className="relative h-full w-full overflow-hidden rounded-full border-[10px] border-white shadow-2xl"
          style={{ transform: 'rotate(' + String(rotation) + 'deg)', transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)' : 'none' }}
        >
          <svg viewBox="0 0 100 100" className="h-full w-full">
            {Array.from({ length: totalSlices }).map((_, i) => (
              <path
                key={i}
                d={getSlicePath(i, totalSlices)}
                fill={i % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'}
                className="transition-colors duration-500"
              />
            ))}
          </svg>

          {Array.from({ length: totalSlices }).map((_, i) => {
            const angle = 360 / totalSlices;
            const textAngle = i * angle + angle / 2;
            const amountIdx = i % participants.length;
            return (
              <div
                key={i}
                className="pointer-events-none absolute inset-0 flex items-start justify-center pt-10"
                style={{ transform: 'rotate(' + String(textAngle) + 'deg)' }}
              >
                <div className="max-w-[72px] truncate rounded-full bg-black/20 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
                  {amounts[amountIdx]}
                </div>
              </div>
            );
          })}

          <div className="absolute inset-[38%] z-10 flex items-center justify-center rounded-full border-4 border-primary/10 bg-white shadow-inner">
            <Target className="text-primary opacity-20" size={32} />
          </div>
        </div>
      </div>

      <div className="w-full rounded-[1.8rem] border border-white/70 bg-white/50 p-4 shadow-inner backdrop-blur-md sm:p-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold text-secondary">
          <Target size={14} /> 실시간 룰렛 현황
        </div>
        <div className="grid grid-cols-2 gap-2">
          {participants.map((p) => {
            const res = results.find((r) => r.participant.id === p.id);
            return (
              <div
                key={p.id}
                className={cn(
                  'flex min-w-0 items-center justify-between gap-2 rounded-xl border px-3 py-2 text-[10px] font-bold transition-all',
                  res ? 'border-secondary/30 bg-secondary/10 text-secondary' : 'border-white bg-white/50 text-muted-foreground opacity-60'
                )}
              >
                <span className="min-w-0 flex-1 truncate">{p.name}</span>
                <span className="shrink-0">{res ? res.amount : '대기'}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full space-y-4">
        {currentIndex < participants.length ? (
          <Button onClick={spinRoulette} disabled={isSpinning} className="hero-gradient soft-glow w-full rounded-[1.6rem] py-7 text-lg font-bold sm:text-xl">
            {isSpinning ? '룰렛 회전 중' : <><User /> {participants[currentIndex].name}님 룰렛 돌리기</>}
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-secondary/20 bg-secondary/5 py-6 text-center font-bold text-secondary animate-pulse">
            <CheckCircle2 /> 결과 분석 중...
          </div>
        )}
      </div>
    </div>
  );
};
