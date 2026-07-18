// ============================================================
// Card — Glassmorphic card component
// ============================================================

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'highlight' | 'danger';
  padding?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  onClick?: () => void;
}

const variantClasses: Record<string, string> = {
  default: 'bg-white/5 border-white/10',
  gradient: 'bg-gradient-to-br from-white/10 to-white/5 border-white/15',
  highlight: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20',
  danger: 'bg-gradient-to-br from-red-500/10 to-rose-500/10 border-red-500/20',
};

const paddingClasses: Record<string, string> = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  animate = true,
  onClick,
}: CardProps) {
  const Component = animate ? motion.div : 'div';
  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
      }
    : {};

  return (
    <Component
      className={`
        rounded-3xl border backdrop-blur-xl
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${onClick ? 'cursor-pointer hover:bg-white/8 transition-colors' : ''}
        ${className}
      `}
      onClick={onClick}
      {...animationProps}
    >
      {children}
    </Component>
  );
}
