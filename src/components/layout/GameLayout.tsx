// ============================================================
// GameLayout — Shared layout with bottom navigation
// ============================================================

import { Outlet } from 'react-router-dom';
import { BottomNav } from '../ui/BottomNav';

export function GameLayout() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Outlet />
      <BottomNav />
    </div>
  );
}
