
"use client";

import { useState, useEffect } from 'react';
import { useGame, Participant } from '../game-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Target, User, CheckCircle2 } from 'lucide-react';

interface DartResult {
  participant: Participant;
  amount: string;
}

export const RouletteGame = () => {
  const { participants, setWinner } = useGame();
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isDartFlying, setIsDartFlying] = useState(false);
  const [amounts, setAmounts] = useState<string[]>([]);
  
  // Sequential Game State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<DartResult[]>([]);

  useEffect(() => {
    // Initial suggested amounts
    const initialAmts = participants.map((_, i) => i === 0 ? "50000" : (i * 10000).toString());
    setAmounts(initialAmts);
  }, [participants.length]);

  const parseAmount = (str: string) => {
    const val = parseInt(str.replace(/[^0-9]/g, '')) || 0;
    const boost = (str.includes("BOSS") || str.includes("결제")) ? 1000000 : 0;
    return val + boost;
  };

  const throwDart = () => {
    if (isSpinning || isDartFlying || currentIndex >= participants.length) return;
    
    setIsSpinning(true);
    // Slow, trackable rotation: 3-5 full spins over 3 seconds
    const extraSpins = 3 + Math.random() * 2;
    const finalRotation = rotation + extraSpins * 360;
    setRotation(finalRotation);

    // After spinning animation, throw the dart
    setTimeout(() => {
      setIsDartFlying(true);
      
      setTimeout(() => {
        setIsSpinning(false);
        setIsDartFlying(false);
        
        const sliceSize = 360 / participants.length;
        // The pointer is at the top (0 deg). 
        // We need to find which slice is currently under the pointer.
        const normalizedRotation = (finalRotation % 360);
        const hitIndex = Math.floor(((360 - normalizedRotation) % 360) / sliceSize);
        
        const currentResult: DartResult = {
          participant: participants[currentIndex],
          amount: amounts[hitIndex]
        };

        const updatedResults = [...results, currentResult];
        setResults(updatedResults);
        
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);

        // If all participants have thrown
        if (nextIdx === participants.length) {
          setTimeout(() => {
            let maxVal = -1;
            let winnerRes = updatedResults[0];

            updatedResults.forEach(res => {
              const val = parseAmount(res.amount);
              if (val > maxVal) {
                maxVal = val;
                winnerRes = res;
              }
            });

            setWinner(winnerRes.participant, winnerRes.amount);
          }, 1500);
        }
      }, 800);
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center gap-8 h-full w-full max-w-md mx-auto">
      <div className="text-center space-y-1">
        <h3 className="text-2xl font-black text-secondary italic uppercase tracking-tighter">DART ROULETTE</h3>
        <p className="text-xs font-bold text-muted-foreground">전원이 다트를 던져 최고 금액을 뽑는 사람이 보스가 됩니다!</p>
      </div>
      
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
        {/* Target Pointer */}
        <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 z-30 animate-bounce">
          <div className="w-8 h-8 rounded-full bg-accent border-4 border-white shadow-lg flex items-center justify-center">
             <div className="w-2 h-2 rounded-full bg-white" />
          </div>
        </div>
        
        {/* Roulette Wheel */}
        <div 
          className={cn(
            "w-full h-full rounded-full border-[12px] border-white shadow-2xl overflow-hidden relative transition-transform cubic-bezier(0.2, 0, 0.2, 1)",
          )}
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transitionDuration: '4000ms'
          }}
        >
          {participants.map((p, i) => {
            const angle = 360 / participants.length;
            const rotate = i * angle;
            return (
              <div 
                key={i}
                className="absolute w-full h-full origin-center"
                style={{ 
                  transform: `rotate(${rotate}deg)`,
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.tan((angle * Math.PI) / 360)}% 0%)`,
                  backgroundColor: i % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'
                }}
              >
                <div 
                  className="absolute left-1/2 top-10 -translate-x-1/2 flex flex-col items-center gap-1"
                  style={{ transform: `rotate(${angle / 2}deg)` }}
                >
                  <Input
                    value={amounts[i]}
                    onChange={(e) => {
                      const newAmts = [...amounts];
                      newAmts[i] = e.target.value;
                      setAmounts(newAmts);
                    }}
                    disabled={currentIndex > 0 || isSpinning}
                    className="w-16 h-8 text-[10px] font-black bg-white/20 border-none text-center text-white placeholder:text-white/50 focus:ring-0"
                  />
                </div>
              </div>
            );
          })}
          {/* Inner Circle */}
          <div className="absolute inset-[35%] rounded-full bg-white shadow-inner flex items-center justify-center z-10 border-4 border-primary/10">
             <Target className="text-primary opacity-20" size={40} />
          </div>
        </div>

        {/* Dart Animation */}
        <div className={cn(
          "absolute bottom-[-100px] transition-all duration-700 ease-out z-40",
          isDartFlying ? "bottom-[40%] scale-50 rotate-[45deg] opacity-100" : "opacity-0 translate-y-20"
        )}>
          <div className="relative">
            <div className="w-2 h-24 bg-zinc-800 rounded-full" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-12 bg-accent clip-path-dart-tail" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-zinc-400" />
          </div>
        </div>
      </div>

      {/* Result Status */}
      <div className="w-full bg-white/40 p-4 rounded-2xl border-2 border-white">
        <div className="text-xs font-bold text-muted-foreground mb-2">실시간 다트 현황</div>
        <div className="flex flex-wrap gap-2">
           {participants.map(p => {
             const res = results.find(r => r.participant.id === p.id);
             return (
               <div key={p.id} className={cn(
                 "px-2 py-1 rounded-full text-[10px] font-black border transition-all",
                 res ? "bg-secondary/20 border-secondary text-secondary" : "bg-white/50 border-white text-muted-foreground"
               )}>
                 {p.name}: {res ? res.amount : '대기 중'}
               </div>
             );
           })}
        </div>
      </div>

      <div className="w-full space-y-4">
        {currentIndex < participants.length ? (
          <Button 
            onClick={throwDart} 
            disabled={isSpinning || isDartFlying}
            className="w-full py-8 text-2xl font-black hero-gradient soft-glow rounded-[2rem] flex gap-3"
          >
            {isSpinning ? '회전 중...' : isDartFlying ? '발사!' : (
              <><User /> {participants[currentIndex].name}님 다트 던지기!</>
            )}
          </Button>
        ) : (
          <div className="text-center py-4 text-secondary font-black animate-pulse flex items-center justify-center gap-2">
            <CheckCircle2 /> 최고 금액 보스 선별 중...
          </div>
        )}
      </div>

      <style jsx>{`
        .clip-path-dart-tail {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
      `}</style>
    </div>
  );
};
