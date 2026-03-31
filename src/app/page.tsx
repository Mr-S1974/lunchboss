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
import { Card } from '@/components/ui/card';
import { ArrowLeft, ChevronRight, Clock3, CircleDot, Home as HomeIcon, ShieldCheck, Sparkles, Target, Trophy, UtensilsCrossed } from 'lucide-react';

const HIGHLIGHTS = [
  { title: '빠른 결정', description: '회의 끝나고 바로 시작해도 1분 안에 세팅이 끝납니다.', icon: Clock3 },
  { title: '어색하지 않은 텐션', description: '과하지 않은 게임성으로 점심 전 분위기만 가볍게 띄웁니다.', icon: Sparkles },
  { title: '공정한 룰', description: '사다리, 룰렛, 셔플 중 상황에 맞는 방식으로 부담 없이 정합니다.', icon: ShieldCheck },
];

const GAME_OPTIONS = [
  {
    mode: 'ladder',
    emoji: '🪜',
    title: '사다리 타기',
    subtitle: '클래식하고 가장 무난한 선택',
    summary: '참가자가 많아도 설명이 쉽고, 결과를 직관적으로 받아들이기 좋습니다.',
    meta: ['안정적', '설명 쉬움', '팀 점심용'],
  },
  {
    mode: 'roulette',
    emoji: '🎡',
    title: '복불복 룰렛',
    subtitle: '긴장감을 조금 더 주고 싶을 때',
    summary: '시각적으로 가장 경쾌하고, 금액이나 역할 변주를 넣기에도 편합니다.',
    meta: ['몰입감', '이벤트형', '빠른 진행'],
  },
  {
    mode: 'tap',
    emoji: '🖐️',
    title: '지목 셔플',
    subtitle: '짧고 직관적인 서바이벌 방식',
    summary: '터치 기반이라 흐름이 빠르고, 한 명 면제나 한 명 지목 상황에 잘 맞습니다.',
    meta: ['순발력', '짧은 플레이', '캐주얼'],
  },
] as const;

const STEPS = [
  { label: '1. 인원 선택', description: '현재 식사 인원만 빠르게 고릅니다.' },
  { label: '2. 이름 확인', description: '자동 배정된 이름을 그대로 쓰거나 바로 수정합니다.' },
  { label: '3. 게임 시작', description: '상황에 맞는 방식으로 결제 담당을 정합니다.' },
] as const;

const FloatingNav = ({ onBack, onHome }: { onBack: () => void; onHome: () => void }) => {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 sm:bottom-6 sm:right-6">
      <Button variant="outline" className="h-12 rounded-full border-white/80 bg-white/90 px-4 font-semibold shadow-[0_18px_40px_rgba(16,24,40,0.16)] backdrop-blur-xl" onClick={onBack}>
        <ArrowLeft size={16} className="mr-2" /> 이전
      </Button>
      <Button className="h-12 rounded-full bg-white/90 px-4 font-semibold text-foreground shadow-[0_18px_40px_rgba(16,24,40,0.16)] backdrop-blur-xl hover:bg-white" onClick={onHome}>
        <HomeIcon size={16} className="mr-2" /> 메인
      </Button>
    </div>
  );
};

const MainScreen = () => {
  const [view, setView] = useState<'intro' | 'setup' | 'game'>('intro');
  const { gameMode, setGameMode, winner, participants, fullReset } = useGame();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && view === 'game' && participants.length === 0) {
      setView('setup');
    }
  }, [participants.length, view, mounted]);

  const handleGameSelect = (mode: 'ladder' | 'roulette' | 'tap') => {
    setGameMode(mode);
    setView('game');
  };

  const handleGoHome = () => {
    fullReset();
    setView('intro');
  };

  if (!mounted) return null;

  if (view === 'intro') {
    return (
      <div className="relative min-h-[100svh] overflow-hidden px-5 py-8 sm:px-8 lg:px-12">
        <FloatingIcons />
        <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.88),_transparent_72%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,_rgba(255,93,88,0.12),_transparent_28%),radial-gradient(circle_at_90%_16%,_rgba(0,209,178,0.12),_transparent_24%),radial-gradient(circle_at_50%_100%,_rgba(255,196,61,0.1),_transparent_26%)]" />
        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center gap-8 lg:gap-10">
          <div className="flex items-center justify-between rounded-full border border-white/70 bg-white/70 px-4 py-3 backdrop-blur-xl shadow-[0_12px_30px_rgba(16,24,40,0.08)]">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UtensilsCrossed size={20} />
              </div>
              <div className="min-w-0">
                <div className="font-headline text-sm font-bold uppercase tracking-[0.24em] text-primary">Lunch Boss</div>
                <div className="text-xs text-muted-foreground break-keep">점심 결제 담당을 가장 가볍게 정하는 방법</div>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-full bg-foreground/[0.04] px-3 py-1.5 text-xs font-semibold text-foreground/70 sm:flex">
              <CircleDot size={14} className="text-secondary" />
              TPO에 맞는 라이트 게임
            </div>
          </div>

          <div className="grid items-stretch gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_rgba(16,24,40,0.10)] backdrop-blur-xl lg:p-10">
              <div className="mb-8 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
                  <Sparkles size={14} />
                  Office Lunch Game
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-xs font-semibold text-secondary">
                  <Target size={14} />
                  덜 파스텔하고 더 리드미컬하게
                </div>
              </div>

              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-xs font-semibold text-foreground/70">
                  <Trophy size={14} className="text-accent" />
                  오늘 점심 분위기를 정리하는 가장 빠른 흐름
                </div>
                <div>
                  <h1 className="font-headline text-3xl font-extrabold leading-[1.02] tracking-[-0.05em] text-foreground break-keep whitespace-normal sm:text-4xl md:text-6xl lg:text-7xl">
                    빠르게 고르고
                    <br />
                    확실하게 정하는
                    <br />
                    점심 결제 게임
                  </h1>
                  <p className="mt-5 max-w-2xl break-keep whitespace-normal text-base leading-7 text-muted-foreground sm:text-lg">
                    회의 직후, 외근 전, 팀 점심 직전. 과하게 귀엽기보다 선명하고 가볍게 반응하는 톤으로
                    흐름을 만들었습니다. 인원만 고르면 바로 시작할 수 있고, 화면도 더 또렷한 대비와 컬러로
                    지루하지 않게 정리했습니다.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {HIGHLIGHTS.map(({ title, description, icon: Icon }) => (
                  <div key={title} className="rounded-[1.5rem] border border-border/60 bg-background/78 p-4">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(255,96,74,0.12),rgba(0,209,178,0.16))] text-primary shadow-sm">
                      <Icon size={18} />
                    </div>
                    <div className="font-headline text-base font-bold text-foreground">{title}</div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  className="hero-gradient soft-glow group h-14 rounded-full px-7 text-base font-bold"
                  onClick={() => setView('setup')}
                >
                  인원 설정 시작
                  <ChevronRight size={18} className="ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
                <div className="flex items-center rounded-full border border-border/70 bg-background/70 px-5 py-3 text-sm text-muted-foreground">
                  평균 준비 시간 30초 내외. 이름은 자동으로 채워집니다.
                </div>
              </div>
            </section>

            <section className="grid gap-4">
              <div className="rounded-[2rem] border border-[rgba(255,255,255,0.18)] bg-[linear-gradient(145deg,#161f46_0%,#1f1557_45%,#0d7869_100%)] p-6 text-white shadow-[0_24px_70px_rgba(17,24,39,0.24)]">
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">Quick Flow</div>
                <div className="mt-4 space-y-4">
                  {STEPS.map((step, index) => (
                    <div key={step.label} className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/12 font-headline text-sm font-bold shadow-[0_8px_24px_rgba(0,0,0,0.14)]">
                        0{index + 1}
                      </div>
                      <div>
                        <div className="font-headline text-lg font-bold">{step.label}</div>
                        <p className="mt-1 text-sm leading-6 text-white/70">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/70 bg-white/78 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Recommended</div>
                    <h2 className="mt-2 font-headline text-2xl font-bold text-foreground">상황별 게임 선택</h2>
                  </div>
                  <div className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">3 modes</div>
                </div>
                <div className="mt-4 space-y-3">
                  {GAME_OPTIONS.map((game) => (
                    <div key={game.mode} className="rounded-[1.4rem] border border-border/60 bg-background/70 p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(255,96,74,0.12),rgba(255,196,61,0.18))] text-2xl shadow-sm">
                          <span>{game.emoji}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="font-headline text-lg font-bold text-foreground">{game.title}</div>
                            <div className="rounded-full bg-foreground/[0.05] px-2.5 py-1 text-[11px] font-semibold text-foreground/60">
                              {game.subtitle}
                            </div>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">{game.summary}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {game.meta.map((item) => (
                              <span key={item} className="rounded-full border border-border/70 px-2.5 py-1 text-[11px] font-semibold text-foreground/65">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'setup') {
    return (
      <div className="fixed inset-0 z-30 overflow-y-auto bg-background">
        <ParticipantSetup onNext={() => { setGameMode(null); setView('game'); }} onBack={() => setView('intro')} />
      </div>
    );
  }

  if (view === 'game' && !gameMode) {
    return (
      <div className="fixed inset-0 z-30 overflow-y-auto bg-background px-4 py-6 pb-32 sm:px-8 sm:py-8 sm:pb-36 lg:px-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 animate-in fade-in slide-in-from-bottom-8">
          <div className="flex flex-col gap-4 rounded-[2rem] border border-border/70 bg-white p-5 shadow-[0_20px_50px_rgba(16,24,40,0.08)] sm:flex-row sm:items-end sm:justify-between sm:p-8">
            <div className="space-y-2 min-w-0">
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Game Select</div>
              <h2 className="font-headline text-3xl font-extrabold tracking-[-0.04em] text-foreground break-keep sm:text-4xl">오늘의 방식만 고르면 됩니다</h2>
              <p className="max-w-2xl break-keep text-sm leading-6 text-muted-foreground">
                분위기를 과하게 끌어올리기보다, 팀 성격과 식사 자리의 온도에 맞게 가볍게 선택할 수 있도록 정리했습니다.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border/70 bg-muted/50 px-4 py-3 text-sm text-muted-foreground break-keep sm:max-w-[280px]">
              참가자 정보는 이미 준비되었습니다. 게임만 고르면 바로 시작합니다.
            </div>
          </div>

          <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
            {GAME_OPTIONS.map((game) => (
              <Card
                key={game.mode}
                role="button"
                tabIndex={0}
                className="cursor-pointer rounded-[1.8rem] border border-border/70 bg-white p-4 text-left shadow-[0_14px_36px_rgba(16,24,40,0.08)] transition-all hover:-translate-y-1 hover:bg-muted/20 sm:rounded-[2rem] sm:p-6"
                onClick={() => handleGameSelect(game.mode)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleGameSelect(game.mode);
                  }
                }}
              >
                <div className="flex w-full flex-col items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(255,96,74,0.12),rgba(255,196,61,0.18))] text-2xl shadow-sm">
                    <span>{game.emoji}</span>
                  </div>
                  <div className="w-full min-w-0">
                    <div className="inline-flex max-w-full rounded-full bg-foreground/[0.05] px-3 py-1 text-[11px] font-semibold text-foreground/60 break-keep whitespace-normal">
                      {game.subtitle}
                    </div>
                    <div className="mt-3 font-headline text-xl font-bold text-foreground break-keep sm:text-2xl">{game.title}</div>
                    <p className="mt-2 break-keep whitespace-normal text-sm leading-6 text-muted-foreground">{game.summary}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {game.meta.map((item) => (
                      <span key={item} className="rounded-full border border-border/70 px-2.5 py-1 text-[11px] font-semibold text-foreground/65">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <FloatingNav onBack={() => setView('setup')} onHome={handleGoHome} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-30 overflow-y-auto bg-background px-4 py-6 pb-32 sm:px-8 sm:py-8 sm:pb-36 lg:px-12">
      <div className="relative mx-auto flex h-full w-full max-w-4xl flex-1 flex-col pt-2 sm:pt-4">
        <div className="pb-24 sm:pb-28">
          {gameMode === 'ladder' && <LadderGame />}
          {gameMode === 'roulette' && <RouletteGame />}
          {gameMode === 'tap' && <TapSurvival />}
        </div>
        <FloatingNav onBack={() => setGameMode(null)} onHome={handleGoHome} />
      </div>
      {winner && <ResultScreen onBack={() => setGameMode(null)} onHome={handleGoHome} />}
    </div>
  );
};

export default function Home() {
  return (
    <GameProvider>
      <main className="relative min-h-screen bg-background selection:bg-primary selection:text-white">
        <MainScreen />
      </main>
    </GameProvider>
  );
}
