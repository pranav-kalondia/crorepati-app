// ============================================================
// Formatting Utilities — Indian number system
// ============================================================

/**
 * Formats a number as Indian Rupee currency.
 * Uses the Indian numbering system (lakhs, crores).
 * Example: 1000000 → ₹10,00,000
 */
export function formatCurrency(amount: number, compact = false): string {
  if (compact) {
    return formatCompactCurrency(amount);
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));

  const formatted = absAmount.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  });

  return `${isNegative ? '-' : ''}₹${formatted}`;
}

/**
 * Compact currency formatting.
 * ₹10K, ₹5.2L, ₹1.3Cr
 */
function formatCompactCurrency(amount: number): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const prefix = isNegative ? '-₹' : '₹';

  if (absAmount >= 1_00_00_000) {
    // Crores
    const crores = absAmount / 1_00_00_000;
    return `${prefix}${crores >= 10 ? crores.toFixed(0) : crores.toFixed(1)}Cr`;
  }

  if (absAmount >= 1_00_000) {
    // Lakhs
    const lakhs = absAmount / 1_00_000;
    return `${prefix}${lakhs >= 10 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`;
  }

  if (absAmount >= 1_000) {
    // Thousands
    const thousands = absAmount / 1_000;
    return `${prefix}${thousands >= 10 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
  }

  return `${prefix}${absAmount.toFixed(0)}`;
}

/**
 * Format a percentage with sign indicator.
 * Example: 12.5 → +12.5%
 */
export function formatPercent(value: number, showSign = true): string {
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

/**
 * Format age display.
 */
export function formatAge(age: number): string {
  return `${age} yrs`;
}

/**
 * Format year display.
 */
export function formatYear(year: number): string {
  return `Year ${year}`;
}

/**
 * Get a color class based on financial impact.
 */
export function getImpactColor(impact: number): string {
  if (impact > 0) return 'text-emerald-400';
  if (impact < 0) return 'text-red-400';
  return 'text-slate-400';
}

/**
 * Get a color class based on risk level.
 */
export function getRiskColor(risk: string): string {
  switch (risk) {
    case 'low':
      return 'text-emerald-400';
    case 'medium':
      return 'text-amber-400';
    case 'high':
      return 'text-orange-400';
    case 'very_high':
      return 'text-red-400';
    case 'extreme':
      return 'text-red-500';
    default:
      return 'text-slate-400';
  }
}

/**
 * Get a background color class based on risk level.
 */
export function getRiskBgColor(risk: string): string {
  switch (risk) {
    case 'low':
      return 'bg-emerald-400/20';
    case 'medium':
      return 'bg-amber-400/20';
    case 'high':
      return 'bg-orange-400/20';
    case 'very_high':
      return 'bg-red-400/20';
    case 'extreme':
      return 'bg-red-500/20';
    default:
      return 'bg-slate-400/20';
  }
}

/**
 * Format impact as currency with +/- sign.
 */
export function formatImpact(amount: number): string {
  const sign = amount >= 0 ? '+' : '';
  return `${sign}${formatCurrency(amount, true)}`;
}

/**
 * Truncate text with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
