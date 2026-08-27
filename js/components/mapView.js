// ==========================================================
// mapView.js — 人生マップ画面の描画（総合＋テーマ別マップ）
// ==========================================================

import { computeMapThemesMeta, computeMapProgress } from "../models/mapSystem.js";

const containerEl = document.getElementById("map-content");
const tabsEl = document.getElementById("map-tabs");

const THEMES_META = computeMapThemesMeta();
let selectedThemeId = THEMES_META[0].id;
let cachedTotalExp = 0;
let cachedLifeStatuses = [];

function renderTabs() {
  tabsEl.innerHTML = THEMES_META.map(
    (t) => `
      <button class="map-tab tap-scale ${t.id === selectedThemeId ? "active" : ""}" data-theme-id="${t.id}">
        <span class="map-tab-icon">${t.icon}</span><span class="map-tab-label">${t.label}</span>
      </button>
    `
  ).join("");

  tabsEl.querySelectorAll(".map-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedThemeId = btn.dataset.themeId;
      renderTabs();
      renderContent();
    });
  });
}

function renderContent() {
  const progress = computeMapProgress(selectedThemeId, cachedTotalExp, cachedLifeStatuses);
  const { areas, currentArea, nextArea, progressRatio, expToNext, isFinalArea } = progress;

  const pathHtml = areas
    .map(
      (a) => `
    <div class="map-area ${a.unlocked ? "unlocked" : "locked"} ${a.isCurrent ? "current" : ""}">
      <span class="map-area-icon">${a.icon}</span>
      <span class="map-area-name">${a.name}</span>
      ${a.isCurrent ? '<span class="map-area-here">現在地</span>' : ""}
      ${!a.unlocked ? '<span class="map-area-lock">🔒</span>' : ""}
    </div>
  `
    )
    .join("");

  const progressHtml = isFinalArea
    ? `<p class="map-progress-hint">🎉 最終エリアに到達しました</p>`
    : `
      <div class="map-progress-track"><div class="map-progress-fill" style="width:${Math.round(progressRatio * 100)}%"></div></div>
      <p class="map-progress-hint">次のエリア「${nextArea.name}」まであと${expToNext}EXP</p>
    `;

  containerEl.innerHTML = `
    <p class="card-label">現在地：${currentArea.icon} ${currentArea.name}</p>
    <div class="map-path">${pathHtml}</div>
    ${progressHtml}
  `;
}

export function renderMap({ totalExp, lifeStatuses }) {
  cachedTotalExp = totalExp;
  cachedLifeStatuses = lifeStatuses;

  if (!tabsEl.childElementCount) renderTabs();
  renderContent();
}
