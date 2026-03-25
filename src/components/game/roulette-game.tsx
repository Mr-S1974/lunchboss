
"use client";

import { useState, useEffect } from 'react';
import { useGame, Participant, GameResult } from '../game-context';
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
      setAmounts(participants.map(() => ""));
    }
  }, [participants.length]);

  const formatWithCommas = (val: string) => {
    const numeric = val.replace(/[^0-9]/g, '');
    if (!numeric) return "";
    return Number(numeric).toLocaleString();
  };

  // 인원수의 2배로 칸을 배정
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
      // 룰렛 회전 후 상단 화살표(0도)에 위치한 슬라이스 계산
      // 회전된 각도를 360으로 나눈 나머지를 이용하여 인덱스 역추적
      const normalizedRotation = newRotation % 360;
      const hitSliceIndex = Math.floor(((360 - normalizedRotation) % 360) / sliceSize);
      
      // 금액은 순환 구조 (N개 금액이 2세트 반복)
      const hitAmountIndex = hitSliceIndex % participants.length;
      
      const currentResult: GameResult = {
        participant: participants[currentIndex],
        amount: amounts[hitAmountIndex]
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
    }, 4000); // 4초 동안 회전
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
    
    return `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  if (step === 'setup') {
    return (
      <div className="flex flex-col gap-6 w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4">
        <div className="text-center space-y-2">
          <h3 className="text-3xl font-black text-secondary italic">복불복 룰렛 SETUP</h3>
          <p className="text-sm font-bold text-muted-foreground">룰렛의 각 칸에 들어갈 금액을 정해주세요!</p>
        </div>

        <div className="grid gap-3 bg-white/60 backdrop-blur-md p-6 rounded-[2.5rem] border-4 border-white shadow-xl">
          {amounts.map((amt, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center font-black text-secondary border-2 border-secondary/20 shrink-0">
                {i + 1}
              </div>
              <Input
                value={amt}
                onChange={(e) => {
                  const newAmts = [...amounts];
                  newAmts[i] = formatWithCommas(e.target.value);
                  setAmounts(newAmts);
                }}
                className="h-12 rounded-xl border-2 border-secondary/10 font-bold focus:ring-secondary bg-white"
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
          <Play fill="currentColor" /> 복불복 룰렛 준비 완료!
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 h-full w-full max-w-md mx-auto">
      <div className="text-center space-y-1">
        <h3 className="text-2xl font-black text-secondary italic uppercase tracking-tighter">복불복 룰렛</h3>
        <p className="text-xs font-bold text-muted-foreground">
          {currentIndex < participants.length 
            ? `${participants[currentIndex].name}님이 룰렛을 돌릴 차례입니다!` 
            : "모든 결과 분석 중..."}
        </p>
      </div>
      
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
        {/* 상단 화살표 인디케이터 */}
        <div className="absolute top-[-25px] left-1/2 -translate-x-1/2 z-30">
          <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-accent drop-shadow-md" />
        </div>
        
        {/* 룰렛 판 */}
        <div 
          className="w-full h-full rounded-full border-[10px] border-white shadow-2xl overflow-hidden relative"
          style={{ transform: `rotate(${rotation}deg)`, transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)' : 'none' }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {Array.from({ length: totalSlices }).map((_, i) => (
              <path
                key={i}
                d={getSlicePath(i, totalSlices)}
                fill={i % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'}
                className="transition-colors duration-500"
              />
            ))}
          </svg>
          
          {/* 금액 텍스트 레이블 (2배 칸 배정) */}
          {Array.from({ length: totalSlices }).map((_, i) => {
            const angle = 360 / totalSlices;
            const textAngle = i * angle + angle / 2;
            const amountIdx = i % participants.length;
            return (
              <div 
                key={i} 
                className="absolute inset-0 flex items-start justify-center pt-10 pointer-events-none"
                style={{ transform: `rotate(${textAngle}deg)` }}
              >
                <div className="text-[9px] font-black text-white bg-black/20 px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                  {amounts[amountIdx]}
                </div>
              </div>
            );
          })}

          {/* 중앙 코어 */}
          <div className="absolute inset-[38%] rounded-full bg-white shadow-inner flex items-center justify-center z-10 border-4 border-primary/10">
             <Target className="text-primary opacity-20" size={32} />
          </div>
        </div>
      </div>

      <div className="w-full bg-white/40 backdrop-blur-md p-5 rounded-[2rem] border-4 border-white shadow-inner mt-4">
        <div className="text-xs font-black text-secondary mb-3 flex items-center gap-2">
          <Target size={14} /> 실시간 룰렛 현황
        </div>
        <div className="grid grid-cols-2 gap-2">
           {participants.map(p => {
             const res = results.find(r => r.participant.id === p.id);
             return (
               <div key={p.id} className={cn(
                 "px-3 py-2 rounded-xl text-[10px] font-black border transition-all flex justify-between items-center",
                 res ? "bg-secondary/10 border-secondary/30 text-secondary" : "bg-white/50 border-white text-muted-foreground opacity-60"
               )}>
                 <span className="truncate max-w-[60px]">{p.name}</span>
                 <span>{res ? `${res.amount}` : '대기'}</span>
               </div>
             );
           })}
        </div>
      </div>

      <div className="w-full space-y-4">
        {currentIndex < participants.length ? (
          <Button onClick={spinRoulette} disabled={isSpinning} className="w-full py-8 text-2xl font-black hero-gradient soft-glow rounded-[2rem] flex gap-3">
            {isSpinning ? '돌아가는 중... (두근두근! 🎡)' : <><User /> {participants[currentIndex].name}님 룰렛 돌리기!</>}
          </Button>
        ) : (
          <div className="text-center py-6 text-secondary font-black animate-pulse flex items-center justify-center gap-2 bg-secondary/5 rounded-3xl border-2 border-dashed border-secondary/20">
            <CheckCircle2 /> 결과 분석 중...
          </div>
        )}
      </div>
    </div>
  );
};
