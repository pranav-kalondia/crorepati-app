// ============================================================
// ScamDetective — Spot the Red Flags mini-game
// ============================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Search,
  CheckCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  ArrowRight,
  ShieldAlert as RadarIcon
} from 'lucide-react';
import type { Scam, ScamClue } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { audio } from '../../utils/audio';

interface ScamDetectiveProps {
  scam: Scam;
  onVerdict: (correct: boolean) => void; // Send whether they chose the correct verdict
}

export function ScamDetective({ scam, onVerdict }: ScamDetectiveProps) {
  const [scannedIds, setScannedIds] = useState<string[]>([]);
  const [selectedClue, setSelectedClue] = useState<ScamClue | null>(null);
  const [showVerdictConfirm, setShowVerdictConfirm] = useState(false);
  const [submittedVerdict, setSubmittedVerdict] = useState<boolean | null>(null);

  const clues = scam.clues || [];
  const totalFlags = clues.filter((c) => c.isRedFlag).length;
  const flagsScanned = clues.filter((c) => scannedIds.includes(c.id) && c.isRedFlag).length;

  const handleScanClue = (clue: ScamClue) => {
    setSelectedClue(clue);
    if (!scannedIds.includes(clue.id)) {
      setScannedIds([...scannedIds, clue.id]);
      if (clue.isRedFlag) {
        audio.playScam();
      } else {
        audio.playClick();
      }
    } else {
      audio.playClick();
    }
  };

  const handleVerdict = (isScam: boolean) => {
    setSubmittedVerdict(isScam);
    setShowVerdictConfirm(true);
    audio.playClick();
  };

  const confirmVerdict = () => {
    // In our game, all encounters from this folder are indeed scams!
    // So the correct verdict is choosing "Scam" (isScam === true)
    const correct = submittedVerdict === true;
    onVerdict(correct);
  };

  return (
    <Card variant="gradient" padding="md" className="space-y-4 w-full max-w-md my-auto select-none border-teal-500/20 bg-slate-950/90 backdrop-blur-2xl">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
            <Search size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Scam Detective Scanner</h3>
            <p className="text-[10px] text-slate-400">Spot the red flags in the pitch below</p>
          </div>
        </div>
        <Badge variant="warning" size="sm">
          Radar Active
        </Badge>
      </div>

      <AnimatePresence mode="wait">
        {!showVerdictConfirm ? (
          <motion.div
            key="scanner-main"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Explanatory banner */}
            <div className="p-3 bg-white/2 rounded-2xl text-[10px] text-slate-300 leading-relaxed border border-white/5 flex gap-2">
              <Info size={16} className="text-teal-400 flex-shrink-0 mt-0.5" />
              <span>
                Press the highlighted boxes in the pitch document below to scan for warning indicators. Scan all clues before deciding.
              </span>
            </div>

            {/* Simulated Pitch with Clickable Clues */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-white/10 space-y-3 shadow-inner relative">
              <div className="absolute top-2 right-3 flex items-center gap-1 text-[8px] text-slate-500 uppercase tracking-widest font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" /> SCANNING PITCH
              </div>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-2">Subject Material:</p>

              <div className="text-xs text-slate-200 leading-relaxed font-mono whitespace-normal">
                {clues.map((clue) => {
                  const isScanned = scannedIds.includes(clue.id);
                  let borders = 'border border-dashed border-sky-500/30 bg-sky-500/2 hover:border-sky-500/60 hover:bg-sky-500/5';
                  if (isScanned) {
                    borders = clue.isRedFlag
                      ? 'border-2 border-solid border-red-500/60 bg-red-500/10 text-red-100 shadow-sm shadow-red-500/10'
                      : 'border-2 border-solid border-emerald-500/60 bg-emerald-500/10 text-emerald-100 shadow-sm shadow-emerald-500/10';
                  }

                  return (
                    <motion.button
                      key={clue.id}
                      onClick={() => handleScanClue(clue)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`inline-block rounded-xl px-2.5 py-1.5 m-1 text-left cursor-pointer transition-all ${borders}`}
                    >
                      {clue.isRedFlag && isScanned && '🚩 '}
                      {!clue.isRedFlag && isScanned && '✅ '}
                      {clue.text}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Scan Progress Bar */}
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  <RadarIcon size={12} className="text-teal-400" /> Red Flags Located:
                </span>
                <span className="font-extrabold text-white">
                  {flagsScanned} / {totalFlags}
                </span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${(scannedIds.length / clues.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Selected Clue Analysis */}
            <div className="min-h-[80px]">
              {selectedClue ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-3.5 rounded-2xl border ${
                    selectedClue.isRedFlag
                      ? 'bg-red-500/10 border-red-500/20 text-red-200'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                  } text-xs flex gap-2.5`}
                >
                  {selectedClue.isRedFlag ? (
                    <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h5 className="font-bold mb-0.5">
                      {selectedClue.isRedFlag ? 'Red Flag Spotted!' : 'Legitimate Statement'}
                    </h5>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{selectedClue.explanation}</p>
                  </div>
                </motion.div>
              ) : (
                <div className="p-4 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-slate-500 text-center gap-1.5">
                  <HelpCircle size={20} className="text-slate-600 animate-pulse" />
                  <p className="text-xs">Tap any highlighted box to run the Scam Radar scanner.</p>
                </div>
              )}
            </div>

            {/* Verdict Choices */}
            <div className="pt-2 border-t border-white/5">
              <p className="text-xs text-slate-400 font-semibold mb-2.5 text-center">
                Submit your scan results and final verdict:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="danger"
                  fullWidth
                  className="rounded-xl py-3 text-xs"
                  onClick={() => handleVerdict(true)}
                  disabled={scannedIds.length < Math.floor(clues.length / 2)}
                  icon={<ShieldAlert size={14} />}
                >
                  It's a Fraud/Scam
                </Button>
                <Button
                  variant="success"
                  fullWidth
                  className="rounded-xl py-3 text-xs"
                  onClick={() => handleVerdict(false)}
                  disabled={scannedIds.length < Math.floor(clues.length / 2)}
                  icon={<CheckCircle size={14} />}
                >
                  It's Legitimate
                </Button>
              </div>
              {scannedIds.length < Math.floor(clues.length / 2) && (
                <p className="text-[9px] text-slate-500 text-center mt-1.5">
                  Scan at least {Math.floor(clues.length / 2)} elements before submitting a verdict.
                </p>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="verdict-confirm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="py-6 text-center space-y-4"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto text-white shadow-lg ${
              submittedVerdict ? 'bg-red-500 shadow-red-500/20' : 'bg-emerald-500 shadow-emerald-500/20'
            }`}>
              {submittedVerdict ? <ShieldAlert size={28} /> : <CheckCircle size={28} />}
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">Confirm Your Verdict</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                You are about to report this document as{' '}
                <span className={`font-extrabold ${submittedVerdict ? 'text-red-400' : 'text-emerald-400'}`}>
                  {submittedVerdict ? 'A SCAM / FRAUD' : 'A LEGITIMATE OPPORTUNITY'}
                </span>
                .
              </p>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-[10px] text-slate-400 text-left max-w-xs mx-auto space-y-1">
              <p className="font-semibold text-slate-300">Scan Summary:</p>
              <p>• Clues checked: {scannedIds.length} / {clues.length}</p>
              <p>• Red flags spotted: {flagsScanned} / {totalFlags}</p>
            </div>

            <div className="flex gap-2 justify-center pt-2 max-w-xs mx-auto">
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => setShowVerdictConfirm(false)}
              >
                Go Back
              </Button>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                icon={<ArrowRight size={14} />}
                onClick={confirmVerdict}
              >
                Submit Verdict
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
