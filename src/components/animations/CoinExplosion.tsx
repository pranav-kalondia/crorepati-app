// ============================================================
// CoinExplosion — Burst of coins for positive events
// ============================================================

import { useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CoinExplosionProps {
  trigger: boolean;
  count?: number;
  className?: string;
}

export function CoinExplosion({
  trigger,
  count = 20,
  className = '',
}: CoinExplosionProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  const coins = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      angle: (i / count) * 360,
      distance: 60 + Math.random() * 120,
      symbol: i % 3 === 0 ? '🪙' : i % 3 === 1 ? '💰' : '✨',
      size: 16 + Math.random() * 14,
      duration: 0.6 + Math.random() * 0.4,
    }));
  }, [count]);

  return (
    <AnimatePresence>
      {show && (
        <div className={`absolute inset-0 pointer-events-none flex items-center justify-center ${className}`}>
          {coins.map((coin) => {
            const rad = (coin.angle * Math.PI) / 180;
            const x = Math.cos(rad) * coin.distance;
            const y = Math.sin(rad) * coin.distance;

            return (
              <motion.span
                key={coin.id}
                className="absolute"
                style={{ fontSize: coin.size }}
                initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: 0,
                  x,
                  y: y - 30,
                  scale: 1.2,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: coin.duration,
                  ease: 'easeOut',
                }}
              >
                {coin.symbol}
              </motion.span>
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
