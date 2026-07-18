// ============================================================
// StatCard — Compact stat display
// ============================================================

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { audio } from '../../utils/audio';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  delay?: number;
  onClick?: () => void;
}

export function StatCard({
  icon,
  label,
  value,
  subtitle,
  trend,
  className = '',
  delay = 0,
  onClick,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{ duration: 0.4, delay }}
      onClick={() => {
        if (onClick) {
          audio.playClick();
          onClick();
        }
      }}
      className={`
        bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3
        flex flex-col gap-1
        ${onClick ? 'cursor-pointer hover:bg-white/10 transition-colors' : ''}
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-lg font-bold text-white">{value}</span>
        {trend && (
          <span
            className={`text-xs font-semibold ${
              trend === 'up'
                ? 'text-emerald-400'
                : trend === 'down'
                ? 'text-red-400'
                : 'text-slate-400'
            }`}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
      {subtitle && (
        <span className="text-[10px] text-slate-500 font-medium">{subtitle}</span>
      )}
    </motion.div>
  );
}
