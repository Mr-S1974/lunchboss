import { create } from 'zustand';

export type CharacterType = 'Penniless Intern' | 'Corp Card Hunter' | 'Card Loaded Manager' | 'Kind Director' | 'Coffee Junkie';

export interface Participant {
  id: string;
  name: string;
  character: CharacterType;
}

export type GameMode = 'ladder' | 'roulette' | 'shuffle' | null;

interface GameState {
  participants: Participant[];
  gameMode: GameMode;
  winner: Participant | null;
  addParticipant: (name: string, character: CharacterType) => void;
  removeParticipant: (id: string) => void;
  setGameMode: (mode: GameMode) => void;
  setWinner: (winner: Participant | null) => void;
  resetGame: () => void;
}

// Simple implementation of create to avoid adding another library if not strictly needed, 
// but using a standard pattern. Actually, I'll just use a plain object state or a simple custom hook for this app.
// Let's use a React Context instead for simplicity without external deps.
