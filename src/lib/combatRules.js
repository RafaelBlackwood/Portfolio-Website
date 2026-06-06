export const ATTACK_RESULT = {
  HIT: 'hit',
  MISS: 'miss',
  CRIT: 'crit',
};

export function sumDice(rolls = []) {
  return rolls.reduce((total, value) => total + value, 0);
}

export function rollDice(count, sides, random = Math.random) {
  return Array.from({ length: count }, () => Math.floor(random() * sides) + 1);
}

export function getDamageDiceCount(value, isCrit = false) {
  const baseCount = Math.max(1, Math.min(6, Math.ceil(value / 3)));
  return isCrit ? Math.min(6, baseCount * 2) : baseCount;
}

export function getMonsterDamageDiceCount(attack, isCrit = false) {
  const baseCount = Math.max(1, Math.min(6, Math.ceil(attack / 3)));
  return isCrit ? Math.min(6, baseCount * 2) : baseCount;
}

export function resolveD20Attack({ rolls = [], bonus = 0, armorClass = 10 }) {
  const naturalRoll = Math.max(...rolls, 1);
  const totalRoll = naturalRoll + bonus;
  const isCrit = naturalRoll === 20;
  const isMiss = naturalRoll === 1 || (!isCrit && totalRoll < armorClass);

  return {
    naturalRoll,
    totalRoll,
    isCrit,
    isMiss,
    result: isCrit ? ATTACK_RESULT.CRIT : isMiss ? ATTACK_RESULT.MISS : ATTACK_RESULT.HIT,
  };
}

export function isAttackMiss(resolution = {}) {
  if (resolution.result === ATTACK_RESULT.HIT || resolution.result === ATTACK_RESULT.CRIT) {
    return false;
  }
  if (resolution.result === ATTACK_RESULT.MISS) {
    return true;
  }
  return resolution.isMiss === true;
}

export function isAttackCrit(resolution = {}) {
  return resolution.result === ATTACK_RESULT.CRIT || resolution.isCrit === true;
}

export function resolveDamage({
  rolls = [],
  modifier = 0,
  block = 0,
  isMiss = false,
}) {
  const diceTotal = sumDice(rolls);
  const rawDamage = isMiss ? 0 : Math.max(0, diceTotal + modifier);
  const blocked = Math.min(Math.max(0, block), rawDamage);
  const finalDamage = Math.max(0, rawDamage - blocked);

  return {
    diceTotal,
    rawDamage,
    blocked,
    finalDamage,
  };
}

export function formatDiceRolls(rolls = []) {
  return rolls.join(' + ');
}
