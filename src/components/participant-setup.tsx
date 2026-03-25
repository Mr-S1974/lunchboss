
"use client";

import { useState, useEffect } from 'react';
import { useGame, Participant, CharacterType } from './game-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { User, ArrowLeft, Users, UserPlus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const CHARACTERS: CharacterType[] = ['텅장 사원', '법카 사냥꾼 대리', '법카 장전 과장', '허허 부장', '커피 요정'];

export const ParticipantSetup = ({ onNext }: { onNext: () => void }) => {
  const { participants, setParticipants, updateParticipant, resetGame } = useGame();
  const [step, setStep] = useState<'count' | 'names'>('count');
  const [count, setCount] = useState<number>(0);
  const [inputName, setInputName] = useState('');
  const [selectedChar, setSelectedChar] = useState<CharacterType>(CHARACTERS[0]);

  // 인원수 선택 시 초기 슬롯 생성
  const handleCountSelect = (n: number) => {
    setCount(n);
    const initialSlots: Participant[] = Array.from({ length: n }, (_, i) => ({
      id: `slot-${i}`,
      name: '',
      character: CHARACTERS[i % CHARACTERS.length]
    }));
    setParticipants(initialSlots);
    setStep('names');
  };

  // 상단 입력창에서 추가 시 첫 번째 빈 칸부터 자동 입력
  const handleQuickAdd = () => {
    if (!inputName.trim()) return;

    const firstEmptyIndex = participants.findIndex(p => p.name === '');
    if (firstEmptyIndex !== -1) {
      const slot = participants[firstEmptyIndex];
      updateParticipant(slot.id, inputName, selectedChar);
      setInputName('');
      // 별칭도 다음걸로 미리 선택해주면 편함
      setSelectedChar(CHARACTERS[(CHARACTERS.indexOf(selectedChar) + 1) % CHARACTERS.length]);
    }
  };

  const isReady = participants.length > 0 && participants.every(p => p.name.trim() !== "");

  if (step === 'count') {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto p-6 gap-8 animate-in fade-in zoom-in-95">
        <div className="text-center space-y-2">
          <div className="bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 text-primary">
            <Users size={40} />
          </div>
          <h2 className="text-4xl font-black text-primary sunny-text">멤버 인원수</h2>
          <p className="font-bold text-muted-foreground">오늘 몇 분이서 식사하시나요?</p>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
            <Button 
              key={n} 
              variant="outline" 
              className="h-20 text-2xl font-black rounded-2xl border-4 hover:border-primary hover:bg-primary/5 transition-all card-hover"
              onClick={() => handleCountSelect(n)}
            >
              {n}명
            </Button>
          ))}
        </div>
        
        <Button variant="ghost" onClick={resetGame} className="font-bold text-muted-foreground">취소</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-md mx-auto p-6 gap-6 relative z-10 animate-in slide-in-from-right-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setStep('count')} className="rounded-full hover:bg-white/50">
          <ArrowLeft />
        </Button>
        <div className="flex flex-col">
          <h2 className="text-3xl font-black sunny-text text-primary">멤버 정보 입력</h2>
          <p className="text-sm font-bold text-muted-foreground">이름과 별칭을 채워주세요! ({participants.filter(p => p.name !== '').length}/{count})</p>
        </div>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-4 border-primary/10 rounded-[2rem] p-2 shadow-xl">
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="멤버 이름 입력" 
              value={inputName} 
              onChange={(e) => setInputName(e.target.value)}
              className="bg-white border-2 border-primary/20 h-12 rounded-xl focus:ring-primary font-bold"
              onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
            />
            <Button onClick={handleQuickAdd} className="h-12 px-6 rounded-xl hero-gradient soft-glow font-bold gap-2">
              <UserPlus size={18} /> 입력
            </Button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CHARACTERS.map(char => (
              <Badge 
                key={char} 
                variant={selectedChar === char ? "default" : "outline"}
                className={`cursor-pointer whitespace-nowrap px-4 py-2 text-sm font-bold transition-all border-2 ${selectedChar === char ? 'scale-105 border-primary bg-primary' : 'opacity-60 border-primary/20 bg-white'}`}
                onClick={() => setSelectedChar(char)}
              >
                {char}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <ScrollArea className="flex-1 bg-white/30 backdrop-blur-sm rounded-[2rem] border-4 border-white p-4 shadow-inner">
        <div className="space-y-3">
          {participants.map((p, idx) => (
            <Card key={p.id} className={`bg-white/90 border-2 transition-all rounded-2xl ${p.name ? 'border-primary/20 shadow-sm' : 'border-dashed border-muted-foreground/20 opacity-60'}`}>
              <CardContent className="p-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 shrink-0 transition-colors ${p.name ? 'bg-primary/10 text-primary border-primary/10' : 'bg-muted text-muted-foreground border-transparent'}`}>
                    {p.name ? p.name[0] : idx + 1}
                  </div>
                  <div className="flex-1">
                    <Input 
                      value={p.name}
                      placeholder={`${idx + 1}번 멤버 이름`}
                      onChange={(e) => updateParticipant(p.id, e.target.value)}
                      className="h-8 border-none bg-transparent font-black text-lg p-0 focus-visible:ring-0"
                    />
                    <div className="text-[10px] font-bold text-secondary uppercase tracking-wider">{p.character}</div>
                  </div>
                </div>
                {p.name && (
                   <Badge variant="secondary" className="bg-secondary/10 text-secondary border-none">완료</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <Button 
        className="w-full py-8 text-2xl font-black hero-gradient soft-glow rounded-[2rem] disabled:opacity-50" 
        disabled={!isReady}
        onClick={onNext}
      >
        준비 완료!
      </Button>
    </div>
  );
};
