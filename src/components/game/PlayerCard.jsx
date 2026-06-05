import React from 'react';
import { motion } from 'framer-motion';

// Visual art map per class
const CLASS_ART = {
  warrior: {
    bg: 'linear-gradient(160deg, #3a1a00 0%, #1a0c00 40%, #0e0608 100%)',
    border: '#c97020',
    glow: '#c9702055',
  },
  mage: {
    bg: 'linear-gradient(160deg, #1a0a3a 0%, #0e0628 40%, #060210 100%)',
    border: '#7060d0',
    glow: '#7060d055',
  },
  rogue: {
    bg: 'linear-gradient(160deg, #001a0a 0%, #000e06 40%, #020806 100%)',
    border: '#208040',
    glow: '#20804055',
  },
};

function HpBar({ current, max }) {
  const pct = Math.max(0, (current / max) * 100);
  const color = pct > 50 ? '#40c040' : pct > 25 ? '#d0a020' : '#e03020';
  return (
    <div className="w-full bg-black/40 rounded-full h-3 overflow-hidden border border-black/40">
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

function ManaOrbs({ current, max }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {Array.from({ length: Math.min(max, 10) }).map((_, i) => (
        <motion.div
          key={i}
          animate={i < current ? { opacity: 1, scale: 1 } : { opacity: 0.25, scale: 0.85 }}
          className="w-3.5 h-3.5 rounded-full border"
          style={{
            background: i < current ? 'radial-gradient(circle at 35% 35%, #90c0ff, #3060d0)' : '#1a2040',
            borderColor: i < current ? '#6090ff' : '#2a3060',
            boxShadow: i < current ? '0 0 6px #4080ff88' : 'none',
          }}
        />
      ))}
    </div>
  );
}

export default function PlayerCard({ playerClass, player, playerBlock, playerBuff, equipped, stats, hurt, onOpenInventory }) {
  const art = CLASS_ART[playerClass?.id] || CLASS_ART.warrior;
  const equippedItems = Object.values(equipped || {}).filter(Boolean);

  return (
    <motion.div
      animate={hurt ? { x: [-10, 10, -8, 8, 0] } : {}}
      transition={{ duration: 0.35 }}
      className="relative rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: art.bg,
        border: `2px solid ${art.border}`,
        boxShadow: `0 0 24px ${art.glow}, inset 0 0 30px rgba(0,0,0,0.4)`,
        minHeight: 220,
      }}
    >
      {/* Decorative corner ornaments */}
      <div className="absolute top-1.5 left-1.5 w-4 h-4 border-t-2 border-l-2 rounded-tl" style={{ borderColor: art.border + '99' }} />
      <div className="absolute top-1.5 right-1.5 w-4 h-4 border-t-2 border-r-2 rounded-tr" style={{ borderColor: art.border + '99' }} />
      <div className="absolute bottom-1.5 left-1.5 w-4 h-4 border-b-2 border-l-2 rounded-bl" style={{ borderColor: art.border + '99' }} />
      <div className="absolute bottom-1.5 right-1.5 w-4 h-4 border-b-2 border-r-2 rounded-br" style={{ borderColor: art.border + '99' }} />

      {/* Header band */}
      <div className="px-3 pt-3 pb-1 flex items-center justify-between">
        <div>
          <div className="text-[9px] uppercase tracking-[0.2em] mb-0.5" style={{ color: art.border }}>Hero</div>
          <div className="text-sm font-bold text-stone-100" style={{ fontFamily: "'Cinzel',serif", textShadow: `0 0 12px ${art.border}` }}>
            {playerClass?.name}
          </div>
        </div>
        <div className="text-[10px] text-stone-500 text-right">
          <div>AC {10 + (stats?.defense || 0)}</div>
          <div style={{ color: art.border }}>Floor Hero</div>
        </div>
      </div>

      {/* Art area */}
      <div className="relative flex items-center justify-center overflow-hidden" style={{ height: 160 }}>
        <div className="absolute inset-0 opacity-20" style={{
          background: `radial-gradient(ellipse at 50% 50%, ${art.border} 0%, transparent 70%)`
        }} />
        <motion.div
          aria-label={playerClass?.name}
          role="img"
          className="flex h-28 w-28 items-center justify-center rounded-full border bg-black/25 text-7xl"
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          style={{
            borderColor: art.border + '88',
            boxShadow: `inset 0 0 28px ${art.border}22`,
            filter: `drop-shadow(0 0 14px ${art.border})`,
          }}
        >
          {playerClass?.emoji}
        </motion.div>
        {/* Hurt flash */}
        {hurt && (
          <div className="absolute inset-0 bg-red-500/30 pointer-events-none" />
        )}
      </div>

      {/* Stats section */}
      <div className="px-3 pb-3 flex flex-col gap-2 flex-1">
        {/* HP */}
        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-stone-400">❤️ HP</span>
            <span className="font-bold" style={{ color: player.hp / player.maxHp > 0.5 ? '#60d060' : player.hp / player.maxHp > 0.25 ? '#d0a020' : '#e04040' }}>
              {player.hp} / {player.maxHp}
            </span>
          </div>
          <HpBar current={player.hp} max={player.maxHp} />
        </div>

        {/* Mana */}
        <div>
          <div className="text-[10px] text-stone-400 mb-1">💧 Mana</div>
          <ManaOrbs current={player.mana} max={player.maxMana} />
        </div>

        {/* Status badges */}
        <div className="flex gap-1 flex-wrap min-h-[20px]">
          {playerBlock > 0 && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">🛡️ {playerBlock}</span>
          )}
          {playerBuff > 0 && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-900/60 text-amber-300 border border-amber-700/50">⚔️ +{playerBuff}</span>
          )}
        </div>

        {/* Equipped gear */}
        {equippedItems.length > 0 && (
          <button
            onClick={onOpenInventory}
            className="flex gap-1.5 flex-wrap items-center mt-auto"
            title="Open Inventory"
          >
            {equippedItems.map(item => (
              <span
                key={item.id}
                title={item.name}
                className="text-lg rounded px-0.5 py-0.5 transition-transform hover:scale-125"
                style={{ filter: `drop-shadow(0 0 4px ${item.color || '#aaa'})` }}
              >
                {item.emoji}
              </span>
            ))}
          </button>
        )}
      </div>
    </motion.div>
  );
}
