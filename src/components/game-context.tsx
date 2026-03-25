
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CharacterType = '텅장 사원' | '법카 사냥꾼 대리' | '법카 장전 과장' | '허허 부장' | '커피 요정';

export interface Participant {
  id: string;
  name: string;
  character: CharacterType;
}

export interface GameResult {
  participant: Participant;
  amount: string;
}

export type GameMode = 'ladder' | 'roulette' | 'tap' | null;

interface GameContextType {
  participants: Participant[];
  gameMode: GameMode;
  winner: Participant | null;
  winningAmount: string | null;
  allResults: GameResult[];
  setParticipants: (participants: Participant[]) => void;
  updateParticipant: (id: string, name: string, character?: CharacterType) => void;
  setGameMode: (mode: GameMode) => void;
  setFinalResults: (results: GameResult[]) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [participants, setParticipantsState] = useState<Participant[]>([]);
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [winner, setWinnerState] = useState<Participant | null>(null);
  const [winningAmount, setWinningAmount] = useState<string | null>(null);
  const [allResults, setAllResults] = useState<GameResult[]>([]);

  const setParticipants = (newParticipants: Participant[]) => {
    setParticipantsState(newParticipants);
  };

  const updateParticipant = (id: string, name: string, character?: CharacterType) => {
    setParticipantsState(prev => prev.map(p => p.id === id ? { ...p, name, character: character || p.character } : p));
  };

  const setFinalResults = (results: GameResult[]) => {
    setAllResults(results);
    
    // Find winner (max amount)
    let maxVal = -1;
    let currentWinner = results[0].participant;
    let currentAmount = results[0].amount;

    results.forEach(res => {
      const val = parseInt(res.amount.replace(/[^0-9]/g, '')) || 0;
      if (val > maxVal) {
        maxVal = val;
        currentWinner = res.participant;
        currentAmount = res.amount;
      }
    });

    setWinnerState(currentWinner);
    setWinningAmount(currentAmount);
  };

  const resetGame = () => {
    setGameMode(null);
    setWinnerState(null);
    setWinningAmount(null);
    setAllResults([]);
    setParticipantsState([]);
  };

  return (
    <GameContext.Provider value={{
      participants,
      gameMode,
      winner,
      winningAmount,
      allResults,
      setParticipants,
      updateParticipant,
      setGameMode,
      setFinalResults,
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
