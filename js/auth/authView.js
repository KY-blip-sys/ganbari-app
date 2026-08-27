// ==========================================================
// authView.js — ログイン／新規登録画面の制御
// ==========================================================

import { signUp, signIn } from "./authService.js";

const titleEl = document.getElementById("auth-title");
const emailEl = document.getElementById("auth-email");
const passwordEl = document.getElementById("auth-password");
const errorEl = document.getElementById("auth-error");
const infoEl = document.getElementById("auth-info");
const submitBtn = document.getElementById("btn-auth-submit");
const toggleBtn = document.getElementById("btn-auth-toggle");

const LOGIN_TITLE = "ログイン";
const SIGNUP_TITLE = "新規登録";
const LOGIN_SUBMIT_LABEL = "ログイン";
const SIGNUP_SUBMIT_LABEL = "登録する";
const LOGIN_TOGGLE_LABEL = "アカウントをお持ちでない方はこちら";
const SIGNUP_TOGGLE_LABEL = "すでにアカウントをお持ちの方はこちら";

let mode = "login";
let onAuthenticatedCallback = null;

function canSubmit() {
  return emailEl.value.trim().length > 0 && passwordEl.value.length > 0;
}

function updateSubmitState() {
  submitBtn.disabled = !canSubmit();
}

function clearMessages() {
  errorEl.textContent = "";
  infoEl.textContent = "";
}

function applyMode() {
  const isLogin = mode === "login";
  titleEl.textContent = isLogin ? LOGIN_TITLE : SIGNUP_TITLE;
  submitBtn.textContent = isLogin ? LOGIN_SUBMIT_LABEL : SIGNUP_SUBMIT_LABEL;
  toggleBtn.textContent = isLogin ? LOGIN_TOGGLE_LABEL : SIGNUP_TOGGLE_LABEL;
  clearMessages();
}

function mapErrorMessage(error) {
  if (!error) return "エラーが発生しました。もう一度お試しください。";
  const msg = error.message || "";
  if (msg.includes("Invalid login credentials")) {
    return "メールアドレスまたはパスワードが正しくありません。";
  }
  if (msg.includes("already registered") || msg.includes("already been registered")) {
    return "このメールアドレスはすでに登録されています。";
  }
  if (msg.includes("Password should be")) {
    return "パスワードは6文字以上で入力してください。";
  }
  return mode === "login" ? "ログインに失敗しました。" : "登録に失敗しました。";
}

async function handleSubmit() {
  if (!canSubmit()) return;

  clearMessages();
  submitBtn.disabled = true;
  const originalLabel = submitBtn.textContent;
  submitBtn.textContent = "処理中…";

  try {
    const email = emailEl.value.trim();
    const password = passwordEl.value;

    if (mode === "login") {
      const { data, error } = await signIn(email, password);
      if (error) {
        errorEl.textContent = mapErrorMessage(error);
        return;
      }
      if (data.session && onAuthenticatedCallback) {
        onAuthenticatedCallback(data.session);
      }
    } else {
      const { data, error } = await signUp(email, password);
      if (error) {
        errorEl.textContent = mapErrorMessage(error);
        return;
      }
      if (data.session && onAuthenticatedCallback) {
        onAuthenticatedCallback(data.session);
      } else {
        infoEl.textContent = "確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。";
      }
    }
  } catch {
    errorEl.textContent = "通信エラーが発生しました。通信状態を確認してください。";
  } finally {
    submitBtn.textContent = originalLabel;
    updateSubmitState();
  }
}

export function initAuthView({ onAuthenticated }) {
  onAuthenticatedCallback = onAuthenticated;

  applyMode();
  updateSubmitState();

  emailEl.addEventListener("input", updateSubmitState);
  passwordEl.addEventListener("input", updateSubmitState);

  submitBtn.addEventListener("click", handleSubmit);

  toggleBtn.addEventListener("click", () => {
    mode = mode === "login" ? "signup" : "login";
    applyMode();
    updateSubmitState();
  });
}
