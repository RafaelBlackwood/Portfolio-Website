import React from 'react';
import { motion } from 'framer-motion';

const MONSTER_THEMES = {
  goblin:   { bg: 'linear-gradient(160deg, #0a1a00 0%, #060e00 50%, #030806 100%)', border: '#40a020', glow: '#40a02044' },
  skeleton: { bg: 'linear-gradient(160deg, #1a1810 0%, #0e0e08 50%, #060604 100%)', border: '#c0b080', glow: '#c0b08044' },
  orc:      { bg: 'linear-gradient(160deg, #1a1600 0%, #0e0c00 50%, #060600 100%)', border: '#909030', glow: '#90903044' },
  vampire:  { bg: 'linear-gradient(160deg, #1a0010 0%, #0e0008 50%, #060004 100%)', border: '#c02060', glow: '#c0206044' },
  dragon:   { bg: 'linear-gradient(160deg, #1a0800 0%, #0e0400 50%, #060200 100%)', border: '#e04020', glow: '#e0402044' },
  lich:     { bg: 'linear-gradient(160deg, #100018 0%, #08000e 50%, #040008 100%)', border: '#8040c0', glow: '#8040c044' },
  troll:    { bg: 'linear-gradient(160deg, #0a120a 0%, #060806 50%, #030403 100%)', border: '#608050', glow: '#60805044' },
  bandit:   { bg: 'linear-gradient(160deg, #14100a 0%, #0c0806 50%, #060402 100%)', border: '#a07040', glow: '#a0704044' },
};

function HpBar({ current, max }) {
  const pct = Math.max(0, (current / max) * 100);
  const color = pct > 50 ? '#c03020' : pct > 25 ? '#d08020' : '#20c020';
  return (
    <div className="w-full bg-black/50 rounded-full h-3 overflow-hidden border border-black/40">
      <motion.div
        className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg, ${color}aa, ${color})`, boxShadow: `0 0 8px ${color}88` }}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}

export default function MonsterCard({ monster, hurt, statusBadges }) {
  const theme = MONSTER_THEMES[monster.id] || MONSTER_THEMES.goblin;

  return (
    <motion.div
      animate={hurt ? { x: [12, -12, 8, -8, 0] } : {}}
      transition={{ duration: 0.35 }}
      className="relative rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: theme.bg,
        border: `2px solid ${theme.border}`,
        boxShadow: `0 0 24px ${theme.glow}, inset 0 0 30px rgba(0,0,0,0.5)`,
        minHeight: 220,
      }}
    >
      {/* Corner ornaments */}
      <div className="absolute top-1.5 left-1.5 w-4 h-4 border-t-2 border-l-2 rounded-tl" style={{ borderColor: theme.border + '99' }} />
      <div className="absolute top-1.5 right-1.5 w-4 h-4 border-t-2 border-r-2 rounded-tr" style={{ borderColor: theme.border + '99' }} />
      <div className="absolute bottom-1.5 left-1.5 w-4 h-4 border-b-2 border-l-2 rounded-bl" style={{ borderColor: theme.border + '99' }} />
      <div className="absolute bottom-1.5 right-1.5 w-4 h-4 border-b-2 border-r-2 rounded-br" style={{ borderColor: theme.border + '99' }} />

      {/* Header */}
      <div className="px-3 pt-3 pb-1 flex items-center justify-between">
        <div>
          <div className="text-[9px] uppercase tracking-[0.2em] mb-0.5" style={{ color: theme.border }}>
            {monster.boss ? '👑 Boss' : 'Enemy'}
          </div>
          <div className="text-sm font-bold text-stone-100" style={{ fontFamily: "'Cinzel',serif", textShadow: `0 0 12px ${theme.border}` }}>
            {monster.name}
          </div>
        </div>
        <div className="text-right text-[10px] text-stone-400 space-y-0.5">
          <div>AC <span style={{ color: theme.border }}>{monster.ac}</span></div>
          <div>⚔️ <span className="text-stone-300">{monster.attack}</span></div>
        </div>
      </div>

      {/* Art area */}
      <div className="relative flex items-center justify-center overflow-hidden flex-1" style={{ minHeight: 140, maxHeight: 160 }}>
        {/* Background radial glow */}
        <div className="absolute inset-0 opacity-20" style={{
          background: `radial-gradient(ellipse at 50% 50%, ${theme.border} 0%, transparent 70%)`
        }} />

        {/* Boss glow ring */}
        {monster.boss && (
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-20 h-20 rounded-full border-2" style={{ borderColor: theme.border + '88', boxShadow: `0 0 30px ${theme.border}66` }} />
          </motion.div>
        )}

        <motion.div
          aria-label={monster.name}
          role="img"
          className="flex h-28 w-28 items-center justify-center rounded-full border bg-black/25 text-7xl"
          animate={hurt
            ? { scale: [1, 0.85, 1.1, 1], rotate: [0, -5, 5, 0] }
            : { y: [0, -5, 0] }
          }
          transition={hurt ? { duration: 0.35 } : { repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
          style={{
            borderColor: theme.border + '88',
            boxShadow: `inset 0 0 28px ${theme.border}22`,
            filter: `drop-shadow(0 0 14px ${theme.border})`,
          }}
        >
          {monster.emoji}
        </motion.div>
      </div>

      {/* Stats */}
      <div className="px-3 pb-3 space-y-2">
        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-stone-400">❤️ HP</span>
            <span className="font-bold" style={{ color: theme.border }}>{monster.hp} / {monster.maxHp}</span>
          </div>
          <HpBar current={monster.hp} max={monster.maxHp} />
        </div>

        {/* Special traits & status badges */}
        <div className="flex gap-1 flex-wrap min-h-[18px]">
          {monster.regen && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-900/60 text-green-300 border border-green-700/50">💚 regen {monster.regen}</span>
          )}
          {monster.lifesteal && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-900/60 text-red-300 border border-red-700/50">🩸 leech {monster.lifesteal}</span>
          )}
          {statusBadges}
        </div>

        <p className="text-[9px] text-stone-500 italic">{monster.desc}</p>
      </div>
    </motion.div>
  );
}
