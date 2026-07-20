// ============================================================
// Learn Page — Scam Collection Book & Cyber Safety Quizzes
// ============================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Shield,
  CheckCircle,
  XCircle,
  Play,
  Award,
  BookMarked
} from 'lucide-react';
import { useGame } from '../../hooks/useGame';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { PageTransition } from '../../components/ui/PageTransition';
import { SCAMS } from '../../data/scams';
import { getScamRadarLevel, getFinancialLiteracyLevel } from '../Dashboard/DashboardPage';
import { audio } from '../../utils/audio';

// Scam Categories in the Collection Book
const SCAM_CATEGORIES = [
  { id: 'fake_investment_app', name: 'Phishing Apps', emoji: '📲', desc: 'Mock trading apps showing fake profits to lock and steal deposited savings.' },
  { id: 'ponzi_scheme', name: 'Ponzi Schemes', emoji: '💰', desc: 'Investment loops paying old recruits using fees collected from new signups.' },
  { id: 'lottery_scam', name: 'Lottery Fraud', emoji: '🎰', desc: 'Phony sweepstakes letters demanding clearance tax transfer before shipping prizes.' },
  { id: 'fake_job', name: 'Fake Job Offers', emoji: '✈️', desc: 'Urgent employment listings demanding upfront registration/visa fees.' },
  { id: 'fake_bank_call', name: 'KYC Phishing Call', emoji: '📞', desc: 'Imposter callers demanding bank OTP codes to check KYC status and unblock cards.' },
  { id: 'phishing_sms', name: 'Tax / Refund SMS', emoji: '💬', desc: 'Short texts carrying links to cloned tax portals to harvest net banking logs.' },
  { id: 'fake_crypto', name: 'Crypto VIP Groups', emoji: '🪙', desc: 'Telegram channels pushing low liquidity coins onto users for pump-and-dumps.' },
  { id: 'pyramid_scheme', name: 'MLM Schemes', emoji: '💊', desc: 'Sales network groups forcing upfront starter pack deposits and signups.' },
  { id: 'fake_real_estate', name: 'Property Fraud', emoji: '🌅', desc: 'Flyers selling land plots without RERA registration or clear ownership titles.' },
  { id: 'tech_support', name: 'Tech Support Scare', emoji: '🖥️', desc: 'Fake browser screens locking systems and asking for AnyDesk remote passwords.' }
];

interface QuizQuestion {
  question: string;
  options: { text: string; correct: boolean; explanation: string }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "Can a bank representative call you to ask for your verification OTP code?",
    options: [
      { text: "No, banks never ask for OTPs or CVVs over the phone.", correct: true, explanation: "Correct! OTPs are for your personal transactions only. Bank staff will never request them." },
      { text: "Yes, if they need to process an urgent KYC profile update.", correct: false, explanation: "Wrong! OTPs are private keys. Real banking representatives will never ask for them." }
    ]
  },
  {
    question: "Do you need to scan a QR code or enter your UPI PIN to receive money?",
    options: [
      { text: "No, UPI PIN is only entered to send money. Receiving is automatic.", correct: true, explanation: "Correct! UPI PIN is your signature to authorize debit. To credit money, someone only needs your ID/Number." },
      { text: "Yes, authentication is always required for deposit processing.", correct: false, explanation: "Wrong! Scanning QR codes to 'receive money' is a primary scam method to drain your account." }
    ]
  },
  {
    question: "Is an investment offering a 'guaranteed 250% return in 1 month' realistic?",
    options: [
      { text: "No, guaranteed returns do not exist, and 250% is a fraudulent claim.", correct: true, explanation: "Correct! Financial markets always carry risk. Promising astronomical risk-free returns is the hook of Ponzi schemes." },
      { text: "Yes, with algorithmic AI high-frequency trading assets.", correct: false, explanation: "Wrong! No algorithms or bots can guarantee triple-digit risk-free monthly yields. Be skeptical." }
    ]
  },
  {
    question: "Should you download AnyDesk if a tech support representative requests it?",
    options: [
      { text: "No, screen-sharing apps give strangers visual access to my mobile screens.", correct: true, explanation: "Correct! Granting remote control access allows scammers to view banking codes and credentials." },
      { text: "Yes, it allows support engineers to clean active laptop infections safely.", correct: false, explanation: "Wrong! Legitimate operators never call out of the blue to ask for remote controls. Hang up." }
    ]
  },
  {
    question: "Does the income tax department send SMS links to claim refunds?",
    options: [
      { text: "No, tax refunds are automatically credited directly to registered accounts.", correct: true, explanation: "Correct! Official refunds go straight to your bank. Links in text alerts are phishing hooks." },
      { text: "Yes, you must click and log in via the link to select your bank portal.", correct: false, explanation: "Wrong! Clicking these links leads to fake pages that steal your bank username and password." }
    ]
  },
  {
    question: "If someone calls on a WhatsApp video call claiming they are police/TRAI officials and placing you under 'digital arrest', what should you do?",
    options: [
      { text: "Hang up immediately. Government and police agencies never arrest anyone over video calls or demand online payments.", correct: true, explanation: "Correct! Official agencies never conduct arrests over video call or demand money online. Scammers use psychological pressure and fear to extort money." },
      { text: "Stay on the call, keep your camera on, and transfer the requested amount to clear your name.", correct: false, explanation: "Wrong! Video calls claiming digital arrest are 100% scams. Official procedures involve physical summons, not video chat threats." }
    ]
  },
  {
    question: "A contact online offers you a commission to open a bank account in your name or rent out your existing bank account. Is this safe?",
    options: [
      { text: "No. Renting or opening bank accounts for others is illegal and makes you an accomplice to money laundering (Mule Account fraud).", correct: true, explanation: "Correct! Fraudulent networks use rented accounts ('mule accounts') to launder stolen money. If the account is used for crime, the account holder is legally responsible." },
      { text: "Yes, it is a safe way to earn passive income as long as you do not share your ATM card PIN.", correct: false, explanation: "Wrong! Supplying bank accounts to others, even without PINs, is illegal money laundering facilitation. Police will freeze your accounts and take legal action." }
    ]
  },
  {
    question: "You receive a WhatsApp message from a number using your company CEO's photo, ordering you to make an urgent financial transfer immediately. What is the first step?",
    options: [
      { text: "Verify the request independently via a direct call or official internal company channels before sending any funds.", correct: true, explanation: "Correct! CEO/MD impersonation scams trick employees into transferring funds by creating a sense of urgency. Always confirm verbally via known numbers." },
      { text: "Process the transfer immediately to avoid getting fired or angering the CEO.", correct: false, explanation: "Wrong! Scammers scrape executive profiles to set up fake WhatsApp/email profiles. Always verify corporate transfers independently." }
    ]
  },
  {
    question: "You receive an SMS warning you of an unpaid traffic e-challan or electricity bill, with a link to download an APK file to view it. What should you do?",
    options: [
      { text: "Delete the SMS. Official departments never send APK download links. Installing unofficial APKs can compromise your mobile device.", correct: true, explanation: "Correct! Installing malicious APK files allows scammers to read your SMS (including OTPs), steal credentials, and compromise your mobile banking apps." },
      { text: "Download and install the APK to verify the bill details and avoid legal penalties.", correct: false, explanation: "Wrong! Government departments use official web portals, not custom APK file shares. Downloading random APKs compromises your phone's security sandbox." }
    ]
  },
  {
    question: "While booking a hotel or temple guest house online, you find a website with heavy discounts asking for immediate advance payments. How do you verify it?",
    options: [
      { text: "Verify details through official tourism department channels or contact the hotel directly using a number from their official listing.", correct: true, explanation: "Correct! Scammers create fake hotel websites and search listings to steal advance payments from tourists and devotees." },
      { text: "Pay immediately since they claim the rooms are filling fast and offer massive discounts.", correct: false, explanation: "Wrong! False urgency is a key scam sign. Always double-check hotel websites and direct contacts through trusted travel guides." }
    ]
  },
  {
    question: "A caller claiming to be from your bank offers a credit card limit upgrade and asks you to share the OTP sent to your phone. What should you do?",
    options: [
      { text: "Refuse and hang up. Banks will never ask for OTPs, PINs, or card CVVs to process upgrades or reward points.", correct: true, explanation: "Correct! Bank staff will never request sensitive security credentials. OTP sharing is only used to authorize debit transactions from your account." },
      { text: "Share the OTP to ensure you do not miss out on the credit card limit upgrade.", correct: false, explanation: "Wrong! Bank executives are forbidden from asking for passwords or OTPs. Sharing it grants scammers full access to drain your credit card balance." }
    ]
  },
  {
    question: "If you are a victim of cybercrime and want to claim a refund for siphoned funds, how should you proceed?",
    options: [
      { text: "Use only the official Money Restoration Module (MRM) on the National Cybercrime Portal. Avoid third-party 'refund recovery' agents.", correct: true, explanation: "Correct! There are many fake recovery agents online who scam victims again. The government's Money Restoration Module (MRM) is the only official, legal way to trace and restore blocked funds." },
      { text: "Search online for private recovery agents who guarantee refunding siphoned money for an upfront fee.", correct: false, explanation: "Wrong! Private recovery agents charging upfront fees are almost always secondary scams targeting already vulnerable victims." }
    ]
  }
];

export function LearnPage() {
  const game = useGame();
  const [expandedTipId, setExpandedTipId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<typeof SCAM_CATEGORIES[0] | null>(null);

  // Quiz State
  const [quizActive, setQuizActive] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnsIdx, setSelectedAnsIdx] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Find scams encountered or unlocked
  const encounteredScamIds = game.timeline
    .filter((t) => t.type === 'scam_avoided' || t.type === 'scam_fallen')
    .map((t) => t.title.replace('Fell for: ', '').replace('Avoided: ', '').replace('Investigated: ', '').replace('Scam Detected: ', ''));

  const encounteredScams = SCAMS.filter((s) =>
    encounteredScamIds.some((id) => id === s.name)
  );

  const checkCategoryUnlocked = (catId: string) => {
    // Unlocked if in store unlocked IDs or matched by encountered categories
    const isEncountered = encounteredScams.some((s) => s.category === catId);
    const isStoreUnlocked = game.unlockedScamIds.some((id) => {
      const matchScam = SCAMS.find((s) => s.id === id);
      return matchScam?.category === catId;
    });
    return isEncountered || isStoreUnlocked;
  };

  const startQuiz = () => {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random());
    setActiveQuestions(shuffled.slice(0, 3));
    setQuizActive(true);
    setQuizIndex(0);
    setSelectedAnsIdx(null);
    setQuizScore(0);
    setShowQuizResult(false);
    audio.playClick();
  };

  const handleSelectAnswer = (idx: number) => {
    setSelectedAnsIdx(idx);
    const correct = activeQuestions[quizIndex]?.options[idx].correct;
    if (correct) {
      setQuizScore((prev) => prev + 1);
      audio.playCoin();
    } else {
      audio.playFail();
    }
  };

  const handleNextQuiz = () => {
    audio.playClick();
    if (quizIndex < 2) {
      // 3-question sequence
      setQuizIndex((prev) => prev + 1);
      setSelectedAnsIdx(null);
    } else {
      // Finished
      setShowQuizResult(true);
      const wonQuiz = quizScore + (activeQuestions[quizIndex]?.options[selectedAnsIdx || 0].correct ? 1 : 0) >= 3;
      game.submitQuizAnswer(wonQuiz);
    }
  };

  const handleFinishQuiz = () => {
    setQuizActive(false);
    setShowQuizResult(false);
    audio.playClick();
  };

  // Find dynamic details for category card
  const getCategoryDetails = (catId: string) => {
    return SCAMS.find((s) => s.category === catId);
  };

  const tips = [
    { emoji: '🌱', title: 'Compounding Interest', content: 'Starting early lets compound interest do the heavy lifting. Accumulating assets at age 22 vs 32 can double your ultimate lifetime retirement wealth.' },
    { emoji: '🛡️', title: 'Emergency Reserves', content: 'Set aside 6 months of expenses in liquid savings before making risky investments. This cushions against unexpected job layoffs.' },
    { emoji: '🥚', title: 'Asset Diversification', content: 'Avoid putting all assets in stocks or crypto. Distribute investments across sovereign gold, mutual funds, and fixed deposits.' },
    { emoji: '🔒', title: 'Credential Security', content: 'Banks, verification agencies, and regulators will never request OTP codes, credit CVVs, or card credentials over phone calls or SMS.' }
  ];

  const radar = getScamRadarLevel(game.scamRadarScore);
  const literacy = getFinancialLiteracyLevel(game.knowledge);

  return (
    <PageTransition className="pb-24 px-4 pt-4 max-w-lg mx-auto overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-bold text-white font-poppins flex items-center gap-2">
            <BookOpen size={24} className="text-emerald-400" /> Education
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Build your cybersecurity armor</p>
        </div>
        <Badge variant="purple" size="md">
          {literacy.name}
        </Badge>
      </motion.div>

      {/* Scam Radar Progression Box */}
      <Card variant="gradient" padding="md" className="mb-5 border-emerald-500/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Scam Radar Level</p>
            <p className="text-xl font-extrabold text-white mt-0.5 flex items-center gap-1.5">
              <span>{radar.emoji}</span> {radar.name}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-400">Score: {game.scamRadarScore}/100</span>
          </div>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${game.scamRadarScore}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        <p className="text-[9px] text-slate-500 mt-2">
          Block scams and clear Cyber Safety Quizzes to level up your Scam Radar status.
        </p>
      </Card>

      {/* Cyber Safety Quiz Module */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2 select-none">
          <Award size={16} className="text-purple-400" /> Cyber Safety Quiz
        </h2>

        <AnimatePresence mode="wait">
          {!quizActive ? (
            <motion.div
              key="quiz-launcher"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <Card variant="default" padding="md" className="bg-slate-900 border-purple-500/10 text-center space-y-3">
                <p className="text-xs text-slate-300">
                  Challenge yourself with a rapid 3-question cyber security check to boost your Scam Radar stats.
                </p>
                <Button
                  variant="amber"
                  size="sm"
                  icon={<Play size={14} />}
                  onClick={startQuiz}
                >
                  Start Safety Quiz
                </Button>
              </Card>
            </motion.div>
          ) : showQuizResult ? (
            <motion.div
              key="quiz-result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card variant="default" padding="md" className="bg-slate-900 border-emerald-500/10 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-400">
                  <Award size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Quiz Completed!</h4>
                  <p className="text-xs text-slate-400">
                    You answered {quizScore}/3 questions correctly.
                  </p>
                </div>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  {quizScore >= 3
                    ? 'Perfect! You earned +6 Scam Radar score, +4 Knowledge, +3 Trust!'
                    : 'Good attempt. Keep reviewing warning flags to earn full credits next time.'}
                </p>
                <Button variant="primary" size="sm" onClick={handleFinishQuiz}>
                  Close Quiz
                </Button>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="quiz-active"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <Card variant="default" padding="md" className="bg-slate-900 border-white/10 space-y-4">
                <div className="flex justify-between items-center text-[10px] text-slate-500 select-none">
                  <span>SAFETY CHALLENGE</span>
                  <span>QUESTION {quizIndex + 1} OF 3</span>
                </div>

                <p className="text-xs font-semibold text-white leading-relaxed">
                  {activeQuestions[quizIndex]?.question}
                </p>

                <div className="space-y-2">
                  {activeQuestions[quizIndex]?.options.map((option, idx) => {
                    const isSelected = selectedAnsIdx === idx;
                    let optionBorders = 'border-white/10 bg-white/2 hover:bg-white/5';
                    if (selectedAnsIdx !== null) {
                      if (option.correct) {
                        optionBorders = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100';
                      } else if (isSelected) {
                        optionBorders = 'border-red-500/40 bg-red-500/10 text-red-100';
                      } else {
                        optionBorders = 'border-white/5 bg-transparent opacity-40';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={selectedAnsIdx !== null}
                        onClick={() => handleSelectAnswer(idx)}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-start gap-2 ${optionBorders}`}
                      >
                        <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-[9px] text-slate-400 font-bold select-none mt-0.5">
                          {idx === 0 ? 'A' : 'B'}
                        </span>
                        <span className="flex-1 leading-normal">{option.text}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedAnsIdx !== null && activeQuestions[quizIndex] && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-xl border text-[11px] leading-relaxed flex gap-2 ${
                      activeQuestions[quizIndex].options[selectedAnsIdx].correct
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                        : 'bg-red-500/10 border-red-500/20 text-red-300'
                    }`}
                  >
                    {activeQuestions[quizIndex].options[selectedAnsIdx].correct ? (
                      <CheckCircle size={14} className="flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={14} className="flex-shrink-0 mt-0.5" />
                    )}
                    <p>{activeQuestions[quizIndex].options[selectedAnsIdx].explanation}</p>
                  </motion.div>
                )}

                {selectedAnsIdx !== null && (
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={handleNextQuiz}
                  >
                    {quizIndex < 2 ? 'Next Question' : 'Finish Quiz'}
                  </Button>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scam Collection Book */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <BookMarked size={16} className="text-emerald-400" /> Scam Collection Book
        </h2>

        <div className="grid grid-cols-2 gap-2">
          {SCAM_CATEGORIES.map((cat) => {
            const unlocked = checkCategoryUnlocked(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (unlocked) {
                    setSelectedCategory(cat);
                    audio.playClick();
                  } else {
                    audio.playFail();
                  }
                }}
                className="w-full text-left"
              >
                <Card
                  variant={unlocked ? 'default' : 'gradient'}
                  padding="sm"
                  animate={false}
                  className={`h-24 flex flex-col justify-between transition-all select-none border-white/10 ${
                    unlocked
                      ? 'bg-slate-900 border-teal-500/20 hover:bg-slate-800 shadow-md cursor-pointer'
                      : 'bg-slate-950/40 opacity-55 border-dashed cursor-not-allowed'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-2xl">{unlocked ? cat.emoji : '🔒'}</span>
                    <Badge variant={unlocked ? 'success' : 'danger'} size="sm">
                      {unlocked ? 'Active' : 'Locked'}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-white leading-tight truncate">
                      {cat.name}
                    </h4>
                    <p className="text-[9px] text-slate-500 truncate mt-0.5">
                      {unlocked ? 'Tap to read card' : 'Encounter to unlock'}
                    </p>
                  </div>
                </Card>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Details Modal */}
      <Modal
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
        title={selectedCategory ? `${selectedCategory.emoji} ${selectedCategory.name}` : ''}
      >
        {selectedCategory && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed bg-white/2 p-3 rounded-2xl border border-white/5">
              {selectedCategory.desc}
            </p>

            {(() => {
              const matchedScam = getCategoryDetails(selectedCategory.id);
              if (!matchedScam) return null;
              return (
                <div className="space-y-3">
                  <div className="text-xs space-y-1">
                    <h5 className="font-bold text-amber-400">🚨 How it Works:</h5>
                    <p className="text-slate-400 leading-relaxed">{matchedScam.learnMore.howItWorks}</p>
                  </div>

                  <div className="text-xs space-y-1 bg-red-500/5 p-3 rounded-2xl border border-red-500/10">
                    <h5 className="font-bold text-red-400">🚩 Warning Signs:</h5>
                    <ul className="text-slate-300 space-y-1 mt-1 pl-1">
                      {matchedScam.learnMore.warningSigns.map((sign, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-red-400">•</span>
                          <span>{sign}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-xs space-y-1 bg-emerald-500/5 p-3 rounded-2xl border border-emerald-500/10">
                    <h5 className="font-bold text-emerald-400">🛡️ How to Stay Safe:</h5>
                    <p className="text-slate-300 leading-relaxed">{matchedScam.learnMore.howToStaySafe}</p>
                  </div>
                </div>
              );
            })()}

            <Button variant="primary" fullWidth onClick={() => setSelectedCategory(null)}>
              Close Card
            </Button>
          </div>
        )}
      </Modal>

      {/* Core Financial Tips (Preserved) */}
      <div className="mb-4">
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2 select-none">
          <Shield size={16} className="text-emerald-400" /> Core Financial Tips
        </h2>
        <div className="space-y-2">
          {tips.map((tip, i) => (
            <button
              key={i}
              onClick={() => setExpandedTipId(expandedTipId === `tip-${i}` ? null : `tip-${i}`)}
              className="w-full text-left"
            >
              <Card variant="default" padding="sm" animate={false}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{tip.emoji}</span>
                    <span className="text-xs font-semibold text-white">{tip.title}</span>
                  </div>
                  {expandedTipId === `tip-${i}` ? (
                    <ChevronUp size={16} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-400" />
                  )}
                </div>
                <AnimatePresence>
                  {expandedTipId === `tip-${i}` && (
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
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
