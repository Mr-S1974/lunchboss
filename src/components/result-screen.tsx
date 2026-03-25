"use client";

import { useEffect, useState } from 'react';
import { useGame } from './game-context';
import { generateGoldenBellCommendation } from '@/ai/flows/generate-golden-bell-commendation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Share2, RefreshCw, Star } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

export const ResultScreen = () => {
  const { winner, resetGame } = useGame();
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
          setCommendation(`와우! 오늘 점심은 ${winner.name}님이 쏘십니다! (멋져부러👍)`);
        } finally {
          setLoading(false);
        }
      };
      getCommendation();
    }
  }, [winner]);

  if (!winner) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-background/95 backdrop-blur-md">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="absolute animate-float opacity-40 text-secondary"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `scale(${0.5 + Math.random()})`
            }}
          >
            <Star size={24} fill="currentColor" />
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md text-center flex flex-col gap-8">
        <div className="space-y-2">
          <h2 className="text-secondary text-lg font-bold tracking-widest uppercase">Today's GoldenBell Hero</h2>
          <h1 className="text-4xl font-black font-headline neon-text">
            오늘의 주인공!
          </h1>
        </div>

        <Card className="bg-card border-primary border-4 shadow-[0_0_30px_hsl(var(--primary)/0.4)] overflow-visible">
          <CardContent className="p-8 flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Crown size={64} className="text-white drop-shadow-lg" />
              </div>
              <div className="absolute -top-6 -right-6 animate-bounce">
                <Badge className="bg-yellow-400 text-black px-3 py-1 text-sm font-black border-2 border-black rotate-12">
                  BEST!
                </Badge>
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold mb-1">{winner.name}</div>
              <div className="text-sm text-primary font-semibold">{winner.character}</div>
            </div>

            <div className="w-full bg-muted/30 p-4 rounded-xl border border-white/5">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-primary/10" />
                  <Skeleton className="h-4 w-[80%] bg-primary/10" />
                </div>
              ) : (
                <p className="text-lg italic font-medium">"{commendation}"</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-14 gap-2 border-primary/50" onClick={() => {}}>
            <Share2 size={20} />
            자랑하기
          </Button>
          <Button className="h-14 gap-2 hero-gradient neon-glow" onClick={resetGame}>
            <RefreshCw size={20} />
            다시 한 판?
          </Button>
        </div>

        <div className="text-xs text-muted-foreground opacity-50 px-8">
          한 번 더? (광고 시청 시 면제권 뽑기 기회 제공!)
        </div>
      </div>
    </div>
  );
};

function Badge({ children, className, ...props }: any) {
  return <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`} {...props}>{children}</div>
}