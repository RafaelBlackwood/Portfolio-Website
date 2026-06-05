export const ATTACK_RESULT = {
  HIT: 'hit',
  MISS: 'miss',
  CRIT: 'crit',
};

export function sumDice(rolls = []) {
  return rolls.reduce((total, value) => total + value, 0);
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

export function formatDiceRolls(rolls = []) {
  return rolls.join(' + ');
}
