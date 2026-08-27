// ==========================================================
// skillTreeView.js — スキルツリー画面の描画
// ==========================================================

const containerEl = document.getElementById("skills-content");

function branchMarkup(branch) {
  return `
    <div class="skill-branch">
      <p class="skill-branch-label">${branch.label}</p>
      <div class="skill-chain">
        ${branch.nodes
          .map(
            (n) => `
          <div class="skill-node ${n.unlocked ? "unlocked" : "locked"}">
            <span class="skill-node-icon">${n.unlocked ? n.icon : "🔒"}</span>
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

export function renderSkillTree(skillTrees) {
  containerEl.innerHTML = "";

  skillTrees.forEach(({ key, icon, level, branches }) => {
    const card = document.createElement("section");
    card.className = "card glass-card skill-tree-card";
    card.innerHTML = `
      <p class="card-label">${icon} ${key}（Lv.${level}）</p>
      ${branches.map(branchMarkup).join("")}
    `;
    containerEl.appendChild(card);
  });
}
