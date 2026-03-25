"use client";

import { useState } from 'react';
import { GameProvider, useGame } from '@/components/game-context';
import { ParticipantSetup } from '@/components/participant-setup';
import { FloatingIcons } from '@/components/game-icons';
import { LadderGame } from '@/components/game/ladder-game';
import { RouletteGame } from '@/components/game/roulette-game';
import { TapSurvival } from '@/components/game/tap-game';
import { ResultScreen } from '@/components/result-screen';
import { Button } from '@/components/ui/button';
import { ChevronRight, UtensilsCrossed } from 'lucide-react';

const MainScreen = () => {
  const [view, setView] = useState<'intro' | 'setup' | 'game'>('intro');
  const { gameMode, setGameMode, winner } = useGame();

  const handleGameSelect = (mode: 'ladder' | 'roulette' | 'tap') => {
    setGameMode(mode);
    setView('game');
  };

  if (view === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[90vh] text-center p-6 relative overflow-hidden">
        <FloatingIcons />
        <div className="space-y-6 relative z-10 max-w-sm">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[3rem] soft-glow border-4 border-primary/20 rotate-[-2deg]">
            <div className="animate-bounce mb-4 flex justify-center">
              <UtensilsCrossed size={64} className="text-primary" />
            </div>
            <h1 className="text-6xl sm:text-7xl font-black sunny-text italic hero-gradient bg-clip-text text-transparent leading-tight mb-2">
              LUNCH<br/>BOSS
            </h1>
            <p className="text-xl font-bold tracking-widest text-secondary/80">점심 보스 등장!</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-muted-foreground font-semibold">오늘의 "결제할 결심" 주인공은?</p>
          </div>

          <Button 
            className="mt-8 px-16 py-8 text-2xl font-black rounded-3xl hero-gradient soft-glow shadow-primary animate-pulse hover:scale-110 transition-transform"
            onClick={() => setView('setup')}
          >
            START!
          </Button>
        </div>
        
        <div className="absolute bottom-6 left-6 right-6 h-16 bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl flex items-center justify-between px-6 overflow-hidden shadow-sm">
           <div className="text-xs text-left">
             <div className="font-bold text-primary">AD: 오늘은 샐러드 어때요?</div>
             <div className="text-muted-foreground">근처 샐러드 가게 10% 쿠폰 발급 중</div>
           </div>
           <ChevronRight size={16} className="text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (view === 'setup') {
    return <ParticipantSetup onNext={() => setView('game')} />;
  }

  return (
    <div className="h-full min-h-[90vh] p-6 pt-12">
      {!gameMode ? (
         <div className="flex flex-col gap-6 max-w-md mx-auto h-full justify-center">
            <h2 className="text-3xl font-black sunny-text mb-4 text-center text-primary">게임 선택</h2>
            <div className="grid gap-4">
              <Button className="h-24 text-xl font-bold gap-4 border-4 border-primary/10 bg-white hover:bg-primary hover:text-white transition-all card-hover group" variant="outline" onClick={() => handleGameSelect('ladder')}>
                 <span className="text-5xl group-hover:scale-125 transition-transform">🪜</span> 
                 <div className="text-left">
                   <div>사다리 타기</div>
                   <div className="text-xs font-normal opacity-70">클래식한 운명 테스트</div>
                 </div>
              </Button>
              <Button className="h-24 text-xl font-bold gap-4 border-4 border-secondary/10 bg-white hover:bg-secondary hover:text-white transition-all card-hover group" variant="outline" onClick={() => handleGameSelect('roulette')}>
                 <span className="text-5xl group-hover:scale-125 transition-transform">🎡</span>
                 <div className="text-left">
                   <div>복불복 룰렛</div>
                   <div className="text-xs font-normal opacity-70">돌아가는 행운의 영수증</div>
                 </div>
              </Button>
              <Button className="h-24 text-xl font-bold gap-4 border-4 border-accent/10 bg-white hover:bg-accent hover:text-white transition-all card-hover group" variant="outline" onClick={() => handleGameSelect('tap')}>
                 <span className="text-5xl group-hover:scale-125 transition-transform">🖐️</span>
                 <div className="text-left">
                   <div>지목 셔플</div>
                   <div className="text-xs font-normal opacity-70">순발력으로 살아남기</div>
                 </div>
              </Button>
            </div>
            <Button variant="ghost" className="mt-4 font-bold text-muted-foreground" onClick={() => setView('setup')}>참가자 수정하러 가기</Button>
         </div>
      ) : (
        <div className="max-w-md mx-auto h-full flex flex-col relative">
           <Button variant="ghost" className="absolute top-0 left-0 font-bold" onClick={() => setGameMode(null)}>뒤로가기</Button>
           <div className="flex-1 mt-12">
             {gameMode === 'ladder' && <LadderGame />}
             {gameMode === 'roulette' && <RouletteGame />}
             {gameMode === 'tap' && <TapSurvival />}
           </div>
        </div>
      )}
      {winner && <ResultScreen />}
    </div>
  );
};

export default function Home() {
  return (
    <GameProvider>
      <main className="min-h-screen bg-background relative selection:bg-primary selection:text-white">
        <MainScreen />
      </main>
    </GameProvider>
  );
}
