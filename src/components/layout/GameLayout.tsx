// ============================================================
// GameLayout — Shared layout with bottom navigation
// ============================================================

import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { BottomNav } from '../ui/BottomNav';
import { useGame } from '../../hooks/useGame';

export function GameLayout() {
  const game = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (game.hasWon) {
      navigate('/victory');
    } else if (game.gameOver) {
      navigate('/gameover');
    }
  }, [game.hasWon, game.gameOver, navigate]);

  return (
    <div className="min-h-screen bg-slate-950">
      <Outlet />
      <BottomNav />
    </div>
  );
}
