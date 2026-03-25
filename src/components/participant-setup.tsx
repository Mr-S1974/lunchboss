"use client";

import { useState } from 'react';
import { useGame, Participant, CharacterType } from './game-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, User, ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const CHARACTERS: CharacterType[] = ['텅장 사원', '법카 사냥꾼 대리', '법카 장전 과장', '허허 부장', '커피 요정'];

export const ParticipantSetup = ({ onNext }: { onNext: () => void }) => {
  const { participants, addParticipant, removeParticipant, resetGame } = useGame();
  const [name, setName] = useState('');
  const [selectedChar, setSelectedChar] = useState<CharacterType>(CHARACTERS[0]);

  const handleAdd = () => {
    if (name.trim()) {
      addParticipant(name, selectedChar);
      setName('');
    }
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto p-6 gap-6 relative z-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={resetGame}>
          <ArrowLeft />
        </Button>
        <h2 className="text-2xl font-bold font-headline neon-text">Who's Hungry?</h2>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input 
            placeholder="이름 입력..." 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="bg-card/50 border-primary/30"
          />
          <Button size="icon" onClick={handleAdd} className="neon-glow">
            <Plus />
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CHARACTERS.map(char => (
            <Badge 
              key={char} 
              variant={selectedChar === char ? "default" : "outline"}
              className={`cursor-pointer whitespace-nowrap px-4 py-2 text-xs transition-all ${selectedChar === char ? 'scale-105' : 'opacity-60'}`}
              onClick={() => setSelectedChar(char)}
            >
              {char}
            </Badge>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1 bg-card/20 rounded-xl border border-white/5 p-4">
        <div className="space-y-3">
          {participants.length === 0 && (
            <div className="text-center py-10 opacity-30 italic">참가자를 추가해주세요!</div>
          )}
          {participants.map((p) => (
            <Card key={p.id} className="bg-card/50 border-white/10 hover:border-primary/50 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.character}</div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive/50 hover:text-destructive" onClick={() => removeParticipant(p.id)}>
                  <Trash2 size={18} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <Button 
        className="w-full py-6 text-lg font-bold hero-gradient neon-glow" 
        disabled={participants.length < 2}
        onClick={onNext}
      >
        게임 시작!
      </Button>
    </div>
  );
};