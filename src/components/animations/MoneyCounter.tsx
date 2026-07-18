// ============================================================
// MoneyCounter — Animated money display
// ============================================================

import { useAnimatedNumber } from '../../hooks/useAnimatedNumber';
import { formatCurrency } from '../../utils/formatters';

interface MoneyCounterProps {
  amount: number;
  compact?: boolean;
  className?: string;
  duration?: number;
}

export function MoneyCounter({
  amount,
  compact = false,
  className = '',
  duration = 800,
}: MoneyCounterProps) {
  const animated = useAnimatedNumber(amount, duration);

  return (
    <span className={className}>
      {formatCurrency(animated, compact)}
    </span>
  );
}
