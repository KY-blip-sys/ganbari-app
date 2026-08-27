// ==========================================================
// storage.js — localStorage の読み書きだけを担当する薄いレイヤー
// ==========================================================

const STORAGE_KEY = "lifeRPG_v1";

function defaultState() {
  return {
    totalExp: 0,
    records: {}, // { "YYYY-MM-DD": [record, ...] }
    quests: {
      daily: {}, // { "YYYY-MM-DD": { list: [quest, ...], rewardClaimed: boolean } }
      weekly: {}, // { "週の月曜日キー": { list, rewardClaimed } }
      monthly: {}, // { "YYYY-MM": { list, rewardClaimed } }
      special: { claimed: [] }, // 達成済みマイルストーンID
    },
  };
}

function migrateRecords(records) {
  const migrated = {};
  for (const [key, list] of Object.entries(records)) {
    migrated[key] = list.map((r) => {
      if (r.exp === undefined && r.points !== undefined) {
        const { points, ...rest } = r;
        return { ...rest, exp: points };
      }
      return r;
    });
  }
  return migrated;
}

export function migrateQuests(quests) {
  if (!quests || typeof quests !== "object") return defaultState().quests;

  if (quests.daily || quests.weekly || quests.monthly || quests.special) {
    return {
      daily: quests.daily || {},
      weekly: quests.weekly || {},
      monthly: quests.monthly || {},
      special: quests.special && Array.isArray(quests.special.claimed) ? quests.special : { claimed: [] },
    };
  }

  // 旧形式: { "YYYY-MM-DD": { list, rewardClaimed } } はそのままデイリーとして扱う
  return { daily: quests, weekly: {}, monthly: {}, special: { claimed: [] } };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return {
      totalExp: typeof parsed.totalExp === "number" ? parsed.totalExp : 0,
      records: migrateRecords(parsed.records && typeof parsed.records === "object" ? parsed.records : {}),
      quests: migrateQuests(parsed.quests),
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}
