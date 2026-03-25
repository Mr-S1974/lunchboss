
"use client";

import { useEffect, useState } from 'react';
import { useGame } from './game-context';
import { generateGoldenBellCommendation } from '@/ai/flows/generate-golden-bell-commendation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Share2, RefreshCw, PartyPopper, Wallet } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';

export const ResultScreen = () => {
  const { winner, winningAmount, resetGame } = useGame();
  const [commendation, setCommendation] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (winner) {
      const getCommendation = async () => {
        try {
          const result = await generateGoldenBellCommendation({
            winnerName: winner.name,
            winnerCharacter: winner.character
          });
          setCommendation(result.commendationMessage);
        } catch (error) {
          setCommendation(`와우! 오늘 점심은 ${winner.name} 보스가 쏘십니다! (멋져부러👍)`);
        } finally {
          setLoading(false);
        }
      };
      getCommendation();
    }
  }, [winner]);

  if (!winner) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-white/95 backdrop-blur-2xl">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="absolute animate-float opacity-30 text-primary"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `scale(${0.5 + Math.random()})`
            }}
          >
            <PartyPopper size={32} />
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md text-center flex flex-col gap-6 animate-in zoom-in-95 duration-500">
        <div className="space-y-1">
          <h2 className="text-secondary text-xl font-black tracking-tighter uppercase">Today's Lunch Boss</h2>
          <h1 className="text-5xl font-black sunny-text hero-gradient bg-clip-text text-transparent">
            축하합니다!
          </h1>
        </div>

        <Card className="bg-white border-primary border-[12px] shadow-[0_30px_60px_rgba(255,165,0,0.4)] overflow-visible rounded-[3.5rem] relative">
          <CardContent className="p-10 flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center soft-glow">
                <Crown size={80} className="text-white drop-shadow-lg" />
              </div>
              <div className="absolute -top-6 -right-12 animate-bounce">
                <Badge className="bg-yellow-400 text-black px-6 py-3 text-lg font-black border-4 border-black rotate-12 rounded-2xl shadow-xl">
                  LUNCH BOSS!
                </Badge>
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-black mb-1 text-foreground">{winner.name}</div>
              <div className="text-lg text-primary font-bold bg-primary/10 px-4 py-1 rounded-full">{winner.character}</div>
            </div>

            {winningAmount && (
              <div className="flex flex-col items-center gap-2 bg-accent/10 w-full p-4 rounded-3xl border-2 border-accent/20">
                <div className="flex items-center gap-2 text-accent font-black">
                  <Wallet size={20} />
                  <span>결제할 금액</span>
                </div>
                <div className="text-3xl font-black text-accent">{winningAmount}</div>
              </div>
            )}

            <div className="w-full bg-muted/30 p-6 rounded-[2rem] border-2 border-primary/5">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-primary/10" />
                  <Skeleton className="h-4 w-[80%] bg-primary/10" />
                </div>
              ) : (
                <p className="text-lg font-bold leading-relaxed text-foreground/80 italic">"{commendation}"</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-16 gap-2 border-4 border-primary/20 text-lg font-bold rounded-[1.5rem] hover:bg-primary/5" onClick={() => {}}>
            <Share2 size={24} />
            자랑하기
          </Button>
          <Button className="h-16 gap-2 hero-gradient soft-glow text-lg font-bold rounded-[1.5rem]" onClick={resetGame}>
            <RefreshCw size={24} />
            다시 하기
          </Button>
        </div>

        <p className="text-xs font-bold text-muted-foreground opacity-60">
          모두가 행복한 점심시간, Lunch Boss가 응원합니다! 🍱
        </p>
      </div>
    </div>
  );
};
