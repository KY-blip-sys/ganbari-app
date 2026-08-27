// ==========================================================
// settingsView.js — 設定画面（データリセットのみ）
// ==========================================================

import { showConfirm } from "./confirmDialog.js";
import { showView } from "../nav.js";

const closeBtn = document.getElementById("btn-close-settings");
const resetBtn = document.getElementById("btn-reset-data");
const logoutBtn = document.getElementById("btn-logout");
const accountEmailEl = document.getElementById("account-email");

export function initSettingsView(onResetConfirmed, onLogout) {
  closeBtn.addEventListener("click", () => showView("home"));

  resetBtn.addEventListener("click", () => {
    showConfirm({
      title: "本当にリセットしますか？",
      text: "この操作は取り消せません",
      confirmLabel: "リセットする",
      onConfirm: () => {
        onResetConfirmed();
        showView("home");
      },
    });
  });

  logoutBtn.addEventListener("click", () => {
    showConfirm({
      title: "ログアウトしますか？",
      text: "再度ログインすることでデータが復元されます",
      confirmLabel: "ログアウト",
      onConfirm: onLogout,
    });
  });
}

export function setAccountEmail(email) {
  accountEmailEl.textContent = email || "";
}
