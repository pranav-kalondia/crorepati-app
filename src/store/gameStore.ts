// ============================================================
// Zustand Game Store — State Management
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState,
  GameActions,
  GamePhase,
  CareerCategory,
  ScamDecision,
  PlayerInvestment,
  TimelineEntry,
  LeaderboardEntry,
} from '../types';
import { DEFAULT_CAREER, CAREERS } from '../data/careers';
import { ACHIEVEMENTS } from '../data/achievements';
import { INVESTMENT_OPTIONS } from '../data/investments';
import {
  calculateNetWorth,
  calculateReturns,
  calculateTax,
  calculatePortfolioAllocation,
  clamp,
} from '../utils/calculations';
import {
  getRandomLifeEvent,
  getRandomScam,
  getRandomInvestmentOpportunity,
  getRandomMarketUpdate,
  generateId,
  randomChance,
} from '../utils/randomizers';
import { BOSSES } from '../data/bosses';

// Simple helper for compact formatting inside the store
function formatCompact(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 10000000) return `₹${(abs / 10000000).toFixed(1)}Cr`;
  if (abs >= 100000) return `₹${(abs / 100000).toFixed(1)}L`;
  if (abs >= 1000) return `₹${(abs / 1000).toFixed(1)}K`;
  return `₹${abs}`;
}

// --- Achievement checker ---
function checkAchievementsForState(get: () => GameState & GameActions): void {
  const state = get();
  const updates: Record<string, boolean> = {};

  const nw = state.netWorth;
  if (nw >= 100000) updates['ach_lakhpati'] = true;
  if (nw >= 500000) updates['ach_5_lakh'] = true;
  if (nw >= 1000000) updates['ach_10_lakh'] = true;
  if (nw >= 5000000) updates['ach_50_lakh'] = true;
  if (nw >= 10000000) updates['ach_crorepati'] = true;

  if (state.investments.length > 0) updates['ach_first_investment'] = true;
  if (state.stats.scamsAvoided > 0) updates['ach_scam_dodger'] = true;
  if (state.stats.scamsAvoided >= 3) updates['ach_scam_detective'] = true;
  if (state.emergencyFund >= 100000) updates['ach_emergency_fund'] = true;
  if (state.stats.careerChanges >= 3) updates['ach_career_climb'] = true;
  if (state.knowledge >= 100) updates['ach_knowledge_guru'] = true;
  if (state.trustScore >= 90) updates['ach_trusted'] = true;

  const types = new Set(state.investments.map((i) => i.type));
  if (types.size >= 5) updates['ach_diversified'] = true;

  const newAchievements = state.achievements.map((a) => ({
    ...a,
    unlocked: a.unlocked || (updates[a.id] ?? false),
    unlockedAtAge: a.unlocked ? a.unlockedAtAge : updates[a.id] ? state.age : undefined,
  }));

  useGameStore.setState({ achievements: newAchievements });
}

// --- Initial State ---
const createInitialState = (): GameState => ({
  playerName: '',
  age: 22,
  year: 1,
  startYear: new Date().getFullYear(),
  cash: 10000,
  emergencyFund: 0,
  loans: 0,
  netWorth: 10000,
  netWorthHistory: [{ year: 0, amount: 10000 }],
  career: { ...DEFAULT_CAREER },
  salary: DEFAULT_CAREER.baseSalary,
  yearsInCareer: 0,
  trustScore: 50,
  knowledge: 0,
  investments: [],
  portfolioAllocation: {
    cash: 10000,
    emergencyFund: 0,
    stocks: 0,
    mutualFunds: 0,
    gold: 0,
    property: 0,
    business: 0,
    fixedDeposit: 0,
    governmentBond: 0,
    crypto: 0,
  },
  gamePhase: 'idle',
  isPlaying: false,
  isPaused: false,
  gameOver: false,
  hasWon: false,
  currentLifeEvent: null,
  currentScam: null,
  currentInvestmentOpportunity: null,
  currentMarketUpdate: null,
  currentYearSummary: null,
  activePhoneNotification: null,
  currentBossBattle: null,
  unlockedScamIds: [],
  scamRadarScore: 20,
  timeline: [],
  achievements: ACHIEVEMENTS.map((a) => ({ ...a })),
  stats: {
    scamsAvoided: 0,
    scamsFallenFor: 0,
    totalScamLoss: 0,
    totalInvestmentGains: 0,
    totalSalaryEarned: 0,
    totalTaxPaid: 0,
    bestInvestment: null,
    worstInvestment: null,
    bestDecision: null,
    worstDecision: null,
    yearsPlayed: 0,
    careerChanges: 0,
    promotions: 0,
    lifeEventsExperienced: 0,
  },
  marketHistory: [],
  leaderboard: [],
});

// --- Store ---
export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      // ==========================================
      // Game Flow
      // ==========================================

      startGame: (playerName: string) => {
        const initial = createInitialState();
        set({
          ...initial,
          playerName,
          isPlaying: true,
          gamePhase: 'idle',
          leaderboard: get().leaderboard, // Preserve leaderboard
        });
      },

      resetGame: () => {
        set({
          ...createInitialState(),
          leaderboard: get().leaderboard,
        });
      },

      setGamePhase: (phase: GamePhase) => {
        set({ gamePhase: phase });
      },

      advanceYear: () => {
        const state = get();
        if (state.gameOver || state.hasWon) return;
        if (state.age >= 52) {
          // Game ends at age 52 (30 years)
          set({ gamePhase: 'gameover', gameOver: true });
          return;
        }

        const yearEvents: string[] = [];
        let yearIncome = 0;
        let yearExpenses = 0;

        // 1. Income phase
        const salary = state.salary;
        const tax = calculateTax(salary);
        const netSalary = salary - tax;

        // Bonus check
        const bonusAmount = randomChance(state.career.bonusChance)
          ? Math.round(salary * (0.1 + Math.random() * 0.2))
          : 0;

        yearIncome = netSalary + bonusAmount;
        yearExpenses = 0;

        const newCash = state.cash + yearIncome;

        // Salary growth
        const growthRate = state.career.salaryGrowthRate / 100;
        const newSalary = Math.round(
          salary * (1 + growthRate * (0.8 + Math.random() * 0.4))
        );

        if (bonusAmount > 0) {
          yearEvents.push(`Received ₹${bonusAmount.toLocaleString('en-IN')} bonus!`);
        }

        // 2. Generate life event
        const usedIds = state.timeline.filter((t) => t.type === 'life_event').map((t) => t.id);
        const lifeEvent = getRandomLifeEvent(state.age + 1, state.trustScore, usedIds);

              // 3. Generate investment opportunity
        const investOpp = getRandomInvestmentOpportunity(state.knowledge);

        // 4. Generate scam or boss battle opportunity
        let currentBossBattle = null;
        let activePhoneNotification = null;
        let scam = null;
        let nextPhase: GamePhase = 'market_update';

        const isBossYear = (state.year + 1) % 5 === 0;
        if (isBossYear) {
          // Trigger boss battle based on year
          const bossIds = ['boss_ponzi', 'boss_banker', 'boss_crypto', 'boss_lottery', 'boss_wizard', 'boss_ai'];
          const bossIndex = Math.min(Math.floor((state.year) / 5), bossIds.length - 1);
          const bossKey = bossIds[bossIndex] || 'boss_ponzi';
          const bossData = BOSSES[bossKey];
          if (bossData) {
            currentBossBattle = {
              ...bossData,
              currentQuestionIndex: 0,
              playerShield: 3,
              bossHealth: 100,
            };
            nextPhase = 'boss_battle';
          }
        } else {
          scam = getRandomScam(state.trustScore, state.knowledge);
          if (scam) {
            // Turn it into a PhoneNotification
            let nType: 'sms' | 'whatsapp' | 'email' | 'call' | 'upi' = 'sms';
            if (scam.category === 'phishing_sms') nType = 'sms';
            else if (scam.category === 'fake_bank_call' || scam.category === 'fake_govt_call') nType = 'call';
            else if (scam.category === 'tech_support') nType = 'email';
            else if (scam.category === 'referral_scam') nType = 'whatsapp';
            else if (scam.category === 'registration_fee') nType = 'upi';

            activePhoneNotification = {
              id: scam.id,
              sender: scam.name,
              type: nType,
              title: scam.name,
              content: scam.pitch,
              avatar: scam.emoji,
              amount: scam.amountRequested,
            };
            nextPhase = 'phone_ui';
          }
        }

        // 5. Market update
        const lastMarket = state.marketHistory.length > 0
          ? state.marketHistory[state.marketHistory.length - 1]
          : null;
        const marketUpdate = getRandomMarketUpdate(state.year + 1, lastMarket);

        // 6. Update existing investments
        const updatedInvestments: PlayerInvestment[] = state.investments.map((inv) => {
          const returns = calculateReturns(inv, marketUpdate);
          const newValue = Math.max(0, inv.currentValue + returns);
          const totalReturn =
            ((newValue - inv.amountInvested) / inv.amountInvested) * 100;
          return {
            ...inv,
            currentValue: Math.round(newValue),
            returns: Math.round(totalReturn * 10) / 10,
          };
        });

        const investmentGains = updatedInvestments.reduce(
          (sum, inv) => sum + (inv.currentValue - inv.amountInvested),
          0
        );

        // 7. Calculate new net worth
        const newNetWorth = calculateNetWorth(
          newCash,
          state.emergencyFund,
          updatedInvestments,
          state.loans
        );

        // 8. Promotion check
        let promoted = false;
        if (randomChance(state.career.promotionChance)) {
          promoted = true;
          yearEvents.push('Got promoted! 🎉');
        }

        // Update state for phase transitions
        set({
          age: state.age + 1,
          year: state.year + 1,
          cash: Math.round(newCash),
          salary: promoted ? Math.round(newSalary * 1.15) : newSalary,
          yearsInCareer: state.yearsInCareer + 1,
          investments: updatedInvestments,
          netWorth: Math.round(newNetWorth),
          netWorthHistory: [
            ...state.netWorthHistory,
            { year: state.year + 1, amount: Math.round(newNetWorth) },
          ],
          portfolioAllocation: calculatePortfolioAllocation(
            newCash,
            state.emergencyFund,
            updatedInvestments
          ),
          currentLifeEvent: lifeEvent,
          currentScam: scam,
          currentInvestmentOpportunity: investOpp,
          currentMarketUpdate: marketUpdate,
          marketHistory: [...state.marketHistory, marketUpdate],
          activePhoneNotification,
          currentBossBattle,
          stats: {
            ...state.stats,
            totalSalaryEarned: state.stats.totalSalaryEarned + yearIncome,
            totalTaxPaid: state.stats.totalTaxPaid + tax,
            totalInvestmentGains:
              state.stats.totalInvestmentGains + investmentGains,
            yearsPlayed: state.stats.yearsPlayed + 1,
            promotions: promoted
              ? state.stats.promotions + 1
              : state.stats.promotions,
          },
          currentYearSummary: {
            year: state.year + 1,
            age: state.age + 1,
            incomeEarned: yearIncome,
            expenses: yearExpenses,
            investmentReturns: investmentGains,
            netWorthChange: Math.round(newNetWorth - state.netWorth),
            netWorth: Math.round(newNetWorth),
            events: yearEvents,
          },
          gamePhase: lifeEvent ? 'life_event' : investOpp ? 'investment_opportunity' : nextPhase,
        });

        // Add timeline entry
        const timelineEntry: TimelineEntry = {
          id: generateId(),
          age: state.age + 1,
          year: state.year + 1,
          type: 'career',
          title: promoted ? 'Got Promoted!' : `Year ${state.year + 1}`,
          description: `Earned ${formatCompact(yearIncome)} as ${state.career.name}`,
          financialImpact: yearIncome,
          emoji: promoted ? '🎉' : '💼',
        };

        set((s) => ({
          timeline: [...s.timeline, timelineEntry],
        }));

        // Check achievements
        checkAchievementsForState(get);

        // Check victory/game over
        if (newNetWorth >= 1_00_00_000) {
          set({ gamePhase: 'victory', hasWon: true, gameOver: true });
        } else if (newNetWorth <= 0 && state.cash <= 0) {
          set({ gamePhase: 'gameover', gameOver: true });
        }
      },

      // ==========================================
      // Life Events
      // ==========================================

      handleLifeEvent: (choiceId?: string) => {
        const state = get();
        if (!state.currentLifeEvent) return;

        const event = state.currentLifeEvent;
        let impact = event.financialImpact;
        let trustImp = event.trustImpact;
        let knowledgeImp = event.knowledgeImpact;

        if (choiceId && event.choices) {
          const choice = event.choices.find((c) => c.id === choiceId);
          if (choice) {
            impact = choice.financialImpact;
            trustImp = choice.trustImpact;
            knowledgeImp = choice.knowledgeImpact;
          }
        }

        const newCash = Math.round(state.cash + impact);
        const newTrust = clamp(state.trustScore + trustImp, 0, 100);
        const newKnowledge = clamp(state.knowledge + knowledgeImp, 0, 100);

        const entry: TimelineEntry = {
          id: generateId(),
          age: state.age,
          year: state.year,
          type: 'life_event',
          title: event.name,
          description: event.description,
          financialImpact: impact,
          emoji: event.emoji,
        };

        set({
          cash: newCash,
          trustScore: newTrust,
          knowledge: newKnowledge,
          timeline: [...state.timeline, entry],
          stats: {
            ...state.stats,
            lifeEventsExperienced: state.stats.lifeEventsExperienced + 1,
          },
          currentLifeEvent: null,
          gamePhase: state.currentInvestmentOpportunity
            ? 'investment_opportunity'
            : state.currentBossBattle
            ? 'boss_battle'
            : state.activePhoneNotification
            ? 'phone_ui'
            : 'market_update',
        });
      },

      dismissLifeEvent: () => {
        const state = get();
        set({
          currentLifeEvent: null,
          gamePhase: state.currentInvestmentOpportunity
            ? 'investment_opportunity'
            : state.currentBossBattle
            ? 'boss_battle'
            : state.activePhoneNotification
            ? 'phone_ui'
            : 'market_update',
        });
      },

      // ==========================================
      // Investments
      // ==========================================

      makeInvestment: (optionId: string, amount: number) => {
        const state = get();
        const option = INVESTMENT_OPTIONS.find((o) => o.id === optionId);
        if (!option || amount > state.cash || amount < option.minAmount) return;

        const newInvestment: PlayerInvestment = {
          id: generateId(),
          optionId: option.id,
          name: option.name,
          type: option.type,
          amountInvested: amount,
          currentValue: amount,
          yearInvested: state.year,
          returns: 0,
        };

        const entry: TimelineEntry = {
          id: generateId(),
          age: state.age,
          year: state.year,
          type: 'investment',
          title: `Invested in ${option.name}`,
          description: `Invested ₹${amount.toLocaleString('en-IN')}`,
          financialImpact: -amount,
          emoji: option.emoji,
        };

        set({
          cash: Math.round(state.cash - amount),
          investments: [...state.investments, newInvestment],
          timeline: [...state.timeline, entry],
          knowledge: clamp(state.knowledge + 2, 0, 100),
        });

        get().updateNetWorth();
        checkAchievementsForState(get);
      },

      sellInvestment: (investmentId: string) => {
        const state = get();
        const inv = state.investments.find((i) => i.id === investmentId);
        if (!inv) return;

        const entry: TimelineEntry = {
          id: generateId(),
          age: state.age,
          year: state.year,
          type: 'investment',
          title: `Sold ${inv.name}`,
          description: `Sold for ₹${inv.currentValue.toLocaleString('en-IN')} (${inv.returns > 0 ? '+' : ''}${inv.returns}% return)`,
          financialImpact: inv.currentValue,
          emoji: '💸',
        };

        set({
          cash: Math.round(state.cash + inv.currentValue),
          investments: state.investments.filter((i) => i.id !== investmentId),
          timeline: [...state.timeline, entry],
        });

        get().updateNetWorth();
      },

      dismissInvestmentOpportunity: () => {
        const state = get();
        set({
          currentInvestmentOpportunity: null,
          gamePhase: state.currentBossBattle
            ? 'boss_battle'
            : state.activePhoneNotification
            ? 'phone_ui'
            : 'market_update',
        });
      },

      // ==========================================
      // Scams
      // ==========================================

      handleScamDecision: (decision: ScamDecision) => {
        const state = get();
        if (!state.currentScam) return;

        const scam = state.currentScam;

        if (decision === 'go_for_it') {
          // Player fell for the scam - triggers Scam Timeline presentation
          set({ gamePhase: 'scam_timeline' });
        } else if (decision === 'investigate') {
          set({ gamePhase: 'scam_detective' });
        } else {
          // Ignored
          const entry: TimelineEntry = {
            id: generateId(),
            age: state.age,
            year: state.year,
            type: 'scam_avoided',
            title: `Avoided: ${scam.name}`,
            description: 'Wisely ignored a suspicious offer',
            financialImpact: 0,
            emoji: '🛡️',
          };

          set({
            trustScore: clamp(state.trustScore + 2, 0, 100),
            scamRadarScore: clamp(state.scamRadarScore + 2, 0, 100),
            knowledge: clamp(state.knowledge + 3, 0, 100),
            timeline: [...state.timeline, entry],
            stats: {
              ...state.stats,
              scamsAvoided: state.stats.scamsAvoided + 1,
              bestDecision:
                state.stats.bestDecision ?? `Avoided ${scam.name}`,
            },
            currentScam: null,
            activePhoneNotification: null,
            gamePhase: 'market_update',
          });

          checkAchievementsForState(get);
        }
      },

      investigateScam: (methodId: string) => {
        const state = get();
        if (!state.currentScam) return;

        const scam = state.currentScam;
        const method = scam.investigationOptions.find((m) => m.id === methodId);
        if (!method) return;

        const cost = method.cost;
        if (cost > state.cash) return;

        // Investigation reveals it's a scam
        const entry: TimelineEntry = {
          id: generateId(),
          age: state.age,
          year: state.year,
          type: 'scam_avoided',
          title: `Investigated: ${scam.name}`,
          description: `Used ${method.name} to expose the scam. Cost: ₹${cost.toLocaleString('en-IN')}`,
          financialImpact: -cost,
          emoji: '🔍',
        };

        set({
          cash: Math.round(state.cash - cost),
          trustScore: clamp(state.trustScore + 5, 0, 100),
          scamRadarScore: clamp(state.scamRadarScore + 5, 0, 100),
          knowledge: clamp(state.knowledge + 5, 0, 100),
          unlockedScamIds: Array.from(new Set([...state.unlockedScamIds, scam.id])),
          timeline: [...state.timeline, entry],
          stats: {
            ...state.stats,
            scamsAvoided: state.stats.scamsAvoided + 1,
            bestDecision:
              state.stats.bestDecision ?? `Investigated ${scam.name}`,
          },
          currentScam: null,
          activePhoneNotification: null,
          gamePhase: 'scam_result',
        });

        get().updateNetWorth();
        checkAchievementsForState(get);
      },

      dismissScamResult: () => {
        set({
          currentScam: null,
          activePhoneNotification: null,
          gamePhase: 'market_update',
        });
      },

      // ==========================================
      // New Scam Awareness Actions
      // ==========================================

      setPhoneNotification: (notification) => {
        set({ activePhoneNotification: notification });
      },

      triggerPhoneAction: (action) => {
        const state = get();
        const scam = state.currentScam;
        if (!scam) return;

        if (action === 'ignore') {
          const entry: TimelineEntry = {
            id: generateId(),
            age: state.age,
            year: state.year,
            type: 'scam_avoided',
            title: `Avoided: ${scam.name}`,
            description: 'Ignored the suspicious alert.',
            financialImpact: 0,
            emoji: '🛡️',
          };
          set({
            trustScore: clamp(state.trustScore + 2, 0, 100),
            scamRadarScore: clamp(state.scamRadarScore + 2, 0, 100),
            timeline: [...state.timeline, entry],
            stats: {
              ...state.stats,
              scamsAvoided: state.stats.scamsAvoided + 1,
            },
            currentScam: null,
            activePhoneNotification: null,
            gamePhase: 'market_update',
          });
        } else if (action === 'block') {
          const entry: TimelineEntry = {
            id: generateId(),
            age: state.age,
            year: state.year,
            type: 'scam_avoided',
            title: `Blocked: ${scam.name}`,
            description: 'Blocked phone sender and reported the scam text to helplines.',
            financialImpact: 0,
            emoji: '🚫',
          };
          set({
            trustScore: clamp(state.trustScore + 5, 0, 100),
            scamRadarScore: clamp(state.scamRadarScore + 6, 0, 100),
            knowledge: clamp(state.knowledge + 3, 0, 100),
            unlockedScamIds: Array.from(new Set([...state.unlockedScamIds, scam.id])),
            timeline: [...state.timeline, entry],
            stats: {
              ...state.stats,
              scamsAvoided: state.stats.scamsAvoided + 1,
            },
            currentScam: null,
            activePhoneNotification: null,
            gamePhase: 'market_update',
          });
        } else if (action === 'open') {
          set({ gamePhase: 'scam_encounter' });
        } else if (action === 'verify') {
          set({ gamePhase: 'scam_investigation' });
        }
      },

      solveScamDetective: (correctVerdict) => {
        const state = get();
        const scam = state.currentScam;
        if (!scam) return;

        if (correctVerdict) {
          // Spotted successfully!
          const entry: TimelineEntry = {
            id: generateId(),
            age: state.age,
            year: state.year,
            type: 'scam_avoided',
            title: `Scam Detected: ${scam.name}`,
            description: 'Correctly scanned and flagged red flags inside the pitch.',
            financialImpact: 0,
            emoji: '🛡️',
          };
          set({
            trustScore: clamp(state.trustScore + 6, 0, 100),
            scamRadarScore: clamp(state.scamRadarScore + 15, 0, 100),
            knowledge: clamp(state.knowledge + 5, 0, 100),
            unlockedScamIds: Array.from(new Set([...state.unlockedScamIds, scam.id])),
            timeline: [...state.timeline, entry],
            stats: {
              ...state.stats,
              scamsAvoided: state.stats.scamsAvoided + 1,
            },
            gamePhase: 'scam_result',
          });
        } else {
          // Wrong verdict (declared legitimate) -> triggers scam timeline loss sequence!
          set({ gamePhase: 'scam_timeline' });
        }
      },

      advanceScamTimeline: () => {
        // Handled in React component internally until completed, then calls dismiss
      },

      dismissScamTimeline: () => {
        const state = get();
        const scam = state.currentScam;
        if (!scam) return;

        // Apply financial loss since they fell for the scam
        const loss = scam.amountLost;
        const newCash = Math.max(0, state.cash - loss);

        const entry: TimelineEntry = {
          id: generateId(),
          age: state.age,
          year: state.year,
          type: 'scam_fallen',
          title: `Fell for: ${scam.name}`,
          description: `Lost ₹${loss.toLocaleString('en-IN')} to scam`,
          financialImpact: -loss,
          emoji: '😱',
        };

        set({
          cash: newCash,
          trustScore: clamp(state.trustScore + scam.trustImpact, 0, 100),
          scamRadarScore: clamp(state.scamRadarScore - 12, 0, 100),
          timeline: [...state.timeline, entry],
          stats: {
            ...state.stats,
            scamsFallenFor: state.stats.scamsFallenFor + 1,
            totalScamLoss: state.stats.totalScamLoss + loss,
            worstDecision: state.stats.worstDecision ?? `Fell for ${scam.name}`,
          },
          currentScam: null,
          activePhoneNotification: null,
          gamePhase: 'scam_result',
        });

        get().updateNetWorth();
      },

      startBossBattle: (bossId) => {
        const bossData = BOSSES[bossId];
        if (!bossData) return;
        set({
          currentBossBattle: {
            ...bossData,
            currentQuestionIndex: 0,
            playerShield: 3,
            bossHealth: 100,
          },
          gamePhase: 'boss_battle',
        });
      },

      answerBossQuestion: (optionIndex) => {
        const state = get();
        const battle = state.currentBossBattle;
        if (!battle) return;

        const currentQuestion = battle.questions[battle.currentQuestionIndex];
        const selectedOption = currentQuestion.options[optionIndex];
        if (!selectedOption) return;

        let nextHealth = battle.bossHealth;
        let nextShield = battle.playerShield;

        if (selectedOption.correct) {
          nextHealth = Math.max(0, battle.bossHealth - Math.ceil(100 / battle.questions.length));
        } else {
          nextShield = Math.max(0, battle.playerShield - 1);
        }

        const nextQuestionIndex = battle.currentQuestionIndex + 1;
        const isBattleFinished = nextHealth <= 0 || nextShield <= 0 || nextQuestionIndex >= battle.questions.length;

        if (isBattleFinished) {
          if (nextHealth <= 0 || (selectedOption.correct && nextQuestionIndex >= battle.questions.length)) {
            // Player won!
            const entry: TimelineEntry = {
              id: generateId(),
              age: state.age,
              year: state.year,
              type: 'scam_avoided',
              title: `Defeated Boss: ${battle.title}`,
              description: `Correctly answered scam questions and exposed ${battle.name}.`,
              financialImpact: 0,
              emoji: '🏆',
            };
            set({
              trustScore: clamp(state.trustScore + 10, 0, 100),
              scamRadarScore: clamp(state.scamRadarScore + 20, 0, 100),
              knowledge: clamp(state.knowledge + 10, 0, 100),
              timeline: [...state.timeline, entry],
              currentBossBattle: null,
              gamePhase: 'market_update',
            });
          } else {
            // Player lost (shield ran out or failed to defeat boss)
            const lossAmount = Math.round(state.cash * 0.2); // lose 20% cash to boss
            const newCash = Math.max(0, state.cash - lossAmount);
            const entry: TimelineEntry = {
              id: generateId(),
              age: state.age,
              year: state.year,
              type: 'scam_fallen',
              title: `Scammed by Boss: ${battle.title}`,
              description: `Fell for tricks of ${battle.name}. Lost ₹${lossAmount.toLocaleString('en-IN')}`,
              financialImpact: -lossAmount,
              emoji: '💀',
            };
            set({
              cash: newCash,
              trustScore: clamp(state.trustScore - 15, 0, 100),
              scamRadarScore: clamp(state.scamRadarScore - 15, 0, 100),
              timeline: [...state.timeline, entry],
              currentBossBattle: null,
              gamePhase: 'market_update',
            });
            get().updateNetWorth();
          }
        } else {
          // Next question
          set({
            currentBossBattle: {
              ...battle,
              currentQuestionIndex: nextQuestionIndex,
              bossHealth: nextHealth,
              playerShield: nextShield,
            },
          });
        }
      },

      dismissBossBattle: () => {
        set({ currentBossBattle: null, gamePhase: 'market_update' });
      },

      submitQuizAnswer: (correct) => {
        const state = get();
        if (correct) {
          set({
            trustScore: clamp(state.trustScore + 3, 0, 100),
            scamRadarScore: clamp(state.scamRadarScore + 6, 0, 100),
            knowledge: clamp(state.knowledge + 4, 0, 100),
          });
        } else {
          set({
            trustScore: clamp(state.trustScore - 1, 0, 100),
            scamRadarScore: clamp(state.scamRadarScore - 3, 0, 100),
          });
        }
      },

      // ==========================================
      // Career
      // ==========================================

      changeCareer: (careerId: CareerCategory) => {
        const state = get();
        const newCareer = CAREERS.find((c) => c.id === careerId);
        if (!newCareer || newCareer.requiredKnowledge > state.knowledge) return;

        const entry: TimelineEntry = {
          id: generateId(),
          age: state.age,
          year: state.year,
          type: 'career',
          title: `Switched to ${newCareer.name}`,
          description: `New salary: ₹${newCareer.baseSalary.toLocaleString('en-IN')}`,
          financialImpact: 0,
          emoji: newCareer.emoji,
        };

        set({
          career: { ...newCareer },
          salary: newCareer.baseSalary,
          yearsInCareer: 0,
          timeline: [...state.timeline, entry],
          stats: {
            ...state.stats,
            careerChanges: state.stats.careerChanges + 1,
          },
        });

        checkAchievementsForState(get);
      },

      // ==========================================
      // Market
      // ==========================================

      acknowledgeMarketUpdate: () => {
        set({
          gamePhase: 'year_summary',
        });
      },

      // ==========================================
      // Year Summary
      // ==========================================

      acknowledgeYearSummary: () => {
        const state = get();
        if (state.hasWon) {
          set({ gamePhase: 'victory' });
        } else if (state.netWorth <= 0 && state.cash <= 0) {
          set({ gamePhase: 'gameover', gameOver: true });
        } else if (state.age >= 52) {
          set({ gamePhase: 'gameover', gameOver: true });
        } else {
          set({ gamePhase: 'idle' });
        }
      },

      // ==========================================
      // Persistence
      // ==========================================

      saveGame: () => {
        // Handled by zustand persist middleware
      },

      loadGame: () => {
        // Handled by zustand persist middleware
        return get().isPlaying;
      },

      // ==========================================
      // Leaderboard
      // ==========================================

      addToLeaderboard: (entry: LeaderboardEntry) => {
        const state = get();
        const newLeaderboard = [...state.leaderboard, entry]
          .sort((a, b) => b.netWorth - a.netWorth)
          .slice(0, 10);
        set({ leaderboard: newLeaderboard });
      },

      // ==========================================
      // Utility
      // ==========================================

      updateNetWorth: () => {
        const state = get();
        const netWorth = calculateNetWorth(
          state.cash,
          state.emergencyFund,
          state.investments,
          state.loans
        );
        set({
          netWorth: Math.round(netWorth),
          portfolioAllocation: calculatePortfolioAllocation(
            state.cash,
            state.emergencyFund,
            state.investments
          ),
        });
      },
    }),
    {
      name: 'crorepati-game-save',
      partialize: (state) => {
        // Don't persist functions
        const { startGame: _sg, resetGame: _rg, advanceYear: _ay, setGamePhase: _sgp,
                handleLifeEvent: _hle, dismissLifeEvent: _dle, makeInvestment: _mi,
                sellInvestment: _si, dismissInvestmentOpportunity: _dio,
                handleScamDecision: _hsd, investigateScam: _is, dismissScamResult: _dsr,
                setPhoneNotification: _spn, triggerPhoneAction: _tpa, solveScamDetective: _ssd,
                advanceScamTimeline: _ast, dismissScamTimeline: _dst, startBossBattle: _sbb,
                answerBossQuestion: _abq, dismissBossBattle: _dbb, submitQuizAnswer: _sqa,
                changeCareer: _cc, acknowledgeMarketUpdate: _amu,
                acknowledgeYearSummary: _ays, saveGame: _ssg, loadGame: _lg,
                addToLeaderboard: _atl, updateNetWorth: _unw, ...rest } = state;
        return rest;
      },
    }
  )
);


