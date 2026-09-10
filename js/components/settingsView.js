// ==========================================================
// settingsView.js — 設定画面（データリセットのみ）
// ==========================================================

import { showConfirm } from "./confirmDialog.js";
import { showView } from "../nav.js";
import { openTermsModal, openPrivacyModal } from "./legalModal.js";

const resetBtn = document.getElementById("btn-reset-data");
const logoutBtn = document.getElementById("btn-logout");
const loginBtn = document.getElementById("btn-login");
const loginHintEl = document.getElementById("login-hint");
const accountEmailEl = document.getElementById("account-email");
const termsBtn = document.getElementById("btn-terms");
const privacyBtn = document.getElementById("btn-privacy");

export function initSettingsView(onResetConfirmed, onLogout, onLoginRequested) {
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

  loginBtn.addEventListener("click", () => {
    onLoginRequested();
  });

  termsBtn.addEventListener("click", openTermsModal);
  privacyBtn.addEventListener("click", openPrivacyModal);

  setLoggedIn(false);
}

export function setAccountEmail(email) {
  accountEmailEl.textContent = email || "";
  setLoggedIn(Boolean(email));
}

export function setLoggedIn(isLoggedIn) {
  logoutBtn.classList.toggle("settings-hidden", !isLoggedIn);
  accountEmailEl.classList.toggle("settings-hidden", !isLoggedIn);
  loginBtn.classList.toggle("settings-hidden", isLoggedIn);
  loginHintEl.classList.toggle("settings-hidden", isLoggedIn);
}
