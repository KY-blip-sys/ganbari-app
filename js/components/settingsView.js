// ==========================================================
// settingsView.js — 設定画面（データリセットのみ）
// ==========================================================

import { showConfirm } from "./confirmDialog.js";
import { showView } from "../nav.js";

const openBtn = document.getElementById("btn-open-settings");
const closeBtn = document.getElementById("btn-close-settings");
const resetBtn = document.getElementById("btn-reset-data");

export function initSettingsView(onResetConfirmed) {
  openBtn.addEventListener("click", () => showView("settings"));
  closeBtn.addEventListener("click", () => showView("home"));

  resetBtn.addEventListener("click", () => {
    showConfirm({
      title: "本当にリセットしますか？",
      text: "この操作は取り消せません。",
      confirmLabel: "リセットする",
      onConfirm: () => {
        onResetConfirmed();
        showView("home");
      },
    });
  });
}
