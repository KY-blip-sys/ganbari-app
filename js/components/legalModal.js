// ==========================================================
// legalModal.js — 利用規約・プライバシーポリシー表示モーダル
// ==========================================================

import { lockBodyScroll, unlockBodyScroll } from "../utils/scrollLock.js";
import { initSheetDragToClose } from "../utils/sheetDrag.js";
import { TERMS_TITLE, TERMS_HTML, PRIVACY_TITLE, PRIVACY_HTML } from "../legalContent.js";

const overlayEl = document.getElementById("legal-overlay");
const sheetEl = document.getElementById("legal-sheet");
const handleEl = sheetEl.querySelector(".modal-handle");
const titleEl = document.getElementById("legal-title");
const bodyEl = document.getElementById("legal-body");

export function initLegalModal() {
  overlayEl.addEventListener("click", (e) => {
    if (e.target === overlayEl) closeLegalModal();
  });
  initSheetDragToClose(handleEl, sheetEl, closeLegalModal);
}

export function openTermsModal() {
  openLegalModal(TERMS_TITLE, TERMS_HTML);
}

export function openPrivacyModal() {
  openLegalModal(PRIVACY_TITLE, PRIVACY_HTML);
}

function openLegalModal(title, html) {
  titleEl.textContent = title;
  bodyEl.innerHTML = html;
  bodyEl.scrollTop = 0;

  overlayEl.classList.remove("modal-hidden");
  requestAnimationFrame(() => overlayEl.classList.add("modal-visible"));
  lockBodyScroll();
}

function closeLegalModal() {
  overlayEl.classList.remove("modal-visible");
  unlockBodyScroll();
  setTimeout(() => overlayEl.classList.add("modal-hidden"), 300);
}
