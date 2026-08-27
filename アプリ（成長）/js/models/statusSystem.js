// ==========================================================
// statusSystem.js — 人生ステータス（長期累積・レベル制）
// ==========================================================

import { CATEGORIES } from "./categories.js";
import { computeLevelFromExp } from "./levelSystem.js";

export const STATUS_EXP_PER_LEVEL = 100;

export const LIFE_STAT_LIST = [
  { key: "学び", icon: "🧠" },
  { key: "健康", icon: "❤️" },
  { key: "お金", icon: "💰" },
  { key: "人間関係", icon: "🤝" },
  { key: "趣味", icon: "🎨" },
];

export const CATEGORY_LIFESTAT_MAP = Object.fromEntries(
  CATEGORIES.filter((c) => c.lifeStat).map((c) => [c.key, c.lifeStat])
);

export function computeLifeStatuses(allRecords) {
  const totals = Object.fromEntries(LIFE_STAT_LIST.map(({ key }) => [key, 0]));

  allRecords.forEach((record) => {
    const stat = CATEGORY_LIFESTAT_MAP[record.category];
    if (stat) totals[stat] += record.exp;
  });

  return LIFE_STAT_LIST.map(({ key, icon }) => {
    const exp = totals[key];
    const { level, expIntoLevel, expToNext, progressRatio } = computeLevelFromExp(
      exp,
      STATUS_EXP_PER_LEVEL
    );
    return { key, icon, exp, level, expIntoLevel, expToNext, progressRatio };
  });
}
