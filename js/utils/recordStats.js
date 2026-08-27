// ==========================================================
// recordStats.js — records から集計値を導出する共通ヘルパー
// achievementSystem / questSystem など複数箇所から利用される
// ==========================================================

import { isDateKeyInWeek, isDateKeyInMonth } from "./dateUtils.js";

export function computeMaxStreak(recordsByDate) {
  const days = Object.keys(recordsByDate)
    .filter((key) => recordsByDate[key].length > 0)
    .map((key) => {
      const [y, m, d] = key.split("-").map(Number);
      return new Date(y, m - 1, d).getTime();
    })
    .sort((a, b) => a - b);

  if (days.length === 0) return 0;

  let maxStreak = 1;
  let current = 1;
  const ONE_DAY = 24 * 60 * 60 * 1000;

  for (let i = 1; i < days.length; i++) {
    const diff = Math.round((days[i] - days[i - 1]) / ONE_DAY);
    current = diff === 1 ? current + 1 : 1;
    maxStreak = Math.max(maxStreak, current);
  }

  return maxStreak;
}

export function computeCurrentStreak(recordsByDate, todayKeyValue) {
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const [ty, tm, td] = todayKeyValue.split("-").map(Number);
  let cursor = new Date(ty, tm - 1, td).getTime();

  // 今日まだ記録がない場合は、昨日までの連続日数を数える
  if (!(recordsByDate[todayKeyValue] || []).length) {
    cursor -= ONE_DAY;
  }

  let streak = 0;
  while (true) {
    const d = new Date(cursor);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (!(recordsByDate[key] || []).length) break;
    streak++;
    cursor -= ONE_DAY;
  }

  return streak;
}

export function recordsInWeek(recordsByDate, weekStartKey) {
  return Object.entries(recordsByDate)
    .filter(([key]) => isDateKeyInWeek(key, weekStartKey))
    .flatMap(([, list]) => list);
}

export function recordsInMonth(recordsByDate, monthKeyValue) {
  return Object.entries(recordsByDate)
    .filter(([key]) => isDateKeyInMonth(key, monthKeyValue))
    .flatMap(([, list]) => list);
}

export function countTouchedCategories(records) {
  return new Set(records.map((r) => r.category)).size;
}
