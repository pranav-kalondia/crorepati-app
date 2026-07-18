import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Shield,
  Brain,
  Briefcase,
  TrendingUp,
  AlertTriangle,
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

export function DashboardPage() {
  const game = useGame();
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [investAmount, setInvestAmount] = useState('');
  const [selectedInvestment, setSelectedInvestment] = useState<string | null>(null);
  const [coinExplode, setCoinExplode] = useState(false);
  const [investigatedFlags, setInvestigatedFlags] = useState<string[]>([]);

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
        // If we have investigated flags it means we successfully investigated it
        if (investigatedFlags.length > 0) {
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
  }, [game.gamePhase, game.isPlaying, game.currentLifeEvent, game.currentMarketUpdate, game.currentYearSummary, investigatedFlags.length]);

  // Auto-open modals based on game phase
  const handleAdvanceYear = () => {
    game.advanceYear();
    setCoinExplode(true);
    setTimeout(() => setCoinExplode(false), 100);
  };

  // Phase-driven modal display
  const showLifeEvent = game.gamePhase === 'life_event' && game.currentLifeEvent;
  const showInvestOpp = game.gamePhase === 'investment_opportunity' && game.currentInvestmentOpportunity;
  const showScam = game.gamePhase === 'scam_encounter' && game.currentScam;
  const showScamInvestigation = game.gamePhase === 'scam_investigation' && game.currentScam;
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
          label="Trust Score"
          value={`${game.trustScore}/100`}
          trend={game.trustScore > 60 ? 'up' : game.trustScore < 40 ? 'down' : 'neutral'}
          delay={0.1}
        />
        <StatCard
          icon={<Brain size={16} className="text-purple-400" />}
          label="Knowledge"
          value={`${game.knowledge}/100`}
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
            onClick={handleAdvanceYear}
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
                    game.makeInvestment(game.currentInvestmentOpportunity.id, amt);
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

      {/* Scam Encounter Modal */}
      <Modal
        isOpen={!!showScam}
        onClose={() => game.handleScamDecision('ignore')}
        title="📩 You received an offer..."
      >
        {game.currentScam && (
          <div className="space-y-4">
            <Card variant="highlight" padding="md">
              <p className="text-sm text-white font-medium">{game.currentScam.pitch}</p>
            </Card>
            <p className="text-slate-400 text-xs">{game.currentScam.description}</p>
            {game.currentScam.amountRequested > 0 && (
              <p className="text-center text-amber-400 font-bold">
                Amount requested: {formatCurrency(game.currentScam.amountRequested, true)}
              </p>
            )}
            <div className="space-y-2">
              <Button
                variant="amber"
                fullWidth
                onClick={() => game.handleScamDecision('go_for_it')}
              >
                🤑 Go For It!
              </Button>
              <Button
                variant="secondary"
                fullWidth
                icon={<AlertTriangle size={16} />}
                onClick={() => game.handleScamDecision('investigate')}
              >
                🔍 Investigate
              </Button>
              <Button
                variant="ghost"
                fullWidth
                onClick={() => game.handleScamDecision('ignore')}
              >
                ✋ Ignore
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Scam Investigation Modal */}
      <Modal
        isOpen={!!showScamInvestigation}
        onClose={() => game.handleScamDecision('ignore')}
        title="🔍 Investigation"
      >
        {game.currentScam && (
          <div className="space-y-4">
            <p className="text-slate-300 text-sm">Choose an investigation method:</p>
            {game.currentScam.investigationOptions.map((method) => (
              <button
                key={method.id}
                onClick={() => {
                  setInvestigatedFlags(game.currentScam?.redFlags || []);
                  game.investigateScam(method.id);
                }}
                disabled={method.cost > game.cash}
                className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-colors disabled:opacity-40"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white text-sm">{method.emoji} {method.name}</span>
                  <span className="text-xs text-amber-400">{method.cost > 0 ? formatCurrency(method.cost, true) : 'Free'}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{method.description}</p>
              </button>
            ))}
          </div>
        )}
      </Modal>

      {/* Scam Result Modal */}
      <Modal
        isOpen={!!showScamResult}
        onClose={() => { game.dismissScamResult(); setInvestigatedFlags([]); }}
        title={game.stats.scamsFallenFor > 0 && !investigatedFlags.length ? '😱 Scam Alert!' : '🛡️ Scam Exposed!'}
      >
        <div className="space-y-4">
          {investigatedFlags.length > 0 ? (
            <>
              <p className="text-emerald-400 font-semibold text-sm">Investigation revealed red flags:</p>
              <div className="space-y-1">
                {investigatedFlags.map((flag, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-red-400 mt-0.5">🚩</span>
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
              <p className="text-emerald-400 text-sm font-bold">You saved your money! Trust +5, Knowledge +5</p>
            </>
          ) : (
            <>
              <p className="text-red-400 font-bold text-lg text-center">
                You lost {formatCurrency(game.currentScam?.amountLost || 0, true)}!
              </p>
              <p className="text-slate-400 text-sm text-center">This was a scam. Learn from this experience.</p>
            </>
          )}
          {game.currentScam?.learnMore && (
            <Card variant="default" padding="sm">
              <h4 className="text-xs font-bold text-amber-400 uppercase mb-1">📖 Learn More</h4>
              <p className="text-xs text-slate-300">{game.currentScam.learnMore.howItWorks}</p>
              <h5 className="text-xs font-bold text-slate-400 mt-2">How to stay safe:</h5>
              <p className="text-xs text-slate-300">{game.currentScam.learnMore.howToStaySafe}</p>
            </Card>
          )}
          <Button variant="primary" fullWidth onClick={() => { game.dismissScamResult(); setInvestigatedFlags([]); }}>
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
                    game.makeInvestment(selectedInvestment, amt);
                    setInvestAmount('');
                    setSelectedInvestment(null);
                    setShowInvestModal(false);
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
    </PageTransition>
  );
}
