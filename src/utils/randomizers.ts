// ============================================================
// Randomization Utilities
// ============================================================

import type {
  LifeEvent,
  Scam,
  InvestmentOption,
  MarketState,
} from '../types';
import { LIFE_EVENTS } from '../data/lifeEvents';
import { SCAMS } from '../data/scams';
import { INVESTMENT_OPTIONS } from '../data/investments';

/**
 * Weighted random selection from an array.
 */
export function weightedRandom<T>(
  items: T[],
  weights: number[]
): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) return items[i];
  }

  return items[items.length - 1];
}

/**
 * Get a random life event appropriate for the player's current state.
 */
export function getRandomLifeEvent(
  age: number,
  _trustScore: number,
  usedEventIds: string[] = []
): LifeEvent | null {
  const eligible = LIFE_EVENTS.filter(
    (event) =>
      age >= event.minAge &&
      age <= event.maxAge &&
      !usedEventIds.includes(event.id) &&
      Math.random() < event.probability
  );

  if (eligible.length === 0) {
    // Fallback: pick any age-appropriate event
    const fallback = LIFE_EVENTS.filter(
      (event) => age >= event.minAge && age <= event.maxAge
    );
    if (fallback.length === 0) return null;
    return fallback[Math.floor(Math.random() * fallback.length)];
  }

  return eligible[Math.floor(Math.random() * eligible.length)];
}

/**
 * Get a random scam based on trust score.
 * Lower trust = more frequent scams.
 */
export function getRandomScam(
  trustScore: number,
  knowledge: number
): Scam | null {
  // Higher trust = lower chance of encountering scams
  const scamChance = Math.max(0.15, 0.6 - trustScore / 200);
  if (Math.random() > scamChance) return null;

  // Filter scams based on knowledge (higher knowledge = easier scams filtered out)
  const eligible = SCAMS.filter((scam) => {
    if (knowledge > 70 && scam.riskLevel === 'low') return Math.random() < 0.2;
    if (knowledge > 50 && scam.riskLevel === 'medium') return Math.random() < 0.5;
    return true;
  });

  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)];
}

/**
 * Get a random investment opportunity based on knowledge level.
 */
export function getRandomInvestmentOpportunity(
  knowledge: number
): InvestmentOption | null {
  const investmentChance = 0.7; // 70% chance each year
  if (Math.random() > investmentChance) return null;

  const eligible = INVESTMENT_OPTIONS.filter(
    (inv) => knowledge >= inv.requiredKnowledge
  );

  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)];
}

/**
 * Generate a random market update.
 */
export function getRandomMarketUpdate(
  year: number,
  previousMarket?: MarketState | null
): MarketState {
  // Determine market cycle
  const cycleRandom = Math.random();
  let cycle: 'bull' | 'bear' | 'neutral';

  if (previousMarket) {
    // Tend to stay in same cycle with 60% chance, shift with 40%
    if (cycleRandom < 0.6) {
      cycle = previousMarket.cycle;
    } else if (cycleRandom < 0.8) {
      cycle = 'neutral';
    } else {
      cycle = previousMarket.cycle === 'bull' ? 'bear' : 'bull';
    }
  } else {
    cycle = cycleRandom < 0.4 ? 'bull' : cycleRandom < 0.7 ? 'neutral' : 'bear';
  }

  const bullBias = cycle === 'bull' ? 1.3 : cycle === 'bear' ? 0.6 : 1.0;

  return {
    stocks: randomReturn(-15, 25) * bullBias,
    mutualFunds: randomReturn(-8, 18) * bullBias,
    gold: randomReturn(-5, 15) * (cycle === 'bear' ? 1.3 : 0.9),
    property: randomReturn(-3, 12) * bullBias,
    crypto: randomReturn(-40, 80) * bullBias,
    fixedDeposit: randomReturn(5, 8),
    governmentBond: randomReturn(6, 9),
    inflation: randomReturn(3, 8),
    cycle,
    year,
  };
}

/**
 * Generate a random return within a range.
 */
function randomReturn(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 10) / 10;
}

/**
 * Generate a unique ID.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Random integer between min and max (inclusive).
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Random boolean with given probability.
 */
export function randomChance(probability: number): boolean {
  return Math.random() < probability;
}
