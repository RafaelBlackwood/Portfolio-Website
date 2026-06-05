import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ALL_ITEMS, RARITY_COLORS } from '../../lib/gameData';

// Generate a random shop stock of 4 items with prices
function generateShop(floor) {
  const pool = [...ALL_ITEMS];
  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  // Pick 4 items, price scales with rarity & floor
  const rarityPrice = { common: 15, uncommon: 25, rare: 40, epic: 60, legendary: 90 };
  return pool.slice(0, 4).map(item => ({
    ...item,
    price: Math.round((rarityPrice[item.rarity] || 20) * (1 + floor * 0.1)),
  }));
}

export default function MerchantScreen({ floor, gold, onBuy, onLeave, inventory, equipped }) {
  const [stock, setStock] = useState(() => generateShop(floor));
  const [bought, setBought] = useState(new Set());
  const [hoveredItem, setHoveredItem] = useState(null);

  // Check if item slot is already equipped
  function isSlotFull(item) {
    return !!equipped[item.slot];
  }

  function handleBuy(item, idx) {
    if (gold < item.price || bought.has(idx)) return;
    onBuy(item, item.price);
    setBought(b => new Set(b).add(idx));
  }

  return (
    <div className="min-h-screen text-stone-300 flex items-center justify-center px-4" style={{ background: '#0a080e' }}>
      <div className="fixed inset-0" style={{ background: 'radial-gradient(ellipse at 50% 30%, #1a1208 0%, #0a080e 70%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-6xl mb-3"
          >
            🧙
          </motion.div>
          <h2 className="text-3xl text-amber-300 tracking-widest mb-1" style={{ fontFamily: "'Cinzel',serif" }}>
            The Merchant
          </h2>
          <p className="text-stone-500 text-sm italic">"Fine wares for a weary adventurer... for a price."</p>
          <div className="mt-3 inline-flex items-center gap-2 bg-amber-900/30 border border-amber-700/40 rounded-full px-4 py-1.5">
            <span className="text-amber-400 font-bold text-lg">🪙 {gold}</span>
            <span className="text-stone-500 text-xs">gold available</span>
          </div>
        </div>

        {/* Shop items */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stock.map((item, idx) => {
            const rc = RARITY_COLORS[item.rarity] || '#aaa';
            const isBought = bought.has(idx);
            const canAfford = gold >= item.price;
            const equippedSlot = equipped[item.slot];

            return (
              <motion.div
                key={item.id + idx}
                whileHover={{ scale: isBought ? 1 : 1.02, y: isBought ? 0 : -2 }}
                onMouseEnter={() => setHoveredItem(idx)}
                onMouseLeave={() => setHoveredItem(null)}
                className="relative rounded-2xl border-2 p-5 flex flex-col gap-3"
                style={{
                  background: isBought
                    ? 'linear-gradient(145deg, #111018, #0a0810)'
                    : `linear-gradient(145deg, ${rc}12, #12091e)`,
                  borderColor: isBought ? '#2a2040' : rc,
                  boxShadow: isBought ? 'none' : `0 0 20px ${rc}22`,
                  opacity: isBought ? 0.5 : 1,
                }}
              >
                {isBought && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50">
                    <span className="text-stone-500 font-bold text-sm uppercase tracking-widest">Sold</span>
                  </div>
                )}

                {/* Rarity ribbon */}
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full" style={{ background: rc + '33', color: rc, border: `1px solid ${rc}66` }}>
                    {item.rarity}
                  </span>
                  <span className="text-xs text-stone-500">{item.slot}</span>
                </div>

                {/* Item display */}
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{item.emoji}</div>
                  <div>
                    <div className="text-sm font-bold" style={{ color: rc, fontFamily: "'Cinzel',serif" }}>{item.name}</div>
                    <div className="text-xs text-stone-400 mt-0.5">{item.desc}</div>
                    {equippedSlot && !isBought && (
                      <div className="text-[9px] text-amber-600 mt-1">⚠️ Replaces {equippedSlot.name}</div>
                    )}
                  </div>
                </div>

                {/* Price & Buy button */}
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1">
                    <span className="text-amber-400 font-bold">🪙 {item.price}</span>
                  </div>
                  <button
                    onClick={() => handleBuy(item, idx)}
                    disabled={isBought || !canAfford}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                    style={
                      isBought
                        ? { background: '#2a2040', color: '#555' }
                        : canAfford
                          ? { background: `linear-gradient(135deg, ${rc}88, ${rc}55)`, color: '#fff', border: `1px solid ${rc}`, boxShadow: `0 0 10px ${rc}33`, cursor: 'pointer' }
                          : { background: '#1a1028', color: '#555', border: '1px solid #333', cursor: 'not-allowed' }
                    }
                  >
                    {isBought ? 'Sold' : canAfford ? 'Buy' : 'Too poor'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Leave button */}
        <div className="text-center">
          <button
            onClick={onLeave}
            className="px-12 py-3 text-amber-100 font-bold uppercase tracking-widest rounded-xl transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg,#7a3800,#c97020,#7a3800)', boxShadow: '0 0 30px rgba(180,100,20,0.4)' }}
          >
            ⚔️ Continue to Next Floor
          </button>
          <p className="text-stone-600 text-xs mt-3 italic">Floor {floor}/8 awaits...</p>
        </div>
      </motion.div>

    </div>
  );
}
