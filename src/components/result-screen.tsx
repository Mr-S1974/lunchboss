"use client";

import { useEffect, useState } from "react";
import { useGame } from "./game-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, RefreshCw, PartyPopper, Wallet, ListChecks, Home, ArrowLeft } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

interface Particle {
  top: string;
  left: string;
  delay: string;
  scale: string;
}

const COMMENDATIONS: Record<string, string[]> = {
  "텅장 사원": [
    "오늘은 기분 좋게 한 번 크게 갑니다. 다음 판의 역전 서사도 벌써 기대됩니다.",
    "월말 계산기는 잠시 닫아두고, 오늘은 통 큰 주인공으로 기억됩니다.",
  ],
  "법카 사냥꾼 대리": [
    "카드 꺼내는 동선까지 깔끔한 분답게 오늘의 스포트라이트를 받으셨습니다.",
    "좋은 타이밍에 카드가 열렸습니다. 오늘 점심 분위기까지 시원하게 가져가주세요.",
  ],
  "법카 장전 과장": [
    "든든하게 판을 받아주셨으니 오늘 식사 분위기도 같이 올라갑니다.",
    "준비된 사람은 결제 타이밍에도 멋있습니다. 오늘은 시원하게 갑니다.",
  ],
  "허허 부장": [
    "웃으면서 크게 한 번 내는 날이 제일 멋있습니다. 오늘 그 장면의 주인공입니다.",
    "이왕 걸렸다면 멋있게. 오늘의 한 끼를 더 기분 좋게 만드는 역할이 잘 어울립니다.",
  ],
  "커피 요정": [
    "커피도 챙기고 점심도 살리는, 오늘 오피스 텐션 메이커로 등판하셨습니다.",
    "지갑은 조금 열렸지만 분위기는 확실히 좋아지는 오늘의 요정입니다.",
  ],
  default: [
    "오늘 점심은 이분 덕분에 한층 더 기분 좋게 흘러갑니다.",
    "가볍게 돌렸지만 결과는 확실합니다. 오늘의 한턱 담당이 멋지게 정해졌습니다.",
  ],
};

const digitsOnly = (value: string) => value.replace(new RegExp("[^0-9]", "g"), "");

const getCommendation = (name: string, character: string) => {
  const pool = COMMENDATIONS[character] || COMMENDATIONS.default;
  const selected = pool[Math.floor(Math.random() * pool.length)] || COMMENDATIONS.default[0];
  return name + "님, " + selected;
};

export const ResultScreen = ({ onBack, onHome }: { onBack: () => void; onHome: () => void }) => {
  const { winner, winningAmount, allResults, resetGame } = useGame();
  const [commendation, setCommendation] = useState("");
  const [loading, setLoading] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);

  const maxVal = winningAmount ? parseInt(digitsOnly(winningAmount), 10) || 0 : -1;
  const bosses = allResults.length > 0
    ? allResults.filter((r) => (parseInt(digitsOnly(r.amount), 10) || 0) === maxVal)
    : winner
      ? [{ participant: winner, amount: winningAmount || "0" }]
      : [];

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, () => ({
      top: String(Math.random() * 100) + "%",
      left: String(Math.random() * 100) + "%",
      delay: String(Math.random() * 5) + "s",
      scale: String(0.5 + Math.random()),
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    if (!winner) return;

    const winnerName = bosses.length > 1
      ? bosses[0].participant.name + " 외 " + String(bosses.length - 1) + "명"
      : winner.name;

    setCommendation(getCommendation(winnerName, winner.character));
    setLoading(false);
  }, [winner, bosses.length]);

  if (!winner) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[rgba(255,249,240,0.82)] backdrop-blur-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,90,95,0.16),_transparent_28%),radial-gradient(circle_at_20%_80%,_rgba(0,209,178,0.18),_transparent_26%),radial-gradient(circle_at_85%_20%,_rgba(255,196,61,0.22),_transparent_24%),linear-gradient(180deg,_rgba(255,255,255,0.72),_rgba(255,244,233,0.94))]" />
      <div className="pointer-events-none absolute inset-0 h-full overflow-hidden">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute animate-float text-primary opacity-30"
            style={{
              top: p.top,
              left: p.left,
              animationDelay: p.delay,
              transform: "scale(" + p.scale + ")",
            }}
          >
            <PartyPopper size={32} />
          </div>
        ))}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-10 pb-32 text-center animate-in zoom-in-95 duration-500 sm:px-6 sm:py-12 sm:pb-36">
        <div className="space-y-3">
          <div className="mx-auto inline-flex items-center rounded-full border border-white/70 bg-white/70 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-secondary shadow-[0_10px_30px_rgba(16,24,40,0.08)] backdrop-blur-xl">
            오늘의 기분 좋은 한턱
          </div>
          <div className="space-y-1">
            <h1 className="hero-gradient bg-clip-text text-4xl font-black text-transparent sm:text-5xl">유쾌한 결과 발표</h1>
            <p className="text-sm font-semibold text-foreground/65 break-keep">오늘 한 번 시원하게 쏘며 분위기를 살릴 주인공이 정해졌습니다.</p>
          </div>
        </div>

        <Card className="relative overflow-visible rounded-[2.5rem] border-[10px] border-primary/85 bg-white/92 shadow-[0_30px_90px_rgba(255,96,74,0.28)] backdrop-blur-xl sm:rounded-[3.5rem] sm:border-[12px]">
          <CardContent className="flex flex-col items-center gap-4 p-6 sm:p-8">
            <div className="relative">
              <div className="soft-glow flex h-28 w-28 items-center justify-center rounded-full bg-[linear-gradient(135deg,hsl(var(--primary))_0%,hsl(var(--accent))_55%,hsl(var(--secondary))_100%)] sm:h-32 sm:w-32">
                <Crown size={56} className="text-white drop-shadow-lg sm:size-[60px]" />
              </div>
              <div className="absolute -right-3 -top-3 sm:-right-8 sm:-top-4 animate-bounce">
                <Badge className="rotate-12 rounded-xl border-4 border-black bg-[hsl(var(--highlight))] px-3 py-1.5 text-xs font-black text-black shadow-xl sm:px-4 sm:py-2 sm:text-sm">
                  {bosses.length > 1 ? "공동 스폰서" : "오늘의 스폰서"}
                </Badge>
              </div>
            </div>

            <div className="text-center min-w-0 w-full">
              <div className="mb-1 break-keep text-2xl font-black text-foreground whitespace-normal sm:text-3xl">
                {bosses.length > 1 ? bosses.map((b) => b.participant.name).join(", ") : winner.name}
              </div>
              <div className="inline-flex max-w-full rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary break-keep">
                {bosses.length > 1 ? "기분 좋게 공동 당첨" : winner.character}
              </div>
            </div>

            {winningAmount && (
              <div className="flex w-full flex-col items-center gap-1 rounded-3xl border border-accent/20 bg-[linear-gradient(135deg,rgba(255,96,74,0.08),rgba(0,209,178,0.14))] p-3">
                <div className="flex items-center gap-2 text-xs font-black text-accent">
                  <Wallet size={16} />
                  <span>오늘 시원하게 나간 금액</span>
                </div>
                <div className="text-2xl font-black text-accent">{winningAmount}원</div>
              </div>
            )}

            <div className="w-full rounded-[1.5rem] border border-white bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,247,240,0.92))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-primary/10" />
                  <Skeleton className="h-4 w-[80%] bg-primary/10" />
                </div>
              ) : (
                <p className="break-keep text-sm italic leading-relaxed text-foreground/80">{commendation}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {allResults.length > 0 && (
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-2 px-2 font-black text-primary">
              <ListChecks size={20} />
              <h3>이번 판 전체 결과</h3>
            </div>
            <ScrollArea className="max-h-[360px] rounded-[2.5rem] border border-white/80 bg-white/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-md sm:max-h-[400px]">
              <div className="space-y-2 pr-2">
                {allResults.map((res, i) => {
                  const isBoss = (parseInt(digitsOnly(res.amount), 10) || 0) === maxVal;
                  return (
                    <div
                      key={res.participant.id}
                      className={"flex items-center justify-between rounded-2xl border p-4 transition-all " + (isBoss ? "border-primary/30 bg-[linear-gradient(135deg,rgba(255,96,74,0.12),rgba(255,196,61,0.16))] shadow-sm" : "border-white/80 bg-white/92")}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className={"flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold " + (isBoss ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                          {isBoss ? <Crown size={14} /> : i + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-black">{res.participant.name}</div>
                          <div className="truncate text-[10px] font-bold text-muted-foreground">{res.participant.character}</div>
                        </div>
                      </div>
                      <div className="ml-3 shrink-0 text-right">
                        <div className={"text-sm font-black " + (isBoss ? "text-accent" : "text-primary")}>{res.amount}원</div>
                        {isBoss && <Badge className="h-4 border-none bg-accent text-[9px] font-bold">당첨</Badge>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}

        <div className="grid gap-3">
          <Button className="hero-gradient soft-glow h-16 gap-2 rounded-[1.7rem] text-lg font-bold shadow-[0_20px_50px_rgba(255,96,74,0.28)]" onClick={resetGame}>
            <RefreshCw size={24} />
            같은 멤버로 한 판 더
          </Button>
          <div className="rounded-[1.4rem] border border-white/80 bg-white/65 px-5 py-4 text-left text-sm leading-6 text-foreground/68 backdrop-blur-xl break-keep">
            지금 멤버 그대로 바로 다시 돌릴 수 있습니다. 이번엔 누가 웃으면서 카드 꺼낼지 한 판 더 보세요.
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 sm:bottom-6 sm:right-6">
        <Button variant="outline" className="h-12 rounded-full border-white/80 bg-white/90 px-4 font-semibold shadow-[0_18px_40px_rgba(16,24,40,0.16)] backdrop-blur-xl" onClick={onBack}>
          <ArrowLeft size={16} className="mr-2" /> 이전
        </Button>
        <Button className="h-12 rounded-full bg-white/90 px-4 font-semibold text-foreground shadow-[0_18px_40px_rgba(16,24,40,0.16)] backdrop-blur-xl hover:bg-white" onClick={onHome}>
          <Home size={16} className="mr-2" /> 메인
        </Button>
      </div>
    </div>
  );
};
