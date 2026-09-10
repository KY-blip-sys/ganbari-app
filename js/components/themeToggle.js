// ==========================================================
// themeToggle.js — ダーク／ライトモード切り替えボタンの制御
// ==========================================================

import { iconSvg } from "../utils/icons.js";

const THEME_KEY = "lifeRPG_theme";
const THEME_COLOR = { dark: "#0a0e1a", light: "#f5f6fa" };

const btn = document.getElementById("btn-theme-toggle");
const iconEl = document.getElementById("theme-toggle-icon");
const metaThemeColorEl = document.querySelector('meta[name="theme-color"]');

function currentTheme() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function applyTheme(theme) {
  if (theme === "light") {
    document.documentElement.dataset.theme = "light";
  } else {
    delete document.documentElement.dataset.theme;
  }
  iconEl.innerHTML = iconSvg(theme === "light" ? "☀️" : "🌙", { size: 20 });
  if (metaThemeColorEl) metaThemeColorEl.setAttribute("content", THEME_COLOR[theme]);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {}
}

export function initThemeToggle() {
  applyTheme(currentTheme());
  btn.addEventListener("click", () => {
    applyTheme(currentTheme() === "light" ? "dark" : "light");
  });
}
