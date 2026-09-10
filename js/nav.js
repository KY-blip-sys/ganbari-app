// ==========================================================
// nav.js — 画面遷移（タブバー／サイドバー／その他シート）
// ==========================================================

import { lockBodyScroll, unlockBodyScroll } from "./utils/scrollLock.js";
import { initSheetDragToClose } from "./utils/sheetDrag.js";

const VIEWS = [
  { id: "home", elId: "view-home", group: "primary", icon: "home", label: "ホーム" },
  { id: "records", elId: "view-records", group: "primary", icon: "edit_note", label: "記録" },
  { id: "quests", elId: "view-quests", group: "primary", icon: "flag", label: "クエスト" },
  { id: "status", elId: "view-status", group: "primary", icon: "bar_chart", label: "ステータス" },
  { id: "map", elId: "view-map", group: "overflow", icon: "public", label: "人生マップ" },
  { id: "skills", elId: "view-skills", group: "overflow", icon: "park", label: "スキルツリー" },
  { id: "achievements", elId: "view-achievements", group: "overflow", icon: "emoji_events", label: "実績" },
  { id: "titles", elId: "view-titles", group: "overflow", icon: "military_tech", label: "称号" },
  // { id: "coach", elId: "view-coach", group: "overflow", icon: "smart_toy", label: "AIコーチ" }, // 一旦非表示
  { id: "settings", elId: "view-settings", group: "overflow", icon: "settings", label: "設定" },
];

const tabBarEl = document.getElementById("tab-bar");
const sidebarEl = document.getElementById("sidebar-nav");
const overflowListEl = document.getElementById("overflow-list");
const overflowOverlayEl = document.getElementById("overflow-sheet-overlay");
const overflowSheetEl = document.getElementById("overflow-sheet");
const overflowHandleEl = overflowSheetEl.querySelector(".modal-handle");
const contentWrapEl = document.getElementById("content-wrap");

let activeId = "home";

function navButton(view, className) {
  const btn = document.createElement("button");
  btn.className = `${className} tap-scale`;
  btn.dataset.navId = view.id;
  btn.innerHTML = `<span class="${className}-icon material-symbols-outlined">${view.icon}</span><span class="${className}-label">${view.label}</span>`;
  btn.addEventListener("click", () => showView(view.id));
  return btn;
}

function buildTabBar() {
  tabBarEl.innerHTML = "";
  VIEWS.filter((v) => v.group === "primary").forEach((v) => {
    tabBarEl.appendChild(navButton(v, "tab-bar-btn"));
  });

  const moreBtn = document.createElement("button");
  moreBtn.className = "tab-bar-btn tap-scale";
  moreBtn.dataset.navId = "__more__";
  moreBtn.innerHTML = `<span class="tab-bar-btn-icon material-symbols-outlined">more_horiz</span><span class="tab-bar-btn-label">その他</span>`;
  moreBtn.addEventListener("click", openOverflowSheet);
  tabBarEl.appendChild(moreBtn);
}

function buildSidebar() {
  sidebarEl.innerHTML = "";
  VIEWS.forEach((v) => sidebarEl.appendChild(navButton(v, "sidebar-btn")));
}

function buildOverflowSheet() {
  overflowListEl.innerHTML = "";
  VIEWS.filter((v) => v.group === "overflow").forEach((v) => {
    overflowListEl.appendChild(navButton(v, "overflow-item"));
  });
}

let closeTimer = null;

function openOverflowSheet() {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
  overflowOverlayEl.classList.remove("modal-hidden");
  requestAnimationFrame(() => overflowOverlayEl.classList.add("modal-visible"));
  lockBodyScroll();
}

function closeOverflowSheet() {
  if (!overflowOverlayEl.classList.contains("modal-visible")) return;

  overflowOverlayEl.classList.remove("modal-visible");
  unlockBodyScroll();
  if (closeTimer) clearTimeout(closeTimer);
  closeTimer = setTimeout(() => {
    overflowOverlayEl.classList.add("modal-hidden");
    closeTimer = null;
  }, 300);
}

function updateActiveStates(id) {
  const view = VIEWS.find((v) => v.id === id);
  document.querySelectorAll("[data-nav-id]").forEach((el) => {
    el.classList.toggle("active", el.dataset.navId === id);
  });
  const moreBtn = tabBarEl.querySelector('[data-nav-id="__more__"]');
  if (moreBtn) moreBtn.classList.toggle("active", Boolean(view && view.group === "overflow"));
}

export function showView(id) {
  activeId = id;
  VIEWS.forEach((v) => {
    document.getElementById(v.elId).classList.toggle("view-hidden", v.id !== id);
  });
  updateActiveStates(id);
  closeOverflowSheet();
  contentWrapEl.scrollTop = 0;
  window.scrollTo(0, 0);
}

export function initNav() {
  buildTabBar();
  buildSidebar();
  buildOverflowSheet();

  overflowOverlayEl.addEventListener("click", (e) => {
    if (e.target === overflowOverlayEl) closeOverflowSheet();
  });
  initSheetDragToClose(overflowHandleEl, overflowSheetEl, closeOverflowSheet);

  showView(activeId);
}
