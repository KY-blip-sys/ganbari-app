// ==========================================================
// statusDetailView.js — 能力詳細画面（Heroカード／内訳／推移／次の目標）
// ==========================================================

import { iconSvg, iconMarkup } from "../utils/icons.js";
import { STATUS_EXP_PER_LEVEL } from "../models/statusSystem.js";

const overlayEl = document.getElementById("status-detail-overlay");
const iconEl = document.getElementById("status-detail-icon");
const titleEl = document.getElementById("status-detail-title");
const levelEl = document.getElementById("status-detail-level");
const barFillEl = document.getElementById("status-detail-bar-fill");
const fractionEl = document.getElementById("status-detail-fraction");
const hintEl = document.getElementById("status-detail-hint");
const breakdownEl = document.getElementById("status-detail-breakdown");
const trendEl = document.getElementById("status-detail-trend");
const goalsEl = document.getElementById("status-detail-goals");
const closeBtn = document.getElementById("btn-status-detail-close");

export function initStatusDetail() {
  closeBtn.addEventListener("click", closeStatusDetail);
  overlayEl.addEventListener("click", (e) => {
    if (e.target === overlayEl) closeStatusDetail();
  });
}

function renderBreakdown(breakdown) {
  if (!breakdown.length) {
    breakdownEl.innerHTML = `<p class="record-empty">まだ記録がありません</p>`;
    return;
  }

  breakdownEl.innerHTML = breakdown
    .map(
      (b) => `
    <div class="breakdown-mini-card">
      <span class="breakdown-mini-icon">${iconSvg(b.icon, { size: 20 })}</span>
      <span class="breakdown-mini-name">${b.category}</span>
      <span class="breakdown-mini-percent">${Math.round(b.ratio * 100)}%</span>
    </div>
  `
    )
    .join("");
}

function renderTrend(trend) {
  const maxExp = Math.max(1, ...trend.map((t) => t.exp));

  trendEl.innerHTML = `
    <div class="trend-bars">
      ${trend
        .map(
          (t) => `
        <div class="trend-bar-col" title="${t.exp}EXP">
          <div class="trend-bar" style="height:0%" data-target-height="${Math.max(4, Math.round((t.exp / maxExp) * 100))}"></div>
        </div>
      `
        )
        .join("")}
    </div>
  `;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      trendEl.querySelectorAll(".trend-bar").forEach((bar) => {
        bar.style.height = `${bar.dataset.targetHeight}%`;
      });
    });
  });
}

function goalCardMarkup({ badgeIcon, badgeClass, label, name, expToNext }) {
  return `
    <div class="goal-card">
      <span class="goal-card-badge ${badgeClass}">${iconMarkup(badgeIcon, { size: 20 })}</span>
      <div class="goal-card-text">
        <p class="goal-card-label">${label}</p>
        <p class="goal-card-name">${name}</p>
        <p class="goal-card-sub">あと${expToNext}EXP</p>
      </div>
    </div>
  `;
}

function renderGoals(nextSkill, nextAchievement) {
  const items = [];

  if (nextSkill) {
    items.push(
      goalCardMarkup({
        badgeIcon: "lock",
        badgeClass: "goal-card-badge-skill",
        label: "次に解放するスキル",
        name: nextSkill.name,
        expToNext: nextSkill.expToNext,
      })
    );
  }

  if (nextAchievement) {
    items.push(
      goalCardMarkup({
        badgeIcon: "trophy",
        badgeClass: "goal-card-badge-trophy",
        label: "次に解放",
        name: nextAchievement.name,
        expToNext: nextAchievement.expToNext,
      })
    );
  }

  goalsEl.innerHTML = items.length ? items.join("") : `<p class="record-empty">すべての目標を達成しました</p>`;
}

export function openStatusDetail({
  key,
  icon,
  level,
  expIntoLevel,
  progressRatio,
  expToNext,
  breakdown,
  trend,
  nextSkill,
  nextAchievement,
}) {
  iconEl.innerHTML = iconSvg(icon, { size: 32 });
  titleEl.textContent = key;
  levelEl.textContent = `Lv.${level}`;
  barFillEl.style.width = `${Math.round(progressRatio * 100)}%`;
  fractionEl.textContent = `${expIntoLevel} / ${STATUS_EXP_PER_LEVEL} EXP`;
  hintEl.textContent = `あと${expToNext}EXPでLv.${level + 1}`;

  renderBreakdown(breakdown);
  renderTrend(trend);
  renderGoals(nextSkill, nextAchievement);

  overlayEl.classList.remove("modal-hidden");
  requestAnimationFrame(() => overlayEl.classList.add("modal-visible"));
}

function closeStatusDetail() {
  overlayEl.classList.remove("modal-visible");
  setTimeout(() => overlayEl.classList.add("modal-hidden"), 300);
}
