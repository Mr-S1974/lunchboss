
"use client";

import { useState, useEffect } from 'react';
import { useGame } from '../game-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Target } from 'lucide-react';

export const RouletteGame = () => {
  const { participants, setWinner } = useGame();
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isDartFlying, setIsDartFlying] = useState(false);
  const [amounts, setAmounts] = useState<string[]>([]);

  useEffect(() => {
    setAmounts(participants.map((_, i) => i === 0 ? "전액 결제" : (i * 10000).toLocaleString() + "원"));
  }, [participants.length]);

  const throwDart = () => {
    if (isSpinning || isDartFlying) return;
    
    setIsSpinning(true);
    // Slow, trackable rotation: 3-5 full spins over 4 seconds
    const extraSpins = 3 + Math.random() * 2;
    const finalRotation = rotation + extraSpins * 360;
    setRotation(finalRotation);

    // After 3 seconds of spinning, throw the dart
    setTimeout(() => {
      setIsDartFlying(true);
      
      // Determine winner after dart hits
      setTimeout(() => {
        setIsSpinning(false);
        setIsDartFlying(false);
        
        const sliceSize = 360 / participants.length;
        const normalizedRotation = (finalRotation % 360);
        // The needle/target is at the top (0 deg)
        const winnerIndex = Math.floor(((360 - normalizedRotation) % 360) / sliceSize);
        
        // Randomly assign the amount hit to a participant (or just pick a winner)
        const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
        setWinner(randomParticipant, amounts[winnerIndex]);
      }, 800);
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center gap-8 h-full w-full max-w-md mx-auto">
      <div className="text-center space-y-1">
        <h3 className="text-2xl font-black text-secondary italic uppercase tracking-tighter">DART ROULETTE</h3>
        <p className="text-xs font-bold text-muted-foreground">금액을 입력하고 다트를 던지세요!</p>
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
                    disabled={isSpinning}
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

      <div className="w-full space-y-4">
        <Button 
          onClick={throwDart} 
          disabled={isSpinning || isDartFlying}
          className="w-full py-8 text-2xl font-black hero-gradient soft-glow rounded-[2rem] flex gap-3"
        >
          {isSpinning ? '조준 중...' : isDartFlying ? 'HIT!' : '다트 던지기!'}
        </Button>
      </div>

      <style jsx>{`
        .clip-path-dart-tail {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
      `}</style>
    </div>
  );
};
