import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Shield,
  Brain,
  Briefcase,
  TrendingUp,
  SkipForward,
} from 'lucide-react';
import { useGame } from '../../hooks/useGame';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';
import { Modal } from '../../components/ui/Modal';
import { MoneyCounter } from '../../components/animations/MoneyCounter';
import { CoinExplosion } from '../../components/animations/CoinExplosion';
import { PageTransition } from '../../components/ui/PageTransition';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { CAREERS } from '../../data/careers';
import { INVESTMENT_OPTIONS } from '../../data/investments';
import { audio } from '../../utils/audio';
import { InteractivePhone } from '../../components/layout/InteractivePhone';
import { ScamDetective } from '../../components/layout/ScamDetective';
import { ScamBossBattle } from '../../components/layout/ScamBossBattle';

export function getScamRadarLevel(score: number): { name: string; emoji: string; color: string } {
  if (score <= 20) return { name: 'Beginner', emoji: '🌱', color: 'text-slate-400 border-slate-500/20 bg-slate-500/5' };
  if (score <= 40) return { name: 'Aware', emoji: '🔍', color: 'text-sky-400 border-sky-500/20 bg-sky-500/5' };
  if (score <= 60) return { name: 'Alert', emoji: '🚨', color: 'text-amber-400 border-amber-500/20 bg-amber-500/5' };
  if (score <= 80) return { name: 'Expert', emoji: '🧠', color: 'text-purple-400 border-purple-500/20 bg-purple-500/5' };
  return { name: 'Scam Hunter', emoji: '👑', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' };
}

export function getFinancialLiteracyLevel(score: number): { name: string; emoji: string } {
  if (score <= 15) return { name: 'Beginner Saver', emoji: '🌱' };
  if (score <= 30) return { name: 'Smart Investor', emoji: '💼' };
  if (score <= 50) return { name: 'Scam Spotter', emoji: '🔍' };
  if (score <= 70) return { name: 'Wealth Builder', emoji: '📈' };
  if (score <= 85) return { name: 'Financial Guardian', emoji: '🛡️' };
  if (score <= 95) return { name: 'Crorepati', emoji: '👑' };
  return { name: 'Financial Guru', emoji: '🧠' };
}

function TimelineUnfolding({ scam, onComplete }: { scam: any; onComplete: () => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const steps = scam.scamTimeline || [];

  const handleNext = () => {
    audio.playClick();
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <Card variant="danger" padding="md" className="space-y-4 w-full max-w-md my-auto bg-slate-950/95 border-red-500/20 shadow-2xl relative z-50">
      <div className="text-center space-y-1 select-none">
        <h3 className="text-sm font-extrabold text-red-400 uppercase tracking-widest">😱 Scam Unfolding...</h3>
        <p className="text-[10px] text-slate-400">See how this financial trap operates step-by-step</p>
      </div>

      <div className="relative pl-6 space-y-4 border-l border-white/10 my-4 text-left max-h-[300px] overflow-y-auto pr-2">
        {steps.slice(0, activeStep + 1).map((step: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-red-600 border-2 border-slate-950 flex items-center justify-center text-[8px] z-10 select-none">
              {step.emoji}
            </div>
            <div>
              <h5 className="text-xs font-bold text-white">{step.title}</h5>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {activeStep === steps.length - 1 && (
        <Card variant="default" padding="sm" className="bg-slate-900 border-red-500/10">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold mb-1">💡 Scam Stop Point:</p>
          <p className="text-[10px] text-red-200 leading-normal">
            You could have stopped this loss early by doing independent research, verifying credentials, or refusing transfer demands.
          </p>
        </Card>
      )}

      <Button
        variant={activeStep === steps.length - 1 ? 'danger' : 'primary'}
        fullWidth
        onClick={handleNext}
      >
        {activeStep === steps.length - 1 ? 'Acknowledge Loss' : 'Next Day →'}
      </Button>
    </Card>
  );
}

interface InvestmentQuiz {
  question: string;
  options: { text: string; correct: boolean }[];
  explanation: string;
}

const INVESTMENT_QUIZZES: Record<string, InvestmentQuiz> = {
  mutual_fund: {
    question: "What is a primary advantage of buying Mutual Funds over individual stocks?",
    options: [
      { text: "They pool money to provide professional management and instant diversification.", correct: true },
      { text: "They guarantee fixed monthly returns regardless of market performance.", correct: false },
      { text: "They are completely free of taxation and management charges.", correct: false }
    ],
    explanation: "Mutual Funds collect money from multiple investors to invest in a diversified list of shares or bonds. This is managed by professional fund managers, reducing the risk of a single stock crashing your portfolio."
  },
  stocks: {
    question: "What does owning a stock (equity share) represent in a company?",
    options: [
      { text: "A fractional share of ownership and claim on its future earnings.", correct: true },
      { text: "A guaranteed debt agreement that the company must repay with interest.", correct: false },
      { text: "A government-insured savings account that cannot lose value.", correct: false }
    ],
    explanation: "Stocks represent ownership. When you buy a stock, you become a part-owner of the company. Its value changes based on the company's business performance and market demand, which carries higher risk but offers strong long-term growth."
  },
  fixed_deposit: {
    question: "How does high inflation affect a fixed-return Bank FD?",
    options: [
      { text: "If inflation is higher than the FD rate, your money loses real purchasing power.", correct: true },
      { text: "It has no impact since Fixed Deposits are immune to inflation.", correct: false },
      { text: "It increases the purchasing power of your guaranteed interest payout.", correct: false }
    ],
    explanation: "Fixed Deposits are extremely safe, but their interest rates are low. If inflation runs higher than your interest rate, your money's real value (purchasing power) actually shrinks over time."
  },
  government_bond: {
    question: "Why are Government Bonds generally considered very low-risk investments?",
    options: [
      { text: "They are backed by the sovereign rating and guarantee of the country's government.", correct: true },
      { text: "They guarantee to double your initial capital every two years.", correct: false },
      { text: "They can be withdrawn instantly at any ATM machine for free.", correct: false }
    ],
    explanation: "Government bonds are secure because the government guarantees to pay you back. They are ideal for conserving capital, although they offer moderate returns compared to equity stocks."
  },
  gold: {
    question: "What is the primary role of Gold in a diversified portfolio?",
    options: [
      { text: "It acts as a safe-haven hedge against inflation and market crises.", correct: true },
      { text: "It generates high compounding monthly cash dividends.", correct: false },
      { text: "It always outperforms equity indices during booming bull markets.", correct: false }
    ],
    explanation: "Gold is a physical asset that holds value. During high inflation or geopolitical crises, stock markets may fall, but gold historically maintains purchasing power, protecting your portfolio from extreme drops."
  },
  real_estate: {
    question: "Which of the following is a key risk factor when investing in Real Estate?",
    options: [
      { text: "High illiquidity: selling properties to get cash can take months or years.", correct: true },
      { text: "Real estate properties are completely wiped out by inflation.", correct: false },
      { text: "It is impossible to get cash flow or regular rental returns from property.", correct: false }
    ],
    explanation: "Real estate is capital-intensive and highly illiquid. Unlike stocks, you cannot instantly convert an apartment to cash if you have an urgent medical or financial emergency."
  },
  business: {
    question: "What is a main advantage of a franchise business over starting a brand from scratch?",
    options: [
      { text: "It provides an established brand name, operating systems, and proven market demand.", correct: true },
      { text: "It is legally guaranteed to produce profits from day one.", correct: false },
      { text: "You have absolute freedom to change the product recipes and logo as you like.", correct: false }
    ],
    explanation: "Franchising provides a ready-made blueprint. While it lowers the risk of startup failure, you must pay franchise royalties and adhere to strict brand guidelines."
  },
  startup: {
    question: "Which of the following is a statistical reality of Angel Investing in startups?",
    options: [
      { text: "Startups have high failure rates (up to 80-90%), making them extremely risky.", correct: true },
      { text: "They are highly liquid investments that pay quarterly dividends.", correct: false },
      { text: "Angel investors are guaranteed to get their principal investment back.", correct: false }
    ],
    explanation: "Angel investing offers massive returns if the startup becomes a unicorn, but because the majority of startups fail, it is highly speculative. You should only invest capital you are prepared to lose."
  },
  crypto: {
    question: "What is the primary driver of price shifts in the Cryptocurrency market?",
    options: [
      { text: "Market speculation, investor sentiment, and lack of underlying cash flows.", correct: true },
      { text: "Central bank interest policies adjusting crypto dividends.", correct: false },
      { text: "Legal backing and direct price guarantees from world governments.", correct: false }
    ],
    explanation: "Cryptocurrencies are highly volatile and speculative. They do not have corporate earnings, interest, or physical assets, meaning their prices shift wildly based on demand, sentiment, and regulatory news."
  }
};

const YEARLY_QUIZZES: InvestmentQuiz[] = [
  {
    question: "What does the concept of 'Diversification' mean in investing?",
    options: [
      { text: "Spreading capital across different asset classes to lower overall portfolio risk.", correct: true },
      { text: "Putting all your cash into a single high-performing stock to maximize yield.", correct: false },
      { text: "Changing your career frequently to earn higher baseline salaries.", correct: false }
    ],
    explanation: "Diversification means not putting all your eggs in one basket. If one company or asset crashes, your other holdings (e.g. gold, bonds) protect your net worth."
  },
  {
    question: "What is the compounding effect in wealth accumulation?",
    options: [
      { text: "Earning interest on your initial principal AND on your accumulated interest over time.", correct: true },
      { text: "The flat interest payout you get from checking accounts every year.", correct: false },
      { text: "Paying higher income tax as your career salary grows.", correct: false }
    ],
    explanation: "Compounding means your earnings start earning their own earnings. Over 10-20 years, this causes exponential growth, turning small savings into huge wealth."
  },
  {
    question: "What is a 'SIP' in mutual fund investments?",
    options: [
      { text: "Systematic Investment Plan: investing a fixed sum regularly at set intervals.", correct: true },
      { text: "Secure Interest Payout: a guarantee from SEBI against market losses.", correct: false },
      { text: "Stock Index Portfolio: a plan that buys only international index shares.", correct: false }
    ],
    explanation: "An SIP (Systematic Investment Plan) automates saving by investing a fixed amount (e.g. ₹5,000) every month. This averages out market purchase costs (Rupee Cost Averaging)."
  },
  {
    question: "What is an 'Emergency Fund'?",
    options: [
      { text: "A liquid cash pool covering 3-6 months of living expenses for emergencies.", correct: true },
      { text: "The money you borrow from banks during market crashes.", correct: false },
      { text: "Your equity investment portfolio locked up for high returns.", correct: false }
    ],
    explanation: "An emergency fund protects you from having to sell long-term stock or property investments at a loss if you face sudden layoffs or medical emergencies."
  },
  {
    question: "What does 'Asset Allocation' mean?",
    options: [
      { text: "Deciding the percentage mix of stocks, bonds, and cash in your portfolio based on risk appetite.", correct: true },
      { text: "The location of physical real estate registries you purchase.", correct: false },
      { text: "Choosing which bank accounts to distribute your salary payouts into.", correct: false }
    ],
    explanation: "Asset Allocation balances risk and reward. Young investors typically hold more equities for growth, while older investors allocate more to bonds for safety."
  }
];

export function DashboardPage() {
  const game = useGame();
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [investAmount, setInvestAmount] = useState('');
  const [selectedInvestment, setSelectedInvestment] = useState<string | null>(null);
  const [coinExplode, setCoinExplode] = useState(false);
  const [pendingInvestment, setPendingInvestment] = useState<{
    optionId: string;
    amount: number;
    type: string;
    name: string;
  } | null>(null);
  const [pendingYearAdvance, setPendingYearAdvance] = useState(false);
  const [selectedQuizAns, setSelectedQuizAns] = useState<number | null>(null);
  const [showQuizFeedback, setShowQuizFeedback] = useState(false);

  // Sound effects on game phase change
  useEffect(() => {
    if (!game.isPlaying) return;

    switch (game.gamePhase) {
      case 'scam_encounter':
        audio.playScam();
        break;
      case 'life_event':
        if (game.currentLifeEvent) {
          if (game.currentLifeEvent.category === 'positive' || game.currentLifeEvent.category === 'opportunity') {
            audio.playSuccess();
          } else if (game.currentLifeEvent.category === 'negative' || game.currentLifeEvent.category === 'crisis') {
            audio.playFail();
          }
        }
        break;
      case 'market_update':
        if (game.currentMarketUpdate) {
          if (game.currentMarketUpdate.cycle === 'bull') {
            audio.playSuccess();
          } else if (game.currentMarketUpdate.cycle === 'bear') {
            audio.playFail();
          }
        }
        break;
      case 'scam_result':
        // If the latest timeline entry is scam_avoided it means we successfully investigated/scanned it
        const lastEntry = game.timeline[game.timeline.length - 1];
        if (lastEntry && lastEntry.type === 'scam_avoided') {
          audio.playSuccess();
        } else {
          audio.playFail();
        }
        break;
      case 'year_summary':
        if (game.currentYearSummary) {
          if (game.currentYearSummary.netWorthChange > 0) {
            audio.playCoin();
          } else if (game.currentYearSummary.netWorthChange < 0) {
            audio.playFail();
          }
        }
        break;
    }
  }, [game.gamePhase, game.isPlaying, game.currentLifeEvent, game.currentMarketUpdate, game.currentYearSummary, game.timeline.length]);

  // Auto-open modals based on game phase
  const handleAdvanceYear = () => {
    game.advanceYear();
    setCoinExplode(true);
    setTimeout(() => setCoinExplode(false), 100);
  };

  // Phase-driven modal display
  const showLifeEvent = game.gamePhase === 'life_event' && game.currentLifeEvent;
  const showInvestOpp = game.gamePhase === 'investment_opportunity' && game.currentInvestmentOpportunity;
  const showScamResult = game.gamePhase === 'scam_result';
  const showMarket = game.gamePhase === 'market_update' && game.currentMarketUpdate;
  const showSummary = game.gamePhase === 'year_summary' && game.currentYearSummary;

  return (
    <PageTransition className="pb-24 px-4 pt-4 max-w-lg mx-auto relative">
      <CoinExplosion trigger={coinExplode} />

      {/* ===== Top Bar ===== */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <div>
          <h1 className="text-lg font-bold text-white font-poppins">
            {game.playerName || 'Player'}
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="info" size="sm">Age {game.age}</Badge>
            <Badge variant="purple" size="sm">Year {game.year}</Badge>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Net Worth</p>
          <MoneyCounter
            amount={game.netWorth}
            className="text-xl font-extrabold text-white"
          />
          <p className="text-[10px] text-emerald-400 mt-1 font-medium">Cash: {formatCurrency(game.cash, true)}</p>
        </div>
      </motion.div>

      {/* ===== Progress Bar ===== */}
      <ProgressBar progress={game.progress} className="mb-5" />

      {/* ===== Stats Grid ===== */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <StatCard
          icon={<Shield size={16} className="text-blue-400" />}
          label="Scam Radar"
          value={getScamRadarLevel(game.scamRadarScore).emoji + ' ' + getScamRadarLevel(game.scamRadarScore).name}
          subtitle={`Radar Score: ${game.scamRadarScore}/100`}
          trend={game.scamRadarScore > 60 ? 'up' : game.scamRadarScore < 40 ? 'down' : 'neutral'}
          delay={0.1}
        />
        <StatCard
          icon={<Brain size={16} className="text-purple-400" />}
          label="Literacy Level"
          value={getFinancialLiteracyLevel(game.knowledge).emoji + ' ' + getFinancialLiteracyLevel(game.knowledge).name.split(' ')[0]}
          subtitle={`Knowledge: ${game.knowledge}/100`}
          trend="up"
          delay={0.15}
        />
        <StatCard
          icon={<Briefcase size={16} className="text-amber-400" />}
          label="Career"
          value={game.career.emoji + ' ' + game.career.name.split(' ').slice(0, 2).join(' ')}
          subtitle={formatCurrency(game.salary, true) + '/yr'}
          delay={0.2}
          onClick={() => setShowCareerModal(true)}
        />
        <StatCard
          icon={<TrendingUp size={16} className="text-emerald-400" />}
          label="Investments"
          value={formatCurrency(game.totalInvestmentValue, true)}
          subtitle={`${game.investments.length} active`}
          delay={0.25}
          onClick={() => setShowInvestModal(true)}
        />
      </div>



      {/* ===== Action Buttons ===== */}
      <div className="space-y-3 mb-4">
        {/* Next Year (Main Action) */}
        {game.canAdvance && (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon={<SkipForward size={20} />}
            onClick={() => {
              audio.playClick();
              setPendingYearAdvance(true);
            }}
          >
            Advance to Year {game.year + 1}
          </Button>
        )}
      </div>

      {/* ===== Years Remaining ===== */}
      <Card variant="default" padding="sm" className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Years remaining</span>
          <span className={`text-sm font-bold ${game.yearsRemaining <= 5 ? 'text-red-400' : 'text-slate-300'}`}>
            {game.yearsRemaining} years left
          </span>
        </div>
      </Card>

      {/* ==================== PHASE MODALS ==================== */}

      {/* Life Event Modal */}
      <Modal
        isOpen={!!showLifeEvent}
        onClose={() => game.dismissLifeEvent()}
        title={game.currentLifeEvent?.emoji + ' ' + (game.currentLifeEvent?.name || '')}
      >
        {game.currentLifeEvent && (
          <div className="space-y-4">
            <p className="text-slate-300 text-sm">{game.currentLifeEvent.description}</p>
            {game.currentLifeEvent.financialImpact !== 0 && !game.currentLifeEvent.choices && (
              <div className={`text-center text-2xl font-bold ${game.currentLifeEvent.financialImpact > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {game.currentLifeEvent.financialImpact > 0 ? '+' : ''}{formatCurrency(game.currentLifeEvent.financialImpact, true)}
              </div>
            )}
            {game.currentLifeEvent.choices ? (
              <div className="space-y-2">
                {game.currentLifeEvent.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => game.handleLifeEvent(choice.id)}
                    className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-colors"
                  >
                    <p className="font-semibold text-white text-sm">{choice.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{choice.description}</p>
                    <p className={`text-xs font-bold mt-1 ${choice.financialImpact >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {choice.financialImpact >= 0 ? '+' : ''}{formatCurrency(choice.financialImpact, true)}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <Button variant="primary" fullWidth onClick={() => game.handleLifeEvent()}>
                Continue
              </Button>
            )}
          </div>
        )}
      </Modal>

      {/* Investment Opportunity Modal */}
      <Modal
        isOpen={!!showInvestOpp}
        onClose={() => game.dismissInvestmentOpportunity()}
        title={game.currentInvestmentOpportunity?.emoji + ' Investment Opportunity'}
      >
        {game.currentInvestmentOpportunity && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">{game.currentInvestmentOpportunity.name}</h3>
            <p className="text-slate-300 text-sm">{game.currentInvestmentOpportunity.description}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-white/5">
                <span className="text-slate-400">Risk</span>
                <p className="font-bold text-white capitalize">{game.currentInvestmentOpportunity.risk}</p>
              </div>
              <div className="p-2 rounded-xl bg-white/5">
                <span className="text-slate-400">Expected Return</span>
                <p className="font-bold text-emerald-400">{formatPercent(game.currentInvestmentOpportunity.expectedReturn)}</p>
              </div>
              <div className="p-2 rounded-xl bg-white/5">
                <span className="text-slate-400">Min Amount</span>
                <p className="font-bold text-white">{formatCurrency(game.currentInvestmentOpportunity.minAmount, true)}</p>
              </div>
              <div className="p-2 rounded-xl bg-white/5">
                <span className="text-slate-400">Hold Period</span>
                <p className="font-bold text-white">{game.currentInvestmentOpportunity.holdingPeriod}yr</p>
              </div>
            </div>
            <p className="text-xs text-slate-400">Available cash: {formatCurrency(game.cash, true)}</p>
            <input
              type="number"
              value={investAmount}
              onChange={(e) => setInvestAmount(e.target.value)}
              placeholder={`Min ${formatCurrency(game.currentInvestmentOpportunity.minAmount)}`}
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  const amt = parseInt(investAmount);
                  if (amt && game.currentInvestmentOpportunity) {
                    setPendingInvestment({
                      optionId: game.currentInvestmentOpportunity.id,
                      amount: amt,
                      type: game.currentInvestmentOpportunity.type,
                      name: game.currentInvestmentOpportunity.name,
                    });
                    setInvestAmount('');
                    game.dismissInvestmentOpportunity();
                  }
                }}
                disabled={!investAmount || parseInt(investAmount) < (game.currentInvestmentOpportunity?.minAmount || 0) || parseInt(investAmount) > game.cash}
              >
                Invest
              </Button>
              <Button variant="secondary" fullWidth onClick={() => { setInvestAmount(''); game.dismissInvestmentOpportunity(); }}>
                Skip
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ==================== NEW INTERACTIVE OVERLAYS ==================== */}
      <AnimatePresence>
        {game.gamePhase === 'boss_battle' && game.currentBossBattle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 z-50 overflow-y-auto flex items-start sm:items-center justify-center p-4 py-8"
          >
            <ScamBossBattle
              battle={game.currentBossBattle}
              onAnswer={(idx) => game.answerBossQuestion(idx)}
              onDismiss={() => game.dismissBossBattle()}
            />
          </motion.div>
        )}

        {(game.gamePhase === 'phone_ui' || game.gamePhase === 'scam_encounter') && game.activePhoneNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 z-50 overflow-y-auto flex items-start sm:items-center justify-center p-4 py-8"
          >
            <InteractivePhone
              notification={game.activePhoneNotification}
              onAction={(action) => game.triggerPhoneAction(action)}
              onAcceptScam={() => game.handleScamDecision('go_for_it')}
              isEncounterPhase={game.gamePhase === 'scam_encounter'}
            />
          </motion.div>
        )}

        {game.gamePhase === 'scam_detective' && game.currentScam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 z-50 overflow-y-auto flex items-start sm:items-center justify-center p-4 py-8"
          >
            <ScamDetective
              scam={game.currentScam}
              onVerdict={(correct) => game.solveScamDetective(correct)}
            />
          </motion.div>
        )}

        {game.gamePhase === 'scam_timeline' && game.currentScam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 z-50 overflow-y-auto flex items-start sm:items-center justify-center p-4 py-8"
          >
            <TimelineUnfolding
              scam={game.currentScam}
              onComplete={() => game.dismissScamTimeline()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scam Result Modal */}
      <Modal
        isOpen={!!showScamResult}
        onClose={() => game.dismissScamResult()}
        title={game.timeline[game.timeline.length - 1]?.type === 'scam_avoided' ? '🛡️ Scam Exposed!' : '😱 Scam Alert!'}
      >
        <div className="space-y-4">
          {game.timeline[game.timeline.length - 1]?.type !== 'scam_avoided' ? (
            <>
              <p className="text-red-400 font-bold text-lg text-center">
                You lost {formatCurrency(game.currentScam?.amountLost || 0, true)}!
              </p>
              <p className="text-slate-400 text-sm text-center">This was a scam. Learn from this experience.</p>
            </>
          ) : (
            <>
              <p className="text-emerald-400 font-bold text-lg text-center flex items-center justify-center gap-2">
                🛡️ Capital Saved!
              </p>
              <p className="text-slate-300 text-sm text-center">Your sharp radar successfully identified the warning signs!</p>
              <p className="text-emerald-400 text-xs font-bold text-center">
                Scam Radar +15 • Trust Score Improved
              </p>
            </>
          )}
          {game.currentScam?.learnMore && (
            <Card variant="default" padding="sm" className="bg-slate-900 border-white/5 text-left">
              <h4 className="text-xs font-bold text-amber-400 uppercase mb-1">📖 Learn More</h4>
              <p className="text-xs text-slate-300 leading-normal">{game.currentScam.learnMore.howItWorks}</p>
              <h5 className="text-xs font-bold text-slate-400 mt-2">How to stay safe:</h5>
              <p className="text-xs text-slate-300 mt-0.5 leading-normal">{game.currentScam.learnMore.howToStaySafe}</p>
            </Card>
          )}
          <Button variant="primary" fullWidth onClick={() => game.dismissScamResult()}>
            Continue
          </Button>
        </div>
      </Modal>

      {/* Market Update Modal */}
      <Modal
        isOpen={!!showMarket}
        onClose={() => game.acknowledgeMarketUpdate()}
        title="📊 Market Update"
      >
        {game.currentMarketUpdate && (
          <div className="space-y-4">
            <Badge variant={game.currentMarketUpdate.cycle === 'bull' ? 'success' : game.currentMarketUpdate.cycle === 'bear' ? 'danger' : 'default'} size="md">
              {game.currentMarketUpdate.cycle === 'bull' ? '🐂 Bull Market' : game.currentMarketUpdate.cycle === 'bear' ? '🐻 Bear Market' : '➡️ Neutral Market'}
            </Badge>
            <div className="space-y-2">
              {[
                { name: 'Stocks', value: game.currentMarketUpdate.stocks, emoji: '📈' },
                { name: 'Mutual Funds', value: game.currentMarketUpdate.mutualFunds, emoji: '📊' },
                { name: 'Gold', value: game.currentMarketUpdate.gold, emoji: '✨' },
                { name: 'Property', value: game.currentMarketUpdate.property, emoji: '🏠' },
                { name: 'Crypto', value: game.currentMarketUpdate.crypto, emoji: '₿' },
                { name: 'FD Rate', value: game.currentMarketUpdate.fixedDeposit, emoji: '🏦' },
                { name: 'Inflation', value: game.currentMarketUpdate.inflation, emoji: '📈' },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                  <span className="text-sm text-slate-300">{item.emoji} {item.name}</span>
                  <span className={`text-sm font-bold ${item.name === 'Inflation' ? 'text-amber-400' : item.value >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {item.value >= 0 ? '+' : ''}{item.value.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
            <Button variant="primary" fullWidth onClick={() => game.acknowledgeMarketUpdate()}>
              Continue
            </Button>
          </div>
        )}
      </Modal>

      {/* Year Summary Modal */}
      <Modal
        isOpen={!!showSummary}
        onClose={() => game.acknowledgeYearSummary()}
        title={`📋 Year ${game.currentYearSummary?.year} Summary`}
      >
        {game.currentYearSummary && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-xs text-slate-400">Age {game.currentYearSummary.age}</p>
              <p className="text-3xl font-extrabold text-white mt-1">
                {formatCurrency(game.currentYearSummary.netWorth, true)}
              </p>
              <p className={`text-sm font-bold mt-1 ${game.currentYearSummary.netWorthChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {game.currentYearSummary.netWorthChange >= 0 ? '↑' : '↓'} {formatCurrency(Math.abs(game.currentYearSummary.netWorthChange), true)}
              </p>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded-xl bg-white/5">
                <span className="text-slate-400">Income Earned</span>
                <span className="text-emerald-400 font-bold">{formatCurrency(game.currentYearSummary.incomeEarned, true)}</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-white/5">
                <span className="text-slate-400">Investment Returns</span>
                <span className={`font-bold ${game.currentYearSummary.investmentReturns >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatCurrency(game.currentYearSummary.investmentReturns, true)}
                </span>
              </div>
            </div>
            {game.currentYearSummary.events.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-slate-400 font-semibold">Events:</p>
                {game.currentYearSummary.events.map((e, i) => (
                  <p key={i} className="text-xs text-slate-300">• {e}</p>
                ))}
              </div>
            )}
            <Button variant="primary" fullWidth onClick={() => game.acknowledgeYearSummary()}>
              Continue to Year {(game.currentYearSummary?.year || 0) + 1} <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </Modal>

      {/* ==================== PLAYER-INITIATED MODALS ==================== */}

      {/* Career Change Modal */}
      <Modal isOpen={showCareerModal} onClose={() => setShowCareerModal(false)} title="💼 Change Career">
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {CAREERS.filter((c) => c.id !== game.career.id).map((career) => {
            const locked = career.requiredKnowledge > game.knowledge;
            return (
              <button
                key={career.id}
                onClick={() => {
                  if (!locked) {
                    game.changeCareer(career.id);
                    setShowCareerModal(false);
                  }
                }}
                disabled={locked}
                className={`w-full p-3 rounded-2xl border text-left transition-colors ${
                  locked ? 'bg-white/2 border-white/5 opacity-40' : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{career.emoji} {career.name}</span>
                  {locked && <Badge variant="danger" size="sm">🔒 Knowledge {career.requiredKnowledge}</Badge>}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{career.description}</p>
                <div className="flex gap-3 mt-1 text-[10px] text-slate-500">
                  <span>Salary: {formatCurrency(career.baseSalary, true)}/yr</span>
                  <span>Growth: {career.salaryGrowthRate}%</span>
                  <span>Risk: {career.riskLevel}</span>
                </div>
              </button>
            );
          })}
        </div>
      </Modal>

      {/* Direct Invest Modal */}
      <Modal isOpen={showInvestModal} onClose={() => setShowInvestModal(false)} title="📈 Invest">
        <div className="space-y-2 max-h-96 overflow-y-auto">
          <p className="text-xs text-slate-400">Available: {formatCurrency(game.cash, true)}</p>
          {INVESTMENT_OPTIONS.filter((inv) => inv.requiredKnowledge <= game.knowledge).map((inv) => (
            <button
              key={inv.id}
              onClick={() => setSelectedInvestment(inv.id)}
              className={`w-full p-3 rounded-2xl border text-left transition-colors ${
                selectedInvestment === inv.id ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{inv.emoji} {inv.name}</span>
                <Badge variant={inv.risk === 'low' ? 'success' : inv.risk === 'medium' ? 'warning' : 'danger'} size="sm">
                  {inv.risk}
                </Badge>
              </div>
              <div className="flex gap-3 mt-1 text-[10px] text-slate-500">
                <span>Min: {formatCurrency(inv.minAmount, true)}</span>
                <span>Return: ~{inv.expectedReturn}%</span>
              </div>
            </button>
          ))}
          {selectedInvestment && (
            <div className="pt-2 border-t border-white/10">
              <input
                type="number"
                value={investAmount}
                onChange={(e) => setInvestAmount(e.target.value)}
                placeholder="Enter amount..."
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 mb-2"
              />
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  const amt = parseInt(investAmount);
                  if (amt && selectedInvestment) {
                    const opt = INVESTMENT_OPTIONS.find((o) => o.id === selectedInvestment);
                    if (opt) {
                      setPendingInvestment({
                        optionId: selectedInvestment,
                        amount: amt,
                        type: opt.type,
                        name: opt.name,
                      });
                      setInvestAmount('');
                      setSelectedInvestment(null);
                      setShowInvestModal(false);
                    }
                  }
                }}
                disabled={!investAmount || parseInt(investAmount) > game.cash}
              >
                Invest Now
              </Button>
            </div>
          )}
        </div>
      </Modal>
      {/* Investment Knowledge Check Modal */}
      <Modal
        isOpen={!!pendingInvestment}
        onClose={() => {
          setPendingInvestment(null);
          setSelectedQuizAns(null);
          setShowQuizFeedback(false);
        }}
        title="🔍 Investment Knowledge Check"
      >
        {pendingInvestment && (() => {
          const quiz = INVESTMENT_QUIZZES[pendingInvestment.type];
          if (!quiz) return null;
          return (
            <div className="space-y-4 text-left">
              <p className="text-xs text-slate-300">
                Before completing your investment of <span className="font-bold text-emerald-400">{formatCurrency(pendingInvestment.amount, true)}</span> in <span className="font-bold text-white">{pendingInvestment.name}</span>, answer this educational question about <span className="font-semibold text-teal-400 capitalize">{pendingInvestment.type.replace('_', ' ')}</span>:
              </p>
              
              <Card variant="default" padding="sm" className="bg-slate-900 border-white/5">
                <p className="text-xs font-semibold text-white leading-relaxed">
                  {quiz.question}
                </p>
              </Card>

              <div className="space-y-2">
                {quiz.options.map((option, idx) => {
                  const isSelected = selectedQuizAns === idx;
                  let btnBorders = 'border-white/10 bg-white/2 hover:bg-white/5';
                  if (selectedQuizAns !== null) {
                    if (option.correct) {
                      btnBorders = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100';
                    } else if (isSelected) {
                      btnBorders = 'border-red-500/40 bg-red-500/10 text-red-100';
                    } else {
                      btnBorders = 'border-white/5 bg-transparent opacity-40';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedQuizAns !== null}
                      onClick={() => {
                        setSelectedQuizAns(idx);
                        setShowQuizFeedback(true);
                        if (option.correct) {
                          audio.playCoin();
                        } else {
                          audio.playFail();
                        }
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-start gap-2 ${btnBorders}`}
                    >
                      <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-[9px] text-slate-400 font-bold mt-0.5 select-none">
                        {idx === 0 ? 'A' : idx === 1 ? 'B' : 'C'}
                      </span>
                      <span className="flex-1 leading-normal">{option.text}</span>
                    </button>
                  );
                })}
              </div>

              {showQuizFeedback && selectedQuizAns !== null && (
                <div className="space-y-3">
                  <div className={`p-3 rounded-xl border text-[11px] leading-relaxed flex gap-2 ${
                    quiz.options[selectedQuizAns].correct
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                      : 'bg-red-500/10 border-red-500/20 text-red-300'
                  }`}>
                    {quiz.options[selectedQuizAns].correct ? (
                      <span className="font-bold flex-shrink-0 text-emerald-400">✅ Correct Answer!</span>
                    ) : (
                      <span className="font-bold flex-shrink-0 text-red-400">❌ Wrong Answer!</span>
                    )}
                  </div>
                  
                  <Card variant="default" padding="sm" className="bg-slate-900 border-white/5">
                    <p className="text-[10px] text-amber-400 font-bold uppercase mb-1">📖 Explanation:</p>
                    <p className="text-[10px] text-slate-300 leading-normal">{quiz.explanation}</p>
                  </Card>

                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => {
                      // Perform actual store investment
                      game.makeInvestment(pendingInvestment.optionId, pendingInvestment.amount);
                      setPendingInvestment(null);
                      setSelectedQuizAns(null);
                      setShowQuizFeedback(false);
                    }}
                  >
                    Proceed & Complete Investment
                  </Button>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* Year Advance Financial Checkup Modal */}
      <Modal
        isOpen={pendingYearAdvance}
        onClose={() => {
          setPendingYearAdvance(false);
          setSelectedQuizAns(null);
          setShowQuizFeedback(false);
        }}
        title="📅 Year Advance Financial Checkup"
      >
        {(() => {
          const quizIndex = game.year % YEARLY_QUIZZES.length;
          const quiz = YEARLY_QUIZZES[quizIndex];
          return (
            <div className="space-y-4 text-left">
              <p className="text-xs text-slate-300">
                Before advancing to <span className="font-bold text-purple-400">Year {game.year + 1}</span>, answer this financial checkup question to unlock next year:
              </p>
              
              <Card variant="default" padding="sm" className="bg-slate-900 border-white/5">
                <p className="text-xs font-semibold text-white leading-relaxed">
                  {quiz.question}
                </p>
              </Card>

              <div className="space-y-2">
                {quiz.options.map((option, idx) => {
                  const isSelected = selectedQuizAns === idx;
                  let btnBorders = 'border-white/10 bg-white/2 hover:bg-white/5';
                  if (selectedQuizAns !== null) {
                    if (option.correct) {
                      btnBorders = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100';
                    } else if (isSelected) {
                      btnBorders = 'border-red-500/40 bg-red-500/10 text-red-100';
                    } else {
                      btnBorders = 'border-white/5 bg-transparent opacity-40';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedQuizAns !== null}
                      onClick={() => {
                        setSelectedQuizAns(idx);
                        setShowQuizFeedback(true);
                        if (option.correct) {
                          audio.playCoin();
                        } else {
                          audio.playFail();
                        }
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-start gap-2 ${btnBorders}`}
                    >
                      <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-[9px] text-slate-400 font-bold mt-0.5 select-none">
                        {idx === 0 ? 'A' : idx === 1 ? 'B' : 'C'}
                      </span>
                      <span className="flex-1 leading-normal">{option.text}</span>
                    </button>
                  );
                })}
              </div>

              {showQuizFeedback && selectedQuizAns !== null && (
                <div className="space-y-3">
                  <div className={`p-3 rounded-xl border text-[11px] leading-relaxed flex gap-2 ${
                    quiz.options[selectedQuizAns].correct
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                      : 'bg-red-500/10 border-red-500/20 text-red-300'
                  }`}>
                    {quiz.options[selectedQuizAns].correct ? (
                      <span className="font-bold flex-shrink-0 text-emerald-400">✅ Correct! (Knowledge +5)</span>
                    ) : (
                      <span className="font-bold flex-shrink-0 text-red-400">❌ Wrong Answer!</span>
                    )}
                  </div>
                  
                  <Card variant="default" padding="sm" className="bg-slate-900 border-white/5">
                    <p className="text-[10px] text-amber-400 font-bold uppercase mb-1">📖 Explanation:</p>
                    <p className="text-[10px] text-slate-300 leading-normal">{quiz.explanation}</p>
                  </Card>

                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => {
                      const isCorrect = quiz.options[selectedQuizAns].correct;
                      game.submitQuizAnswer(isCorrect);
                      
                      // Rerun year advance
                      handleAdvanceYear();
                      
                      setPendingYearAdvance(false);
                      setSelectedQuizAns(null);
                      setShowQuizFeedback(false);
                    }}
                  >
                    Advance to Year {game.year + 1}
                  </Button>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>
    </PageTransition>
  );
}
