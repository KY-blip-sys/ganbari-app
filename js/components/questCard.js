// ==========================================================
// questCard.js — クエスト表示（今日／今週／今月／スペシャル）
// ==========================================================

import { evaluateQuest, QUEST_REWARD_EXP } from "../models/questSystem.js";

const tabsEl = document.getElementById("quest-tabs");
const cardEl = document.getElementById("quest-card");
const labelEl = document.getElementById("quest-card-label");
const rewardTagEl = document.getElementById("quest-reward-tag");
const listEl = document.getElementById("quest-list");

const TABS = [
  { id: "daily", icon: "☀️", label: "今日" },
  { id: "weekly", icon: "📅", label: "今週" },
  { id: "monthly", icon: "🗓️", label: "今月" },
  { id: "special", icon: "🌟", label: "スペシャル" },
];

let selectedTab = "daily";
let cachedData = null;

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
      selectedTab = btn.dataset.tabId;
      renderTabs();
      renderContent();
    });
  });
}

function renderQuestList(list, records) {
  labelEl.textContent = { daily: "今日のクエスト", weekly: "今週のクエスト", monthly: "今月のクエスト" }[selectedTab];
  rewardTagEl.textContent = `全達成で+${QUEST_REWARD_EXP[selectedTab]}EXP`;
  rewardTagEl.style.display = "";

  listEl.innerHTML = list
    .map((quest) => {
      const { current, target, done } = evaluateQuest(quest, records);
      return `
        <li class="quest-item">
          <span class="quest-checkbox ${done ? "done" : ""}">${done ? "✓" : ""}</span>
          <span class="quest-text ${done ? "done" : ""}">${quest.label}</span>
          <span class="quest-progress">${current}/${target}</span>
        </li>
      `;
    })
    .join("");
}

function renderSpecial(special) {
  labelEl.textContent = "スペシャルクエスト";
  rewardTagEl.style.display = "none";

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

function renderContent() {
  if (!cachedData) return;

  if (selectedTab === "special") {
    renderSpecial(cachedData.special);
  } else {
    const { list, records } = cachedData[selectedTab];
    renderQuestList(list, records);
  }
}

export function renderQuests(data) {
  cachedData = data;
  if (!tabsEl.childElementCount) renderTabs();
  renderContent();
}

export function flashQuestComplete() {
  cardEl.classList.remove("quest-flash");
  void cardEl.offsetWidth;
  cardEl.classList.add("quest-flash");
}
