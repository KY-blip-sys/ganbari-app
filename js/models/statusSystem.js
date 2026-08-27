// ==========================================================
// statusSystem.js — 人生ステータス（長期累積・レベル制）
// ==========================================================

import { CATEGORIES } from "./categories.js";
import { computeLevelFromExp } from "./levelSystem.js";
import { weekKey } from "../utils/dateUtils.js";
import { recordsInWeek } from "../utils/recordStats.js";

export const STATUS_EXP_PER_LEVEL = 100;

export const LIFE_STAT_LIST = [
  { key: "学び", icon: "🧠" },
  { key: "健康", icon: "❤️" },
  { key: "メンタル", icon: "🧘" },
  { key: "お金", icon: "💰" },
  { key: "人間関係", icon: "🤝" },
  { key: "趣味", icon: "🎨" },
  { key: "生活力", icon: "🏠" },
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

// そのステータスに寄与しているカテゴリの内訳（多い順）
export function computeStatusBreakdown(lifeStatKey, allRecords) {
  const totals = {};

  allRecords.forEach((record) => {
    if (CATEGORY_LIFESTAT_MAP[record.category] !== lifeStatKey) return;
    totals[record.category] = (totals[record.category] || 0) + record.exp;
  });

  const categoryMeta = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));
  const total = Object.values(totals).reduce((sum, v) => sum + v, 0);

  return Object.entries(totals)
    .map(([category, exp]) => ({
      category,
      icon: categoryMeta[category]?.emoji || "✨",
      exp,
      ratio: total ? exp / total : 0,
    }))
    .sort((a, b) => b.exp - a.exp);
}

const RADAR_LEVEL_CAP = 30;

const OVERALL_RANK_TIERS = [
  { min: 25, rank: "SSS", label: "伝説" },
  { min: 20, rank: "SS", label: "覚醒" },
  { min: 15, rank: "S", label: "熟練" },
  { min: 10, rank: "A", label: "上級" },
  { min: 6, rank: "B", label: "中級" },
  { min: 3, rank: "C", label: "初級" },
  { min: 0, rank: "D", label: "駆け出し" },
];

// レーダーチャート・総合ランクなど、ステータス画面上部のサマリー表示用データ
export function computeStatusOverview(lifeStatuses) {
  const totalLevel = lifeStatuses.reduce((sum, s) => sum + s.level, 0);
  const totalExp = lifeStatuses.reduce((sum, s) => sum + s.exp, 0);
  const averageLevel = totalLevel / lifeStatuses.length;

  const radar = lifeStatuses.map(({ key, icon, level }) => ({
    key,
    icon,
    level,
    ratio: Math.min(1, level / RADAR_LEVEL_CAP),
  }));

  const rank = OVERALL_RANK_TIERS.find((t) => averageLevel >= t.min);

  return { radar, totalLevel, totalExp, averageLevel, rank };
}

// 直近N週間、そのステータスが週ごとに何EXP積み上がったか
export function computeStatusWeeklyTrend(lifeStatKey, recordsByDate, weeksCount = 8) {
  const now = new Date();
  const weeks = [];
  for (let i = weeksCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    weeks.push(weekKey(d));
  }

  return weeks.map((wk) => {
    const exp = recordsInWeek(recordsByDate, wk)
      .filter((r) => CATEGORY_LIFESTAT_MAP[r.category] === lifeStatKey)
      .reduce((sum, r) => sum + r.exp, 0);
    return { weekKey: wk, exp };
  });
}
