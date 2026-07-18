// ============================================================
// ScamBossBattle — RPG Dialog Boss Battle
// ============================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Heart, Play, CheckCircle, XCircle } from 'lucide-react';
import type { BossBattle } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { audio } from '../../utils/audio';

interface ScamBossBattleProps {
  battle: BossBattle;
  onAnswer: (optionIndex: number) => void;
  onDismiss: () => void;
}

export function ScamBossBattle({ battle, onAnswer, onDismiss }: ScamBossBattleProps) {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = battle.questions[battle.currentQuestionIndex];
  if (!currentQuestion) return null;

  const handleSelectOption = (index: number) => {
    setSelectedOptionIndex(index);
    setShowFeedback(true);
    const option = currentQuestion.options[index];
    if (option?.correct) {
      audio.playCoin();
    } else {
      audio.playFail();
    }
  };

  const handleContinue = () => {
    if (selectedOptionIndex !== null) {
      onAnswer(selectedOptionIndex);
      setSelectedOptionIndex(null);
      setShowFeedback(false);
    }
  };

  const selectedOption = selectedOptionIndex !== null ? currentQuestion.options[selectedOptionIndex] : null;

  return (
    <Card variant="gradient" padding="md" className="space-y-4 w-full max-w-md my-auto relative border-purple-500/20 bg-slate-950/95 backdrop-blur-2xl">
      {/* RPG HUD (Heads Up Display) */}
      <div className="grid grid-cols-2 gap-4 pb-3 border-b border-white/5 text-xs select-none">
        {/* Boss HP */}
        <div className="space-y-1">
          <div className="flex justify-between items-center font-bold">
            <span className="text-red-400 flex items-center gap-1">
              {battle.emoji} {battle.title}
            </span>
            <span className="text-white">{battle.bossHealth} HP</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-600 to-rose-400 rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: `${battle.bossHealth}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Player Shields */}
        <div className="space-y-1 text-right">
          <div className="flex justify-between items-center font-bold flex-row-reverse">
            <span className="text-blue-400 flex items-center gap-1">
              <Shield size={12} /> Your Shield
            </span>
            <div className="flex gap-0.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={i}
                  size={12}
                  className={i < battle.playerShield ? 'text-red-500 fill-red-500' : 'text-slate-700'}
                />
              ))}
            </div>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden flex justify-end">
            <motion.div
              className="h-full bg-gradient-to-l from-blue-500 to-cyan-400 rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: `${(battle.playerShield / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showFeedback ? (
          <motion.div
            key="battle-dialog"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Boss Character Visual */}
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-xl border border-red-500/30 flex items-center justify-center text-4xl select-none">
                {battle.emoji}
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm">{battle.name}</h4>
                <p className="text-[10px] text-red-400 font-semibold">{battle.title}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">{battle.description}</p>
              </div>
            </div>

            {/* Boss Dialogue Bubble */}
            <div className="relative p-4 rounded-3xl bg-slate-900 border border-white/10 shadow-inner">
              <p className="text-[9px] text-red-400 uppercase tracking-widest font-extrabold mb-1 select-none">Statement:</p>
              <p className="text-xs text-slate-100 font-medium leading-relaxed italic">
                {currentQuestion.text}
              </p>
            </div>

            {/* Answer Options */}
            <div className="space-y-2 pt-2">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold select-none">Select Response:</p>
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-left text-xs font-semibold text-slate-200 transition-colors flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center flex-shrink-0 text-[10px] text-slate-400 font-bold select-none">
                    {idx + 1}
                  </span>
                  <span className="flex-1 mt-0.5 leading-normal">{option.text}</span>
                </button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              fullWidth
              className="text-[10px] text-slate-500 hover:text-slate-400"
              onClick={onDismiss}
            >
              Flee Battle (Dismiss)
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="battle-feedback"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="py-6 text-center space-y-4"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white shadow-xl ${
              selectedOption?.correct ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-red-500 shadow-red-500/20'
            }`}>
              {selectedOption?.correct ? <CheckCircle size={32} /> : <XCircle size={32} />}
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-white">
                {selectedOption?.correct ? 'Direct Hit! Boss Damaged' : 'Shield Block Failed!'}
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                {selectedOption?.correct
                  ? 'Your cybersecurity knowledge successfully counteracted the scammer.'
                  : 'You fell for the social engineering trap. Your defense took damage.'}
              </p>
            </div>

            {selectedOption && (
              <div className={`p-4 rounded-2xl text-left border text-xs max-w-xs mx-auto leading-relaxed ${
                selectedOption.correct ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200' : 'bg-red-500/10 border-red-500/25 text-red-200'
              }`}>
                <p className="font-extrabold mb-1">Educational Context:</p>
                <p className="text-slate-300 text-[11px]">{selectedOption.explanation}</p>
              </div>
            )}

            <div className="pt-2 max-w-xs mx-auto">
              <Button
                variant="primary"
                fullWidth
                icon={<Play size={16} />}
                onClick={handleContinue}
              >
                Continue Battle
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
