
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
  winner: Participant | null; // Keep for legacy/single winner games like Tap
  winningAmount: string | null;
  allResults: GameResult[];
  setParticipants: (participants: Participant[]) => void;
  updateParticipant: (id: string, name: string, character?: CharacterType) => void;
  setGameMode: (mode: GameMode) => void;
  setFinalResults: (results: GameResult[]) => void;
  setWinner: (winner: Participant | null) => void;
  resetGame: () => void;
  fullReset: () => void;
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
    
    let maxVal = -1;
    let currentAmount = "0";

    results.forEach(res => {
      const val = parseInt(res.amount.replace(/[^0-9]/g, '')) || 0;
      if (val > maxVal) {
        maxVal = val;
        currentAmount = res.amount;
      }
    });

    // Find the first one to set as primary winner for AI prompt context
    const primaryWinner = results.find(r => (parseInt(r.amount.replace(/[^0-9]/g, '')) || 0) === maxVal)?.participant;

    setWinnerState(primaryWinner || results[0].participant);
    setWinningAmount(currentAmount);
  };

  const setWinner = (w: Participant | null) => {
    setWinnerState(w);
    setWinningAmount(null);
    setAllResults([]);
  };

  const resetGame = () => {
    setGameMode(null);
    setWinnerState(null);
    setWinningAmount(null);
    setAllResults([]);
    // Participant list is preserved to allow playing another game immediately
  };

  const fullReset = () => {
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
      setWinner,
      resetGame,
      fullReset
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
