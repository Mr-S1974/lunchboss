"use client";

import { useEffect, useState } from "react";
import { useGame } from "./game-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, RefreshCw, PartyPopper, Wallet, ListChecks, Home } from "lucide-react";
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
    "오늘은 통 크게 한 번 갑니다. 다음 점심은 꼭 회수하시길 바랍니다.",
    "월말은 잠시 잊고, 오늘은 런치 히어로로 기록됩니다.",
  ],
  "법카 사냥꾼 대리": [
    "역시 결제 동선이 가장 빠른 분답게 오늘의 주인공이 되셨습니다.",
    "타이밍 좋게 카드가 열렸습니다. 오늘 점심 분위기까지 챙겨주세요.",
  ],
  "법카 장전 과장": [
    "든든한 결단력으로 오늘 식사의 품격을 책임지게 되셨습니다.",
    "역시 준비된 리더는 결제 순간에도 흔들리지 않습니다.",
  ],
  "허허 부장": [
    "여유로운 미소와 함께 오늘 점심을 크게 한 번 쏘는 날입니다.",
    "한마디로 믿고 먹는 점심. 오늘의 보스 자리가 잘 어울립니다.",
  ],
  "커피 요정": [
    "커피에 이어 점심까지 챙기는 진정한 오피스 요정이 되셨습니다.",
    "팀 분위기를 부드럽게 살리는 오늘의 결제 요정입니다.",
  ],
  default: [
    "오늘 점심은 이분이 분위기까지 책임집니다.",
    "가볍게 시작했지만 결과만큼은 제법 진지합니다. 오늘의 보스가 결정됐습니다.",
  ],
};

const digitsOnly = (value: string) => value.replace(new RegExp("[^0-9]", "g"), "");

const getCommendation = (name: string, character: string) => {
  const pool = COMMENDATIONS[character] || COMMENDATIONS.default;
  const selected = pool[Math.floor(Math.random() * pool.length)] || COMMENDATIONS.default[0];
  return name + "님, " + selected;
};

export const ResultScreen = () => {
  const { winner, winningAmount, allResults, resetGame, fullReset } = useGame();
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

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-12 text-center animate-in zoom-in-95 duration-500">
        <div className="space-y-3">
          <div className="mx-auto inline-flex items-center rounded-full border border-white/70 bg-white/70 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-secondary shadow-[0_10px_30px_rgba(16,24,40,0.08)] backdrop-blur-xl">
            Today Lunch Boss
          </div>
          <div className="space-y-1">
            <h1 className="hero-gradient bg-clip-text text-5xl font-black text-transparent">결과 발표</h1>
            <p className="text-sm font-semibold text-foreground/65">오늘 식사 텐션을 가져갈 주인공이 정해졌습니다.</p>
          </div>
        </div>

        <Card className="relative overflow-visible rounded-[3.5rem] border-[12px] border-primary/85 bg-white/92 shadow-[0_30px_90px_rgba(255,96,74,0.28)] backdrop-blur-xl">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <div className="relative">
              <div className="soft-glow flex h-32 w-32 items-center justify-center rounded-full bg-[linear-gradient(135deg,hsl(var(--primary))_0%,hsl(var(--accent))_55%,hsl(var(--secondary))_100%)]">
                <Crown size={60} className="text-white drop-shadow-lg" />
              </div>
              <div className="absolute -right-8 -top-4 animate-bounce">
                <Badge className="rotate-12 rounded-xl border-4 border-black bg-[hsl(var(--highlight))] px-4 py-2 text-sm font-black text-black shadow-xl">
                  {bosses.length > 1 ? "JOINT BOSS" : "LUNCH BOSS"}
                </Badge>
              </div>
            </div>

            <div className="text-center">
              <div className="mb-1 text-3xl font-black text-foreground">
                {bosses.length > 1 ? bosses.map((b) => b.participant.name).join(", ") : winner.name}
              </div>
              <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
                {bosses.length > 1 ? "공동 주인공 탄생" : winner.character}
              </div>
            </div>

            {winningAmount && (
              <div className="flex w-full flex-col items-center gap-1 rounded-3xl border border-accent/20 bg-[linear-gradient(135deg,rgba(255,96,74,0.08),rgba(0,209,178,0.14))] p-3">
                <div className="flex items-center gap-2 text-xs font-black text-accent">
                  <Wallet size={16} />
                  <span>최종 결제 금액</span>
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
                <p className="text-sm italic leading-relaxed text-foreground/80">{commendation}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {allResults.length > 0 && (
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-2 px-2 font-black text-primary">
              <ListChecks size={20} />
              <h3>전체 참가자 결과</h3>
            </div>
            <ScrollArea className="max-h-[400px] rounded-[2.5rem] border border-white/80 bg-white/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-md">
              <div className="space-y-2 pr-2">
                {allResults.map((res, i) => {
                  const isBoss = (parseInt(digitsOnly(res.amount), 10) || 0) === maxVal;
                  return (
                    <div
                      key={res.participant.id}
                      className={"flex items-center justify-between rounded-2xl border p-4 transition-all " + (isBoss ? "border-primary/30 bg-[linear-gradient(135deg,rgba(255,96,74,0.12),rgba(255,196,61,0.16))] shadow-sm" : "border-white/80 bg-white/92")}
                    >
                      <div className="flex items-center gap-3">
                        <div className={"flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold " + (isBoss ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                          {isBoss ? <Crown size={14} /> : i + 1}
                        </div>
                        <div>
                          <div className="text-sm font-black">{res.participant.name}</div>
                          <div className="text-[10px] font-bold text-muted-foreground">{res.participant.character}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={"text-sm font-black " + (isBoss ? "text-accent" : "text-primary")}>{res.amount}원</div>
                        {isBoss && <Badge className="h-4 border-none bg-accent text-[9px] font-bold">BOSS</Badge>}
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
            같은 인원으로 다시 하기
          </Button>
          <div className="rounded-[1.4rem] border border-white/80 bg-white/65 px-5 py-4 text-left text-sm leading-6 text-foreground/68 backdrop-blur-xl">
            참가자 구성을 유지한 채 바로 다음 판으로 넘어갈 수 있습니다. 인원을 바꾸려면 아래에서 처음 화면으로 돌아가세요.
          </div>
        </div>

        <Button variant="ghost" className="mb-8 h-12 gap-2 rounded-full font-bold text-muted-foreground hover:bg-white/40" onClick={fullReset}>
          <Home size={18} /> 처음부터 하기 (인원 재설정)
        </Button>
      </div>
    </div>
  );
};
