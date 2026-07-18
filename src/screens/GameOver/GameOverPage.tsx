// ============================================================
// Game Over Page — Bankrupt/time-up screen
// ============================================================

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Skull, RotateCcw, TrendingDown, AlertCircle } from 'lucide-react';
import { useGame } from '../../hooks/useGame';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { MoneyCounter } from '../../components/animations/MoneyCounter';
import { PageTransition } from '../../components/ui/PageTransition';
import { formatCurrency } from '../../utils/formatters';
import { audio } from '../../utils/audio';

export function GameOverPage() {
  const game = useGame();
  const navigate = useNavigate();

  const isBankrupt = game.netWorth <= 0;
  useEffect(() => {
    // Play fail sound effect
    audio.playFail();

    // Add to leaderboard
    game.addToLeaderboard({
      name: game.playerName,
      netWorth: game.netWorth,
      age: game.age,
      career: game.career.name,
      date: new Date().toLocaleDateString(),
      won: false,
    });
  }, []);

  const handleRestart = () => {
    game.resetGame();
    navigate('/');
  };

  // Determine biggest mistake
  const biggestMistake = game.stats.totalScamLoss > 0
    ? `Lost ${formatCurrency(game.stats.totalScamLoss, true)} to scams`
    : game.investments.length === 0
    ? 'Never invested your money'
    : 'Insufficient diversification';

  const advice = isBankrupt
    ? [
        'Always maintain an emergency fund of 6 months\' expenses.',
        'Diversify your investments — never put everything in one place.',
        'If returns sound too good to be true, they probably are.',
        'Investigate before investing — a small cost can save a fortune.',
      ]
    : [
        'Start investing earlier and more aggressively.',
        'Take calculated risks — FDs alone won\'t make you a Crorepati.',
        'Upskill to unlock higher-paying careers.',
        'Compound interest needs time — start SIPs from Day 1.',
      ];

  return (
    <PageTransition className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-500/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 px-6 py-12 max-w-lg mx-auto">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-rose-600 shadow-2xl shadow-red-500/30 mb-4">
            {isBankrupt ? <Skull size={48} className="text-white" /> : <TrendingDown size={48} className="text-white" />}
          </div>
          <h1 className="text-3xl font-extrabold font-poppins text-red-400">
            {isBankrupt ? 'BANKRUPT!' : 'TIME\'S UP!'}
          </h1>
          <p className="text-slate-400 mt-2">
            {isBankrupt
              ? 'You\'ve run out of money. But every failure is a lesson.'
              : 'You ran out of time. The ₹1 Crore dream remains unfulfilled.'}
          </p>
        </motion.div>

        {/* Net Worth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="danger" padding="lg" className="text-center mb-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Final Net Worth</p>
            <MoneyCounter
              amount={Math.max(0, game.netWorth)}
              className="text-3xl font-extrabold text-red-400"
              duration={1500}
            />
            <p className="text-sm text-slate-500 mt-1">Age: {game.age} • Year {game.year}</p>
          </Card>
        </motion.div>

        {/* Biggest Mistake */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card variant="default" padding="md" className="mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Biggest Mistake</h3>
                <p className="text-xs text-slate-400">{biggestMistake}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card variant="default" padding="md" className="mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Summary</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-400">Salary Earned</span><span className="text-white font-bold">{formatCurrency(game.stats.totalSalaryEarned, true)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Scams Avoided</span><span className="text-emerald-400 font-bold">{game.stats.scamsAvoided}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Scams Fallen For</span><span className="text-red-400 font-bold">{game.stats.scamsFallenFor}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Total Scam Loss</span><span className="text-red-400 font-bold">{formatCurrency(game.stats.totalScamLoss, true)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Career</span><span className="text-white font-bold">{game.career.name}</span></div>
            </div>
          </Card>
        </motion.div>

        {/* Financial Advice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Card variant="highlight" padding="md" className="mb-6">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">💡 Advice for Next Time</h3>
            <div className="space-y-2">
              {advice.map((tip, i) => (
                <p key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-emerald-400">•</span> {tip}
                </p>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Restart */}
        <Button variant="primary" size="lg" fullWidth icon={<RotateCcw size={18} />} onClick={handleRestart}>
          Try Again
        </Button>
      </div>
    </PageTransition>
  );
}
