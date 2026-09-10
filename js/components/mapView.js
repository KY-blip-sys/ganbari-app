// ==========================================================
// mapView.js — 人生マップ画面の描画（総合＋テーマ別マップ）
// 上部タブはホーム画面と同じ感覚でタップ／スワイプ切替できる。
// ==========================================================

import { computeMapThemesMeta, computeMapProgress } from "../models/mapSystem.js";
import { iconMarkup } from "../utils/icons.js";
import { initSwipeableTabs } from "../utils/swipeTabs.js";

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
        <span class="map-tab-icon">${iconMarkup(t.icon, { size: 16 })}</span><span class="map-tab-label">${t.label}</span>
      </button>
    `
  ).join("");

  tabsEl.querySelectorAll(".map-tab").forEach((btn) => {
    btn.addEventListener("click", () => selectTheme(btn.dataset.themeId));
  });
}

function selectTheme(themeId, direction) {
  if (themeId === selectedThemeId) return;
  const fromIndex = THEMES_META.findIndex((t) => t.id === selectedThemeId);
  const toIndex = THEMES_META.findIndex((t) => t.id === themeId);
  selectedThemeId = themeId;
  renderTabs();
  renderContent(direction || (toIndex > fromIndex ? "forward" : "backward"));
}

function renderContent(direction = "forward") {
  const progress = computeMapProgress(selectedThemeId, cachedTotalExp, cachedLifeStatuses);
  const { areas, currentArea, nextArea, progressRatio, expToNext, isFinalArea } = progress;

  const pathHtml = areas
    .map(
      (a) => `
    <div class="map-area ${a.unlocked ? "unlocked" : "locked"} ${a.isCurrent ? "current" : ""}">
      <span class="map-area-icon">${a.icon}</span>
      <span class="map-area-name">${a.name}</span>
      ${a.isCurrent ? '<span class="map-area-here">現在地</span>' : ""}
      ${!a.unlocked ? '<span class="map-area-lock material-symbols-outlined">lock</span>' : ""}
    </div>
  `
    )
    .join("");

  const progressHtml = isFinalArea
    ? `<p class="map-progress-hint">最終エリアに到達しました</p>`
    : `
      <div class="map-progress-track"><div class="map-progress-fill" style="width:${Math.round(progressRatio * 100)}%"></div></div>
      <p class="map-progress-hint">次のエリア「${nextArea.name}」まであと${expToNext}EXP</p>
    `;

  containerEl.innerHTML = `
    <p class="card-label"><span class="card-label-icon material-symbols-outlined">${currentArea.icon}</span>現在地：${currentArea.name}</p>
    <div class="map-path">${pathHtml}</div>
    ${progressHtml}
  `;

  containerEl.classList.remove("tab-content-in-forward", "tab-content-in-backward");
  void containerEl.offsetWidth;
  containerEl.classList.add(direction === "backward" ? "tab-content-in-backward" : "tab-content-in-forward");
}

export function renderMap({ totalExp, lifeStatuses }) {
  cachedTotalExp = totalExp;
  cachedLifeStatuses = lifeStatuses;

  if (!tabsEl.childElementCount) {
    renderTabs();
    initSwipeableTabs(containerEl, {
      onSwipeLeft: () => {
        const i = THEMES_META.findIndex((t) => t.id === selectedThemeId);
        if (i < THEMES_META.length - 1) selectTheme(THEMES_META[i + 1].id, "forward");
      },
      onSwipeRight: () => {
        const i = THEMES_META.findIndex((t) => t.id === selectedThemeId);
        if (i > 0) selectTheme(THEMES_META[i - 1].id, "backward");
      },
    });
  }
  renderContent();
}
