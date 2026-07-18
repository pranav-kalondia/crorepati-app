// ============================================================
// Financial Calculation Utilities
// ============================================================

import type { PlayerInvestment, MarketState, PortfolioAllocation } from '../types';

/**
 * Calculate net worth from all assets and liabilities.
 */
export function calculateNetWorth(
  cash: number,
  emergencyFund: number,
  investments: PlayerInvestment[],
  loans: number
): number {
  const investmentTotal = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  return cash + emergencyFund + investmentTotal - loans;
}

/**
 * Calculate returns on an investment based on market conditions.
 */
export function calculateReturns(
  investment: PlayerInvestment,
  marketState: MarketState
): number {
  const marketReturn = getMarketReturnForType(investment.type, marketState);
  // Add some randomness (±3%)
  const randomFactor = (Math.random() - 0.5) * 0.06;
  const totalReturn = marketReturn + randomFactor;
  return investment.currentValue * totalReturn;
}

/**
 * Get the market return rate for an investment type.
 */
function getMarketReturnForType(
  type: string,
  market: MarketState
): number {
  switch (type) {
    case 'stocks':
      return market.stocks / 100;
    case 'mutual_fund':
      return market.mutualFunds / 100;
    case 'gold':
      return market.gold / 100;
    case 'real_estate':
      return market.property / 100;
    case 'crypto':
      return market.crypto / 100;
    case 'fixed_deposit':
      return market.fixedDeposit / 100;
    case 'government_bond':
      return market.governmentBond / 100;
    case 'business':
      return (market.stocks / 100 + 0.05) * (0.8 + Math.random() * 0.4);
    case 'startup':
      return (market.stocks / 100 + 0.1) * (0.5 + Math.random() * 1.0);
    default:
      return 0.05;
  }
}

/**
 * Simple income tax calculation (Indian slabs - simplified).
 */
export function calculateTax(income: number): number {
  if (income <= 300000) return 0;
  if (income <= 700000) return (income - 300000) * 0.05;
  if (income <= 1000000) return 20000 + (income - 700000) * 0.10;
  if (income <= 1200000) return 50000 + (income - 1000000) * 0.15;
  if (income <= 1500000) return 80000 + (income - 1200000) * 0.20;
  return 140000 + (income - 1500000) * 0.30;
}

/**
 * Calculate EMI for a loan.
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureYears: number
): number {
  const monthlyRate = annualRate / 12 / 100;
  const months = tenureYears * 12;
  if (monthlyRate === 0) return principal / months;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emi);
}

/**
 * Compound interest calculation.
 */
export function compoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  compoundsPerYear = 1
): number {
  return (
    principal *
    Math.pow(1 + annualRate / 100 / compoundsPerYear, compoundsPerYear * years)
  );
}

/**
 * Calculate portfolio allocation from investments.
 */
export function calculatePortfolioAllocation(
  cash: number,
  emergencyFund: number,
  investments: PlayerInvestment[]
): PortfolioAllocation {
  const allocation: PortfolioAllocation = {
    cash,
    emergencyFund,
    stocks: 0,
    mutualFunds: 0,
    gold: 0,
    property: 0,
    business: 0,
    fixedDeposit: 0,
    governmentBond: 0,
    crypto: 0,
  };

  for (const inv of investments) {
    switch (inv.type) {
      case 'stocks':
        allocation.stocks += inv.currentValue;
        break;
      case 'mutual_fund':
        allocation.mutualFunds += inv.currentValue;
        break;
      case 'gold':
        allocation.gold += inv.currentValue;
        break;
      case 'real_estate':
        allocation.property += inv.currentValue;
        break;
      case 'business':
      case 'startup':
        allocation.business += inv.currentValue;
        break;
      case 'fixed_deposit':
        allocation.fixedDeposit += inv.currentValue;
        break;
      case 'government_bond':
        allocation.governmentBond += inv.currentValue;
        break;
      case 'crypto':
        allocation.crypto += inv.currentValue;
        break;
    }
  }

  return allocation;
}

/**
 * Calculate progress towards the ₹1 Crore goal.
 */
export function calculateProgress(netWorth: number): number {
  const goal = 1_00_00_000; // 1 Crore
  const start = 10_000;
  if (netWorth <= start) return 0;
  if (netWorth >= goal) return 100;
  return ((netWorth - start) / (goal - start)) * 100;
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
