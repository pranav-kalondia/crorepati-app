// ============================================================
// BottomNav — Mobile bottom navigation
// ============================================================

import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, PieChart, Clock, BookOpen } from 'lucide-react';

const navItems = [
  { path: '/game', icon: Home, label: 'Home' },
  { path: '/game/portfolio', icon: PieChart, label: 'Portfolio' },
  { path: '/game/timeline', icon: Clock, label: 'Timeline' },
  { path: '/game/learn', icon: BookOpen, label: 'Learn' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40">
      <div className="bg-slate-900/90 backdrop-blur-2xl border-t border-white/10">
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive =
              item.path === '/game'
                ? location.pathname === '/game'
                : location.pathname.startsWith(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl
                  transition-colors duration-200 min-w-[64px]
                  ${isActive ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute inset-0 bg-emerald-500/10 rounded-2xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon size={20} className="relative z-10" />
                <span className="text-[10px] font-semibold relative z-10">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        {/* Safe area bottom */}
        <div className="h-safe-bottom bg-slate-900/90" />
      </div>
    </nav>
  );
}
