// ============================================================
// Landing Page — Beautiful animated hero
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, HelpCircle, Trophy, Lightbulb, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { FloatingParticles } from '../../components/animations/FloatingParticles';
import { useGameStore } from '../../store/gameStore';
import { formatCurrency } from '../../utils/formatters';
import { PageTransition } from '../../components/ui/PageTransition';

export function LandingPage() {
  const navigate = useNavigate();
  const { startGame, isPlaying, leaderboard, loadGame } = useGameStore();

  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  const handleStart = () => {
    if (isPlaying) {
      loadGame();
      navigate('/game');
      return;
    }
    setShowNameInput(true);
  };

  const handleBeginJourney = () => {
    if (playerName.trim()) {
      startGame(playerName.trim());
      navigate('/game');
    }
  };

  return (
    <PageTransition className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-blue-500/6 rounded-full blur-[80px]" />
      </div>

      {/* Floating particles */}
      <FloatingParticles count={12} />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-lg mx-auto w-full">
        {/* Logo / Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="mb-6"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
            <span className="text-4xl">💰</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl font-extrabold text-center font-poppins leading-tight"
        >
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Become a
          </span>
          <br />
          <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
            Crorepati
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 text-center text-slate-400 text-base sm:text-lg max-w-sm leading-relaxed"
        >
          Can you grow{' '}
          <span className="text-emerald-400 font-bold">₹10,000</span> into{' '}
          <span className="text-amber-400 font-bold">₹1 Crore</span> in 30
          Years?
        </motion.p>

        {/* Animated stats */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-6 flex items-center gap-4"
        >
          {[
            { label: 'Start', value: '₹10K', color: 'text-emerald-400' },
            { label: '→', value: '', color: 'text-slate-600' },
            { label: 'Goal', value: '₹1Cr', color: 'text-amber-400' },
            { label: '→', value: '', color: 'text-slate-600' },
            { label: 'Years', value: '30', color: 'text-purple-400' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              {item.value ? (
                <>
                  <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">{item.label}</div>
                </>
              ) : (
                <span className={`text-lg ${item.color}`}>{item.label}</span>
              )}
            </div>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 w-full flex flex-col gap-3"
        >
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon={isPlaying ? <Sparkles size={20} /> : <Play size={20} />}
            onClick={handleStart}
          >
            {isPlaying ? 'Continue Journey' : 'Start Journey'}
          </Button>

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowHowToPlay(true)}
              icon={<HelpCircle size={16} />}
            >
              How
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowLeaderboard(true)}
              icon={<Trophy size={16} />}
            >
              Rank
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowTips(true)}
              icon={<Lightbulb size={16} />}
            >
              Tips
            </Button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-xs text-slate-600 text-center"
        >
          A financial literacy game • Learn while you play
        </motion.p>
      </div>

      {/* ==================== Modals ==================== */}

      {/* Name Input Modal */}
      <Modal isOpen={showNameInput} onClose={() => setShowNameInput(false)} title="What's your name?">
        <div className="flex flex-col gap-4">
          <p className="text-slate-400 text-sm">Enter your name to begin your financial journey.</p>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBeginJourney()}
            placeholder="Enter your name..."
            maxLength={20}
            autoFocus
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 font-medium text-lg"
          />
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleBeginJourney}
            disabled={!playerName.trim()}
            icon={<Play size={18} />}
          >
            Begin Journey
          </Button>
        </div>
      </Modal>

      {/* How to Play Modal */}
      <Modal isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} title="How To Play">
        <div className="space-y-4 text-sm text-slate-300">
          {[
            { emoji: '🎯', title: 'Goal', desc: 'Grow ₹10,000 into ₹1 Crore within 30 years.' },
            { emoji: '📅', title: 'Each Round = 1 Year', desc: 'You\'ll receive salary, face life events, and make financial decisions.' },
            { emoji: '💼', title: 'Career', desc: 'Start as a graduate. Climb the career ladder or switch careers.' },
            { emoji: '📈', title: 'Invest Wisely', desc: 'Choose from stocks, mutual funds, gold, real estate, and more.' },
            { emoji: '🛡️', title: 'Avoid Scams', desc: 'Scammers will try to trick you. Investigate or ignore suspicious offers.' },
            { emoji: '🧠', title: 'Build Knowledge', desc: 'Higher knowledge unlocks better investments and career options.' },
            { emoji: '🤝', title: 'Trust Score', desc: 'Good decisions improve your trust score, attracting better opportunities.' },
            { emoji: '🏆', title: 'Win', desc: 'Reach ₹1 Crore net worth before age 52. Don\'t go bankrupt!' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-xl flex-shrink-0">{item.emoji}</span>
              <div>
                <h4 className="font-semibold text-white">{item.title}</h4>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Leaderboard Modal */}
      <Modal isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} title="🏆 Leaderboard">
        {leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl mb-3 block">🏆</span>
            <p className="text-slate-400">No entries yet. Be the first Crorepati!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5"
              >
                <span className="text-lg font-bold text-slate-500 w-6 text-center">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{entry.name}</p>
                  <p className="text-xs text-slate-400">
                    {entry.career} • Age {entry.age}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${entry.won ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {formatCurrency(entry.netWorth, true)}
                  </p>
                  <p className="text-[10px] text-slate-500">{entry.won ? '👑 Won' : 'Game Over'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Financial Tips Modal */}
      <Modal isOpen={showTips} onClose={() => setShowTips(false)} title="💡 Financial Tips">
        <div className="space-y-3 text-sm">
          {[
            { tip: 'Start investing early — compounding is magical over 20+ years.', emoji: '🌱' },
            { tip: 'Always have an emergency fund of 6 months\' expenses.', emoji: '🛡️' },
            { tip: 'Diversify your investments. Don\'t put all eggs in one basket.', emoji: '🥚' },
            { tip: 'If returns sound too good to be true, they probably are.', emoji: '⚠️' },
            { tip: 'Never share OTP, PIN, or CVV with anyone — ever.', emoji: '🔒' },
            { tip: 'Invest in your knowledge. Financial literacy is the best investment.', emoji: '📚' },
            { tip: 'Index funds beat most active fund managers over the long term.', emoji: '📊' },
            { tip: 'Avoid lifestyle inflation. Save before you spend.', emoji: '💰' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-2xl bg-white/5">
              <span className="text-lg flex-shrink-0">{item.emoji}</span>
              <p className="text-slate-300">{item.tip}</p>
            </div>
          ))}
        </div>
      </Modal>
    </PageTransition>
  );
}
