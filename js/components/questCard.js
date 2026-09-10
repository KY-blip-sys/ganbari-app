// ==========================================================
// questCard.js — クエスト表示（今日／今週／今月／スペシャル）
// ==========================================================

import { evaluateQuest, QUEST_REWARD_EXP } from "../models/questSystem.js";
import { CATEGORIES } from "../models/categories.js";
const tabsEl = document.getElementById("quest-tabs");
const cardEl = document.getElementById("quest-card");
const labelEl = document.getElementById("quest-card-label");
const listEl = document.getElementById("quest-list");
const rewardPanelEl = document.getElementById("quest-reward-panel");

const heroEl = document.getElementById("quest-hero");
const heroRingFillEl = document.getElementById("quest-hero-ring-fill");
const heroPercentEl = document.getElementById("quest-hero-percent");
const heroFractionEl = document.getElementById("quest-hero-fraction");

const RING_RADIUS = 36;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
heroRingFillEl.style.strokeDasharray = `${RING_CIRCUMFERENCE}`;

const TABS = [
  { id: "daily", icon: "☀️", label: "今日" },
  { id: "weekly", icon: "📅", label: "今週" },
  { id: "monthly", icon: "📅", label: "今月" },
  { id: "special", icon: "⭐", label: "スペシャル" },
];

const PERIOD_LABEL = { daily: "今日", weekly: "今週", monthly: "今月" };

let selectedTab = "daily";
let cachedData = null;

const QUEST_TYPE_ICON = {
  categoryExp: "🚩",
  recordCount: "📝",
  totalExp: "💵",
  streak: "🔥",
  timeOfDay: "😴",
  categoryDiversity: "🎨",
};

// 完了の瞬間だけチェックアニメーションを出すための直前状態の記録
const previousDone = {};
const initializedPeriods = new Set();

function questIconName(quest) {
  if (quest.type === "categoryExp") {
    const cat = CATEGORIES.find((c) => c.key === quest.category);
    if (cat) return cat.emoji;
  }
  return QUEST_TYPE_ICON[quest.type] || "🚩";
}

function rewardChipIcon(icon) {
  return `<span class="quest-reward-chip-icon">${icon}</span>`;
}

// 期間の達成報酬をクエスト数で割った「ゲーム風」の目安表示（実際の付与は全達成時のみ）
function flavorReward(period, count) {
  if (!count) return 0;
  const raw = QUEST_REWARD_EXP[period] / count;
  return Math.max(5, Math.round(raw / 5) * 5);
}

function renderTabs() {
  tabsEl.innerHTML = TABS.map(
    (t) => `
      <button class="quest-tab tap-scale ${t.id === selectedTab ? "active" : ""}" data-tab-id="${t.id}">
        <span class="quest-tab-icon">${t.icon}</span><span class="quest-tab-label">${t.label}</span>
      </button>
    `
  ).join("");

  tabsEl.querySelectorAll(".quest-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      const fromIndex = TABS.findIndex((t) => t.id === selectedTab);
      const toIndex = TABS.findIndex((t) => t.id === btn.dataset.tabId);
      selectedTab = btn.dataset.tabId;
      renderTabs();
      renderContent(toIndex > fromIndex ? "forward" : "backward");
    });
  });
}

function renderRewardPanel(period, allDone) {
  const exp = QUEST_REWARD_EXP[period];
  const label = PERIOD_LABEL[period];

  if (allDone) {
    rewardPanelEl.className = "quest-reward-panel quest-reward-panel-complete";
    rewardPanelEl.innerHTML = `
      <p class="quest-complete-badge">COMPLETE</p>
      <p class="quest-complete-message">${label}はよく頑張りました！</p>
      <div class="quest-reward-chips">
        <span class="quest-reward-chip quest-reward-chip-lit">${rewardChipIcon("✨")} +${exp}EXP</span>
        <span class="quest-reward-chip quest-reward-chip-lit">${rewardChipIcon("🎖️")} 称号</span>
      </div>
    `;
  } else {
    rewardPanelEl.className = "quest-reward-panel";
    rewardPanelEl.innerHTML = `
      <p class="quest-reward-panel-label">${label}の報酬（全部達成すると）</p>
      <div class="quest-reward-chips">
        <span class="quest-reward-chip">${rewardChipIcon("✨")} +${exp}EXP</span>
        <span class="quest-reward-chip">${rewardChipIcon("🎖️")} 称号</span>
      </div>
    `;
  }
}

function renderQuestList(period, list, records) {
  labelEl.textContent = { daily: "今日のクエスト", weekly: "今週のクエスト", monthly: "今月のクエスト" }[period];

  const seenBefore = initializedPeriods.has(period);
  const evaluated = list.map((quest) => ({ quest, ...evaluateQuest(quest, records, cachedData.context) }));
  const doneCount = evaluated.filter((e) => e.done).length;
  const allDone = evaluated.length > 0 && doneCount === evaluated.length;
  const perQuestExp = flavorReward(period, evaluated.length);

  listEl.innerHTML = evaluated
    .map(({ quest, current, target, done }) => {
      const key = `${period}:${quest.id}`;
      const justDone = seenBefore && done && !previousDone[key];
      previousDone[key] = done;

      return `
        <li class="quest-item ${done ? "quest-item-done" : ""} ${justDone ? "quest-item-pop" : ""}">
          <span class="quest-item-icon">${questIconName(quest)}</span>
          <div class="quest-item-body">
            <p class="quest-item-label ${done ? "done" : ""}">${quest.label}</p>
            <p class="quest-item-progress">${current}/${target}</p>
          </div>
          <div class="quest-item-meta">
            <span class="quest-item-exp">+${perQuestExp}EXP</span>
            <span class="quest-item-status ${done ? "quest-item-status-done" : ""}">${
              done ? "✅" : "未達成"
            }</span>
          </div>
        </li>
      `;
    })
    .join("");

  if (!seenBefore) initializedPeriods.add(period);

  renderRewardPanel(period, allDone);
}

function renderSpecial(special) {
  labelEl.textContent = "スペシャルクエスト";
  rewardPanelEl.hidden = true;

  const { milestones, totalExp } = special;
  const next = milestones.find((m) => !m.claimed);

  if (!next) {
    listEl.innerHTML = `
      <li class="quest-special-item">
        <span class="quest-special-icon">🏆</span>
        <div class="quest-special-text">
          <p class="quest-special-title">全マイルストーンを制覇しました</p>
          <p class="quest-special-desc">伝説の域に到達しています</p>
        </div>
      </li>
    `;
    return;
  }

  const ratio = Math.min(1, totalExp / next.threshold);

  listEl.innerHTML = `
    <li class="quest-special-item">
      <span class="quest-special-icon">${next.icon}</span>
      <div class="quest-special-text">
        <p class="quest-special-title">${next.label}</p>
        <p class="quest-special-desc">達成で+${next.reward}EXPボーナス</p>
        <div class="map-progress-track"><div class="map-progress-fill" style="width:${Math.round(ratio * 100)}%"></div></div>
        <p class="quest-special-hint">${totalExp}/${next.threshold}EXP</p>
      </div>
    </li>
    ${milestones
      .filter((m) => m.claimed)
      .map(
        (m) => `
      <li class="quest-special-item quest-special-claimed">
        <span class="quest-special-icon">${m.icon}</span>
        <div class="quest-special-text">
          <p class="quest-special-title">${m.label}</p>
          <p class="quest-special-desc">達成済み（+${m.reward}EXP獲得）</p>
        </div>
      </li>
    `
      )
      .join("")}
  `;
}

function renderContent(direction = "forward") {
  if (!cachedData) return;

  if (selectedTab === "special") {
    renderSpecial(cachedData.special);
  } else {
    rewardPanelEl.hidden = false;
    const { list, records } = cachedData[selectedTab];
    renderQuestList(selectedTab, list, records);
  }

  cardEl.classList.remove("tab-content-in-forward", "tab-content-in-backward");
  void cardEl.offsetWidth;
  cardEl.classList.add(direction === "backward" ? "tab-content-in-backward" : "tab-content-in-forward");
}

function renderHero(list, records, context) {
  const evaluated = list.map((quest) => evaluateQuest(quest, records, context));
  const doneCount = evaluated.filter((e) => e.done).length;
  const total = evaluated.length;
  const ratio = total > 0 ? doneCount / total : 0;
  const percent = Math.round(ratio * 100);

  heroRingFillEl.style.strokeDashoffset = `${RING_CIRCUMFERENCE * (1 - ratio)}`;
  heroPercentEl.textContent = `${percent}%`;
  heroFractionEl.textContent = `${doneCount}/${total} クエスト達成`;
  heroEl.classList.toggle("quest-hero-complete", total > 0 && doneCount === total);
}

export function renderQuests(data) {
  cachedData = data;
  if (!tabsEl.childElementCount) renderTabs();
  renderContent();
  renderHero(data.daily.list, data.daily.records, data.context);
}

export function flashQuestComplete() {
  cardEl.classList.remove("quest-flash");
  void cardEl.offsetWidth;
  cardEl.classList.add("quest-flash");
}
