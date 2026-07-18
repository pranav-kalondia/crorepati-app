// ============================================================
// InteractivePhone — Simulated Smartphone UI
// ============================================================

import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  Wifi,
  Battery,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Ban,
  ArrowLeft,
} from 'lucide-react';
import type { PhoneNotification } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { audio } from '../../utils/audio';

interface InteractivePhoneProps {
  notification: PhoneNotification;
  onAction: (action: 'open' | 'block' | 'ignore' | 'verify') => void;
  onAcceptScam: () => void; // Triggered if player clicks "Pay" or "Go for it" inside phone
  isEncounterPhase: boolean; // True if the notification is opened
}

export function InteractivePhone({
  notification,
  onAction,
  onAcceptScam,
  isEncounterPhase,
}: InteractivePhoneProps) {


  const getAppColor = () => {
    switch (notification.type) {
      case 'whatsapp':
        return 'emerald';
      case 'sms':
        return 'sky';
      case 'email':
        return 'indigo';
      case 'upi':
        return 'purple';
      case 'call':
        return 'red';
      default:
        return 'slate';
    }
  };

  const color = getAppColor();

  // Get current simulated phone time
  const phoneTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div className="w-full max-w-[320px] h-[540px] sm:h-[580px] rounded-[40px] border-8 border-slate-800 bg-slate-950 overflow-hidden relative shadow-2xl my-auto flex flex-col ring-1 ring-white/10">
      {/* Top Notch / Speaker & Dynamic Island */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-2xl z-50 flex items-center justify-center">
        <div className="w-16 h-1 bg-slate-900 rounded-full" />
        <div className="w-2.5 h-2.5 bg-slate-900 rounded-full ml-3" />
      </div>

      {/* Screen Status Bar */}
      <div className="h-9 px-6 pt-3 flex justify-between items-center text-[10px] text-white/80 font-medium z-40 bg-black/10 select-none">
        <span>{phoneTime}</span>
        <div className="flex items-center gap-1.5">
          <Wifi size={10} />
          <span className="font-bold">5G</span>
          <Battery size={12} className="rotate-0" />
        </div>
      </div>

      {/* Screen Content Area */}
      <div className="flex-1 relative flex flex-col overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* 1. Incoming Call Phase */}
          {!isEncounterPhase && notification.type === 'call' && (
            <motion.div
              key="call-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900 flex flex-col justify-between py-12 px-6 z-30"
            >
              <div className="text-center mt-12 space-y-2">
                <div className="w-20 h-20 bg-red-500/20 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <Phone size={36} className="text-red-400 rotate-[135deg]" />
                </div>
                <h3 className="text-xl font-bold text-white mt-4">{notification.sender}</h3>
                <p className="text-xs text-red-400 font-semibold animate-pulse tracking-wide uppercase">Potential Spam / Unknown Call</p>
                <p className="text-xs text-slate-400 italic">"Claiming to be from your bank representative"</p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-950/60 backdrop-blur border border-white/5 p-4 rounded-2xl text-xs text-slate-300 leading-relaxed text-center">
                  <p className="font-semibold text-white mb-1">Preview Transcript:</p>
                  "{notification.content.slice(0, 75)}..."
                </div>

                <div className="flex justify-around items-center pt-4">
                  {/* Decline Button */}
                  <button
                    onClick={() => {
                      audio.playFail();
                      onAction('ignore');
                    }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors shadow-lg">
                      <Phone size={24} className="rotate-[135deg]" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">Decline</span>
                  </button>

                  {/* Accept Button */}
                  <button
                    onClick={() => {
                      audio.playSuccess();
                      onAction('open');
                    }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white hover:bg-emerald-400 transition-colors shadow-lg animate-bounce">
                      <Phone size={24} />
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-400">Answer</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. Lock Screen Banner Phase */}
          {!isEncounterPhase && notification.type !== 'call' && (
            <motion.div
              key="lockscreen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-cover bg-center flex flex-col justify-between py-8 px-4 z-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle at top, rgba(16,185,129,0.1) 0%, rgba(15,23,42,0.95) 80%)',
              }}
            >
              {/* Date & Time */}
              <div className="text-center mt-8 space-y-1 select-none">
                <p className="text-sm font-semibold text-slate-300">Saturday, July 18</p>
                <h2 className="text-5xl font-extrabold text-white/90 tracking-tight font-poppins">{phoneTime}</h2>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-semibold">
                  <ShieldCheck size={10} /> Protected by ScamRadar
                </div>
              </div>

              {/* Notification Banner */}
              <div className="space-y-3 mb-12">
                <motion.div
                  drag="x"
                  dragConstraints={{ left: -100, right: 100 }}
                  onDragEnd={(_e, info) => {
                    if (info.offset.x < -80) {
                      onAction('ignore');
                    } else if (info.offset.x > 80) {
                      onAction('open');
                    }
                  }}
                  className={`p-3 rounded-2xl bg-slate-900/90 border border-white/10 flex gap-3 cursor-pointer hover:bg-slate-900 transition-colors shadow-xl`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-${color}-500/20 flex items-center justify-center flex-shrink-0 border border-${color}-500/30`}>
                    <span className="text-xl">{notification.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-white truncate capitalize">
                        {notification.sender}
                      </span>
                      <span className="text-[9px] text-slate-500">now</span>
                    </div>
                    <p className="text-[10px] font-semibold text-slate-300 truncate mt-0.5">
                      {notification.title}
                    </p>
                    <p className="text-[9px] text-slate-400 line-clamp-2 mt-0.5">
                      {notification.content}
                    </p>
                  </div>
                </motion.div>

                {/* Sliding Instructions */}
                <p className="text-[9px] text-slate-500 text-center animate-pulse">
                  ← Swipe left to ignore • Tap to open →
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button
                    variant="danger"
                    size="sm"
                    className="rounded-xl py-2 text-xs"
                    icon={<Ban size={12} />}
                    onClick={() => onAction('block')}
                  >
                    Block & Report
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-xl py-2 text-xs"
                    icon={<ArrowRight size={12} />}
                    onClick={() => onAction('open')}
                  >
                    Open Alert
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. App Details / Chat / Email / UPI Open Phase */}
          {isEncounterPhase && (
            <motion.div
              key="app-opened"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="absolute inset-0 bg-slate-900 flex flex-col z-30"
            >
              {/* App Bar header */}
              <div className={`p-3 bg-slate-950 border-b border-white/5 flex items-center gap-3 text-white`}>
                <button
                  onClick={() => onAction('ignore')}
                  className="p-1 rounded-lg hover:bg-white/5 text-slate-400"
                >
                  <ArrowLeft size={16} />
                </button>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold truncate">{notification.sender}</h4>
                  <p className="text-[9px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> online
                  </p>
                </div>
                <Badge variant={color === 'purple' ? 'purple' : color === 'emerald' ? 'success' : 'info'} size="sm">
                  {notification.type.toUpperCase()}
                </Badge>
              </div>

              {/* App Body Content */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto flex flex-col justify-between">
                {/* Chat Bubble / Email Shell / UPI box */}
                <div className="space-y-3">
                  {notification.type === 'sms' || notification.type === 'whatsapp' ? (
                    <div className="flex flex-col gap-2">
                      <div className="self-start max-w-[85%] rounded-2xl p-3 bg-white/5 border border-white/10 text-xs text-slate-300">
                        {notification.content}
                      </div>
                      <span className="text-[9px] text-slate-500 self-start ml-2">Sent at {phoneTime}</span>
                    </div>
                  ) : notification.type === 'email' ? (
                    <div className="border border-white/5 rounded-2xl bg-white/2 p-3 text-xs text-slate-300">
                      <div className="pb-2 mb-2 border-b border-white/5 text-[10px] space-y-0.5">
                        <p><span className="text-slate-500">From:</span> {notification.sender} &lt;support@verify.net&gt;</p>
                        <p><span className="text-slate-500">Subject:</span> {notification.title}</p>
                      </div>
                      <p className="leading-relaxed">{notification.content}</p>
                    </div>
                  ) : notification.type === 'upi' ? (
                    <Card variant="gradient" padding="sm" className="text-center space-y-2 mt-4">
                      <span className="text-3xl">💸</span>
                      <h4 className="text-sm font-bold text-white">Payment Request</h4>
                      <p className="text-xs text-slate-400">Request from <span className="font-semibold text-white">{notification.sender}</span></p>
                      <div className="text-xl font-extrabold text-white my-1">
                        ₹{(notification.amount || 0).toLocaleString('en-IN')}
                      </div>
                      <p className="text-[10px] text-slate-500 italic">"Reference: Account Activation fee"</p>
                    </Card>
                  ) : (
                    // Call dialog transcript
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 bg-slate-950/40 p-3 rounded-2xl border border-white/5">
                        <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-[10px] font-bold text-red-400">Sp</div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-slate-400">Caller Statement:</p>
                          <p className="text-xs text-slate-200 mt-0.5 font-medium italic">"{notification.content}"</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Simulated Phone Action Panel */}
                <div className="pt-4 border-t border-white/5 space-y-2">
                  <div className="bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-xl text-[10px] text-amber-400 flex items-start gap-2">
                    <ShieldAlert size={14} className="flex-shrink-0 mt-0.5" />
                    <span>Scam Radar detected potential red flags. Scan this message to investigate.</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="amber"
                      size="sm"
                      fullWidth
                      className="py-2.5 text-xs text-center font-bold"
                      icon={<ShieldAlert size={14} />}
                      onClick={() => {
                        audio.playClick();
                        onAction('verify'); // Opens Scam Detective mode
                      }}
                    >
                      Scam Detective
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      fullWidth
                      className="py-2.5 text-xs text-center"
                      icon={<Ban size={14} />}
                      onClick={() => onAction('block')}
                    >
                      Block Sender
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      fullWidth
                      className="py-2 text-xs"
                      onClick={() => onAction('ignore')}
                    >
                      Ignore Message
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      className="py-2 text-xs text-emerald-100 hover:text-white"
                      onClick={() => {
                        audio.playClick();
                        onAcceptScam(); // Proceed to fall for scam (trigger timeline)
                      }}
                    >
                      {notification.type === 'upi' ? 'Pay Request' : 'Accept / Reply'}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Screen Bottom Bar / Home Indicator */}
      <div className="h-6 bg-black flex justify-center items-center select-none z-40 pb-1">
        <div className="w-24 h-1 bg-white/30 rounded-full" />
      </div>
    </div>
  );
}
