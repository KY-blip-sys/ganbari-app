// ==========================================================
// statusSystem.js — 人生ステータス（長期累積・レベル制）
// ==========================================================

import { CATEGORIES } from "./categories.js";
import { computeLevelFromExp } from "./levelSystem.js";
import { weekKey } from "../utils/dateUtils.js";
import { recordsInWeek } from "../utils/recordStats.js";

export const STATUS_EXP_PER_LEVEL = 100;

// 人生ステータスの統一アイコン（ホーム／能力詳細／人生マップ／スキルツリー／実績／称号で共通）
export const LIFE_STAT_ICON = {
  学び: "graduation-cap",
  健康: "heart",
  メンタル: "moon",
  お金: "wallet",
  人間関係: "people",
  趣味: "palette",
  生活力: "house",
};

export const LIFE_STAT_LIST = Object.keys(LIFE_STAT_ICON).map((key) => ({
  key,
  icon: LIFE_STAT_ICON[key],
}));

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
      icon: categoryMeta[category]?.icon || "sparkle",
      exp,
      ratio: total ? exp / total : 0,
    }))
    .sort((a, b) => b.exp - a.exp);
}

const RADAR_LEVEL_CAP = 30;

const OVERALL_RANK_TIERS = [
  { min: 25, rank: "SSS", label: "伝説", tier: "gold" },
  { min: 20, rank: "SS", label: "覚醒", tier: "gold" },
  { min: 15, rank: "S", label: "熟練", tier: "green" },
  { min: 10, rank: "A", label: "上級", tier: "green" },
  { min: 6, rank: "B", label: "中級", tier: "blue" },
  { min: 3, rank: "C", label: "初級", tier: "blue" },
  { min: 0, rank: "D", label: "駆け出し", tier: "orange" },
];

// レーダーチャート・総合ランクなど、ステータス画面上部のサマリー表示用データ
export function computeStatusOverview(lifeStatuses) {
  const n = lifeStatuses.length;
  const totalLevel = lifeStatuses.reduce((sum, s) => sum + s.level, 0);
  const totalExp = lifeStatuses.reduce((sum, s) => sum + s.exp, 0);
  const averageLevel = totalLevel / n;

  const radar = lifeStatuses.map(({ key, icon, level }) => ({
    key,
    icon,
    level,
    ratio: Math.min(1, level / RADAR_LEVEL_CAP),
  }));

  const rankIndex = OVERALL_RANK_TIERS.findIndex((t) => averageLevel >= t.min);
  const rank = OVERALL_RANK_TIERS[rankIndex];
  const nextRank = rankIndex > 0 ? OVERALL_RANK_TIERS[rankIndex - 1] : null;

  // 次ランクまでのEXP：全ステータスの「今のレベル内の端数EXP」を差し引いた必要レベル数から逆算
  let expToNextRank = null;
  let rankProgressRatio = 1;
  if (nextRank) {
    const partialExp = totalExp - (totalLevel - n) * STATUS_EXP_PER_LEVEL;
    const targetTotalLevel = nextRank.min * n;
    const neededLevels = targetTotalLevel - totalLevel;
    expToNextRank = Math.max(0, neededLevels * STATUS_EXP_PER_LEVEL - partialExp);

    const spanExp = (targetTotalLevel - rank.min * n) * STATUS_EXP_PER_LEVEL;
    rankProgressRatio = spanExp > 0 ? Math.min(1, Math.max(0, 1 - expToNextRank / spanExp)) : 1;
  }

  return { radar, totalLevel, totalExp, averageLevel, rank, nextRank, expToNextRank, rankProgressRatio };
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
