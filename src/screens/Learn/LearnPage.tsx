// ============================================================
// Learn Page — Financial literacy section
// ============================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronUp, Shield, AlertTriangle } from 'lucide-react';
import { useGame } from '../../hooks/useGame';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { PageTransition } from '../../components/ui/PageTransition';
import { SCAMS } from '../../data/scams';

export function LearnPage() {
  const game = useGame();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Show scams the player has encountered, plus general tips
  const encounteredScamIds = game.timeline
    .filter((t) => t.type === 'scam_avoided' || t.type === 'scam_fallen')
    .map((t) => t.title.replace('Fell for: ', '').replace('Avoided: ', '').replace('Investigated: ', ''));

  const encounteredScams = SCAMS.filter((s) =>
    encounteredScamIds.some((id) => id === s.name)
  );

  const otherScams = SCAMS.filter(
    (s) => !encounteredScamIds.some((id) => id === s.name)
  );

  const tips = [
    { emoji: '🌱', title: 'Start Early', content: 'The power of compounding means even small investments grow exponentially over decades. Starting at 22 vs 32 can mean 2-3x more wealth.' },
    { emoji: '🛡️', title: 'Emergency Fund First', content: 'Before investing, build an emergency fund covering 6 months of expenses. This prevents you from selling investments at a loss during emergencies.' },
    { emoji: '🥚', title: 'Diversify', content: 'Don\'t put all your eggs in one basket. Spread investments across stocks, bonds, gold, and real estate to reduce risk.' },
    { emoji: '📊', title: 'Index Funds Win', content: 'Most active fund managers underperform index funds over 10+ years. Low-cost index funds are often the best choice for long-term investors.' },
    { emoji: '⚠️', title: 'If It\'s Too Good...', content: 'Any investment promising returns above 15-20% annually is likely either very risky or a scam. Guaranteed high returns don\'t exist.' },
    { emoji: '🔒', title: 'Never Share OTP', content: 'Banks, government agencies, and legitimate companies will NEVER ask for your OTP, PIN, or CVV over phone, SMS, or email.' },
    { emoji: '💰', title: 'Pay Yourself First', content: 'Save and invest 20-30% of your income BEFORE spending. Automate SIPs so saving happens without willpower.' },
    { emoji: '📈', title: 'Stay Invested', content: 'Time in the market beats timing the market. Don\'t panic sell during crashes — historically, markets always recover.' },
  ];

  return (
    <PageTransition className="pb-24 px-4 pt-4 max-w-lg mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5"
      >
        <h1 className="text-2xl font-bold text-white font-poppins flex items-center gap-2">
          <BookOpen size={24} className="text-amber-400" /> Learn
        </h1>
        <p className="text-sm text-slate-400 mt-1">Financial literacy is your superpower</p>
      </motion.div>

      {/* Knowledge Level */}
      <Card variant="gradient" padding="md" className="mb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Your Knowledge</p>
            <p className="text-2xl font-extrabold text-white">{game.knowledge}/100</p>
          </div>
          <div className="text-right">
            <Badge variant={game.knowledge >= 70 ? 'success' : game.knowledge >= 40 ? 'warning' : 'danger'} size="md">
              {game.knowledge >= 70 ? '🧠 Expert' : game.knowledge >= 40 ? '📚 Learning' : '🌱 Beginner'}
            </Badge>
          </div>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${game.knowledge}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </Card>

      {/* Financial Tips */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Shield size={16} className="text-emerald-400" /> Financial Tips
        </h2>
        <div className="space-y-2">
          {tips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => setExpandedId(expandedId === `tip-${i}` ? null : `tip-${i}`)}
                className="w-full text-left"
              >
                <Card variant="default" padding="sm" animate={false}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{tip.emoji}</span>
                      <span className="text-sm font-semibold text-white">{tip.title}</span>
                    </div>
                    {expandedId === `tip-${i}` ? (
                      <ChevronUp size={16} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-400" />
                    )}
                  </div>
                  <AnimatePresence>
                    {expandedId === `tip-${i}` && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs text-slate-400 mt-2 leading-relaxed overflow-hidden"
                      >
                        {tip.content}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </Card>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Encountered Scams */}
      {encounteredScams.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400" /> Scams You Encountered
          </h2>
          <div className="space-y-2">
            {encounteredScams.map((scam) => (
              <button
                key={scam.id}
                onClick={() => setExpandedId(expandedId === scam.id ? null : scam.id)}
                className="w-full text-left"
              >
                <Card variant="danger" padding="sm" animate={false}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{scam.emoji}</span>
                      <span className="text-sm font-semibold text-white">{scam.name}</span>
                    </div>
                    <Badge variant="danger" size="sm">{scam.category.replace(/_/g, ' ')}</Badge>
                  </div>
                  <AnimatePresence>
                    {expandedId === scam.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 space-y-2 text-xs">
                          <div>
                            <p className="font-semibold text-amber-400">How it works:</p>
                            <p className="text-slate-400">{scam.learnMore.howItWorks}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-red-400">Warning signs:</p>
                            <ul className="text-slate-400 space-y-0.5">
                              {scam.learnMore.warningSigns.map((sign, i) => (
                                <li key={i}>🚩 {sign}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="font-semibold text-emerald-400">How to stay safe:</p>
                            <p className="text-slate-400">{scam.learnMore.howToStaySafe}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All Scam Categories */}
      <div className="mb-4">
        <h2 className="text-sm font-bold text-white mb-3">📖 Scam Awareness Library</h2>
        <div className="space-y-2">
          {otherScams.slice(0, 6).map((scam) => (
            <button
              key={scam.id}
              onClick={() => setExpandedId(expandedId === `lib-${scam.id}` ? null : `lib-${scam.id}`)}
              className="w-full text-left"
            >
              <Card variant="default" padding="sm" animate={false}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{scam.emoji}</span>
                    <span className="text-sm text-white">{scam.name}</span>
                  </div>
                  {expandedId === `lib-${scam.id}` ? (
                    <ChevronUp size={14} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={14} className="text-slate-400" />
                  )}
                </div>
                <AnimatePresence>
                  {expandedId === `lib-${scam.id}` && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 space-y-1.5 text-xs text-slate-400">
                        <p>{scam.learnMore.howItWorks}</p>
                        <p className="text-emerald-400 font-semibold">{scam.learnMore.howToStaySafe}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
