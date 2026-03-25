
"use client";

import { useState, useEffect } from 'react';
import { GameProvider, useGame } from '@/components/game-context';
import { ParticipantSetup } from '@/components/participant-setup';
import { FloatingIcons } from '@/components/game-icons';
import { LadderGame } from '@/components/game/ladder-game';
import { RouletteGame } from '@/components/game/roulette-game';
import { TapSurvival } from '@/components/game/tap-game';
import { ResultScreen } from '@/components/result-screen';
import { Button } from '@/components/ui/button';
import { ChevronRight, UtensilsCrossed, Sparkles, TrendingUp, Trophy } from 'lucide-react';

const MainScreen = () => {
  const [view, setView] = useState<'intro' | 'setup' | 'game'>('intro');
  const { gameMode, setGameMode, winner } = useGame();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGameSelect = (mode: 'ladder' | 'roulette' | 'tap') => {
    setGameMode(mode);
    setView('game');
  };

  if (!mounted) return null;

  if (view === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100svh] text-center p-6 relative overflow-hidden">
        <FloatingIcons />
        
        {/* 상단 장식 요소 */}
        <div className="absolute top-10 left-10 opacity-20 rotate-[-15deg] hidden sm:block">
           <Trophy size={80} className="text-primary" />
        </div>
        <div className="absolute top-20 right-10 opacity-20 rotate-[15deg] hidden sm:block">
           <TrendingUp size={80} className="text-secondary" />
        </div>

        <div className="space-y-10 relative z-10 max-w-md w-full">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white shadow-sm animate-bounce mb-2">
              <Sparkles size={16} className="text-yellow-500" />
              <span className="text-xs font-black text-primary uppercase tracking-widest">Office Survival Game</span>
            </div>
            
            <div className="bg-white/90 backdrop-blur-xl p-10 rounded-[4rem] soft-glow border-8 border-primary/10 rotate-[-1deg] relative">
              <div className="absolute -top-6 -left-6 bg-accent text-white p-4 rounded-3xl shadow-xl rotate-[-15deg] font-black text-sm">
                HOT!
              </div>
              <div className="mb-6 flex justify-center">
                <div className="p-6 bg-primary/10 rounded-[2.5rem] border-4 border-white shadow-inner">
                  <UtensilsCrossed size={64} className="text-primary" />
                </div>
              </div>
              <h1 className="text-7xl sm:text-8xl font-black sunny-text italic hero-gradient bg-clip-text text-transparent leading-none mb-4">
                LUNCH<br/>BOSS
              </h1>
              <div className="h-2 w-24 bg-primary/20 mx-auto rounded-full mb-4" />
              <p className="text-xl font-black tracking-tighter text-secondary">오늘 점심, 누가 쏠까요?</p>
            </div>
          </div>
          
          <div className="grid gap-4 px-4">
            <Button 
              className="h-24 text-3xl font-black rounded-[2.5rem] hero-gradient soft-glow shadow-primary group overflow-hidden relative"
              onClick={() => setView('setup')}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10">START GAME!</span>
            </Button>
            
            <p className="text-muted-foreground font-bold text-sm">
              인원수 설정부터 시작해 보세요!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
             <div className="bg-white/50 backdrop-blur-sm p-4 rounded-3xl border-2 border-white text-left">
                <div className="text-primary font-black text-xs mb-1 uppercase">Today's Tip</div>
                <div className="text-[10px] font-bold text-muted-foreground leading-tight">결정 장애가 올 땐 룰렛이 최고의 해결책입니다.</div>
             </div>
             <div className="bg-white/50 backdrop-blur-sm p-4 rounded-3xl border-2 border-white text-left">
                <div className="text-secondary font-black text-xs mb-1 uppercase">Stats</div>
                <div className="text-[10px] font-bold text-muted-foreground leading-tight">어제 가장 많이 뽑힌 별명: '법카 슬래셔'</div>
             </div>
          </div>
        </div>
        
        {/* 광고/푸터 배너 */}
        <div className="absolute bottom-6 left-6 right-6 h-20 bg-white/40 backdrop-blur-md border border-white/60 rounded-[2rem] flex items-center justify-between px-8 overflow-hidden shadow-xl max-w-md mx-auto group cursor-pointer hover:bg-white/60 transition-colors">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary font-black shrink-0">
               AD
             </div>
             <div className="text-left">
               <div className="font-black text-sm text-primary group-hover:underline">오늘은 샐러드 어때요? 🥗</div>
               <div className="text-[10px] font-bold text-muted-foreground">근처 샐러드 가게 10% 쿠폰 발급 중</div>
             </div>
           </div>
           <ChevronRight size={20} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    );
  }

  if (view === 'setup') {
    return <ParticipantSetup onNext={() => setView('game')} />;
  }

  return (
    <div className="h-full min-h-[100svh] p-6 pt-12 flex flex-col">
      {!gameMode ? (
         <div className="flex flex-col gap-8 max-w-md mx-auto flex-1 justify-center w-full animate-in fade-in slide-in-from-bottom-8">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black sunny-text text-primary italic uppercase tracking-tighter">Choose Game</h2>
              <p className="text-sm font-bold text-muted-foreground">오늘의 운명을 결정할 게임을 선택하세요!</p>
            </div>
            
            <div className="grid gap-6">
              <Button className="h-28 text-2xl font-black gap-6 border-4 border-primary/10 bg-white hover:bg-primary hover:text-white transition-all card-hover group rounded-[2.5rem] shadow-sm" variant="outline" onClick={() => handleGameSelect('ladder')}>
                 <span className="text-6xl group-hover:scale-125 transition-transform group-hover:rotate-12">🪜</span> 
                 <div className="text-left">
                   <div className="leading-none mb-1">사다리 타기</div>
                   <div className="text-xs font-bold opacity-70">클래식한 운명 테스트</div>
                 </div>
              </Button>
              <Button className="h-28 text-2xl font-black gap-6 border-4 border-secondary/10 bg-white hover:bg-secondary hover:text-white transition-all card-hover group rounded-[2.5rem] shadow-sm" variant="outline" onClick={() => handleGameSelect('roulette')}>
                 <span className="text-6xl group-hover:scale-125 transition-transform group-hover:rotate-[-12deg]">🎡</span>
                 <div className="text-left">
                   <div className="leading-none mb-1">복불복 룰렛</div>
                   <div className="text-xs font-bold opacity-70">다트로 맞추는 복불복</div>
                 </div>
              </Button>
              <Button className="h-28 text-2xl font-black gap-6 border-4 border-accent/10 bg-white hover:bg-accent hover:text-white transition-all card-hover group rounded-[2.5rem] shadow-sm" variant="outline" onClick={() => handleGameSelect('tap')}>
                 <span className="text-6xl group-hover:scale-125 transition-transform group-hover:scale-110">🖐️</span>
                 <div className="text-left">
                   <div className="leading-none mb-1">지목 셔플</div>
                   <div className="text-xs font-bold opacity-70">순발력으로 살아남기</div>
                 </div>
              </Button>
            </div>
            
            <Button variant="ghost" className="mt-4 font-black text-muted-foreground h-14 rounded-2xl hover:bg-white/50" onClick={() => setView('setup')}>
              <ArrowLeft size={18} className="mr-2" /> 참가자 수정하러 가기
            </Button>
         </div>
      ) : (
        <div className="max-w-md mx-auto h-full flex-1 flex flex-col relative w-full">
           <Button variant="ghost" className="absolute top-0 left-0 font-black h-12 rounded-xl bg-white/50 border border-white px-4" onClick={() => setGameMode(null)}>
             <ArrowLeft size={16} className="mr-1" /> 뒤로가기
           </Button>
           <div className="flex-1 mt-16">
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
