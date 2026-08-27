// ==========================================================
// dateUtils.js — 日付キーの生成
// ==========================================================

export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function weekKey(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const mondayOffset = (d.getDay() + 6) % 7; // 月曜始まり
  d.setDate(d.getDate() - mondayOffset);
  return todayKey(d);
}

export function monthKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function isDateKeyInWeek(dateKey, weekStartKey) {
  const start = new Date(weekStartKey);
  const end = new Date(weekStartKey);
  end.setDate(end.getDate() + 7);
  const target = new Date(dateKey);
  return target >= start && target < end;
}

export function isDateKeyInMonth(dateKey, monthKeyValue) {
  return dateKey.startsWith(`${monthKeyValue}-`);
}

export function formatTime(timestamp) {
  const date = new Date(timestamp);
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}
