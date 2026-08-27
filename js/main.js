// ==========================================================
// main.js — アプリのエントリーポイント（状態管理と結線）
// ==========================================================

import { loadState, saveState, clearState } from "./utils/storage.js";
import { todayKey } from "./utils/dateUtils.js";
import { createRecord } from "./models/record.js";
import { normalizeCategory } from "./models/categories.js";
import { computeLevel } from "./models/levelSystem.js";
import { computeRank } from "./utils/scoreUtils.js";
import { computeLifeStatuses } from "./models/statusSystem.js";
import { computeTodayTitle, computeAllEarnedTitles } from "./models/titleSystem.js";
import { generateDailyQuests, evaluateQuest, QUEST_REWARD_EXP } from "./models/questSystem.js";
import { computeAllSkillTrees } from "./models/skillSystem.js";
import { computeAchievements } from "./models/achievementSystem.js";
import { computeMapProgress } from "./models/mapSystem.js";
import { computeCoachTips } from "./models/coachSystem.js";

import { renderExp } from "./components/scoreCard.js";
import { renderRank } from "./components/rankCard.js";
import { renderLevel } from "./components/levelCard.js";
import { renderRecords, setOnDelete, setOnEdit } from "./components/recordList.js";
import { initRecordModal, openRecordModalForEdit } from "./components/recordModal.js";
import { renderAiComment } from "./components/aiComment.js";
import { initSettingsView } from "./components/settingsView.js";
import { renderTitle } from "./components/titleCard.js";
import { renderQuests, flashQuestComplete } from "./components/questCard.js";
import { renderLifeStatuses } from "./components/statusCard.js";
import { initCalendar, renderCalendar } from "./components/calendarCard.js";
import { showLevelUp } from "./components/levelUpOverlay.js";
import { renderSkillTree } from "./components/skillTreeView.js";
import { renderAchievements } from "./components/achievementView.js";
import { renderMap } from "./components/mapView.js";
import { renderTitleGallery } from "./components/titleGalleryView.js";
import { renderCoach } from "./components/coachView.js";
import { initNav } from "./nav.js";

let state = loadState();

const statusListHomeEl = document.getElementById("status-list-home");
const statusListFullEl = document.getElementById("status-list-full");

function getTodayRecords() {
  return state.records[todayKey()] || [];
}

function getAllRecordsFlat() {
  return Object.values(state.records).flat();
}

function computeTodayExp(records) {
  return records.reduce((sum, r) => sum + r.exp, 0);
}

function ensureTodayQuests() {
  const key = todayKey();
  if (!state.quests[key]) {
    state.quests[key] = { list: generateDailyQuests(), rewardClaimed: false };
    saveState(state);
  }
}

function tryClaimQuestReward() {
  const key = todayKey();
  const questState = state.quests[key];
  if (!questState || questState.rewardClaimed) return false;

  const todayRecords = getTodayRecords();
  const allDone = questState.list.every((q) => evaluateQuest(q, todayRecords).done);
  if (!allDone) return false;

  questState.rewardClaimed = true;
  state.totalExp += QUEST_REWARD_EXP;
  return true;
}

function renderAll({ animate = false } = {}) {
  ensureTodayQuests();

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

  renderExp(todayExp, animate);
  renderRank(rankInfo);
  renderLevel(levelInfo);
  renderRecords(todayRecords);
  renderAiComment(todayExp, todayRecords.length);
  renderTitle(computeTodayTitle(todayRecords));
  renderLifeStatuses(statusListHomeEl, lifeStatuses);
  renderLifeStatuses(statusListFullEl, lifeStatuses);
  renderQuests(state.quests[todayKey()].list, todayRecords);
  renderCalendar(state.records);
  renderSkillTree(computeAllSkillTrees(lifeStatuses));
  renderAchievements(achievements);
  renderMap(computeMapProgress(state.totalExp));
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

  const questRewardClaimed = tryClaimQuestReward();

  saveState(state);
  renderAll({ animate: true });

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

  const questRewardClaimed = tryClaimQuestReward();

  saveState(state);
  renderAll({ animate: true });

  if (questRewardClaimed) flashQuestComplete();

  const afterLevel = computeLevel(state.totalExp).level;
  if (afterLevel > beforeLevel) showLevelUp(afterLevel);
}

function resetAll() {
  clearState();
  state = loadState();
  renderAll();
}

setOnDelete(deleteRecord);
setOnEdit(openRecordModalForEdit);
initRecordModal({ onSave: addRecord, onUpdate: updateRecord });
initSettingsView(resetAll);
initCalendar();
initNav();
renderAll();
