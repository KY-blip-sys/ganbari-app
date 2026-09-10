// ==========================================================
// questSummaryCard.js — ホーム画面「今日のクエスト」の簡易表示
// ==========================================================

import { evaluateQuest } from "../models/questSystem.js";
import { iconSvg } from "../utils/icons.js";
import { showView } from "../nav.js";

const cardEl = document.getElementById("quest-summary-card");
const badgeEl = document.getElementById("quest-summary-badge");
const listEl = document.getElementById("quest-summary-list");

cardEl.addEventListener("click", () => showView("quests"));

export function renderQuestSummary({ list, records, context }) {
  const evaluated = list.map((quest) => ({ quest, ...evaluateQuest(quest, records, context) }));
  const doneCount = evaluated.filter((e) => e.done).length;
  const total = evaluated.length;
  const allDone = total > 0 && doneCount === total;

  badgeEl.textContent = allDone ? "COMPLETE" : `${doneCount}/${total}`;
  badgeEl.classList.toggle("quest-summary-badge-complete", allDone);

  listEl.innerHTML = evaluated
    .map(
      ({ quest, done }) => `
        <li class="quest-summary-item">
          <span class="quest-summary-check ${done ? "done" : ""}">${done ? iconSvg("check", { size: 12 }) : ""}</span>
          <span class="quest-summary-label ${done ? "done" : ""}">${quest.label}</span>
        </li>
      `
    )
    .join("");
}
