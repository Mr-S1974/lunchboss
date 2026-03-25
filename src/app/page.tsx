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
import { ChevronRight } from 'lucide-react';

const MainScreen = () => {
  const [view, setView] = useState<'intro' | 'setup' | 'game'>('intro');
  const { gameMode, setGameMode, winner, resetGame } = useGame();

  const handleGameSelect = (mode: 'ladder' | 'roulette' | 'tap') => {
    setGameMode(mode);
    setView('game');
  };

  if (view === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[90vh] text-center p-6 relative overflow-hidden">
        <FloatingIcons />
        <div className="space-y-6 relative z-10">
          <div className="animate-bounce inline-block">
            <h1 className="text-6xl sm:text-8xl font-black neon-text italic hero-gradient bg-clip-text text-transparent leading-tight">
              엔빵<br/>금지
            </h1>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold tracking-widest text-secondary">GoldenBell Squad</p>
            <p className="text-muted-foreground font-medium">오늘의 점심 히어로는 누구? (결제할 결심)</p>
          </div>

          <Button 
            className="mt-8 px-12 py-8 text-2xl font-black rounded-2xl hero-gradient neon-glow shadow-primary animate-pulse"
            onClick={() => setView('setup')}
          >
            START
          </Button>
        </div>
        
        {/* Mock Ad Banner */}
        <div className="absolute bottom-4 left-4 right-4 h-16 bg-muted/20 border border-white/5 rounded-xl flex items-center justify-between px-6 overflow-hidden">
           <div className="text-xs">
             <div className="font-bold text-primary">AD: 점심 특가 이벤트</div>
             <div className="text-muted-foreground">강남역 인근 샐러드 50% 할인</div>
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
            <h2 className="text-3xl font-black neon-text mb-4 text-center">게임 선택</h2>
            <Button className="h-20 text-xl font-bold gap-4 border-2 border-white/10 bg-card hover:bg-primary transition-all group" variant="outline" onClick={() => handleGameSelect('ladder')}>
               <span className="text-4xl">🪜</span> 사다리 타기
            </Button>
            <Button className="h-20 text-xl font-bold gap-4 border-2 border-white/10 bg-card hover:bg-secondary transition-all group" variant="outline" onClick={() => handleGameSelect('roulette')}>
               <span className="text-4xl">🎡</span> 영수증 룰렛
            </Button>
            <Button className="h-20 text-xl font-bold gap-4 border-2 border-white/10 bg-card hover:bg-accent transition-all group" variant="outline" onClick={() => handleGameSelect('tap')}>
               <span className="text-4xl">🖐️</span> 지목 셔플
            </Button>
            <Button variant="ghost" className="mt-4" onClick={() => setView('setup')}>참가자 수정</Button>
         </div>
      ) : (
        <div className="max-w-md mx-auto h-full flex flex-col relative">
           <Button variant="ghost" className="absolute top-0 left-0" onClick={() => setGameMode(null)}>취소</Button>
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