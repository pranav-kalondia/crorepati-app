// ============================================================
// Become a Crorepati — Type Definitions
// ============================================================

// --- Career ---
export type CareerCategory =
  | 'graduate'
  | 'software_engineer'
  | 'interior_designer'
  | 'government_officer'
  | 'freelancer'
  | 'business_owner'
  | 'doctor'
  | 'teacher'
  | 'trader'
  | 'architect'
  | 'chartered_accountant'
  | 'lawyer'
  | 'content_creator'
  | 'data_scientist'
  | 'banker';

export interface Career {
  id: CareerCategory;
  name: string;
  emoji: string;
  baseSalary: number;
  salaryGrowthRate: number; // annual % growth
  promotionChance: number; // 0-1
  riskLevel: 'low' | 'medium' | 'high';
  jobSecurity: number; // 0-100
  description: string;
  requiredKnowledge: number;
  bonusChance: number; // 0-1
  layoffChance: number; // 0-1
}

// --- Investment ---
export type InvestmentType =
  | 'mutual_fund'
  | 'stocks'
  | 'fixed_deposit'
  | 'government_bond'
  | 'gold'
  | 'real_estate'
  | 'business'
  | 'startup'
  | 'crypto';

export interface InvestmentOption {
  id: string;
  name: string;
  type: InvestmentType;
  emoji: string;
  description: string;
  minAmount: number;
  risk: 'low' | 'medium' | 'high' | 'very_high';
  expectedReturn: number; // annual %
  volatility: number; // 0-1
  holdingPeriod: number; // recommended years
  liquidity: 'high' | 'medium' | 'low';
  requiredKnowledge: number;
}

export interface PlayerInvestment {
  id: string;
  optionId: string;
  name: string;
  type: InvestmentType;
  amountInvested: number;
  currentValue: number;
  yearInvested: number;
  returns: number; // total % return
}

// --- Scam ---
export type ScamCategory =
  | 'fake_investment_app'
  | 'ponzi_scheme'
  | 'lottery_scam'
  | 'registration_fee'
  | 'fake_job'
  | 'phishing_sms'
  | 'fake_bank_call'
  | 'fake_govt_call'
  | 'fake_crypto'
  | 'pyramid_scheme'
  | 'fake_real_estate'
  | 'tech_support'
  | 'referral_scam';

export interface InvestigationOption {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  effectiveness: number; // 0-1, how much it reveals
  description: string;
}

export interface Scam {
  id: string;
  name: string;
  category: ScamCategory;
  emoji: string;
  description: string;
  pitch: string; // the enticing offer text
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  amountRequested: number;
  amountLost: number; // actual loss if fallen for
  trustImpact: number; // negative number
  redFlags: string[];
  investigationOptions: InvestigationOption[];
  learnMore: {
    howItWorks: string;
    warningSigns: string[];
    howToStaySafe: string;
  };
}

export type ScamDecision = 'go_for_it' | 'investigate' | 'ignore';

// --- Life Events ---
export type LifeEventCategory =
  | 'positive'
  | 'negative'
  | 'neutral'
  | 'opportunity'
  | 'crisis';

export interface LifeEvent {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: LifeEventCategory;
  financialImpact: number; // positive = gain, negative = loss
  trustImpact: number;
  knowledgeImpact: number;
  minAge: number;
  maxAge: number;
  probability: number; // 0-1
  choices?: LifeEventChoice[];
}

export interface LifeEventChoice {
  id: string;
  text: string;
  financialImpact: number;
  trustImpact: number;
  knowledgeImpact: number;
  description: string;
}

// --- Market ---
export interface MarketState {
  stocks: number; // % change
  mutualFunds: number;
  gold: number;
  property: number;
  crypto: number;
  fixedDeposit: number;
  governmentBond: number;
  inflation: number;
  cycle: 'bull' | 'bear' | 'neutral';
  year: number;
}

// --- Timeline ---
export type TimelineEventType =
  | 'career'
  | 'investment'
  | 'scam_avoided'
  | 'scam_fallen'
  | 'life_event'
  | 'milestone'
  | 'market'
  | 'achievement';

export interface TimelineEntry {
  id: string;
  age: number;
  year: number;
  type: TimelineEventType;
  title: string;
  description: string;
  financialImpact: number;
  emoji: string;
}

// --- Achievements ---
export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  condition: string; // human-readable condition
  unlocked: boolean;
  unlockedAtAge?: number;
}

// --- Portfolio ---
export interface PortfolioAllocation {
  cash: number;
  emergencyFund: number;
  stocks: number;
  mutualFunds: number;
  gold: number;
  property: number;
  business: number;
  fixedDeposit: number;
  governmentBond: number;
  crypto: number;
}

// --- Player Stats ---
export interface PlayerStats {
  scamsAvoided: number;
  scamsFallenFor: number;
  totalScamLoss: number;
  totalInvestmentGains: number;
  totalSalaryEarned: number;
  totalTaxPaid: number;
  bestInvestment: string | null;
  worstInvestment: string | null;
  bestDecision: string | null;
  worstDecision: string | null;
  yearsPlayed: number;
  careerChanges: number;
  promotions: number;
  lifeEventsExperienced: number;
}

// --- Leaderboard ---
export interface LeaderboardEntry {
  name: string;
  netWorth: number;
  age: number;
  career: string;
  date: string;
  won: boolean;
}

// --- Game Phase ---
export type GamePhase =
  | 'idle'
  | 'income'
  | 'life_event'
  | 'life_event_choice'
  | 'investment_opportunity'
  | 'scam_encounter'
  | 'scam_investigation'
  | 'scam_result'
  | 'market_update'
  | 'year_summary'
  | 'victory'
  | 'gameover';

// --- Year Summary ---
export interface YearSummary {
  year: number;
  age: number;
  incomeEarned: number;
  expenses: number;
  investmentReturns: number;
  netWorthChange: number;
  netWorth: number;
  events: string[];
}

// --- Master Game State ---
export interface GameState {
  // Player
  playerName: string;
  age: number;
  year: number;
  startYear: number;

  // Finances
  cash: number;
  emergencyFund: number;
  loans: number;
  netWorth: number;
  netWorthHistory: { year: number; amount: number }[];

  // Career
  career: Career;
  salary: number;
  yearsInCareer: number;

  // Scores
  trustScore: number; // 0-100
  knowledge: number; // 0-100

  // Portfolio
  investments: PlayerInvestment[];
  portfolioAllocation: PortfolioAllocation;

  // Game
  gamePhase: GamePhase;
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
  hasWon: boolean;

  // Current round
  currentLifeEvent: LifeEvent | null;
  currentScam: Scam | null;
  currentInvestmentOpportunity: InvestmentOption | null;
  currentMarketUpdate: MarketState | null;
  currentYearSummary: YearSummary | null;

  // History
  timeline: TimelineEntry[];
  achievements: Achievement[];
  stats: PlayerStats;
  marketHistory: MarketState[];

  // Leaderboard
  leaderboard: LeaderboardEntry[];
}

// --- Store Actions ---
export interface GameActions {
  // Game flow
  startGame: (playerName: string) => void;
  resetGame: () => void;
  advanceYear: () => void;
  setGamePhase: (phase: GamePhase) => void;

  // Life events
  handleLifeEvent: (choiceId?: string) => void;
  dismissLifeEvent: () => void;

  // Investments
  makeInvestment: (optionId: string, amount: number) => void;
  sellInvestment: (investmentId: string) => void;
  dismissInvestmentOpportunity: () => void;

  // Scams
  handleScamDecision: (decision: ScamDecision) => void;
  investigateScam: (methodId: string) => void;
  dismissScamResult: () => void;

  // Career
  changeCareer: (careerId: CareerCategory) => void;

  // Market
  acknowledgeMarketUpdate: () => void;

  // Year summary
  acknowledgeYearSummary: () => void;

  // Persistence
  saveGame: () => void;
  loadGame: () => boolean;

  // Leaderboard
  addToLeaderboard: (entry: LeaderboardEntry) => void;

  // Utility
  updateNetWorth: () => void;
}
