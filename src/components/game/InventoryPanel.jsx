import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { RARITY_COLORS, getEquipmentBonuses, getSellValue } from '../../lib/gameData';

function HpBar({ current, max }) {
  const pct = Math.max(0, current / max * 100);
  const color = pct > 50 ? '#40c040' : pct > 25 ? '#d0a020' : '#e03020';
  return (
    <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden border border-stone-700">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function ItemTile({ item, isEquipped, onEquip, onUnequip, onSell }) {
  if (!item || !item.name) return null;
  const rc = RARITY_COLORS[item.rarity] || '#aaa';
  const sellVal = getSellValue(item);
  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -2 }}
      className="relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 select-none"
      style={{
        background: isEquipped
          ? `linear-gradient(145deg, ${rc}22, #1a1028)`
          : 'linear-gradient(145deg, #1a1028, #0e0818)',
        borderColor: isEquipped ? rc : '#3a3050',
        boxShadow: isEquipped ? `0 0 16px ${rc}55` : 'none',
        minWidth: 90,
      }}
    >
      {isEquipped && (
        <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black text-[8px] font-bold px-1.5 py-0.5 rounded-full z-10">WORN</div>
      )}
      <div className="text-3xl leading-none">{item.emoji || '❓'}</div>
      <div className="text-[9px] font-bold text-center leading-tight" style={{ color: rc }}>{item.name || 'Unknown'}</div>
      <div className="text-[8px] text-stone-400 text-center leading-tight">{item.desc}</div>
      <div className="text-[8px] uppercase" style={{ color: rc }}>{item.rarity}</div>
      {isEquipped ? (
        <button
          onClick={e => { e.stopPropagation(); onUnequip && onUnequip(); }}
          className="w-full text-[9px] mt-1 py-1 rounded border border-stone-600 text-stone-400 hover:border-red-600 hover:text-red-400 transition-colors"
        >
          Unequip
        </button>
      ) : (
        <>
          <button
            onClick={e => { e.stopPropagation(); onEquip && onEquip(); }}
            className="w-full text-[9px] mt-1 py-1 rounded border font-bold transition-colors"
            style={{ borderColor: rc, color: rc, background: rc + '33' }}
          >
            ✓ Equip
          </button>
          {onSell && (
            <button
              onClick={e => { e.stopPropagation(); onSell && onSell(); }}
              className="w-full text-[9px] py-0.5 rounded border border-amber-700/60 text-amber-500 hover:border-amber-400 hover:text-amber-300 transition-colors"
            >
              🪙 Sell {sellVal}g
            </button>
          )}
        </>
      )}
    </motion.div>
  );
}

const SLOT_LABELS = { weapon: '⚔️ Weapon', armor: '🛡️ Armor', accessory: '💍 Accessory' };
const SLOT_ORDER  = ['weapon', 'armor', 'accessory'];

export default function InventoryPanel({ open, onClose, inventory, equipped, onEquip, onUnequip, onSell, player, playerClass }) {
  const bonuses = getEquipmentBonuses(equipped);
  const totalAtk  = (player?.attack  || 0) + bonuses.attack;
  const totalDef  = (player?.defense || 0) + bonuses.defense;
  const totalMaxHp= (player?.maxHp   || 0) + bonuses.maxHp;
  const totalMana = (player?.maxMana || 0) + bonuses.maxMana;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Side panel — slides in from right */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex flex-col overflow-hidden"
            style={{ width: 'min(520px, 100vw)', background: 'linear-gradient(180deg, #0e0820 0%, #080510 100%)', borderLeft: '1px solid #3a2060' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800">
              <div className="flex items-center gap-3">
                <span className="text-xl">{playerClass?.emoji}</span>
                <div>
                  <div className="text-sm font-bold text-amber-400" style={{ fontFamily: "'Cinzel',serif" }}>Inventory</div>
                  <div className="text-xs text-stone-500">{playerClass?.name}</div>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg text-stone-500 hover:text-stone-200 hover:bg-stone-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Character Stats */}
              <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4">
                <div className="text-[10px] text-stone-500 uppercase tracking-widest mb-3">Character Stats</div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-stone-400">❤️ HP</span>
                      <span className="text-stone-200 font-bold">{player?.hp} / {totalMaxHp}</span>
                    </div>
                    <HpBar current={player?.hp || 0} max={totalMaxHp} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-stone-800/50 rounded-lg p-1.5">
                      <div className="text-amber-400">⚔️</div>
                      <div className="font-bold text-stone-200">{totalAtk}</div>
                      <div className="text-stone-600 text-[8px]">ATK</div>
                    </div>
                    <div className="bg-stone-800/50 rounded-lg p-1.5">
                      <div className="text-blue-400">🛡️</div>
                      <div className="font-bold text-stone-200">{totalDef}</div>
                      <div className="text-stone-600 text-[8px]">DEF</div>
                    </div>
                    <div className="bg-stone-800/50 rounded-lg p-1.5">
                      <div className="text-purple-400">💧</div>
                      <div className="font-bold text-stone-200">{player?.mana}/{totalMana}</div>
                      <div className="text-stone-600 text-[8px]">MP</div>
                    </div>
                  </div>
                </div>
                {bonuses.hitBonus > 0 && (
                  <div className="text-xs text-green-400">🎲 +{bonuses.hitBonus} to hit rolls</div>
                )}
              </div>

              {/* Equipment Slots */}
              <div>
                <div className="text-[10px] text-stone-500 uppercase tracking-widest mb-3">Equipped Gear</div>
                <div className="grid grid-cols-3 gap-3">
                  {SLOT_ORDER.map(slot => (
                    <div key={slot} className="flex flex-col gap-1.5">
                      <div className="text-[9px] text-stone-500 text-center">{SLOT_LABELS[slot]}</div>
                      {equipped[slot] ? (
                        <ItemTile
                          item={equipped[slot]}
                          isEquipped={true}
                          onUnequip={() => onUnequip(slot)}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-700/60 h-32 text-stone-700 text-2xl gap-1">
                          <span>{slot === 'weapon' ? '⚔️' : slot === 'armor' ? '🛡️' : '💍'}</span>
                          <span className="text-[8px] text-stone-700">Empty</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bag */}
              <div>
                <div className="text-[10px] text-stone-500 uppercase tracking-widest mb-3">
                  Bag — {inventory.length} item{inventory.length !== 1 ? 's' : ''}
                </div>
                {inventory.length === 0 ? (
                  <div className="text-stone-600 italic text-xs text-center py-6 border border-dashed border-stone-800 rounded-xl">
                    No items yet.<br />Defeat enemies to find loot!
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                  {inventory.map((item, i) => (
                    <ItemTile
                      key={item.id + '-' + i}
                      item={item}
                      isEquipped={false}
                      onEquip={() => onEquip(item, i)}
                      onSell={onSell ? () => onSell(item, i) : undefined}
                    />
                  ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}