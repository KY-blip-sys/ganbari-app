// ==========================================================
// skillTreeView.js — スキルツリー画面の描画
// 人生マップと同じ感覚で、上部タブから各ステータスのスキルツリーを
// タップ／スワイプで切り替えられるようにする。
// ==========================================================

import { LIFE_STAT_ICON } from "../models/statusSystem.js";
import { iconMarkup } from "../utils/icons.js";
import { initSwipeableTabs } from "../utils/swipeTabs.js";

const containerEl = document.getElementById("skills-content");
const tabsEl = document.getElementById("skills-tabs");

const TABS = Object.keys(LIFE_STAT_ICON).map((key) => ({ id: key, label: key, icon: LIFE_STAT_ICON[key] }));

let selectedKey = TABS[0].id;
let cachedTrees = [];

function branchMarkup(branch) {
  return `
    <div class="skill-branch">
      <p class="skill-branch-label">${branch.label}</p>
      <div class="skill-chain">
        ${branch.nodes
          .map(
            (n) => `
          <div class="skill-node ${n.unlocked ? "unlocked" : "locked"}">
            <span class="skill-node-icon">${n.unlocked ? iconMarkup(n.icon, { size: 18 }) : iconMarkup("lock", { size: 16 })}</span>
            <div class="skill-node-text">
              <span class="skill-node-name">${n.name}</span>
              <span class="skill-node-req">${n.unlocked ? "解放済み" : `Lv.${n.requiredLevel}で解放`}</span>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderTabs() {
  tabsEl.innerHTML = TABS.map(
    (t) => `
      <button class="map-tab tap-scale ${t.id === selectedKey ? "active" : ""}" data-key="${t.id}">
        <span class="map-tab-icon">${iconMarkup(t.icon, { size: 16 })}</span><span class="map-tab-label">${t.label}</span>
      </button>
    `
  ).join("");

  tabsEl.querySelectorAll(".map-tab").forEach((btn) => {
    btn.addEventListener("click", () => selectTab(btn.dataset.key));
  });
}

function selectTab(key, direction) {
  if (key === selectedKey) return;
  const fromIndex = TABS.findIndex((t) => t.id === selectedKey);
  const toIndex = TABS.findIndex((t) => t.id === key);
  selectedKey = key;
  renderTabs();
  renderContent(direction || (toIndex > fromIndex ? "forward" : "backward"));
}

function renderContent(direction = "forward") {
  const tree = cachedTrees.find((t) => t.key === selectedKey);
  if (!tree) return;

  containerEl.innerHTML = `
    <section class="card home-card skill-tree-card">
      <p class="card-label"><span class="card-label-icon">${iconMarkup(tree.icon, { size: 15 })}</span>${tree.key}（Lv.${tree.level}）</p>
      ${tree.branches.map(branchMarkup).join("")}
    </section>
  `;

  containerEl.classList.remove("tab-content-in-forward", "tab-content-in-backward");
  void containerEl.offsetWidth;
  containerEl.classList.add(direction === "backward" ? "tab-content-in-backward" : "tab-content-in-forward");
}

export function renderSkillTree(skillTrees) {
  cachedTrees = skillTrees;

  if (!tabsEl.childElementCount) {
    renderTabs();
    initSwipeableTabs(containerEl, {
      onSwipeLeft: () => {
        const i = TABS.findIndex((t) => t.id === selectedKey);
        if (i < TABS.length - 1) selectTab(TABS[i + 1].id, "forward");
      },
      onSwipeRight: () => {
        const i = TABS.findIndex((t) => t.id === selectedKey);
        if (i > 0) selectTab(TABS[i - 1].id, "backward");
      },
    });
  }
  renderContent();
}
