"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Coffee,
  Dices,
  Flame,
  LoaderCircle,
  MapPin,
  Plus,
  RotateCcw,
  Shuffle,
  Soup,
  Sparkles,
  Store,
  Trash2,
  UtensilsCrossed,
  Wheat,
} from "lucide-react";

type MenuMood =
  | "노멀"
  | "든든한 한식"
  | "국물"
  | "면"
  | "매운맛"
  | "가볍게"
  | "새로운 것"
  | "완전 랜덤";

type MenuExclusion = "매운 음식 제외" | "면 제외" | "국물 제외" | "튀김 제외" | "찬 음식 제외";

type MenuTag = "spicy" | "noodle" | "soup" | "fried" | "cold";

type MenuItem = {
  name: string;
  moods: MenuMood[];
  tags: MenuTag[];
  note: string;
};

type CoffeeEntry = {
  id: string;
  name: string;
  active: boolean;
  source: "default" | "custom";
};

type AnimatedPhase = "setup" | "shuffle" | "shortlist" | "finalists" | "final";

const MENU_MOODS: Array<{ label: MenuMood; icon: typeof Sparkles }> = [
  { label: "노멀", icon: Sparkles },
  { label: "든든한 한식", icon: UtensilsCrossed },
  { label: "국물", icon: Soup },
  { label: "면", icon: Wheat },
  { label: "매운맛", icon: Flame },
  { label: "가볍게", icon: Sparkles },
  { label: "새로운 것", icon: Dices },
  { label: "완전 랜덤", icon: Shuffle },
];

const MENU_EXCLUSIONS: MenuExclusion[] = [
  "매운 음식 제외",
  "면 제외",
  "국물 제외",
  "튀김 제외",
  "찬 음식 제외",
];

const MENU_ITEMS: MenuItem[] = [
  { name: "제육볶음", moods: ["노멀", "든든한 한식", "매운맛"], tags: ["spicy"], note: "실패 확률이 낮고 밥이 잘 들어가는 정석 메뉴" },
  { name: "김치찌개", moods: ["노멀", "든든한 한식", "국물", "매운맛"], tags: ["spicy", "soup"], note: "팀 점심에서 호불호가 적은 안정적인 국물 카드" },
  { name: "된장찌개", moods: ["노멀", "든든한 한식", "국물"], tags: ["soup"], note: "무난하고 부담 없어서 기본값에 가장 잘 맞는 메뉴" },
  { name: "순두부찌개", moods: ["든든한 한식", "국물", "매운맛"], tags: ["spicy", "soup"], note: "국물 텐션은 챙기고 속은 편한 편" },
  { name: "비빔밥", moods: ["노멀", "든든한 한식", "가볍게"], tags: [], note: "채소와 밥 균형이 좋아 노멀 추천에서 자주 살아남는 메뉴" },
  { name: "불고기덮밥", moods: ["노멀", "든든한 한식"], tags: [], note: "단짠 밸런스가 무난해서 여러 명 의견이 갈릴 때 유리합니다." },
  { name: "오므라이스", moods: ["노멀", "가볍게"], tags: [], note: "부담이 적고 깔끔해 노멀 추천의 완충 역할을 하는 메뉴" },
  { name: "돈가스", moods: ["노멀", "든든한 한식"], tags: ["fried"], note: "익숙하고 선택 설명이 쉬운 클래식 카드" },
  { name: "치킨마요덮밥", moods: ["노멀", "든든한 한식"], tags: [], note: "무난하지만 만족감이 높은 편이라 빠른 합의에 좋습니다." },
  { name: "칼국수", moods: ["노멀", "국물", "면"], tags: ["noodle", "soup"], note: "국물과 면 사이에서 무난하게 합의가 잘 되는 선택" },
  { name: "쌀국수", moods: ["국물", "면", "가볍게", "새로운 것"], tags: ["noodle", "soup"], note: "가볍지만 심심하지 않은 쪽을 원할 때 적합" },
  { name: "우동", moods: ["노멀", "국물", "면"], tags: ["noodle", "soup"], note: "자극이 강하지 않아 제외 조건이 많을 때도 잘 남는 편" },
  { name: "잔치국수", moods: ["국물", "면", "가볍게"], tags: ["noodle", "soup"], note: "속 편한 선택을 원할 때 안정적으로 살아남는 카드" },
  { name: "비빔국수", moods: ["면", "매운맛"], tags: ["noodle", "spicy", "cold"], note: "가볍지만 확실한 맛 포인트가 필요한 날에 맞습니다." },
  { name: "파스타", moods: ["노멀", "면", "새로운 것"], tags: ["noodle"], note: "평소 한식 비중이 높을 때 분위기를 바꾸기 좋은 카드" },
  { name: "라멘", moods: ["면", "국물", "새로운 것"], tags: ["noodle", "soup"], note: "면 쪽으로 마음이 기울었을 때 존재감이 큰 선택지" },
  { name: "포케", moods: ["가볍게", "새로운 것"], tags: ["cold"], note: "가볍게 먹고 싶을 때 가장 명확한 방향성" },
  { name: "샌드위치", moods: ["가볍게", "노멀"], tags: ["cold"], note: "짧게 먹고 바로 움직여야 할 때 무난한 선택" },
  { name: "샐러드볼", moods: ["가볍게"], tags: ["cold"], note: "부담을 줄이고 싶은 날 가장 직관적인 선택입니다." },
  { name: "냉모밀", moods: ["면", "가볍게"], tags: ["noodle", "cold"], note: "깔끔하고 빠르게 먹는 흐름에 잘 맞는 메뉴" },
  { name: "초밥", moods: ["가볍게", "새로운 것"], tags: ["cold"], note: "깔끔하고 과하지 않게 분위기를 바꾸고 싶을 때" },
  { name: "마라탕", moods: ["매운맛", "새로운 것"], tags: ["spicy", "soup"], note: "자극적인 확실한 한 방이 필요할 때" },
  { name: "부대찌개", moods: ["든든한 한식", "국물", "매운맛"], tags: ["spicy", "soup"], note: "든든하고 자극적인 쪽으로 의견이 모일 때 잘 맞습니다." },
  { name: "닭갈비", moods: ["든든한 한식", "매운맛"], tags: ["spicy"], note: "점심도 어느 정도 텐션 있게 먹고 싶은 날 강한 카드입니다." },
  { name: "텐동", moods: ["새로운 것"], tags: ["fried"], note: "튀김 쪽으로 선호가 모일 때 존재감이 큰 카드" },
  { name: "규동", moods: ["노멀", "새로운 것"], tags: [], note: "익숙함과 약간의 변주 사이에서 균형이 좋은 메뉴" },
  { name: "타코라이스", moods: ["새로운 것", "가볍게"], tags: [], note: "색다르지만 과하게 모험적이지 않은 메뉴를 원할 때 적합합니다." },
];

const DEFAULT_COFFEE_CANDIDATES: string[] = [
  "스타벅스",
  "투썸플레이스",
  "이디야",
  "메가MGC커피",
  "컴포즈커피",
  "빽다방",
  "할리스",
  "폴바셋",
  "엔제리너스",
  "탐앤탐스",
  "커피빈",
  "매머드커피",
  "더벤티",
  "벤티프레소",
  "드롭탑",
  "파스쿠찌",
  "커피에반하다",
  "하삼동커피",
  "감성커피",
  "더리터",
  "블루샥",
  "달콤커피",
];

const COFFEE_STORAGE_KEY = "lunch-boss-coffee-candidates";

const MENU_RESULT_LINES = [
  "의견이 갈리기 전에 무난하게 합의 보기 좋은 카드입니다.",
  "오늘 점심을 빠르게 정리하기에 가장 부담이 적은 선택입니다.",
  "팀 분위기를 깨지 않고 바로 이동하기 좋은 결과입니다.",
];

const COFFEE_RESULT_LINES = [
  "동선이 너무 꼬이지 않게 오늘 한 곳으로 빠르게 정리했습니다.",
  "기본 프랜차이즈와 지역 카페를 함께 돌린 결과로 최종 선정됐습니다.",
  "식사 후 고민을 더 끌지 않고 바로 향하기 좋은 선택입니다.",
];

const exclusionTagMap: Record<MenuExclusion, MenuTag> = {
  "매운 음식 제외": "spicy",
  "면 제외": "noodle",
  "국물 제외": "soup",
  "튀김 제외": "fried",
  "찬 음식 제외": "cold",
};

const shuffle = <T,>(items: T[]) => {
  const copied = [...items];
  for (let index = copied.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [copied[index], copied[target]] = [copied[target], copied[index]];
  }
  return copied;
};

const pickUnique = <T,>(items: T[], count: number) => shuffle(items).slice(0, Math.min(count, items.length));

const randomLine = (items: string[]) => items[Math.floor(Math.random() * items.length)] || items[0] || "";

const createCoffeeEntry = (name: string, source: CoffeeEntry["source"]): CoffeeEntry => ({
  id: source + "-" + name.replace(/\s+/g, "-").toLowerCase() + "-" + Math.random().toString(36).slice(2, 8),
  name,
  active: true,
  source,
});

const defaultCoffeeEntries = () => DEFAULT_COFFEE_CANDIDATES.map((name) => createCoffeeEntry(name, "default"));

const RecommendationShell = ({
  eyebrow,
  title,
  description,
  accent,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  children: ReactNode;
}) => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 sm:gap-6">
    <section className="rounded-[1.75rem] border border-white/70 bg-white/82 p-4 shadow-[0_24px_80px_rgba(16,24,40,0.10)] backdrop-blur-xl sm:rounded-[2rem] sm:p-8">
      <div className={cn("inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em]", accent)}>
        {eyebrow}
      </div>
      <h2 className="mt-4 font-headline text-2xl font-extrabold tracking-[-0.04em] text-foreground break-keep sm:mt-5 sm:text-5xl">{title}</h2>
      <p className="mt-3 max-w-3xl break-keep text-sm leading-6 text-muted-foreground sm:mt-4 sm:text-base sm:leading-7">{description}</p>
    </section>
    {children}
  </div>
);

const ProgressRail = ({ phase, steps }: { phase: AnimatedPhase; steps: Array<{ key: AnimatedPhase; label: string }> }) => {
  const currentIndex = steps.findIndex((step) => step.key === phase);

  return (
    <div className="overflow-x-auto rounded-[1.4rem] border border-white/70 bg-white/78 p-3 shadow-[0_16px_40px_rgba(16,24,40,0.06)] backdrop-blur-xl sm:rounded-[1.6rem] sm:p-4">
      <div className="flex min-w-max gap-2 sm:grid sm:min-w-0 sm:grid-cols-4 sm:gap-3">
        {steps.map((step, index) => {
          const active = index <= currentIndex;
          const current = index === currentIndex;
          return (
            <div
              key={step.label}
              className={cn(
                "min-w-[88px] rounded-[1.1rem] border px-3 py-3 text-center transition-all sm:min-w-0 sm:rounded-[1.2rem]",
                current
                  ? "border-primary/25 bg-[linear-gradient(135deg,rgba(255,96,74,0.12),rgba(255,196,61,0.16))] shadow-sm"
                  : active
                    ? "border-secondary/20 bg-secondary/10"
                    : "border-border/70 bg-background/80"
              )}
            >
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/45">0{index + 1}</div>
              <div className="mt-1 text-sm font-bold text-foreground">{step.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CandidateDisplay = ({
  title,
  description,
  items,
  highlighted,
  footer,
  variant = "warm",
}: {
  title: string;
  description: string;
  items: string[];
  highlighted?: string | null;
  footer?: string;
  variant?: "warm" | "cool";
}) => {
  const footerClass = variant === "warm" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary";
  const highlightedClass =
    variant === "warm"
      ? "scale-[1.02] border-primary/30 bg-[linear-gradient(135deg,rgba(255,96,74,0.14),rgba(255,196,61,0.18))] shadow-[0_18px_40px_rgba(255,96,74,0.18)]"
      : "scale-[1.02] border-secondary/30 bg-[linear-gradient(135deg,rgba(0,209,178,0.14),rgba(83,196,255,0.18))] shadow-[0_18px_40px_rgba(0,209,178,0.16)]";

  return (
    <Card className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/78 shadow-[0_20px_60px_rgba(16,24,40,0.08)] backdrop-blur-xl sm:rounded-[2rem]">
      <CardContent className="p-4 sm:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{title}</div>
            <h3 className="mt-2 font-headline text-2xl font-bold text-foreground break-keep">{description}</h3>
          </div>
          {footer ? <div className={cn("rounded-full px-3 py-1 text-xs font-semibold", footerClass)}>{footer}</div> : null}
        </div>
        <div className="mt-4 grid gap-2.5 sm:mt-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const isHighlighted = highlighted === item;
            return (
              <div
                key={item + index}
                className={cn(
                  "rounded-[1.25rem] border px-3.5 py-3.5 transition-all duration-300 sm:rounded-[1.5rem] sm:px-4 sm:py-4",
                  isHighlighted ? highlightedClass : "border-border/70 bg-background/80"
                )}
              >
                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/35">candidate</div>
                <div className="mt-1 text-base font-black text-foreground break-keep sm:text-lg">{item}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const MobileActionBar = ({
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  primaryDisabled,
  hidden = false,
}: {
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
  primaryDisabled?: boolean;
  hidden?: boolean;
}) => (
  <div
    className={cn(
      "fixed inset-x-0 bottom-0 z-40 border-t border-white/70 bg-[rgba(255,250,245,0.92)] p-3 pb-[calc(env(safe-area-inset-bottom)+12px)] backdrop-blur-xl transition-opacity sm:hidden",
      hidden ? "pointer-events-none opacity-0" : "opacity-100"
    )}
  >
    <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] gap-2">
      <Button className="hero-gradient h-12 rounded-full text-sm font-bold" onClick={onPrimary} disabled={primaryDisabled}>
        {primaryLabel}
      </Button>
      <Button variant="outline" className="h-12 rounded-full px-4 font-semibold" onClick={onSecondary}>
        {secondaryLabel}
      </Button>
    </div>
  </div>
);

export const MenuRecommendationFlow = () => {
  const [selectedMood, setSelectedMood] = useState<MenuMood>("노멀");
  const [selectedExclusions, setSelectedExclusions] = useState<MenuExclusion[]>([]);
  const [phase, setPhase] = useState<AnimatedPhase>("setup");
  const [displayItems, setDisplayItems] = useState<string[]>(pickUnique(MENU_ITEMS.map((item) => item.name), 6));
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [finalPick, setFinalPick] = useState<MenuItem | null>(null);
  const [resultCopy, setResultCopy] = useState("");
  const timerIds = useRef<number[]>([]);

  const candidatePool = useMemo(() => {
    const excludedTags = selectedExclusions.map((entry) => exclusionTagMap[entry]);
    const byMood =
      selectedMood === "완전 랜덤"
        ? MENU_ITEMS
        : MENU_ITEMS.filter((item) => item.moods.includes(selectedMood));

    const filtered = byMood.filter((item) => excludedTags.every((tag) => item.tags.includes(tag) === false));
    if (filtered.length > 0) {
      return filtered;
    }
    return MENU_ITEMS.filter((item) => excludedTags.every((tag) => item.tags.includes(tag) === false));
  }, [selectedExclusions, selectedMood]);

  useEffect(() => {
    return () => {
      timerIds.current.forEach((id) => window.clearTimeout(id));
      timerIds.current = [];
    };
  }, []);

  const toggleExclusion = (entry: MenuExclusion) => {
    setSelectedExclusions((current) =>
      current.includes(entry) ? current.filter((item) => item !== entry) : [...current, entry]
    );
  };

  const reset = () => {
    timerIds.current.forEach((id) => window.clearTimeout(id));
    timerIds.current = [];
    setPhase("setup");
    setShortlist([]);
    setHighlighted(null);
    setFinalPick(null);
    setResultCopy("");
    setDisplayItems(pickUnique(MENU_ITEMS.map((item) => item.name), 6));
  };

  const startRecommendation = () => {
    if (candidatePool.length === 0) {
      return;
    }

    reset();
    setPhase("shuffle");

    const shuffleInterval = window.setInterval(() => {
      setDisplayItems(pickUnique(candidatePool.map((item) => item.name), 6));
    }, 140);
    timerIds.current.push(shuffleInterval);

    const stopShuffle = window.setTimeout(() => {
      window.clearInterval(shuffleInterval);
      const nextShortlist = pickUnique(candidatePool.map((item) => item.name), Math.min(4, candidatePool.length));
      setShortlist(nextShortlist);
      setDisplayItems(nextShortlist);
      setPhase("shortlist");

      let highlightIndex = 0;
      const highlightInterval = window.setInterval(() => {
        setHighlighted(nextShortlist[highlightIndex % nextShortlist.length]);
        highlightIndex += 1;
      }, 220);
      timerIds.current.push(highlightInterval);

      const finalistsTimeout = window.setTimeout(() => {
        const nextFinalists = nextShortlist.slice(0, Math.min(2, nextShortlist.length));
        setDisplayItems(nextFinalists);
        setPhase("finalists");
      }, 900);
      timerIds.current.push(finalistsTimeout);

      const revealFinal = window.setTimeout(() => {
        window.clearInterval(highlightInterval);
        const basePool = nextShortlist.slice(0, Math.min(2, nextShortlist.length));
        const chosenName = basePool[Math.floor(Math.random() * basePool.length)] || nextShortlist[0];
        const chosenItem = candidatePool.find((item) => item.name === chosenName) || candidatePool[0];
        setHighlighted(chosenItem.name);
        setFinalPick(chosenItem);
        setResultCopy(randomLine(MENU_RESULT_LINES));
        setDisplayItems([chosenItem.name, ...nextShortlist.filter((item) => item !== chosenItem.name)]);
        setPhase("final");
      }, 2000);
      timerIds.current.push(revealFinal);
    }, 2300);

    timerIds.current.push(stopShuffle);
  };

  const steps = [
    { key: "setup" as const, label: "조건" },
    { key: "shuffle" as const, label: "셔플" },
    { key: "shortlist" as const, label: "압축" },
    { key: "final" as const, label: "확정" },
  ];

  return (
    <RecommendationShell
      eyebrow="오늘의 메뉴 추천"
      title="무난한 점심부터 약간의 변주까지, 오늘 먹을 메뉴를 빠르게 좁혀갑니다"
      description="가격 조건은 제외하고, 팀이 고르기 쉬운 기준만 남겼습니다. 노멀을 기본값으로 두고 제외 조건만 간단히 걸러서 후보를 압축합니다."
      accent="bg-primary/10 text-primary"
    >
      <ProgressRail phase={phase === "finalists" ? "shortlist" : phase} steps={steps} />
      <div className="grid gap-4 pb-28 lg:grid-cols-[1fr_1.05fr] lg:gap-6 lg:pb-0">
        <Card className="rounded-[1.75rem] border border-white/70 bg-white/82 shadow-[0_20px_60px_rgba(16,24,40,0.08)] backdrop-blur-xl sm:rounded-[2rem]">
          <CardContent className="p-4 sm:p-7">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">1. 분위기 선택</div>
            <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-2">
              {MENU_MOODS.map(({ label, icon: Icon }) => {
                const selected = selectedMood === label;
                return (
                  <button
                    key={label}
                    type="button"
                    className={cn(
                      "rounded-[1.25rem] border p-3.5 text-left transition-all sm:rounded-[1.5rem] sm:p-4",
                      selected
                        ? "border-primary/25 bg-[linear-gradient(135deg,rgba(255,96,74,0.12),rgba(255,196,61,0.16))] shadow-sm"
                        : "border-border/70 bg-background/70 hover:bg-background"
                    )}
                    onClick={() => setSelectedMood(label)}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-primary shadow-sm sm:h-10 sm:w-10 sm:rounded-2xl">
                        <Icon size={18} />
                      </div>
                      <div className="font-headline text-base font-bold text-foreground sm:text-lg">{label}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 text-sm font-semibold uppercase tracking-[0.24em] text-primary">2. 제외 조건</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {MENU_EXCLUSIONS.map((entry) => {
                const selected = selectedExclusions.includes(entry);
                return (
                  <Badge
                    key={entry}
                    variant={selected ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer rounded-full px-4 py-2 text-xs font-semibold transition-all",
                      selected ? "bg-primary text-white hover:bg-primary/90" : "bg-background/80 text-foreground/70"
                    )}
                    onClick={() => toggleExclusion(entry)}
                  >
                    {entry}
                  </Badge>
                );
              })}
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-border/70 bg-background/80 p-4 text-sm leading-6 text-muted-foreground">
              현재 후보 {candidatePool.length}개. 기본값은 <span className="font-bold text-foreground">노멀</span>이며, 조건이 과도하면 가장 가까운 무난한 풀로 자동 보정합니다.
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {pickUnique(candidatePool.map((item) => item.name), 5).map((item) => (
                <span key={item} className="rounded-full border border-border/70 px-3 py-1 text-[11px] font-semibold text-foreground/65">
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-6 hidden flex-col gap-3 sm:flex sm:flex-row">
              <Button className="hero-gradient soft-glow h-14 rounded-full px-6 text-base font-bold" onClick={startRecommendation}>
                <Shuffle size={18} className="mr-2" /> 메뉴 추천 시작
              </Button>
              <Button variant="outline" className="h-14 rounded-full px-6 font-semibold" onClick={reset}>
                <RotateCcw size={18} className="mr-2" /> 조건만 유지하고 초기화
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <CandidateDisplay
            title="후보 압축"
            description={
              phase === "setup"
                ? "시작 전 미리보기"
                : phase === "shuffle"
                  ? "메뉴 후보를 빠르게 섞는 중"
                  : phase === "shortlist"
                    ? "마지막 shortlist 추리는 중"
                    : phase === "finalists"
                      ? "최종 두 메뉴를 번갈아 강조하는 중"
                      : "오늘의 메뉴 확정"
            }
            items={displayItems}
            highlighted={highlighted}
            footer={
              phase === "shuffle"
                ? "셔플 중"
                : phase === "shortlist"
                  ? "마지막 4개"
                  : phase === "finalists"
                    ? "최종 2개"
                    : phase === "final"
                      ? "선정 완료"
                      : "준비 완료"
            }
          />

          <Card className="rounded-[2rem] border border-white/70 bg-[#172033] text-white shadow-[0_24px_70px_rgba(17,24,39,0.20)]">
            <CardContent className="p-5 sm:p-7">
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">최종 결과</div>
              {phase === "final" && finalPick ? (
                <div className="mt-4 space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                    <UtensilsCrossed size={14} />
                    오늘의 메뉴
                  </div>
                  <div className="font-headline text-4xl font-black tracking-[-0.04em] text-white">{finalPick.name}</div>
                  <p className="break-keep text-sm leading-6 text-white/70">{finalPick.note}</p>
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-white/75">
                    {resultCopy}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="rounded-full bg-white/12 px-3 py-1 text-white">{selectedMood}</Badge>
                    {selectedExclusions.map((entry) => (
                      <Badge key={entry} className="rounded-full bg-white/12 px-3 py-1 text-white/90">
                        {entry}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-6 flex items-center gap-3 rounded-[1.6rem] border border-white/10 bg-white/5 px-4 py-5 text-sm text-white/70">
                  {phase === "setup" ? <Sparkles size={18} /> : <LoaderCircle size={18} className="animate-spin" />}
                  {phase === "setup"
                    ? "조건을 고르고 추천을 시작하면 후보가 많을 때부터 마지막 하나까지 줄어드는 흐름이 여기서 보입니다."
                    : "후보를 순차적으로 줄이는 중입니다. 마지막까지 시선이 끊기지 않도록 텐션을 유지합니다."}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <MobileActionBar
        primaryLabel="메뉴 추천 시작"
        secondaryLabel="초기화"
        onPrimary={startRecommendation}
        onSecondary={reset}
      />
    </RecommendationShell>
  );
};

export const CoffeeRecommendationFlow = () => {
  const [candidates, setCandidates] = useState<CoffeeEntry[]>(defaultCoffeeEntries);
  const [customName, setCustomName] = useState("");
  const [phase, setPhase] = useState<AnimatedPhase>("setup");
  const [displayItems, setDisplayItems] = useState<string[]>(pickUnique(DEFAULT_COFFEE_CANDIDATES, 6));
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [finalists, setFinalists] = useState<string[]>([]);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [finalPick, setFinalPick] = useState<string | null>(null);
  const [resultCopy, setResultCopy] = useState("");
  const timerIds = useRef<number[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(COFFEE_STORAGE_KEY);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as CoffeeEntry[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setCandidates(parsed);
      }
    } catch {
      setCandidates(defaultCoffeeEntries());
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(COFFEE_STORAGE_KEY, JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    return () => {
      timerIds.current.forEach((id) => window.clearTimeout(id));
      timerIds.current = [];
    };
  }, []);

  const activeCandidates = useMemo(
    () => candidates.filter((entry) => entry.active).map((entry) => entry.name),
    [candidates]
  );

  const reset = () => {
    timerIds.current.forEach((id) => window.clearTimeout(id));
    timerIds.current = [];
    setPhase("setup");
    setFinalists([]);
    setHighlighted(null);
    setFinalPick(null);
    setResultCopy("");
    setDisplayItems(pickUnique(activeCandidates.length > 0 ? activeCandidates : DEFAULT_COFFEE_CANDIDATES, 6));
  };

  const toggleCandidate = (id: string) => {
    setCandidates((current) =>
      current.map((entry) => (entry.id === id ? { ...entry, active: !entry.active } : entry))
    );
  };

  const removeCandidate = (id: string) => {
    setCandidates((current) => current.filter((entry) => entry.id !== id));
  };

  const restoreDefaults = () => {
    setCandidates((current) => {
      const customEntries = current.filter((entry) => entry.source === "custom");
      return [...defaultCoffeeEntries(), ...customEntries];
    });
  };

  const addCustomCafe = () => {
    const trimmed = customName.trim();
    if (!trimmed) {
      return;
    }

    const exists = candidates.some((entry) => entry.name === trimmed);
    if (exists) {
      setCustomName("");
      return;
    }

    setCandidates((current) => [...current, createCoffeeEntry(trimmed, "custom")]);
    setCustomName("");
  };

  const startRecommendation = () => {
    if (activeCandidates.length === 0) {
      return;
    }

    reset();
    setPhase("shuffle");

    const shuffleInterval = window.setInterval(() => {
      setDisplayItems(pickUnique(activeCandidates, 6));
    }, 140);
    timerIds.current.push(shuffleInterval);

    const stopShuffle = window.setTimeout(() => {
      window.clearInterval(shuffleInterval);
      const pickedFinalists = pickUnique(activeCandidates, Math.min(3, activeCandidates.length));
      setFinalists(pickedFinalists);
      setDisplayItems(pickedFinalists);
      setPhase("shortlist");

      let highlightIndex = 0;
      const blinkInterval = window.setInterval(() => {
        setHighlighted(pickedFinalists[highlightIndex % pickedFinalists.length]);
        highlightIndex += 1;
      }, 220);
      timerIds.current.push(blinkInterval);

      const finalistsTimeout = window.setTimeout(() => {
        const lastTwo = pickedFinalists.slice(0, Math.min(2, pickedFinalists.length));
        setDisplayItems(lastTwo);
        setPhase("finalists");
      }, 900);
      timerIds.current.push(finalistsTimeout);

      const revealFinal = window.setTimeout(() => {
        window.clearInterval(blinkInterval);
        const basePool = pickedFinalists.slice(0, Math.min(2, pickedFinalists.length));
        const chosen = basePool[Math.floor(Math.random() * basePool.length)] || pickedFinalists[0];
        setHighlighted(chosen);
        setFinalPick(chosen);
        setResultCopy(randomLine(COFFEE_RESULT_LINES));
        setDisplayItems([chosen, ...pickedFinalists.filter((item) => item !== chosen)]);
        setPhase("final");
      }, 1900);
      timerIds.current.push(revealFinal);
    }, 2200);

    timerIds.current.push(stopShuffle);
  };

  const steps = [
    { key: "setup" as const, label: "후보 정리" },
    { key: "shuffle" as const, label: "셔플" },
    { key: "shortlist" as const, label: "압축" },
    { key: "final" as const, label: "확정" },
  ];

  return (
    <RecommendationShell
      eyebrow="오늘의 커피 추천"
      title="기본 프랜차이즈에 지역 카페까지 섞어서, 오늘 갈 카페를 복불복으로 정합니다"
      description="기본 목록은 넉넉하게 제공하고, 내 주변에 없는 곳은 바로 제외할 수 있게 했습니다. 자주 가는 지역 카페도 직접 추가해서 함께 돌릴 수 있습니다."
      accent="bg-secondary/12 text-secondary"
    >
      <ProgressRail phase={phase === "finalists" ? "shortlist" : phase} steps={steps} />
      <div className="grid gap-4 pb-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:pb-0">
        <div className="space-y-6">
          <Card className="rounded-[1.75rem] border border-white/70 bg-white/82 shadow-[0_20px_60px_rgba(16,24,40,0.08)] backdrop-blur-xl sm:rounded-[2rem]">
            <CardContent className="p-4 sm:p-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">1. 기본 프랜차이즈 정리</div>
                  <h3 className="mt-2 font-headline text-2xl font-bold text-foreground">내 주변에 없는 곳은 제외</h3>
                </div>
                <Button variant="outline" className="rounded-full" onClick={restoreDefaults}>
                  <RotateCcw size={16} className="mr-2" /> 기본 목록 복원
                </Button>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {candidates
                  .filter((entry) => entry.source === "default")
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className={cn(
                        "flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-all",
                        entry.active ? "border-secondary/20 bg-secondary/10 text-secondary" : "border-border/70 bg-background/80 text-muted-foreground"
                      )}
                    >
                      <button type="button" onClick={() => toggleCandidate(entry.id)} className="text-left">
                        {entry.name}
                      </button>
                      <button type="button" onClick={() => toggleCandidate(entry.id)} className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold text-foreground/70">
                        {entry.active ? "제외" : "복원"}
                      </button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border border-white/70 bg-white/82 shadow-[0_20px_60px_rgba(16,24,40,0.08)] backdrop-blur-xl sm:rounded-[2rem]">
            <CardContent className="p-4 sm:p-7">
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">2. 지역 카페 추가</div>
              <div className="mt-4 flex flex-col gap-2.5 sm:gap-3 sm:flex-row">
                <Input
                  value={customName}
                  onChange={(event) => setCustomName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      addCustomCafe();
                    }
                  }}
                  placeholder="예: 동네로스터리, 사무실앞카페"
                  className="h-14 rounded-2xl border-border/80 bg-background/80 text-base font-semibold"
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                />
                <Button className="h-12 rounded-2xl px-5 font-semibold sm:h-14" onClick={addCustomCafe}>
                  <Plus size={18} className="mr-2" /> 추가
                </Button>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {candidates.filter((entry) => entry.source === "custom").length > 0 ? (
                  candidates
                    .filter((entry) => entry.source === "custom")
                    .map((entry) => (
                      <div
                        key={entry.id}
                        className={cn(
                          "flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold",
                          entry.active ? "border-primary/20 bg-primary/10 text-primary" : "border-border/70 bg-background/80 text-muted-foreground"
                        )}
                      >
                        <button type="button" onClick={() => toggleCandidate(entry.id)}>
                          <MapPin size={12} className="mr-1 inline-block" />
                          {entry.name}
                        </button>
                        <button type="button" onClick={() => removeCandidate(entry.id)} className="rounded-full bg-white/80 p-1 text-foreground/70">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))
                ) : (
                  <div className="rounded-[1.4rem] border border-dashed border-border/70 bg-background/70 px-4 py-4 text-sm text-muted-foreground">
                    지역 전용 카페를 넣고 싶다면 여기서 추가하세요. 다음 방문에도 유지됩니다.
                  </div>
                )}
              </div>
              <div className="mt-5 rounded-[1.4rem] border border-border/70 bg-background/80 px-4 py-4 text-sm leading-6 text-muted-foreground">
                현재 활성 후보 {activeCandidates.length}곳. 기본 프랜차이즈를 줄이고 지역 카페를 섞어도 복불복 흐름은 그대로 유지됩니다.
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <CandidateDisplay
            title="복불복 진행"
            description={
              phase === "setup"
                ? "카페 후보 준비 완료"
                : phase === "shuffle"
                  ? "카페 카드를 빠르게 섞는 중"
                  : phase === "shortlist"
                    ? "마지막 shortlist 압축 중"
                    : phase === "finalists"
                      ? "최종 두 곳을 번갈아 강조하는 중"
                      : "오늘의 카페 확정"
            }
            items={displayItems}
            highlighted={highlighted}
            variant="cool"
            footer={
              phase === "shuffle"
                ? "셔플 중"
                : phase === "shortlist"
                  ? "마지막 3곳"
                  : phase === "finalists"
                    ? "최종 2곳"
                    : phase === "final"
                      ? "선정 완료"
                      : `${activeCandidates.length}곳 참여`
            }
          />

          <Card className="rounded-[2rem] border border-white/70 bg-[linear-gradient(145deg,#15223b_0%,#14464e_100%)] text-white shadow-[0_24px_70px_rgba(17,24,39,0.20)]">
            <CardContent className="p-5 sm:p-7">
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">최종 결과</div>
              {phase === "final" && finalPick ? (
                <div className="mt-5 space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                    <Coffee size={14} />
                    오늘의 커피 카페
                  </div>
                  <div className="font-headline text-4xl font-black tracking-[-0.04em]">{finalPick}</div>
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-white/75">
                    {resultCopy}
                  </div>
                  <p className="break-keep text-sm leading-6 text-white/70">
                    기본 프랜차이즈와 직접 추가한 지역 카페를 함께 섞어서 최종 한 곳으로 압축했습니다.
                  </p>
                </div>
              ) : (
                <div className="mt-6 flex items-center gap-3 rounded-[1.6rem] border border-white/10 bg-white/5 px-4 py-5 text-sm text-white/70">
                  {phase === "setup" ? <Store size={18} /> : <LoaderCircle size={18} className="animate-spin" />}
                  {phase === "setup"
                    ? "활성화된 카페만 후보군에 들어갑니다. 기본 프랜차이즈를 줄이고 지역 카페를 더해도 됩니다."
                    : "후보를 번갈아 강조하면서 마지막 두 곳까지 압축하는 중입니다."}
                </div>
              )}

              <div className="mt-6 hidden flex-col gap-3 sm:flex sm:flex-row">
                <Button
                  className="hero-gradient soft-glow h-14 rounded-full px-6 text-base font-bold"
                  onClick={startRecommendation}
                  disabled={activeCandidates.length === 0}
                >
                  <Coffee size={18} className="mr-2" /> 카페 추천 시작
                </Button>
                <Button variant="outline" className="h-14 rounded-full px-6 font-semibold" onClick={reset}>
                  <RotateCcw size={18} className="mr-2" /> 연출만 다시 돌리기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <MobileActionBar
        primaryLabel="카페 추천 시작"
        secondaryLabel="다시 돌리기"
        onPrimary={startRecommendation}
        onSecondary={reset}
        primaryDisabled={activeCandidates.length === 0}
        hidden={isInputFocused}
      />
    </RecommendationShell>
  );
};
