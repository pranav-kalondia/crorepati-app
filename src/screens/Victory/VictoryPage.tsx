// ============================================================
// Victory Page — Celebration screen
// ============================================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import { Crown, RotateCcw, Trophy, Shield, Brain, Briefcase, Target } from 'lucide-react';
import { useGame } from '../../hooks/useGame';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { MoneyCounter } from '../../components/animations/MoneyCounter';
import { PageTransition } from '../../components/ui/PageTransition';
import { formatCurrency } from '../../utils/formatters';
import { audio } from '../../utils/audio';

export function VictoryPage() {
  const game = useGame();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    // Play celebratory victory sound
    audio.playSuccess();

    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(() => setShowConfetti(false), 8000);

    // Add to leaderboard
    if (game.hasWon) {
      game.addToLeaderboard({
        name: game.playerName,
        netWorth: game.netWorth,
        age: game.age,
        career: game.career.name,
        date: new Date().toLocaleDateString(),
        won: true,
      });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const handleRestart = () => {
    game.resetGame();
    navigate('/');
  };

  return (
    <PageTransition className="min-h-screen bg-slate-950 relative overflow-hidden">
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={true}
          numberOfPieces={200}
          colors={['#10b981', '#f59e0b', '#6366f1', '#ef4444', '#8b5cf6', '#06b6d4']}
        />
      )}

      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 px-6 py-12 max-w-lg mx-auto">
        {/* Crown */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 shadow-2xl shadow-amber-500/30 mb-4">
            <Crown size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold font-poppins">
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
              CROREPATI!
            </span>
          </h1>
          <p className="text-slate-400 mt-2">You've done it! Incredible financial journey!</p>
        </motion.div>

        {/* Net Worth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="gradient" padding="lg" className="text-center mb-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Final Net Worth</p>
            <MoneyCounter
              amount={game.netWorth}
              className="text-4xl font-extrabold text-emerald-400"
              duration={2000}
            />
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 gap-2 mb-4"
        >
          {[
            { icon: <Trophy size={16} className="text-amber-400" />, label: 'Final Age', value: `${game.age} years` },
            { icon: <Briefcase size={16} className="text-blue-400" />, label: 'Career', value: game.career.name },
            { icon: <Shield size={16} className="text-emerald-400" />, label: 'Trust Score', value: `${game.trustScore}/100` },
            { icon: <Brain size={16} className="text-purple-400" />, label: 'Knowledge', value: `${game.knowledge}/100` },
            { icon: <Target size={16} className="text-green-400" />, label: 'Scams Avoided', value: `${game.stats.scamsAvoided}` },
            { icon: <Target size={16} className="text-red-400" />, label: 'Scams Fallen', value: `${game.stats.scamsFallenFor}` },
          ].map((stat, i) => (
            <Card key={i} variant="default" padding="sm">
              <div className="flex items-center gap-2 mb-1">{stat.icon}<span className="text-[10px] text-slate-500 uppercase">{stat.label}</span></div>
              <p className="text-sm font-bold text-white">{stat.value}</p>
            </Card>
          ))}
        </motion.div>

        {/* Financial Report */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card variant="default" padding="md" className="mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">📊 Financial Report</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-400">Total Salary Earned</span><span className="text-white font-bold">{formatCurrency(game.stats.totalSalaryEarned, true)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Total Tax Paid</span><span className="text-white font-bold">{formatCurrency(game.stats.totalTaxPaid, true)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Investment Gains</span><span className="text-emerald-400 font-bold">{formatCurrency(game.stats.totalInvestmentGains, true)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Scam Losses</span><span className="text-red-400 font-bold">{formatCurrency(game.stats.totalScamLoss, true)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Career Changes</span><span className="text-white font-bold">{game.stats.careerChanges}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Promotions</span><span className="text-white font-bold">{game.stats.promotions}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Years Played</span><span className="text-white font-bold">{game.stats.yearsPlayed}</span></div>
            </div>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Card variant="default" padding="md" className="mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">🏆 Achievements Unlocked</h3>
            <div className="flex flex-wrap gap-2">
              {game.achievements
                .filter((a) => a.unlocked)
                .map((a) => (
                  <div key={a.id} className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
                    {a.emoji} {a.name}
                  </div>
                ))}
              {game.achievements.filter((a) => a.unlocked).length === 0 && (
                <p className="text-slate-500 text-xs">No achievements unlocked</p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Restart */}
        <Button variant="primary" size="lg" fullWidth icon={<RotateCcw size={18} />} onClick={handleRestart}>
          Play Again
        </Button>
      </div>
    </PageTransition>
  );
}
