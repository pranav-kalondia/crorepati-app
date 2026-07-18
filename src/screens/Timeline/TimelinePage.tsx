// ============================================================
// Timeline Page — Visual history of decisions
// ============================================================

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useGame } from '../../hooks/useGame';
import { PageTransition } from '../../components/ui/PageTransition';
import { formatCurrency } from '../../utils/formatters';


const typeDotColors: Record<string, string> = {
  career: 'bg-blue-500',
  investment: 'bg-emerald-500',
  scam_avoided: 'bg-green-500',
  scam_fallen: 'bg-red-500',
  life_event: 'bg-purple-500',
  milestone: 'bg-amber-500',
  market: 'bg-cyan-500',
  achievement: 'bg-yellow-500',
};

export function TimelinePage() {
  const game = useGame();

  const sortedTimeline = [...game.timeline].reverse();

  return (
    <PageTransition className="pb-24 px-4 pt-4 max-w-lg mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5"
      >
        <h1 className="text-2xl font-bold text-white font-poppins flex items-center gap-2">
          <Clock size={24} className="text-cyan-400" /> Timeline
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Your financial journey • {game.timeline.length} events
        </p>
      </motion.div>

      {/* Timeline */}
      {sortedTimeline.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl mb-4 block">📅</span>
          <p className="text-slate-400 text-sm">Your journey hasn't started yet.</p>
          <p className="text-slate-500 text-xs mt-1">Advance a year to see events here.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent" />

          <div className="space-y-1">
            {sortedTimeline.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                className="relative pl-12 py-2"
              >
                {/* Dot */}
                <div className={`absolute left-3.5 top-4 w-3 h-3 rounded-full ${typeDotColors[entry.type] || 'bg-slate-500'} ring-2 ring-slate-900 z-10`} />

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/8 rounded-2xl p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-base">{entry.emoji}</span>
                        <span className="text-sm font-semibold text-white">
                          {entry.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {entry.description}
                      </p>
                    </div>
                    <div className="text-right ml-2 flex-shrink-0">
                      <p className="text-[10px] text-slate-500">Age {entry.age}</p>
                      {entry.financialImpact !== 0 && (
                        <p className={`text-xs font-bold ${entry.financialImpact > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {entry.financialImpact > 0 ? '+' : ''}
                          {formatCurrency(entry.financialImpact, true)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </PageTransition>
  );
}
