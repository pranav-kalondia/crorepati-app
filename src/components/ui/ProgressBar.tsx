// ============================================================
// ProgressBar — Animated progress toward ₹1 Crore
// ============================================================

import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0-100
  showLabel?: boolean;
  height?: 'sm' | 'md' | 'lg';
  className?: string;
}

const heightClasses: Record<string, string> = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

export function ProgressBar({
  progress,
  showLabel = true,
  height = 'md',
  className = '',
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-slate-400 font-medium">₹10K</span>
          <span className="text-xs font-bold text-emerald-400">
            {clampedProgress.toFixed(1)}%
          </span>
          <span className="text-xs text-slate-400 font-medium">₹1Cr</span>
        </div>
      )}
      <div
        className={`w-full ${heightClasses[height]} bg-white/5 rounded-full overflow-hidden backdrop-blur-sm`}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 relative"
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-white/30 to-emerald-400/0 animate-shimmer" />
        </motion.div>
      </div>
    </div>
  );
}
