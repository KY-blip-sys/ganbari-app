// ==========================================================
// recordModal.js — 記録追加・編集モーダルの制御（共通コンポーネント）
// ==========================================================

import { CATEGORIES } from "../models/categories.js";
import { iconSvg } from "../utils/icons.js";
import { showView } from "../nav.js";
import { showExpGainToast } from "./expGainToast.js";

const DEFAULT_EXP = 10;
const ADD_TITLE = "今日頑張ったことを追加";
const EDIT_TITLE = "記録を編集";
const MODAL_CLOSE_MS = 320;

const overlayEl = document.getElementById("modal-overlay");
const sheetEl = document.getElementById("modal-sheet");
const modalTitleEl = document.getElementById("modal-title");
const titleInputEl = document.getElementById("input-title");
const categoryGridEl = document.getElementById("category-grid");
const expGridEl = document.getElementById("exp-grid");
const saveBtn = document.getElementById("btn-save-record");
const cancelBtn = document.getElementById("btn-cancel-record");
const addBtn = document.getElementById("btn-add-record");
const addBtnEmpty = document.getElementById("btn-add-record-empty");

let selectedCategory = null;
let selectedExp = DEFAULT_EXP;
let mode = "add";
let editingId = null;
let onSaveCallback = null;
let onUpdateCallback = null;

function buildCategoryGrid() {
  categoryGridEl.innerHTML = CATEGORIES.map(
    (c) => `
      <button class="category-chip tap-scale" data-category="${c.key}">
        <span class="category-chip-icon">${iconSvg(c.icon, { size: 20 })}</span>
        <span class="category-chip-label">${c.key}</span>
      </button>`
  ).join("");
}

export function initRecordModal({ onSave, onUpdate }) {
  onSaveCallback = onSave;
  onUpdateCallback = onUpdate;

  buildCategoryGrid();

  addBtn.addEventListener("click", () => openModal());
  if (addBtnEmpty) addBtnEmpty.addEventListener("click", () => openModal());
  cancelBtn.addEventListener("click", closeModal);
  overlayEl.addEventListener("click", (e) => {
    if (e.target === overlayEl) closeModal();
  });

  categoryGridEl.addEventListener("click", (e) => {
    const chip = e.target.closest(".category-chip");
    if (!chip) return;
    selectedCategory = chip.dataset.category;
    [...categoryGridEl.children].forEach((c) => c.classList.toggle("selected", c === chip));
    updateSaveState();
  });

  expGridEl.addEventListener("click", (e) => {
    const chip = e.target.closest(".exp-chip");
    if (!chip) return;
    selectedExp = Number(chip.dataset.exp);
    [...expGridEl.children].forEach((c) => c.classList.toggle("selected", c === chip));
    updateSaveState();
  });

  titleInputEl.addEventListener("input", updateSaveState);

  saveBtn.addEventListener("click", () => {
    if (!canSave()) return;
    const data = {
      title: titleInputEl.value.trim(),
      category: selectedCategory,
      exp: selectedExp,
    };

    if (mode === "edit") {
      onUpdateCallback(editingId, data);
      closeModal();
      return;
    }

    // 保存 → モーダルが閉じる → ホームへ戻る → EXPバーが伸びる → 「+EXP」表示
    closeModal();
    setTimeout(() => {
      showView("home");
      onSaveCallback(data);
      showExpGainToast(data.exp);
    }, MODAL_CLOSE_MS);
  });
}

export function openRecordModalForEdit(record) {
  openModal(record);
}

function canSave() {
  return titleInputEl.value.trim().length > 0 && selectedCategory && selectedExp;
}

function updateSaveState() {
  saveBtn.disabled = !canSave();
}

function openModal(record = null) {
  mode = record ? "edit" : "add";
  editingId = record ? record.id : null;
  modalTitleEl.textContent = record ? EDIT_TITLE : ADD_TITLE;

  resetForm(record);

  overlayEl.classList.remove("modal-hidden");
  requestAnimationFrame(() => overlayEl.classList.add("modal-visible"));
  setTimeout(() => titleInputEl.focus(), 300);
}

function closeModal() {
  overlayEl.classList.remove("modal-visible");
  setTimeout(() => overlayEl.classList.add("modal-hidden"), 300);
}

function resetForm(record = null) {
  titleInputEl.value = record ? record.title : "";
  selectedCategory = record ? record.category : null;
  selectedExp = record ? record.exp : DEFAULT_EXP;

  [...categoryGridEl.children].forEach((c) => {
    c.classList.toggle("selected", c.dataset.category === selectedCategory);
  });
  [...expGridEl.children].forEach((c) => {
    c.classList.toggle("selected", Number(c.dataset.exp) === selectedExp);
  });
  updateSaveState();
}
