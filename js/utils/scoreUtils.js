// ==========================================================
// scoreUtils.js — 今日の獲得EXPからランクと色を判定する
// ==========================================================

const RANK_TIERS = [
  { min: 300, rank: "SSS", tier: "gold", message: "👑 伝説級の一日！限界を超えました！" },
  { min: 200, rank: "SS", tier: "gold", message: "🔥 圧巻です！最高レベルの努力でした！" },
  { min: 150, rank: "S", tier: "green", message: "🌟 とても充実した一日でした！" },
  { min: 100, rank: "A", tier: "green", message: "👍 良い一日でした。この調子です！" },
  { min: 70, rank: "B", tier: "blue", message: "😊 順調です。あと少しでAランク！" },
  { min: 40, rank: "C", tier: "blue", message: "📈 少しずつ成長しています！" },
  { min: 20, rank: "D", tier: "orange", message: "💪 小さな努力も立派な一歩です！" },
  { min: 0, rank: "E", tier: "red", message: "🌱 明日は新しい一日です。" },
];

export function computeRank(todayExp) {
  return RANK_TIERS.find((t) => todayExp >= t.min);
}

export function getCalendarDayTier(todayExp) {
  return computeRank(todayExp).tier;
}
