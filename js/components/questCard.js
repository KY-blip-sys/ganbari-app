// ==========================================================
// questCard.js — 今日のクエスト表示
// ==========================================================

import { evaluateQuest } from "../models/questSystem.js";

const listEl = document.getElementById("quest-list");
const cardEl = document.getElementById("quest-card");

export function renderQuests(quests, todayRecords) {
  listEl.innerHTML = "";

  quests.forEach((quest) => {
    const { current, target, done } = evaluateQuest(quest, todayRecords);

    const li = document.createElement("li");
    li.className = "quest-item";
    li.innerHTML = `
      <span class="quest-checkbox ${done ? "done" : ""}">${done ? "✓" : ""}</span>
      <span class="quest-text ${done ? "done" : ""}">${quest.label}</span>
      <span class="quest-progress">${current}/${target}</span>
    `;
    listEl.appendChild(li);
  });
}

export function flashQuestComplete() {
  cardEl.classList.remove("quest-flash");
  void cardEl.offsetWidth;
  cardEl.classList.add("quest-flash");
}
