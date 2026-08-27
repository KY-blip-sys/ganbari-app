// ==========================================================
// nav.js — 画面遷移（タブバー／サイドバー／その他シート）
// ==========================================================

const VIEWS = [
  { id: "home", elId: "view-home", group: "primary", icon: "🏠", label: "ホーム" },
  { id: "records", elId: "view-records", group: "primary", icon: "📝", label: "記録" },
  { id: "quests", elId: "view-quests", group: "primary", icon: "🎯", label: "クエスト" },
  { id: "status", elId: "view-status", group: "primary", icon: "📊", label: "ステータス" },
  { id: "map", elId: "view-map", group: "overflow", icon: "🌍", label: "人生マップ" },
  { id: "skills", elId: "view-skills", group: "overflow", icon: "🌳", label: "スキルツリー" },
  { id: "achievements", elId: "view-achievements", group: "overflow", icon: "🏆", label: "実績" },
  { id: "titles", elId: "view-titles", group: "overflow", icon: "🏅", label: "称号" },
  { id: "coach", elId: "view-coach", group: "overflow", icon: "🤖", label: "AIコーチ" },
  { id: "settings", elId: "view-settings", group: "overflow", icon: "⚙️", label: "設定" },
];

const tabBarEl = document.getElementById("tab-bar");
const sidebarEl = document.getElementById("sidebar-nav");
const overflowListEl = document.getElementById("overflow-list");
const overflowOverlayEl = document.getElementById("overflow-sheet-overlay");
const contentWrapEl = document.getElementById("content-wrap");

let activeId = "home";

function navButton(view, className) {
  const btn = document.createElement("button");
  btn.className = `${className} tap-scale`;
  btn.dataset.navId = view.id;
  btn.innerHTML = `<span class="${className}-icon">${view.icon}</span><span class="${className}-label">${view.label}</span>`;
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
  moreBtn.innerHTML = `<span class="tab-bar-btn-icon">⋯</span><span class="tab-bar-btn-label">その他</span>`;
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
}

function closeOverflowSheet() {
  if (!overflowOverlayEl.classList.contains("modal-visible")) return;

  overflowOverlayEl.classList.remove("modal-visible");
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

  showView(activeId);
}
