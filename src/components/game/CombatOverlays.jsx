import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Dice5, Shield, Skull, Swords, X, Zap } from 'lucide-react';
import {
  ATTACK_RESULT,
  formatDiceRolls,
  getDamageDiceCount,
  getMonsterDamageDiceCount,
  isAttackMiss,
  resolveDamage,
  resolveD20Attack,
  rollDice,
} from '@/lib/combatRules';
import PhysicsDiceRoller from './PhysicsDiceRoller';

const PANEL_STYLE = {
  background: 'linear-gradient(145deg, #120825, #080412)',
};

const AUTO_HIT_RESULT = {
  naturalRoll: null,
  totalRoll: null,
  isCrit: false,
  isMiss: false,
  result: ATTACK_RESULT.HIT,
};

function getResultUi(result, attacker = 'player') {
  if (result === ATTACK_RESULT.CRIT) {
    return {
      color: '#ffd166',
      icon: Zap,
      label: attacker === 'enemy' ? 'Critical strike' : 'Critical hit',
      glow: 'rgba(255, 209, 102, 0.1)',
    };
  }

  if (result === ATTACK_RESULT.MISS) {
    return {
      color: attacker === 'enemy' ? '#4ade80' : '#fb7185',
      icon: attacker === 'enemy' ? Shield : X,
      label: attacker === 'enemy' ? 'Deflected' : 'Miss',
      glow: attacker === 'enemy' ? 'rgba(74, 222, 128, 0.09)' : 'rgba(251, 113, 133, 0.1)',
    };
  }

  return {
    color: attacker === 'enemy' ? '#fb923c' : '#4ade80',
    icon: attacker === 'enemy' ? Swords : Check,
    label: 'Hit',
    glow: attacker === 'enemy' ? 'rgba(251, 146, 60, 0.1)' : 'rgba(74, 222, 128, 0.1)',
  };
}

function RollSummary({ title, rolls, selectedRoll, bonus, armorClass, totalRoll }) {
  if (!rolls?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-lg border border-stone-800 bg-black/25 px-4 py-3 text-sm"
    >
      <div className="text-[10px] uppercase tracking-[0.24em] text-stone-500">{title}</div>
      <div className="mt-1 flex flex-wrap items-baseline justify-center gap-2 text-stone-300">
        <span className="font-semibold text-stone-100">{formatDiceRolls(rolls)}</span>
        {rolls.length > 1 && <span className="text-stone-500">best {selectedRoll}</span>}
        {bonus > 0 && <span className="text-stone-500">+ {bonus}</span>}
        {typeof totalRoll === 'number' && <span className="text-amber-300">= {totalRoll}</span>}
        {typeof armorClass === 'number' && <span className="text-stone-500">vs AC {armorClass}</span>}
      </div>
    </motion.div>
  );
}

function DamageSummary({ rolls, diceTotal, modifier = 0, blocked = 0, finalDamage }) {
  if (!rolls?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-lg border border-stone-800 bg-black/25 px-4 py-3 text-sm"
    >
      <div className="text-[10px] uppercase tracking-[0.24em] text-stone-500">Damage dice</div>
      <div className="mt-1 flex flex-wrap items-baseline justify-center gap-2 text-stone-300">
        <span className="font-semibold text-stone-100">{formatDiceRolls(rolls)}</span>
        <span className="text-amber-300">= {diceTotal}</span>
        {modifier > 0 && <span className="text-stone-500">+ {modifier}</span>}
        {modifier < 0 && <span className="text-stone-500">- {Math.abs(modifier)}</span>}
        {blocked > 0 && <span className="text-stone-500">- {blocked} block</span>}
        <span className="text-red-300">= {finalDamage} damage</span>
      </div>
    </motion.div>
  );
}

function RollerFrame({ children, borderColor, height = 230 }) {
  return (
    <div
      className="w-full overflow-hidden rounded-xl border bg-black/20"
      style={{ height, borderColor: `${borderColor}55` }}
    >
      {children}
    </div>
  );
}

function SettledDiceDisplay({ rolls, sides, color }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-black/20">
      <div className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Settled</div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {rolls.map((roll, index) => (
          <div
            key={`${roll}-${index}`}
            className="flex h-16 w-16 items-center justify-center rounded-xl border text-2xl font-black shadow-lg"
            style={{
              borderColor: `${color}aa`,
              color,
              background: 'linear-gradient(145deg, rgba(20,8,35,0.95), rgba(8,4,18,0.95))',
              boxShadow: `0 0 20px ${color}44`,
              fontFamily: "'Cinzel', serif",
            }}
          >
            {roll}
          </div>
        ))}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-stone-600">d{sides}</div>
    </div>
  );
}

function CombatButton({ children, onClick, tone = 'damage' }) {
  const style = tone === 'damage'
    ? {
      background: 'linear-gradient(135deg, #7a1a00, #d04010, #7a1a00)',
      color: '#ffe0c0',
      boxShadow: '0 0 18px rgba(200,60,10,0.5)',
    }
    : {
      background: 'linear-gradient(135deg, #1f2937, #374151)',
      color: '#e5e7eb',
    };

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-2.5 text-sm font-bold uppercase tracking-widest transition-transform hover:scale-105"
      style={style}
    >
      {children}
    </button>
  );
}

export function PlayerAttackOverlay({ data, onDone }) {
  const hasFinishedRef = useRef(false);
  const [phase, setPhase] = useState(data.needsHit ? 'hit_roll' : 'damage_roll');
  const [hitSettled, setHitSettled] = useState(!data.needsHit);
  const [hitRolls, setHitRolls] = useState(() => []);
  const [hitOutcome, setHitOutcome] = useState(() => (
    data.needsHit ? null : { ...AUTO_HIT_RESULT, hitRolls: [] }
  ));
  const hitOutcomeRef = useRef(hitOutcome);
  const [damageRolls, setDamageRolls] = useState([]);
  const [damageSettled, setDamageSettled] = useState(false);

  const hitResult = hitOutcome;

  const ui = getResultUi(hitResult?.result ?? ATTACK_RESULT.HIT);
  const ResultIcon = ui.icon;
  const damageDiceCount = hitResult
    ? getDamageDiceCount(data.cardValue, hitResult.isCrit)
    : getDamageDiceCount(data.cardValue, false);
  const damageResolution = useMemo(() => resolveDamage({
    rolls: damageRolls,
    modifier: data.damageModifier,
    block: data.blockedByTarget,
    isMiss: isAttackMiss(hitResult),
  }), [damageRolls, data.blockedByTarget, data.damageModifier, hitResult]);
  const { diceTotal, rawDamage, blocked: blockedByTarget, finalDamage } = damageResolution;

  const finish = () => {
    const lockedHit = hitOutcomeRef.current ?? hitResult;
    if (hasFinishedRef.current || !lockedHit || (!isAttackMiss(lockedHit) && !damageSettled)) return;
    hasFinishedRef.current = true;
    onDone({
      ...lockedHit,
      hitRolls: lockedHit.hitRolls ?? hitRolls,
      damageRolls,
      diceTotal,
      rawDamage,
      finalDamage,
      damageModifier: data.damageModifier,
      blocked: blockedByTarget,
    });
  };

  const recordHitRolls = (rolls) => {
    if (hitOutcomeRef.current) return;

    const lockedRolls = [...rolls];
    const resolved = resolveD20Attack({
      rolls: lockedRolls,
      bonus: data.hitBonus,
      armorClass: data.targetArmorClass,
    });
    const lockedOutcome = {
      ...resolved,
      hitRolls: lockedRolls,
    };

    hitOutcomeRef.current = lockedOutcome;
    setHitRolls(lockedRolls);
    setHitOutcome(lockedOutcome);
  };

  const skipHitRoll = () => {
    if (hitSettled || hitOutcomeRef.current) return;
    recordHitRolls(rollDice(data.hitDiceCount, 20));
    setHitSettled(true);
  };

  const startDamageRoll = () => {
    const lockedHit = hitOutcomeRef.current ?? hitResult;
    if (!lockedHit || isAttackMiss(lockedHit) || phase !== 'hit_roll') return;
    setDamageRolls([]);
    setDamageSettled(false);
    setPhase('damage_roll');
  };

  const skipDamageRoll = () => {
    if (damageSettled) return;
    setDamageRolls(rollDice(damageDiceCount, 6));
    setDamageSettled(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: `radial-gradient(ellipse at center, ${ui.glow} 0%, rgba(0,0,0,0.9) 100%)`, backdropFilter: 'blur(4px)' }}
    >
      <motion.div
        initial={{ scale: 0.75, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 190, damping: 22 }}
        className="flex w-full max-w-[520px] flex-col items-center gap-4 rounded-3xl border-2 px-8 py-6 text-center"
        style={{ ...PANEL_STYLE, borderColor: ui.color, boxShadow: `0 0 60px ${ui.color}44` }}
      >
        <div className="flex w-full items-center justify-between gap-4">
          <div className="text-left">
            <div className="text-xs uppercase tracking-[0.28em] text-stone-400">{data.cardName}</div>
            <div className="mt-1 text-[11px] text-stone-600">{data.needsHit ? 'Attack roll first' : 'Spell hit confirmed'}</div>
          </div>
          <ResultIcon className="h-7 w-7" style={{ color: ui.color }} />
        </div>

        {phase === 'hit_roll' && (
          <div className="flex w-full flex-col items-center gap-3">
            <div className="flex w-full items-center justify-between gap-3">
              <div className="text-xs uppercase tracking-wider text-stone-500">
                Hit roll ({data.hitDiceCount}d20{data.hitDiceCount > 1 ? ', take highest' : ''})
              </div>
              {!hitSettled && (
                <button onClick={skipHitRoll} className="text-xs uppercase tracking-wider text-stone-500 underline underline-offset-4 hover:text-stone-200">
                  Skip roll
                </button>
              )}
            </div>
            <RollerFrame borderColor={ui.color} height={280}>
              {hitSettled ? (
                <SettledDiceDisplay rolls={hitRolls} sides={20} color={ui.color} />
              ) : (
                <PhysicsDiceRoller
                  key="player-hit-roll"
                  count={data.hitDiceCount}
                  isD20
                  accentColor={ui.color}
                  onResult={recordHitRolls}
                  onDone={() => setHitSettled(true)}
                />
              )}
            </RollerFrame>
            <RollSummary
              title="Settled result"
              rolls={hitRolls}
              selectedRoll={hitResult?.naturalRoll}
              bonus={data.hitBonus}
              armorClass={data.targetArmorClass}
              totalRoll={hitResult?.totalRoll}
            />
            <AnimatePresence>
              {hitSettled && hitResult && (
                <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 text-3xl font-bold" style={{ color: ui.color, fontFamily: "'Cinzel',serif" }}>
                    <ResultIcon className="h-8 w-8" />
                    <span>{ui.label}</span>
                  </div>
                  {isAttackMiss(hitResult) ? (
                    <CombatButton tone="neutral" onClick={finish}>Continue</CombatButton>
                  ) : (
                    <CombatButton onClick={startDamageRoll}>
                      <Dice5 className="h-4 w-4" />
                      Roll damage
                    </CombatButton>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {phase === 'damage_roll' && (
          <div className="flex w-full flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-2xl font-bold" style={{ color: ui.color, fontFamily: "'Cinzel',serif" }}>
              <ResultIcon className="h-6 w-6" />
              <span>{ui.label}</span>
            </div>
            <div className="flex w-full items-center justify-between gap-3">
              <div className="text-xs uppercase tracking-wider text-stone-500">Damage ({damageDiceCount}d6)</div>
              {!damageSettled && (
                <button onClick={skipDamageRoll} className="text-xs uppercase tracking-wider text-stone-500 underline underline-offset-4 hover:text-stone-200">
                  Skip roll
                </button>
              )}
            </div>
            <RollerFrame borderColor="#ff6040" height={210}>
              {damageSettled ? (
                <SettledDiceDisplay rolls={damageRolls} sides={6} color="#ff6040" />
              ) : (
                <PhysicsDiceRoller
                  key={`player-damage-${damageDiceCount}`}
                  count={damageDiceCount}
                  accentColor="#ff6040"
                  onResult={setDamageRolls}
                  onDone={() => setDamageSettled(true)}
                />
              )}
            </RollerFrame>
            <DamageSummary
              rolls={damageRolls}
              diceTotal={diceTotal}
              modifier={data.damageModifier}
              blocked={blockedByTarget}
              finalDamage={finalDamage}
            />
            {damageSettled ? (
              <CombatButton onClick={() => setPhase('done')}>Show result</CombatButton>
            ) : (
              <div className="text-xs italic text-stone-600">Waiting for dice to settle...</div>
            )}
          </div>
        )}

        {phase === 'done' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-3xl font-bold" style={{ color: ui.color, fontFamily: "'Cinzel',serif" }}>
              <ResultIcon className="h-8 w-8" />
              <span>{ui.label}</span>
            </div>
            <div className="text-4xl font-bold" style={{ color: '#ff6040', fontFamily: "'Cinzel',serif" }}>
              {finalDamage} damage
            </div>
            <DamageSummary
              rolls={damageRolls}
              diceTotal={diceTotal}
              modifier={data.damageModifier}
              blocked={blockedByTarget}
              finalDamage={finalDamage}
            />
            <CombatButton tone="neutral" onClick={finish}>Continue</CombatButton>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export function EnemyAttackOverlay({ data, onDone }) {
  const [resolved, setResolved] = useState(null);
  const ui = getResultUi(resolved?.result ?? ATTACK_RESULT.HIT, 'enemy');
  const ResultIcon = ui.icon;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const hitRolls = rollDice(1, 20);
      const hitResult = resolveD20Attack({
        rolls: hitRolls,
        bonus: data.hitBonus,
        armorClass: data.playerAC,
      });
      const damageDiceCount = getMonsterDamageDiceCount(data.monster.attack, hitResult.isCrit);
      const attackMissed = isAttackMiss(hitResult);
      const damageRolls = attackMissed ? [] : rollDice(damageDiceCount, 6);
      const slowedPenalty = data.enemySlowed ? 2 : 0;
      const damageResolution = resolveDamage({
        rolls: damageRolls,
        modifier: -slowedPenalty,
        block: data.playerBlock,
        isMiss: attackMissed,
      });

      setResolved({
        ...hitResult,
        hitRolls,
        damageRolls,
        ...damageResolution,
        slowedPenalty,
      });
    }, 700);

    return () => window.clearTimeout(timer);
  }, [data.enemySlowed, data.hitBonus, data.monster.attack, data.playerAC, data.playerBlock]);

  const finish = () => {
    if (resolved) onDone(resolved);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: `radial-gradient(ellipse at center, ${ui.glow} 0%, rgba(0,0,0,0.9) 100%)`, backdropFilter: 'blur(4px)' }}
    >
      <motion.div
        initial={{ scale: 0.75, y: -30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 190, damping: 22 }}
        className="flex w-full max-w-[520px] flex-col items-center gap-4 rounded-3xl border-2 px-8 py-6 text-center"
        style={{ background: 'linear-gradient(145deg, #1d080f, #0b0407)', borderColor: ui.color, boxShadow: `0 0 60px ${ui.color}44` }}
      >
        <div className="flex w-full items-center justify-between gap-4">
          <div className="text-left">
            <div className="flex items-center gap-2 text-sm font-bold text-stone-200" style={{ fontFamily: "'Cinzel',serif" }}>
              <Skull className="h-4 w-4" />
              <span>{data.monster.name}</span>
            </div>
            <div className="mt-1 text-[11px] text-stone-500">Attacks vs AC {data.playerAC}</div>
          </div>
          <ResultIcon className="h-7 w-7" style={{ color: ui.color }} />
        </div>

        {!resolved && (
          <div className="flex w-full flex-col items-center gap-4 py-8">
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.75, 1, 0.75] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="rounded-full border border-red-500/40 bg-red-950/30 p-5"
            >
              <Swords className="h-10 w-10 text-red-300" />
            </motion.div>
            <div className="text-xs uppercase tracking-[0.28em] text-stone-500">Enemy attack resolving</div>
          </div>
        )}

        {resolved && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-3xl font-bold" style={{ color: ui.color, fontFamily: "'Cinzel',serif" }}>
              <ResultIcon className="h-8 w-8" />
              <span>{ui.label}</span>
            </div>
            {!resolved.isMiss && (
              <div className="text-4xl font-bold" style={{ color: '#ff4040', fontFamily: "'Cinzel',serif" }}>
                {resolved.finalDamage} damage
              </div>
            )}
            {resolved.isMiss && <div className="text-sm uppercase tracking-[0.25em] text-stone-500">No damage</div>}
            {resolved.blocked > 0 && <div className="text-xs text-stone-500">{resolved.blocked} blocked</div>}
            <CombatButton tone="neutral" onClick={finish}>Continue</CombatButton>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
