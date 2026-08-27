// ==========================================================
// confirmDialog.js — 汎用確認ダイアログ（リセット・削除などで共用）
// ==========================================================

const overlayEl = document.getElementById("confirm-overlay");
const titleEl = document.getElementById("confirm-title");
const textEl = document.getElementById("confirm-text");
const cancelBtn = document.getElementById("btn-confirm-cancel");
const okBtn = document.getElementById("btn-confirm-ok");

let onConfirmCallback = null;
let onCancelCallback = null;

export function showConfirm({ title, text, confirmLabel = "削除する", onConfirm, onCancel } = {}) {
  titleEl.textContent = title;
  textEl.textContent = text;
  okBtn.textContent = confirmLabel;
  onConfirmCallback = onConfirm || null;
  onCancelCallback = onCancel || null;

  overlayEl.classList.remove("modal-hidden");
  requestAnimationFrame(() => overlayEl.classList.add("modal-visible"));
}

function hide() {
  overlayEl.classList.remove("modal-visible");
  setTimeout(() => overlayEl.classList.add("modal-hidden"), 300);
}

function cancel() {
  hide();
  const callback = onCancelCallback;
  onConfirmCallback = null;
  onCancelCallback = null;
  if (callback) callback();
}

cancelBtn.addEventListener("click", cancel);
overlayEl.addEventListener("click", (e) => {
  if (e.target === overlayEl) cancel();
});

okBtn.addEventListener("click", () => {
  hide();
  const callback = onConfirmCallback;
  onConfirmCallback = null;
  onCancelCallback = null;
  if (callback) callback();
});
