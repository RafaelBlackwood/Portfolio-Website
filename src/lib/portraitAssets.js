export function getHeroPortrait(classId) {
  return classId ? `/assets/portraits/heroes/${classId}.png` : null;
}

export function getMonsterPortrait(monsterId) {
  return monsterId ? `/assets/portraits/monsters/${monsterId}.png` : null;
}
