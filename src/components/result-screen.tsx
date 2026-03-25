
"use client";

import { useEffect, useState } from 'react';
import { useGame } from './game-context';
import { generateGoldenBellCommendation } from '@/ai/flows/generate-golden-bell-commendation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Share2, RefreshCw, PartyPopper, Wallet, ListChecks } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

export const ResultScreen = () => {
  const { winner, winningAmount, allResults, resetGame } = useGame();
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
    <div className="fixed inset-0 z-50 flex flex-col items-center bg-white/95 backdrop-blur-2xl overflow-y-auto pt-10 pb-20 px-6">
      <div className="absolute inset-0 pointer-events-none overflow-hidden h-full">
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
            결과 발표!
          </h1>
        </div>

        {/* BOSS Card */}
        <Card className="bg-white border-primary border-[12px] shadow-[0_30px_60px_rgba(255,165,0,0.4)] overflow-visible rounded-[3.5rem] relative">
          <CardContent className="p-8 flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center soft-glow">
                <Crown size={60} className="text-white drop-shadow-lg" />
              </div>
              <div className="absolute -top-4 -right-8 animate-bounce">
                <Badge className="bg-yellow-400 text-black px-4 py-2 text-sm font-black border-4 border-black rotate-12 rounded-xl shadow-xl">
                  LUNCH BOSS!
                </Badge>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-black mb-1 text-foreground">{winner.name}</div>
              <div className="text-sm text-primary font-bold bg-primary/10 px-3 py-1 rounded-full">{winner.character}</div>
            </div>

            {winningAmount && (
              <div className="flex flex-col items-center gap-1 bg-accent/10 w-full p-3 rounded-3xl border-2 border-accent/20">
                <div className="flex items-center gap-2 text-accent text-xs font-black">
                  <Wallet size={16} />
                  <span>최종 결제 금액</span>
                </div>
                <div className="text-2xl font-black text-accent">{winningAmount}원</div>
              </div>
            )}

            <div className="w-full bg-muted/30 p-4 rounded-[1.5rem] border-2 border-primary/5">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-primary/10" />
                  <Skeleton className="h-4 w-[80%] bg-primary/10" />
                </div>
              ) : (
                <p className="text-sm font-bold leading-relaxed text-foreground/80 italic">"{commendation}"</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* All Participants List */}
        <div className="space-y-3 text-left">
          <div className="flex items-center gap-2 px-2 text-primary font-black">
            <ListChecks size={20} />
            <h3>전체 참가자 결과</h3>
          </div>
          <ScrollArea className="bg-white/50 backdrop-blur-md rounded-[2.5rem] border-4 border-white p-4 shadow-inner max-h-[300px]">
             <div className="space-y-2">
               {allResults.map((res, i) => (
                 <div key={res.participant.id} className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${res.participant.id === winner.id ? 'bg-primary/10 border-primary shadow-sm' : 'bg-white border-transparent'}`}>
                    <div className="flex items-center gap-3">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${res.participant.id === winner.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                         {res.participant.id === winner.id ? <Crown size={14} /> : i + 1}
                       </div>
                       <div>
                         <div className="font-black text-sm">{res.participant.name}</div>
                         <div className="text-[10px] text-muted-foreground font-bold">{res.participant.character}</div>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className={`font-black text-sm ${res.participant.id === winner.id ? 'text-accent' : 'text-primary'}`}>{res.amount}원</div>
                       {res.participant.id === winner.id && <Badge className="text-[9px] h-4 bg-accent border-none font-bold">BOSS</Badge>}
                    </div>
                 </div>
               ))}
             </div>
          </ScrollArea>
        </div>

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
