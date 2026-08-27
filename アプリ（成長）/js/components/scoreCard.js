// ==========================================================
// scoreCard.js — 今日の獲得EXP表示（カウントアップ・祝福演出つき）
// ==========================================================

import { computeRank } from "../utils/scoreUtils.js";

const expNumberEl = document.getElementById("exp-number");
const expCardEl = document.getElementById("exp-card");

const COUNT_UP_MS = 500;

let displayedExp = null;
let rafId = null;

export function renderExp(todayExp, animate = false) {
  if (displayedExp === null || !animate) {
    displayedExp = todayExp;
    expNumberEl.textContent = String(todayExp);
    return;
  }

  animateCountUp(displayedExp, todayExp);
  displayedExp = todayExp;
}

function animateCountUp(from, to) {
  if (rafId) cancelAnimationFrame(rafId);
  const start = performance.now();

  function tick(now) {
    const t = Math.min(1, (now - start) / COUNT_UP_MS);
    const eased = 1 - Math.pow(1 - t, 3);
    const current = Math.round(from + (to - from) * eased);
    expNumberEl.textContent = String(current);

    if (t < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      expNumberEl.textContent = String(to);
      rafId = null;
      triggerCelebration(to);
    }
  }

  rafId = requestAnimationFrame(tick);
}

function triggerCelebration(todayExp) {
  expCardEl.classList.remove("exp-celebrate-blue", "exp-celebrate-gold");
  void expCardEl.offsetWidth;

  const { tier } = computeRank(todayExp);
  if (tier === "gold") {
    expCardEl.classList.add("exp-celebrate-gold");
  } else if (tier === "green") {
    expCardEl.classList.add("exp-celebrate-blue");
  }
}
