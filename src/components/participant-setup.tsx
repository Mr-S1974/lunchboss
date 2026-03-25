
"use client";

import { useState, useEffect } from 'react';
import { useGame, Participant, CharacterType } from './game-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { User, ArrowLeft, Users, UserPlus, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const CHARACTERS: CharacterType[] = ['텅장 사원', '법카 사냥꾼 대리', '법카 장전 과장', '허허 부장', '커피 요정'];
const FUNNY_NAMES = [
  '법카 슬래셔', '영수증 콜렉터', '메뉴 결정 장애', '한입만 빌런', 
  '프로 혼밥러', '간식 요정', '커피 셔틀', '도시락 마스터', 
  '맛집 내비게이션', '카드 슬래셔', '점심의 지배자', '퇴근 갈망러'
];

export const ParticipantSetup = ({ onNext }: { onNext: () => void }) => {
  const { participants, setParticipants, updateParticipant, resetGame } = useGame();
  const [step, setStep] = useState<'count' | 'names'>('count');
  const [count, setCount] = useState<number>(0);
  const [inputName, setInputName] = useState('');
  const [selectedChar, setSelectedChar] = useState<CharacterType>(CHARACTERS[0]);

  // 인원수 선택 시 초기 슬롯 생성 및 가명 배정
  const handleCountSelect = (n: number) => {
    setCount(n);
    const shuffledNames = [...FUNNY_NAMES].sort(() => Math.random() - 0.5);
    const initialSlots: Participant[] = Array.from({ length: n }, (_, i) => ({
      id: `slot-${i}`,
      name: shuffledNames[i % shuffledNames.length],
      character: CHARACTERS[i % CHARACTERS.length]
    }));
    setParticipants(initialSlots);
    setStep('names');
  };

  // 상단 입력창에서 추가 시 첫 번째 "가명"인 칸부터 자동 입력 (사용자가 직접 수정한 칸은 제외하는 로직 대신 단순 순차 입력)
  const handleQuickAdd = () => {
    if (!inputName.trim()) return;

    // 비어있거나 가명인 상태인 첫 번째 칸 찾기 (여기서는 단순하게 비어있지 않은 첫 번째 가명 슬롯을 덮어씌움)
    const targetIndex = participants.findIndex(p => FUNNY_NAMES.includes(p.name) || p.name === '');
    const finalIndex = targetIndex === -1 ? 0 : targetIndex;
    
    const slot = participants[finalIndex];
    if (slot) {
      updateParticipant(slot.id, inputName, selectedChar);
      setInputName('');
      setSelectedChar(CHARACTERS[(CHARACTERS.indexOf(selectedChar) + 1) % CHARACTERS.length]);
    }
  };

  const isReady = participants.length > 0 && participants.every(p => p.name.trim() !== "");

  if (step === 'count') {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto p-6 gap-8 animate-in fade-in zoom-in-95">
        <div className="text-center space-y-2">
          <div className="bg-primary/10 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-primary shadow-inner border-4 border-white">
            <Users size={48} />
          </div>
          <h2 className="text-4xl font-black text-primary sunny-text">멤버 인원수</h2>
          <p className="font-bold text-muted-foreground">오늘 몇 분이서 식사하시나요?</p>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
            <Button 
              key={n} 
              variant="outline" 
              className="h-24 text-2xl font-black rounded-[2rem] border-4 hover:border-primary hover:bg-primary/5 transition-all card-hover bg-white shadow-sm"
              onClick={() => handleCountSelect(n)}
            >
              {n}명
            </Button>
          ))}
        </div>
        
        <Button variant="ghost" onClick={resetGame} className="font-bold text-muted-foreground mt-4">메인으로 돌아가기</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-md mx-auto p-6 gap-6 relative z-10 animate-in slide-in-from-right-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setStep('count')} className="rounded-full bg-white/50 shadow-sm border-2 border-white">
          <ArrowLeft />
        </Button>
        <div className="flex flex-col">
          <h2 className="text-3xl font-black sunny-text text-primary">멤버 정보 확인</h2>
          <p className="text-xs font-bold text-muted-foreground italic flex items-center gap-1">
            <Sparkles size={12} className="text-yellow-500" /> 가명이 자동 배정되었습니다! 직접 수정도 가능해요.
          </p>
        </div>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-4 border-primary/10 rounded-[2rem] p-2 shadow-xl overflow-hidden">
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="이름을 입력하고 엔터!" 
              value={inputName} 
              onChange={(e) => setInputName(e.target.value)}
              className="bg-white border-2 border-primary/20 h-14 rounded-2xl focus:ring-primary font-bold text-lg"
              onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
            />
            <Button onClick={handleQuickAdd} className="h-14 px-6 rounded-2xl hero-gradient soft-glow font-bold gap-2">
              <UserPlus size={20} />
            </Button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CHARACTERS.map(char => (
              <Badge 
                key={char} 
                variant={selectedChar === char ? "default" : "outline"}
                className={`cursor-pointer whitespace-nowrap px-4 py-2.5 text-xs font-bold transition-all border-2 ${selectedChar === char ? 'scale-105 border-primary bg-primary shadow-md' : 'opacity-60 border-primary/20 bg-white'}`}
                onClick={() => setSelectedChar(char)}
              >
                {char}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <ScrollArea className="flex-1 bg-white/30 backdrop-blur-sm rounded-[2.5rem] border-4 border-white p-4 shadow-inner">
        <div className="space-y-3">
          {participants.map((p, idx) => (
            <Card key={p.id} className={`bg-white/90 border-2 transition-all rounded-2xl ${FUNNY_NAMES.includes(p.name) ? 'border-dashed border-primary/30' : 'border-primary/20 shadow-sm'}`}>
              <CardContent className="p-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl border-2 shrink-0 transition-colors ${!FUNNY_NAMES.includes(p.name) ? 'bg-primary text-white border-primary shadow-md' : 'bg-muted text-muted-foreground border-transparent'}`}>
                    {p.name ? p.name[0] : idx + 1}
                  </div>
                  <div className="flex-1">
                    <Input 
                      value={p.name}
                      placeholder={`${idx + 1}번 멤버 이름`}
                      onChange={(e) => updateParticipant(p.id, e.target.value)}
                      className={`h-8 border-none bg-transparent font-black text-xl p-0 focus-visible:ring-0 ${FUNNY_NAMES.includes(p.name) ? 'text-muted-foreground italic' : 'text-foreground'}`}
                    />
                    <div className="text-[10px] font-black text-secondary uppercase tracking-widest mt-0.5">{p.character}</div>
                  </div>
                </div>
                {!FUNNY_NAMES.includes(p.name) && p.name !== "" && (
                   <Badge variant="secondary" className="bg-secondary/20 text-secondary border-none font-black px-2 py-0.5">OK</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <Button 
        className="w-full py-9 text-2xl font-black hero-gradient soft-glow rounded-[2rem] disabled:opacity-50 shadow-lg" 
        disabled={!isReady}
        onClick={onNext}
      >
        게임하러 가기!
      </Button>
    </div>
  );
};
