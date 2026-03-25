
"use client";

import { useState } from 'react';
import { useGame, Participant, CharacterType } from './game-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, User, ArrowLeft, Utensils } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const CHARACTERS: CharacterType[] = ['텅장 사원', '법카 사냥꾼 대리', '법카 장전 과장', '허허 부장', '커피 요정'];

export const ParticipantSetup = ({ onNext }: { onNext: () => void }) => {
  const { participants, addParticipant, updateParticipant, removeParticipant, resetGame } = useGame();
  const [name, setName] = useState('');
  const [selectedChar, setSelectedChar] = useState<CharacterType>(CHARACTERS[0]);

  const handleAdd = () => {
    if (name.trim()) {
      addParticipant(name, selectedChar);
      setName('');
    }
  };

  const readyParticipants = participants.filter(p => p.name.trim() !== "");

  return (
    <div className="flex flex-col h-full max-w-md mx-auto p-6 gap-6 relative z-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={resetGame} className="rounded-full hover:bg-white/50">
          <ArrowLeft />
        </Button>
        <div className="flex flex-col">
          <h2 className="text-3xl font-black sunny-text text-primary">점심 멤버 소환</h2>
          <p className="text-sm font-bold text-muted-foreground">함께 먹을 사람을 추가해주세요!</p>
        </div>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-4 border-primary/10 rounded-[2rem] p-2">
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="새 멤버 이름 입력" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="bg-white border-2 border-primary/20 h-12 rounded-xl focus:ring-primary font-bold"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <Button size="icon" onClick={handleAdd} className="h-12 w-12 rounded-xl hero-gradient soft-glow">
              <Plus />
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
          {participants.map((p) => (
            <Card key={p.id} className="bg-white/90 border-2 border-primary/5 hover:border-primary/30 transition-all card-hover rounded-2xl">
              <CardContent className="p-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border-2 border-primary/10 shrink-0">
                    {p.name ? p.name[0] : <User size={18} />}
                  </div>
                  <div className="flex-1">
                    <Input 
                      value={p.name}
                      placeholder="이름을 입력하세요"
                      onChange={(e) => updateParticipant(p.id, e.target.value)}
                      className="h-8 border-none bg-transparent font-black text-lg p-0 focus-visible:ring-0"
                    />
                    <div className="text-[10px] font-bold text-secondary uppercase tracking-wider">{p.character}</div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive/40 hover:text-destructive hover:bg-destructive/5 rounded-full shrink-0" onClick={() => removeParticipant(p.id)}>
                  <Trash2 size={18} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <Button 
        className="w-full py-8 text-2xl font-black hero-gradient soft-glow rounded-[2rem] disabled:opacity-50" 
        disabled={readyParticipants.length < 2}
        onClick={onNext}
      >
        보스 결정하기!
      </Button>
    </div>
  );
};
