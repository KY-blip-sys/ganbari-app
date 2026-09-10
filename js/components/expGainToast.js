// ==========================================================
// expGainToast.js — 記録保存直後の「+EXP」演出（ホーム画面）
// ==========================================================

const toastEl = document.getElementById("exp-gain-toast");
const amountEl = document.getElementById("exp-gain-amount");

const VISIBLE_MS = 1200;

let hideTimer = null;

export function showExpGainToast(exp) {
  amountEl.textContent = String(exp);

  clearTimeout(hideTimer);
  toastEl.classList.remove("exp-gain-toast-visible");
  void toastEl.offsetWidth;
  toastEl.classList.add("exp-gain-toast-visible");

  hideTimer = setTimeout(() => {
    toastEl.classList.remove("exp-gain-toast-visible");
  }, VISIBLE_MS);
}
