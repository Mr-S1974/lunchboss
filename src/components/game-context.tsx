
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CharacterType = '텅장 사원' | '법카 사냥꾼 대리' | '법카 장전 과장' | '허허 부장' | '커피 요정';

export interface Participant {
  id: string;
  name: string;
  character: CharacterType;
}

export type GameMode = 'ladder' | 'roulette' | 'tap' | null;

interface GameContextType {
  participants: Participant[];
  gameMode: GameMode;
  winner: Participant | null;
  winningAmount: string | null;
  addParticipant: (name: string, character: CharacterType) => void;
  removeParticipant: (id: string) => void;
  setGameMode: (mode: GameMode) => void;
  setWinner: (winner: Participant | null, amount?: string | null) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: '김철수', character: '텅장 사원' },
    { id: '2', name: '이영희', character: '법카 장전 과장' },
    { id: '3', name: '박대리', character: '법카 사냥꾼 대리' },
  ]);
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [winner, setWinnerState] = useState<Participant | null>(null);
  const [winningAmount, setWinningAmount] = useState<string | null>(null);

  const addParticipant = (name: string, character: CharacterType) => {
    setParticipants(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), name, character }]);
  };

  const removeParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const setWinner = (winner: Participant | null, amount: string | null = null) => {
    setWinnerState(winner);
    setWinningAmount(amount);
  };

  const resetGame = () => {
    setGameMode(null);
    setWinnerState(null);
    setWinningAmount(null);
  };

  return (
    <GameContext.Provider value={{
      participants,
      gameMode,
      winner,
      winningAmount,
      addParticipant,
      removeParticipant,
      setGameMode,
      setWinner,
      resetGame
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
