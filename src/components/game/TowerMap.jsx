import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Castle,
  Coins,
  DoorOpen,
  Footprints,
  Gem,
  HeartPulse,
  HelpCircle,
  MapPin,
  Package,
  ShoppingBag,
  Swords,
} from 'lucide-react';
import {
  getDoomTowerCellCount,
  getReachableTowerCellIds,
  TOWER_CELL_EVENT,
} from '@/lib/towerMap';

const EVENT_CONFIG = {
  [TOWER_CELL_EVENT.START]: {
    label: 'Entry',
    description: 'The run began here.',
    icon: Footprints,
    color: '#60a5fa',
    bg: '#0b1728',
  },
  [TOWER_CELL_EVENT.GATE]: {
    label: 'Gate',
    description: 'Descend to the next floor.',
    icon: DoorOpen,
    color: '#fbbf24',
    bg: '#241605',
  },
  [TOWER_CELL_EVENT.BATTLE]: {
    label: 'Battle',
    description: 'A hostile room has been revealed.',
    icon: Swords,
    color: '#fb923c',
    bg: '#261008',
  },
  [TOWER_CELL_EVENT.MERCHANT]: {
    label: 'Merchant',
    description: 'A trader waits between the stones.',
    icon: ShoppingBag,
    color: '#facc15',
    bg: '#211805',
  },
  [TOWER_CELL_EVENT.TREASURE]: {
    label: 'Treasure',
    description: 'A hidden reward was found.',
    icon: Gem,
    color: '#34d399',
    bg: '#062018',
  },
  hidden: {
    label: 'Unknown',
    description: 'Enter to reveal what is inside.',
    icon: HelpCircle,
    color: '#78716c',
    bg: '#111013',
  },
};

function getVisibleCellConfig(cell, isRevealed) {
  if (!isRevealed && cell.event !== TOWER_CELL_EVENT.GATE) return EVENT_CONFIG.hidden;
  return EVENT_CONFIG[cell.event] ?? EVENT_CONFIG.hidden;
}

function TowerCell({ cell, isCurrent, isReachable, isVisited, isRevealed, onSelect }) {
  const config = getVisibleCellConfig(cell, isRevealed);
  const Icon = config.icon;
  const canEnter = isReachable && !isCurrent;
  const helperText = isCurrent
    ? 'Current position'
    : isVisited
      ? 'Move back here'
      : canEnter
        ? 'Move here'
        : config.description;

  return (
    <motion.button
      type="button"
      whileHover={canEnter ? { y: -3, scale: 1.03 } : {}}
      whileTap={canEnter ? { scale: 0.96 } : {}}
      onClick={canEnter ? () => onSelect(cell) : undefined}
      disabled={!canEnter}
      className="relative aspect-square min-h-[68px] rounded border p-2 text-left transition-colors sm:min-h-[76px]"
      style={{
        background: isCurrent
          ? 'linear-gradient(145deg, #172554, #0c1225)'
          : `linear-gradient(145deg, ${config.bg}, #070609)`,
        borderColor: isCurrent ? '#93c5fd' : canEnter ? config.color : isVisited ? '#3f3f46' : '#1f1c24',
        boxShadow: canEnter ? `0 0 22px ${config.color}44` : isCurrent ? '0 0 22px #60a5fa55' : 'none',
        opacity: canEnter || isVisited || isCurrent ? 1 : 0.42,
        cursor: canEnter ? 'pointer' : 'default',
      }}
      title={canEnter ? `Move to ${config.label}` : config.label}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <Icon className="h-5 w-5" style={{ color: config.color }} />
          {isVisited && !isCurrent && <span className="rounded bg-stone-700/40 px-1.5 py-0.5 text-[9px] text-stone-400">Seen</span>}
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: config.color }}>
            {config.label}
          </div>
          <div className="mt-0.5 text-[10px] leading-tight text-stone-500">
            {helperText}
          </div>
        </div>
      </div>
      {isCurrent && (
        <motion.div
          className="pointer-events-none absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-blue-200 bg-blue-500 text-white shadow-lg"
          style={{ boxShadow: '0 0 22px rgba(96, 165, 250, 0.75)' }}
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
        >
          <MapPin className="h-4 w-4" />
        </motion.div>
      )}
      {canEnter && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded border"
          style={{ borderColor: config.color }}
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
        />
      )}
    </motion.button>
  );
}

export default function TowerMap({
  towerState,
  floor,
  onEnterCell,
  playerHp,
  playerMaxHp,
  gold,
  onOpenInventory,
  inventoryCount,
  onAbandon,
}) {
  const [selectedCell, setSelectedCell] = useState(null);
  const reachableIds = useMemo(() => new Set(getReachableTowerCellIds(towerState)), [towerState]);
  const visitedIds = useMemo(() => new Set(towerState.visitedIds), [towerState.visitedIds]);
  const revealedIds = useMemo(() => new Set(towerState.revealedIds), [towerState.revealedIds]);

  const rows = useMemo(() => {
    const grouped = [];
    for (let row = 0; row < towerState.rows; row += 1) {
      grouped.push(towerState.cells.filter((cell) => cell.row === row));
    }
    return grouped;
  }, [towerState]);

  function confirmCellEntry() {
    if (!selectedCell) return;
    const cellId = selectedCell.id;
    setSelectedCell(null);
    onEnterCell(cellId);
  }

  const selectedConfig = selectedCell
    ? getVisibleCellConfig(selectedCell, revealedIds.has(selectedCell.id))
    : null;
  const SelectedIcon = selectedConfig?.icon;

  return (
    <div className="min-h-screen text-stone-300" style={{ background: '#08070b' }}>
      <div className="fixed inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, #181027 0%, #08070b 70%)' }} />

      <header className="relative z-10 border-b border-stone-900/70 bg-black/35 px-4 py-3">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {onAbandon && (
              <button
                type="button"
                onClick={() => { if (window.confirm('Abandon run?')) onAbandon(); }}
                className="inline-flex items-center gap-1 text-xs text-stone-500 transition-colors hover:text-red-400"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Quit
              </button>
            )}
            <div>
              <div className="flex items-center gap-2 text-amber-300" style={{ fontFamily: "'Cinzel',serif" }}>
                <Castle className="h-5 w-5" />
                <span className="font-bold">Doom Tower Floor {floor}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-stone-600">
                <ArrowUp className="h-3 w-3" />
                <ArrowRight className="h-3 w-3" />
                <ArrowDown className="h-3 w-3" />
                <ArrowLeft className="h-3 w-3" />
                <span>Move one cell in any direction. Revealed cells stay open.</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-stone-400">
            <span className="inline-flex items-center gap-1"><HeartPulse className="h-4 w-4 text-red-300" /> {playerHp}/{playerMaxHp}</span>
            <span className="inline-flex items-center gap-1"><Coins className="h-4 w-4 text-amber-300" /> {gold}</span>
            {onOpenInventory && (
              <button
                type="button"
                onClick={onOpenInventory}
                className="inline-flex items-center gap-1 rounded border border-stone-700 px-2 py-1 text-xs transition-colors hover:border-amber-500"
              >
                <Package className="h-3.5 w-3.5" />
                Bag {inventoryCount !== undefined ? `(${inventoryCount})` : ''}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl text-stone-100" style={{ fontFamily: "'Cinzel',serif" }}>Choose Your Cell</h1>
            <p className="mt-2 max-w-2xl text-sm text-stone-500">
              The gate is visible. Unknown rooms reveal when you enter them, and seen rooms can be crossed again.
            </p>
          </div>
          <div className="rounded border border-stone-800 bg-black/25 px-4 py-3 text-right">
            <div className="text-[10px] uppercase tracking-[0.24em] text-stone-600">Cells</div>
            <div className="text-2xl font-bold text-amber-300">{getDoomTowerCellCount(floor)}</div>
          </div>
        </section>

        <section
          className="grid w-full max-w-md self-center rounded border border-stone-900/80 bg-black/25 p-3"
          style={{ gridTemplateColumns: `repeat(${towerState.columns}, minmax(0, 1fr))`, gap: 8 }}
        >
          {rows.flat().map((cell) => {
            const isVisited = visitedIds.has(cell.id);
            const isCurrent = towerState.currentId === cell.id;
            const isReachable = reachableIds.has(cell.id);
            const isRevealed = revealedIds.has(cell.id);

            return (
              <TowerCell
                key={cell.id}
                cell={cell}
                isCurrent={isCurrent}
                isReachable={isReachable}
                isVisited={isVisited}
                isRevealed={isRevealed}
                onSelect={setSelectedCell}
              />
            );
          })}
        </section>
      </main>

      <AnimatePresence>
        {selectedCell && selectedConfig && SelectedIcon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4"
            onClick={() => setSelectedCell(null)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border p-6 text-center"
              style={{
                background: '#100820',
                borderColor: selectedConfig.color,
                boxShadow: `0 0 40px ${selectedConfig.color}55`,
              }}
            >
              <SelectedIcon className="mx-auto h-12 w-12" style={{ color: selectedConfig.color }} />
              <h2 className="mt-4 text-2xl text-stone-100" style={{ fontFamily: "'Cinzel',serif" }}>{selectedConfig.label}</h2>
              <p className="mt-2 text-sm text-stone-500">{selectedConfig.description}</p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCell(null)}
                  className="rounded-lg border border-stone-700 px-4 py-2 text-sm text-stone-400 transition-colors hover:border-stone-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmCellEntry}
                  className="rounded-lg px-6 py-2 text-sm font-bold text-black"
                  style={{ background: selectedConfig.color }}
                >
                  Enter
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
