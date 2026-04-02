"use client";

import { useEffect, useState } from 'react';
import { GameProvider, useGame } from '@/components/game-context';
import { ParticipantSetup } from '@/components/participant-setup';
import { FloatingIcons } from '@/components/game-icons';
import { LadderGame } from '@/components/game/ladder-game';
import { RouletteGame } from '@/components/game/roulette-game';
import { TapSurvival } from '@/components/game/tap-game';
import { ResultScreen } from '@/components/result-screen';
import { CoffeeRecommendationFlow, MenuRecommendationFlow } from '@/components/recommendation-flows';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  ChevronRight,
  CircleDot,
  Clock3,
  Coffee,
  Home as HomeIcon,
  ShieldCheck,
  Sparkles,
  Soup,
  Trophy,
  UtensilsCrossed,
} from 'lucide-react';

const HIGHLIGHTS = [
  { title: '빠른 결정', description: '결제든 메뉴든 커피든, 고민 길어지기 전에 기분 좋게 결론을 냅니다.', icon: Clock3 },
  { title: '재미있는 압축 과정', description: '결정 과정도 심심하지 않게, 후보가 줄어드는 재미를 살렸습니다.', icon: Sparkles },
  { title: '상황 맞춤 선택', description: '지금 필요한 모드만 골라 바로 들어가면 됩니다.', icon: ShieldCheck },
];

const EXPERIENCE_OPTIONS = [
  {
    mode: 'payment',
    emoji: '🎲',
    title: '점심 결제 게임',
    subtitle: '인원 설정 후 사다리, 룰렛, 셔플 중 선택',
    summary: '누가 조금 더 낼지 정해야 할 때, 괜히 무겁지 않게 웃으면서 결과를 받아들이게 만드는 모드입니다.',
    meta: ['인원 필요', '게임형', '대표 모드'],
  },
  {
    mode: 'menu',
    emoji: '🍱',
    title: '오늘 메뉴 고르기',
    subtitle: '노멀 중심의 메뉴 압축 추천',
    summary: '무난하게 먹고 싶은 날도, 조금 색다르게 가고 싶은 날도 취향만 고르면 오늘 메뉴를 빠르게 정리합니다.',
    meta: ['노멀 기본값', '제외 조건', '시각적 압축'],
  },
  {
    mode: 'coffee',
    emoji: '☕',
    title: '오늘 커피 고르기',
    subtitle: '프랜차이즈와 지역 카페를 섞는 복불복 추천',
    summary: '기본 프랜차이즈와 단골 지역 카페를 함께 돌려 식사 후 발걸음이 가벼워지는 한 곳을 정합니다.',
    meta: ['카페 편집', '지역 카페 추가', '복불복'],
  },
] as const;

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
    summary: '터치 기반이라 진행이 빠르고, 한 명 면제나 한 명 지목 상황에 잘 맞습니다.',
    meta: ['순발력', '짧은 플레이', '캐주얼'],
  },
] as const;

const STEPS = [
  { label: '1. 모드 선택', description: '오늘은 누가 쏠지, 뭘 먹을지, 어디 갈지부터 빠르게 고릅니다.' },
  { label: '2. 조건 정리', description: '인원이나 취향만 짧게 정리하고 바로 결과 쪽으로 넘어갑니다.' },
  { label: '3. 결과 확정', description: '후보가 줄어드는 재미를 보고 마지막 선택을 기분 좋게 받습니다.' },
] as const;

type ExperienceMode = 'payment' | 'menu' | 'coffee' | null;
type ViewMode = 'intro' | 'setup' | 'game' | 'recommendation';

const FloatingNav = ({
  onBack,
  onHome,
  className,
}: {
  onBack?: () => void;
  onHome: () => void;
  className?: string;
}) => {
  return (
    <div className={['fixed right-4 z-40 flex flex-col gap-2 sm:right-6', className ?? 'bottom-4 sm:bottom-6'].join(' ')}>
      {onBack ? (
        <Button variant="outline" className="h-12 rounded-full border-white/80 bg-white/90 px-4 font-semibold shadow-[0_18px_40px_rgba(16,24,40,0.16)] backdrop-blur-xl" onClick={onBack}>
          <ArrowLeft size={16} className="mr-2" /> 이전
        </Button>
      ) : null}
      <Button className="h-12 rounded-full bg-white/90 px-4 font-semibold text-foreground shadow-[0_18px_40px_rgba(16,24,40,0.16)] backdrop-blur-xl hover:bg-white" onClick={onHome}>
        <HomeIcon size={16} className="mr-2" /> 메인
      </Button>
    </div>
  );
};

const MainScreen = () => {
  const [view, setView] = useState<ViewMode>('intro');
  const [experienceMode, setExperienceMode] = useState<ExperienceMode>(null);
  const { gameMode, setGameMode, winner, participants, fullReset } = useGame();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && view === 'game' && experienceMode === 'payment' && participants.length === 0) {
      setView('setup');
    }
  }, [participants.length, view, mounted, experienceMode]);

  const handleGameSelect = (mode: 'ladder' | 'roulette' | 'tap') => {
    setGameMode(mode);
    setView('game');
  };

  const handleExperienceEnter = (mode: ExperienceMode) => {
    setExperienceMode(mode);
    if (mode === 'payment') {
      setView('setup');
      return;
    }
    setView('recommendation');
  };

  const handleGoHome = () => {
    fullReset();
    setExperienceMode(null);
    setView('intro');
  };

  if (!mounted) return null;

  if (view === 'intro') {
    return (
      <div className="relative min-h-[100svh] overflow-hidden px-4 py-5 sm:px-8 sm:py-8 lg:px-12">
        <FloatingIcons />
        <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.88),_transparent_72%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,_rgba(255,93,88,0.12),_transparent_28%),radial-gradient(circle_at_90%_16%,_rgba(0,209,178,0.12),_transparent_24%),radial-gradient(circle_at_50%_100%,_rgba(255,196,61,0.1),_transparent_26%)]" />
        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center gap-5 sm:gap-8 lg:gap-10">
          <div className="flex items-center justify-between rounded-[1.5rem] border border-white/70 bg-white/70 px-3 py-3 backdrop-blur-xl shadow-[0_12px_30px_rgba(16,24,40,0.08)] sm:rounded-full sm:px-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UtensilsCrossed size={20} />
              </div>
              <div className="min-w-0">
                <div className="font-headline text-sm font-bold uppercase tracking-[0.24em] text-primary">Lunch Boss</div>
                <div className="text-xs text-muted-foreground break-keep">점심값도 메뉴도 커피도 기분 좋게 정리하는 방법</div>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-full bg-foreground/[0.04] px-3 py-1.5 text-xs font-semibold text-foreground/70 sm:flex">
              <CircleDot size={14} className="text-secondary" />
              점심 타임 결정을 한 번에
            </div>
          </div>

          <div className="grid items-stretch gap-4 sm:gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-[1.75rem] border border-white/70 bg-white/82 p-4 shadow-[0_24px_80px_rgba(16,24,40,0.10)] backdrop-blur-xl sm:rounded-[2rem] sm:p-6 lg:p-10">
              <div className="mb-8 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
                  <Sparkles size={14} />
                  Lunch Mood Hub
                </div>
              </div>

              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-xs font-semibold text-foreground/70">
                  <Trophy size={14} className="text-accent" />
                  점심시간 고민을 짧고 유쾌하게 끝내는 모드들
                </div>
                <div>
                  <h1 className="font-headline text-[2rem] font-extrabold leading-[1.02] tracking-[-0.05em] text-foreground break-keep whitespace-normal sm:text-4xl md:text-6xl lg:text-7xl">
                    한 번 웃고
                    <br />
                    메뉴 고르고
                    <br />
                    커피까지 정하는
                  </h1>
                  <div className="mt-5 max-w-2xl space-y-2 break-keep text-base leading-7 text-muted-foreground sm:text-lg">
                    <p>회의 직후: 인원만 넣으면 오늘 한 번 크게 낼 주인공이 유쾌하게 정해집니다.</p>
                    <p>메뉴 고민 중: 취향만 고르면 괜히 빙빙 돌지 않고 오늘 점심이 빠르게 좁혀집니다.</p>
                    <p>식사 후: 프랜차이즈와 동네 카페를 함께 돌려 오늘 가볍게 들를 한 곳을 정합니다.</p>
                  </div>
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

              <div className="mt-6 rounded-[1.4rem] border border-border/70 bg-background/78 px-4 py-4 text-sm leading-6 text-muted-foreground sm:mt-8">
                오늘 필요한 모드는 오른쪽 카드에서 바로 시작할 수 있습니다. 설명을 보고 지금 가장 맞는 버튼을 눌러 들어가면 됩니다.
              </div>
            </section>

            <section className="grid gap-4">
              <div className="rounded-[2rem] border border-[rgba(255,255,255,0.18)] bg-[linear-gradient(145deg,#161f46_0%,#1f1557_45%,#0d7869_100%)] p-6 text-white shadow-[0_24px_70px_rgba(17,24,39,0.24)]">
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">진행 순서</div>
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
                    <div className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">오늘의 선택</div>
                    <h2 className="mt-2 font-headline text-2xl font-bold text-foreground">지금 필요한 모드 고르기</h2>
                  </div>
                  <div className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">3가지 모드</div>
                </div>
                <div className="mt-4 space-y-3">
                  {EXPERIENCE_OPTIONS.map((item) => (
                    <div key={item.mode} className="rounded-[1.4rem] border border-border/60 bg-background/70 p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(255,96,74,0.12),rgba(255,196,61,0.18))] text-2xl shadow-sm">
                          <span>{item.emoji}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="font-headline text-lg font-bold text-foreground">{item.title}</div>
                            <div className="rounded-full bg-foreground/[0.05] px-2.5 py-1 text-[11px] font-semibold text-foreground/60">
                              {item.subtitle}
                            </div>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.summary}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.meta.map((meta) => (
                              <span key={meta} className="rounded-full border border-border/70 px-2.5 py-1 text-[11px] font-semibold text-foreground/65">
                                {meta}
                              </span>
                            ))}
                          </div>
                          <Button className="mt-4 h-11 w-full rounded-full text-sm font-bold sm:w-auto sm:px-5" onClick={() => handleExperienceEnter(item.mode)}>
                            {item.mode === 'payment' && '오늘 한 번 크게 쏘기'}
                            {item.mode === 'menu' && '오늘 메뉴 고르기'}
                            {item.mode === 'coffee' && '오늘 커피 고르기'}
                          </Button>
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
      <div className="relative z-30 min-h-[100svh] bg-background">
        <ParticipantSetup onNext={() => { setGameMode(null); setView('game'); }} onBack={() => setView('intro')} />
      </div>
    );
  }

  if (view === 'recommendation') {
    return (
      <div className="relative z-30 min-h-[100svh] bg-background px-4 py-6 pb-10 sm:px-8 sm:py-8 lg:px-12">
        <div className="mx-auto w-full max-w-6xl">
          {experienceMode === 'menu' && <MenuRecommendationFlow />}
          {experienceMode === 'coffee' && <CoffeeRecommendationFlow />}
        </div>
        <FloatingNav onHome={handleGoHome} className="bottom-[5.25rem] sm:bottom-6" />
      </div>
    );
  }

  if (view === 'game' && !gameMode) {
    return (
      <div className="relative z-30 min-h-[100svh] bg-background px-4 py-6 pb-32 sm:px-8 sm:py-8 sm:pb-36 lg:px-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 animate-in fade-in slide-in-from-bottom-8">
          <div className="flex flex-col gap-4 rounded-[2rem] border border-border/70 bg-white p-5 shadow-[0_20px_50px_rgba(16,24,40,0.08)] sm:flex-row sm:items-end sm:justify-between sm:p-8">
            <div className="space-y-2 min-w-0">
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">게임 선택</div>
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
    <div className="relative z-30 min-h-[100svh] bg-background px-4 py-6 pb-32 sm:px-8 sm:py-8 sm:pb-36 lg:px-12">
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
