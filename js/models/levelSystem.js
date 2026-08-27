// ==========================================================
// levelSystem.js — 累計EXPからレベル・進捗を算出する
// ==========================================================

export const EXP_PER_LEVEL = 100;

export function computeLevelFromExp(exp, expPerLevel) {
  const safeExp = Math.max(0, exp);
  const level = Math.floor(safeExp / expPerLevel) + 1;
  const expIntoLevel = safeExp % expPerLevel;
  const expToNext = expPerLevel - expIntoLevel;
  const progressRatio = expIntoLevel / expPerLevel;

  return { level, expIntoLevel, expToNext, progressRatio };
}

export function computeLevel(totalExp) {
  return computeLevelFromExp(totalExp, EXP_PER_LEVEL);
}
