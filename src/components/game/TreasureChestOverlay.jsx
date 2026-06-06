import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, HeartPulse, Package, Sparkles } from 'lucide-react';
import { RARITY_COLORS } from '@/lib/gameData';

function getRewardDetails(treasure) {
  if (treasure?.type === 'gold') {
    return {
      title: 'Gold Cache',
      subtitle: `${treasure.value} gold`,
      description: 'Ancient coins spill from the chest.',
      color: '#facc15',
      Icon: Coins,
      token: null,
    };
  }

  if (treasure?.type === 'heal') {
    return {
      title: 'Healing Relic',
      subtitle: `${treasure.value} HP restored`,
      description: 'Warm light seals your wounds.',
      color: '#4ade80',
      Icon: HeartPulse,
      token: null,
    };
  }

  const item = treasure?.item;
  const color = RARITY_COLORS[item?.rarity] || '#c4b5fd';
  return {
    title: item?.name || 'Mysterious Item',
    subtitle: item?.rarity || 'unknown',
    description: item?.desc || 'A strange reward glimmers in the dark.',
    color,
    Icon: Package,
    token: item?.emoji || null,
  };
}

function LightBurst({ color }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <motion.div
          key={index}
          className="absolute left-1/2 top-1/2 h-36 w-1 origin-bottom rounded-full"
          style={{
            background: `linear-gradient(to top, ${color}00, ${color}aa, ${color}00)`,
            transform: `translate(-50%, -100%) rotate(${index * 60}deg)`,
          }}
          animate={{ opacity: [0.1, 0.75, 0.1], scaleY: [0.65, 1.15, 0.65] }}
          transition={{ repeat: Infinity, duration: 1.8, delay: index * 0.08 }}
        />
      ))}
    </div>
  );
}

function TreasureChest({ opened, color }) {
  return (
    <div className="relative h-44 w-64" style={{ perspective: 900 }}>
      <motion.div
        className="absolute inset-0"
        animate={{ rotateY: [0, -5, 5, 0], y: opened ? -6 : [0, -4, 0] }}
        transition={{ repeat: opened ? 0 : Infinity, duration: 2.2, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.div
          className="absolute left-5 right-5 top-7 h-20 rounded-t-3xl border-2"
          style={{
            transformOrigin: 'bottom center',
            background: 'linear-gradient(160deg, #8a4b18 0%, #3a1708 58%, #160704 100%)',
            borderColor: '#f59e0b',
            boxShadow: `0 0 28px ${opened ? color : '#f59e0b'}66, inset 0 14px 20px rgba(255,255,255,0.12)`,
          }}
          animate={opened ? { rotateX: -68, y: -18 } : { rotateX: 0, y: 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 18 }}
        >
          <div className="absolute left-1/2 top-1/2 h-10 w-8 -translate-x-1/2 -translate-y-1/2 rounded-md border border-amber-200/80 bg-amber-400/80" />
          <div className="absolute inset-x-4 top-5 h-1 rounded-full bg-amber-200/60" />
        </motion.div>

        <div
          className="absolute bottom-3 left-6 right-6 h-24 rounded-2xl border-2"
          style={{
            background: 'linear-gradient(160deg, #9b521a 0%, #4a1f0a 52%, #160704 100%)',
            borderColor: '#f59e0b',
            boxShadow: '0 24px 40px rgba(0,0,0,0.55), inset 0 -16px 20px rgba(0,0,0,0.35)',
          }}
        >
          <div className="absolute inset-x-0 top-8 h-3 bg-amber-300/60" />
          <div className="absolute bottom-0 left-1/2 h-12 w-10 -translate-x-1/2 rounded-t-lg border border-amber-100/80 bg-amber-500" />
          <div className="absolute left-5 top-0 h-full w-3 bg-black/25" />
          <div className="absolute right-5 top-0 h-full w-3 bg-black/25" />
        </div>

        {opened && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: -18 }}
            className="absolute left-1/2 top-10 h-24 w-24 -translate-x-1/2 rounded-full blur-xl"
            style={{ background: color, boxShadow: `0 0 80px ${color}` }}
          />
        )}
      </motion.div>
    </div>
  );
}

export default function TreasureChestOverlay({ treasure, onCollect }) {
  const [opened, setOpened] = useState(false);
  const reward = useMemo(() => getRewardDetails(treasure), [treasure]);
  const RewardIcon = reward.Icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.82, y: 28 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.88, y: 18 }}
        className="relative flex w-full max-w-md flex-col items-center overflow-hidden rounded-3xl border-2 px-6 py-7 text-center"
        style={{
          background: 'radial-gradient(circle at 50% 24%, rgba(54,30,95,0.72), #100820 58%, #07030d 100%)',
          borderColor: reward.color,
          boxShadow: `0 0 60px ${reward.color}55`,
        }}
      >
        {opened && <LightBurst color={reward.color} />}

        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.28em]" style={{ color: reward.color }}>
            <Sparkles className="h-4 w-4" />
            Treasure Room
          </div>

          <TreasureChest opened={opened} color={reward.color} />

          {!opened ? (
            <div className="mt-2 flex flex-col items-center gap-4">
              <p className="max-w-xs text-sm text-stone-400">
                A locked chest hums with old tower magic.
              </p>
              <button
                type="button"
                onClick={() => setOpened(true)}
                className="rounded-xl px-7 py-3 text-sm font-bold uppercase tracking-widest text-black transition-transform hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${reward.color}, #fff7ad)`,
                  boxShadow: `0 0 22px ${reward.color}66`,
                }}
              >
                Open Chest
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="mt-2 flex w-full flex-col items-center gap-4"
            >
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 3, -3, 0] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                className="relative flex h-24 w-24 items-center justify-center rounded-2xl border bg-black/35 text-5xl"
                style={{ borderColor: reward.color, boxShadow: `0 0 30px ${reward.color}77` }}
              >
                {reward.token || <RewardIcon className="h-12 w-12" style={{ color: reward.color }} />}
              </motion.div>

              <div>
                <h2 className="text-2xl font-bold text-stone-100" style={{ fontFamily: "'Cinzel',serif", color: reward.color }}>
                  {reward.title}
                </h2>
                <div className="mt-1 text-xs uppercase tracking-[0.22em]" style={{ color: reward.color }}>
                  {reward.subtitle}
                </div>
                <p className="mt-3 text-sm text-stone-400">{reward.description}</p>
              </div>

              <button
                type="button"
                onClick={onCollect}
                className="rounded-xl px-7 py-3 text-sm font-bold uppercase tracking-widest text-black transition-transform hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${reward.color}, #fff7ad)`,
                  boxShadow: `0 0 22px ${reward.color}66`,
                }}
              >
                Take Reward
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
