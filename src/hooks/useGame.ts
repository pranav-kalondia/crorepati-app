// ============================================================
// useGame — Convenience hook wrapping Zustand store
// ============================================================

import { useGameStore } from '../store/gameStore';
import { calculateProgress } from '../utils/calculations';

export function useGame() {
  const state = useGameStore();

  const progress = calculateProgress(state.netWorth);
  const yearsRemaining = 52 - state.age;
  const isVictory = state.hasWon;
  const isBankrupt = state.gameOver && !state.hasWon;
  const canAdvance = state.gamePhase === 'idle' && state.isPlaying && !state.gameOver;

  const totalInvestmentValue = state.investments.reduce(
    (sum, inv) => sum + inv.currentValue,
    0
  );

  const totalAssets = state.cash + state.emergencyFund + totalInvestmentValue;

  return {
    ...state,
    progress,
    yearsRemaining,
    isVictory,
    isBankrupt,
    canAdvance,
    totalInvestmentValue,
    totalAssets,
  };
}
