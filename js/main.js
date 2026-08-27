// ==========================================================
// main.js — アプリのエントリーポイント（状態管理と結線）
// ==========================================================

import { loadState, saveState, clearState } from "./utils/storage.js";
import { todayKey, weekKey, monthKey } from "./utils/dateUtils.js";
import { recordsInWeek, recordsInMonth } from "./utils/recordStats.js";
import { createRecord } from "./models/record.js";
import { normalizeCategory } from "./models/categories.js";
import { computeLevel } from "./models/levelSystem.js";
import { computeRank } from "./utils/scoreUtils.js";
import {
  computeLifeStatuses,
  computeStatusBreakdown,
  computeStatusWeeklyTrend,
} from "./models/statusSystem.js";
import { computeTodayTitle, computeAllEarnedTitles } from "./models/titleSystem.js";
import {
  generateQuests,
  evaluateQuest,
  QUEST_REWARD_EXP,
  SPECIAL_MILESTONES,
  findNewlyReachedMilestones,
} from "./models/questSystem.js";
import { computeAllSkillTrees, computeSkillTree } from "./models/skillSystem.js";
import { computeAchievements } from "./models/achievementSystem.js";
import { computeCoachTips } from "./models/coachSystem.js";

import { renderExp } from "./components/scoreCard.js";
import { renderRank } from "./components/rankCard.js";
import { renderLevel } from "./components/levelCard.js";
import { renderRecords, setOnDelete, setOnEdit } from "./components/recordList.js";
import { initRecordModal, openRecordModalForEdit } from "./components/recordModal.js";
import { renderAiComment } from "./components/aiComment.js";
import { initSettingsView, setAccountEmail } from "./components/settingsView.js";
import { renderTitle } from "./components/titleCard.js";
import { renderQuests, flashQuestComplete } from "./components/questCard.js";
import { renderLifeStatuses, setOnStatusClick } from "./components/statusCard.js";
import { initStatusDetail, openStatusDetail } from "./components/statusDetailView.js";
import { initCalendar, renderCalendar } from "./components/calendarCard.js";
import { showLevelUp } from "./components/levelUpOverlay.js";
import { renderSkillTree } from "./components/skillTreeView.js";
import { renderAchievements } from "./components/achievementView.js";
import { renderMap } from "./components/mapView.js";
import { renderTitleGallery } from "./components/titleGalleryView.js";
import { renderCoach } from "./components/coachView.js";
import { initNav } from "./nav.js";
import * as authService from "./auth/authService.js";
import { initAuthView } from "./auth/authView.js";
import {
  hasRemoteData,
  fetchRemoteState,
  migrateLocalToRemote,
  upsertRecordRemote,
  deleteRecordRemote,
  upsertProgressRemote,
  deleteAllRemoteData,
} from "./utils/cloudSync.js";
import { showSyncError } from "./components/syncError.js";

const SAVE_FAIL_MSG = "データの保存に失敗しました 通信状態を確認してください";
const DELETE_FAIL_MSG = "データの削除に失敗しました 通信状態を確認してください";
const LOAD_FAIL_MSG = "データの読み込みに失敗しました 通信状態を確認してください";

let state = loadState();
let currentUserId = null;
let appStarted = false;

const appEl = document.getElementById("app");
const authScreenEl = document.getElementById("auth-screen");

const statusListHomeEl = document.getElementById("status-list-home");
const statusListFullEl = document.getElementById("status-list-full");
const greetingMainEl = document.getElementById("greeting-main");

function updateGreeting() {
  const hour = new Date().getHours();
  let text;
  if (hour >= 5 && hour < 12) text = "おはようございます";
  else if (hour >= 12 && hour < 18) text = "こんにちは";
  else text = "こんばんは";
  greetingMainEl.textContent = text;
}

updateGreeting();

function getTodayRecords() {
  return state.records[todayKey()] || [];
}

function getAllRecordsFlat() {
  return Object.values(state.records).flat();
}

function computeTodayExp(records) {
  return records.reduce((sum, r) => sum + r.exp, 0);
}

function syncProgress() {
  if (!currentUserId) return;
  upsertProgressRemote(currentUserId, { totalExp: state.totalExp, quests: state.quests }).catch(() =>
    showSyncError(SAVE_FAIL_MSG)
  );
}

function syncRecordUpsert(dateKey, record) {
  if (!currentUserId) return;
  upsertRecordRemote(currentUserId, dateKey, record).catch(() => showSyncError(SAVE_FAIL_MSG));
}

function syncRecordDelete(id) {
  if (!currentUserId) return;
  deleteRecordRemote(currentUserId, id).catch(() => showSyncError(SAVE_FAIL_MSG));
}

function ensurePeriodicQuests() {
  let changed = false;
  const dKey = todayKey();
  const wKey = weekKey();
  const mKey = monthKey();

  if (!state.quests.daily[dKey]) {
    state.quests.daily[dKey] = { list: generateQuests("daily", dKey), rewardClaimed: false };
    changed = true;
  }
  if (!state.quests.weekly[wKey]) {
    state.quests.weekly[wKey] = { list: generateQuests("weekly", wKey), rewardClaimed: false };
    changed = true;
  }
  if (!state.quests.monthly[mKey]) {
    state.quests.monthly[mKey] = { list: generateQuests("monthly", mKey), rewardClaimed: false };
    changed = true;
  }

  if (changed) {
    saveState(state);
    syncProgress();
  }
}

function tryClaimPeriodRewards() {
  let anyClaimed = false;

  const periods = [
    { type: "daily", key: todayKey(), records: getTodayRecords() },
    { type: "weekly", key: weekKey(), records: recordsInWeek(state.records, weekKey()) },
    { type: "monthly", key: monthKey(), records: recordsInMonth(state.records, monthKey()) },
  ];

  periods.forEach(({ type, key, records }) => {
    const questState = state.quests[type][key];
    if (!questState || questState.rewardClaimed) return;

    const allDone = questState.list.every((q) => evaluateQuest(q, records).done);
    if (!allDone) return;

    questState.rewardClaimed = true;
    state.totalExp += QUEST_REWARD_EXP[type];
    anyClaimed = true;
  });

  let newMilestone = findNewlyReachedMilestones(state.totalExp, state.quests.special.claimed)[0];
  while (newMilestone) {
    state.quests.special.claimed.push(newMilestone.id);
    state.totalExp += newMilestone.reward;
    anyClaimed = true;
    newMilestone = findNewlyReachedMilestones(state.totalExp, state.quests.special.claimed)[0];
  }

  return anyClaimed;
}

function renderAll({ animate = false } = {}) {
  ensurePeriodicQuests();

  const todayRecords = getTodayRecords();
  const allRecords = getAllRecordsFlat();
  const todayExp = computeTodayExp(todayRecords);
  const levelInfo = computeLevel(state.totalExp);
  const rankInfo = computeRank(todayExp);
  const lifeStatuses = computeLifeStatuses(allRecords);
  const lifeStatLevels = Object.fromEntries(lifeStatuses.map((s) => [s.key, s.level]));
  const achievements = computeAchievements({
    totalExp: state.totalExp,
    records: state.records,
    lifeStatLevels,
  });

  const wKey = weekKey();
  const mKey = monthKey();

  renderExp(todayExp, animate);
  renderRank(rankInfo);
  renderLevel(levelInfo);
  renderRecords(todayRecords);
  renderAiComment(todayExp, todayRecords.length);
  renderTitle(computeTodayTitle(todayRecords));
  renderLifeStatuses(statusListHomeEl, lifeStatuses);
  renderLifeStatuses(statusListFullEl, lifeStatuses);
  renderQuests({
    daily: { list: state.quests.daily[todayKey()].list, records: todayRecords },
    weekly: { list: state.quests.weekly[wKey].list, records: recordsInWeek(state.records, wKey) },
    monthly: { list: state.quests.monthly[mKey].list, records: recordsInMonth(state.records, mKey) },
    special: {
      totalExp: state.totalExp,
      milestones: SPECIAL_MILESTONES.map((m) => ({
        ...m,
        claimed: state.quests.special.claimed.includes(m.id),
      })),
    },
  });
  renderCalendar(state.records);
  renderSkillTree(computeAllSkillTrees(lifeStatuses));
  renderAchievements(achievements);
  renderMap({ totalExp: state.totalExp, lifeStatuses });
  renderTitleGallery(computeAllEarnedTitles(state.records));
  renderCoach(computeCoachTips({ lifeStatuses, achievements, todayRecords }));
}

function addRecord({ title, category, exp }) {
  const key = todayKey();
  const beforeLevel = computeLevel(state.totalExp).level;

  const record = createRecord(title, category, exp);
  if (!state.records[key]) state.records[key] = [];
  state.records[key].push(record);
  state.totalExp += exp;

  const questRewardClaimed = tryClaimPeriodRewards();

  saveState(state);
  renderAll({ animate: true });
  syncRecordUpsert(key, record);
  syncProgress();

  if (questRewardClaimed) flashQuestComplete();

  const afterLevel = computeLevel(state.totalExp).level;
  if (afterLevel > beforeLevel) showLevelUp(afterLevel);
}

function deleteRecord(id) {
  const key = todayKey();
  const records = state.records[key] || [];
  const target = records.find((r) => r.id === id);
  if (!target) return;

  state.records[key] = records.filter((r) => r.id !== id);
  state.totalExp = Math.max(0, state.totalExp - target.exp);

  saveState(state);
  renderAll({ animate: true });
  syncRecordDelete(id);
  syncProgress();
}

function updateRecord(id, { title, category, exp }) {
  const key = todayKey();
  const records = state.records[key] || [];
  const target = records.find((r) => r.id === id);
  if (!target) return;

  const beforeLevel = computeLevel(state.totalExp).level;

  state.totalExp = Math.max(0, state.totalExp - target.exp + exp);
  target.title = title;
  target.category = normalizeCategory(category);
  target.exp = exp;

  const questRewardClaimed = tryClaimPeriodRewards();

  saveState(state);
  renderAll({ animate: true });
  syncRecordUpsert(key, target);
  syncProgress();

  if (questRewardClaimed) flashQuestComplete();

  const afterLevel = computeLevel(state.totalExp).level;
  if (afterLevel > beforeLevel) showLevelUp(afterLevel);
}

function handleStatusClick(key) {
  const allRecords = getAllRecordsFlat();
  const lifeStatuses = computeLifeStatuses(allRecords);
  const stat = lifeStatuses.find((s) => s.key === key);
  if (!stat) return;

  const lifeStatLevels = Object.fromEntries(lifeStatuses.map((s) => [s.key, s.level]));
  const achievements = computeAchievements({
    totalExp: state.totalExp,
    records: state.records,
    lifeStatLevels,
  });

  const skillNodes = computeSkillTree(key, stat.level);

  openStatusDetail({
    key,
    icon: stat.icon,
    level: stat.level,
    progressRatio: stat.progressRatio,
    expToNext: stat.expToNext,
    breakdown: computeStatusBreakdown(key, allRecords),
    trend: computeStatusWeeklyTrend(key, state.records),
    nextSkill: skillNodes.find((n) => !n.unlocked) || null,
    nextAchievement: achievements.find((a) => a.id.startsWith(`stat-${key}-`) && !a.unlocked) || null,
  });
}

function resetAll() {
  clearState();
  state = loadState();
  renderAll();

  if (currentUserId) {
    deleteAllRemoteData(currentUserId).catch(() => showSyncError(DELETE_FAIL_MSG));
  }
}

function showApp() {
  authScreenEl.classList.add("auth-hidden");
  appEl.classList.remove("app-hidden");
}

function showAuth() {
  appEl.classList.add("app-hidden");
  authScreenEl.classList.remove("auth-hidden");
}

function startApp() {
  setOnDelete(deleteRecord);
  setOnEdit(openRecordModalForEdit);
  initRecordModal({ onSave: addRecord, onUpdate: updateRecord });
  initSettingsView(resetAll, () => authService.signOut());
  initCalendar();
  initStatusDetail();
  setOnStatusClick(handleStatusClick);
  initNav();
  renderAll();
}

async function handleAuthenticated(session) {
  currentUserId = session.user.id;
  setAccountEmail(session.user.email);

  try {
    const remoteHasData = await hasRemoteData(currentUserId);
    if (remoteHasData) {
      state = await fetchRemoteState(currentUserId);
      saveState(state);
    } else {
      await migrateLocalToRemote(currentUserId, state);
    }
  } catch {
    showSyncError(LOAD_FAIL_MSG);
  }

  if (!appStarted) {
    appStarted = true;
    startApp();
  } else {
    renderAll();
  }
  showApp();
}

async function bootstrap() {
  initAuthView({ onAuthenticated: handleAuthenticated });

  try {
    authService.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        location.reload();
      }
    });

    const { data } = await authService.getSession();
    if (data.session) {
      await handleAuthenticated(data.session);
      return;
    }
  } catch {
    showSyncError(LOAD_FAIL_MSG);
  }
  showAuth();
}

bootstrap();
