"use client";

import { useState } from 'react';
import { useGame, Participant, CharacterType } from './game-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Home, Sparkles, UserPlus, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const CHARACTERS: CharacterType[] = ['텅장 사원', '법카 사냥꾼 대리', '법카 장전 과장', '허허 부장', '커피 요정'];
const FUNNY_NAMES = [
  '법카 슬래셔', '영수증 콜렉터', '메뉴 결정 장애', '한입만 빌런',
  '프로 혼밥러', '간식 요정', '커피 셔틀', '도시락 마스터',
  '맛집 내비게이션', '카드 슬래셔', '점심의 지배자', '퇴근 갈망러',
];

const COUNT_NOTES = [
  '이름은 자동으로 채워져서 바로 다음 단계로 넘어갈 수 있습니다.',
  '닉네임이 마음에 들지 않으면 참가자 화면에서 바로 수정할 수 있습니다.',
  '점심 전 짧은 시간에도 부담 없이 진행할 수 있는 흐름으로 구성했습니다.',
] as const;

export const ParticipantSetup = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const { participants, setParticipants, updateParticipant } = useGame();
  const [step, setStep] = useState<'count' | 'names'>('count');
  const [inputName, setInputName] = useState('');
  const [selectedChar, setSelectedChar] = useState<CharacterType>(CHARACTERS[0]);

  const handleCountSelect = (n: number) => {
    const shuffledNames = [...FUNNY_NAMES].sort(() => Math.random() - 0.5);
    const initialSlots: Participant[] = Array.from({ length: n }, (_, i) => ({
      id: 'slot-' + i,
      name: shuffledNames[i % shuffledNames.length],
      character: CHARACTERS[i % CHARACTERS.length],
    }));

    setParticipants(initialSlots);
    setStep('names');
  };

  const handleQuickAdd = () => {
    if (inputName.trim() === '') return;

    const targetIndex = participants.findIndex((p) => FUNNY_NAMES.includes(p.name) || p.name === '');
    const finalIndex = targetIndex === -1 ? 0 : targetIndex;
    const slot = participants[finalIndex];

    if (slot) {
      updateParticipant(slot.id, inputName, selectedChar);
      setInputName('');
      setSelectedChar(CHARACTERS[(CHARACTERS.indexOf(selectedChar) + 1) % CHARACTERS.length]);
    }
  };

  const isReady = participants.length > 0 && participants.every((p) => p.name.trim() !== '');
  const namedCount = participants.filter((p) => FUNNY_NAMES.includes(p.name) === false && p.name.trim() !== '').length;

  if (step === 'count') {
    return (
      <div className="mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center gap-6 px-5 py-8 sm:px-8 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:px-12">
        <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_rgba(16,24,40,0.10)] backdrop-blur-xl sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            <Users size={14} />
            Participant Setup
          </div>
          <h2 className="mt-6 font-headline text-4xl font-extrabold tracking-[-0.04em] text-foreground sm:text-5xl">
            먼저 인원 수를
            <br />
            가볍게 정해주세요
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
            팀 점심의 분위기를 깨지 않도록 준비 단계도 최대한 간단하게 구성했습니다. 인원만 고르면 자동 별칭이
            채워지고, 다음 화면에서 실제 이름으로 빠르게 정리할 수 있습니다.
          </p>

          <div className="mt-8 grid gap-3">
            {COUNT_NOTES.map((note) => (
              <div key={note} className="rounded-[1.4rem] border border-border/60 bg-background/80 px-4 py-4 text-sm leading-6 text-muted-foreground">
                {note}
              </div>
            ))}
          </div>

          <Button variant="ghost" onClick={onBack} className="mt-6 h-12 rounded-xl px-0 font-semibold text-muted-foreground hover:bg-transparent hover:text-foreground">
            <Home size={18} className="mr-2" /> 메인으로 돌아가기
          </Button>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-[#122033] p-6 text-white shadow-[0_24px_80px_rgba(12,18,28,0.16)] sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">Count</div>
              <h3 className="mt-2 font-headline text-2xl font-bold">오늘 식사 인원은 몇 명인가요</h3>
            </div>
            <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">2 - 10명</div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <Button
                key={n}
                variant="outline"
                className="h-24 rounded-[1.6rem] border border-white/15 bg-white/5 text-2xl font-bold text-white hover:bg-white hover:text-foreground"
                onClick={() => handleCountSelect(n)}
              >
                {n}명
              </Button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col gap-6 px-5 py-8 sm:px-8 lg:px-12">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/82 p-6 backdrop-blur-xl sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => setStep('count')} className="mt-1 rounded-full border border-white bg-white/70 shadow-sm">
            <ArrowLeft />
          </Button>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
              <Sparkles size={14} />
              Member Details
            </div>
            <h2 className="mt-4 font-headline text-4xl font-extrabold tracking-[-0.04em] text-foreground">자동 배정된 이름을 정리해주세요</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              비어 보이지 않도록 필요한 정보는 상단에 모으고, 실제 입력은 아래 리스트에서 빠르게 끝낼 수 있게 구성했습니다.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:min-w-[260px]">
          <div className="rounded-[1.4rem] bg-background/80 px-4 py-3 text-sm text-muted-foreground">
            총 {participants.length}명 중 {namedCount}명 입력 완료
          </div>
          <div className="rounded-[1.4rem] bg-secondary/10 px-4 py-3 text-sm font-semibold text-secondary">
            자동 별칭은 그대로 사용해도 되고, 실제 이름으로 바꿔도 됩니다.
          </div>
        </div>
      </div>

      <div className="grid flex-1 gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <Card className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/82 shadow-[0_20px_60px_rgba(16,24,40,0.08)] backdrop-blur-xl">
          <CardContent className="p-6 sm:p-7">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Quick Input</div>
            <h3 className="mt-3 font-headline text-2xl font-bold text-foreground">이름 빠르게 채우기</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              엔터 한 번으로 다음 미입력 슬롯에 바로 반영됩니다. 역할 배지도 함께 순환됩니다.
            </p>

            <div className="mt-6 flex gap-2">
              <Input
                placeholder="이름을 입력하고 엔터"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="h-14 rounded-2xl border-border/80 bg-background/70 text-base font-semibold"
                onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
              />
              <Button onClick={handleQuickAdd} className="hero-gradient soft-glow h-14 rounded-2xl px-5 font-semibold">
                <UserPlus size={18} className="mr-1" /> 추가
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {CHARACTERS.map((char) => {
                const selected = selectedChar === char;
                const badgeClass = selected
                  ? 'cursor-pointer rounded-full border-primary bg-primary px-4 py-2 text-xs font-semibold text-white transition-all'
                  : 'cursor-pointer rounded-full border-border/80 bg-background/70 px-4 py-2 text-xs font-semibold text-foreground/70 transition-all';

                return (
                  <Badge
                    key={char}
                    variant={selected ? 'default' : 'outline'}
                    className={badgeClass}
                    onClick={() => setSelectedChar(char)}
                  >
                    {char}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="rounded-[2rem] border border-white/70 bg-white/72 p-4 shadow-[0_20px_60px_rgba(16,24,40,0.08)] backdrop-blur-xl sm:p-5">
          <ScrollArea className="h-[52vh] pr-3 sm:h-[56vh]">
            <div className="space-y-3">
              {participants.map((p, idx) => {
                const isPlaceholder = FUNNY_NAMES.includes(p.name);
                const cardClass = isPlaceholder
                  ? 'rounded-[1.5rem] border border-dashed border-border/80 bg-background/70 transition-all'
                  : 'rounded-[1.5rem] border border-primary/15 bg-white shadow-sm transition-all';
                const iconClass = isPlaceholder
                  ? 'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted text-lg font-bold text-muted-foreground'
                  : 'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-white';
                const inputClass = isPlaceholder
                  ? 'h-8 border-none bg-transparent p-0 text-lg font-semibold italic text-muted-foreground focus-visible:ring-0'
                  : 'h-8 border-none bg-transparent p-0 text-lg font-semibold text-foreground focus-visible:ring-0';
                const badgeClass = isPlaceholder
                  ? 'rounded-full border-border/80 px-3 py-1 text-[11px] font-semibold text-muted-foreground'
                  : 'rounded-full border-secondary/20 bg-secondary/10 px-3 py-1 text-[11px] font-semibold text-secondary';

                return (
                  <Card key={p.id} className={cardClass}>
                    <CardContent className="flex items-center justify-between gap-3 p-4">
                      <div className="flex min-w-0 flex-1 items-center gap-4">
                        <div className={iconClass}>{p.name ? p.name[0] : idx + 1}</div>
                        <div className="min-w-0 flex-1">
                          <Input
                            value={p.name}
                            placeholder={String(idx + 1) + '번 멤버 이름'}
                            onChange={(e) => updateParticipant(p.id, e.target.value)}
                            className={inputClass}
                          />
                          <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary">{p.character}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className={badgeClass}>
                        {isPlaceholder ? 'AUTO' : 'READY'}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>

      <Button
        className="hero-gradient soft-glow h-16 w-full rounded-[1.4rem] text-lg font-bold shadow-lg disabled:opacity-50"
        disabled={isReady === false}
        onClick={onNext}
      >
        게임 선택으로 이동
      </Button>
    </div>
  );
};
