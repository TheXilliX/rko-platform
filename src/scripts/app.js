import { accounts } from "../data/accounts.js";

const splash = document.querySelector("#splash");
const authPage = document.querySelector("#authPage");
const authForm = document.querySelector("#authForm");
const loginInput = document.querySelector("#login");
const passwordInput = document.querySelector("#password");
const eyeButton = document.querySelector("#eyeButton");
const authStatus = document.querySelector("#authStatus");
const passwordHelp = document.querySelector("#passwordHelp");
const welcomePage = document.querySelector("#welcomePage");
const welcomeKicker = document.querySelector("#welcomeKicker");
const welcomeTitle = document.querySelector("#welcomeTitle");
const dashboardPage = document.querySelector("#dashboardPage");
const roleLabel = document.querySelector("#roleLabel");
const accountName = document.querySelector("#accountName");
const adminMark = document.querySelector("#adminMark");
const adminDot = document.querySelector("#adminDot");
const logoutButton = document.querySelector("#logoutButton");
const adminPage = document.querySelector("#adminPage");
const adminAccountName = document.querySelector("#adminAccountName");
const adminBackButton = document.querySelector("#adminBackButton");
const adminLogoutButton = document.querySelector("#adminLogoutButton");

let introPlayed = false;
let transitionTimer;
let currentAccount = null;

function clearTransitionTimer() {
  window.clearTimeout(transitionTimer);
}

function setPage(activePage) {
  [authPage, welcomePage, dashboardPage, adminPage].forEach((page) => {
    page.classList.toggle("is-active", page === activePage);
  });
}

function showAuth({ skipIntro = false } = {}) {
  clearTransitionTimer();
  authForm.reset();
  authForm.classList.remove("is-ready", "is-authenticated");
  authStatus.textContent = "";
  authStatus.className = "auth-status";
  passwordHelp.classList.remove("is-visible");
  passwordInput.type = "password";
  eyeButton.setAttribute("aria-pressed", "false");
  eyeButton.setAttribute("aria-label", "Показать пароль");
  document.body.classList.remove("error-flash");

  if (skipIntro || introPlayed) {
    splash.classList.add("is-gone");
    setPage(authPage);
    window.setTimeout(() => loginInput.focus({ preventScroll: true }), 450);
    return;
  }

  setPage(authPage);
  transitionTimer = window.setTimeout(() => {
    introPlayed = true;
    splash.classList.add("is-gone");
    loginInput.focus({ preventScroll: true });
  }, 4500);
}

function updateReadyState() {
  const ready = loginInput.value.trim().length > 0 && passwordInput.value.length > 0;
  authForm.classList.toggle("is-ready", ready);
  eyeButton.classList.toggle("is-visible", passwordInput.value.length > 0);
}

function triggerError() {
  authStatus.textContent = "";
  authStatus.className = "auth-status";
  passwordHelp.classList.remove("is-visible");
  document.body.classList.remove("error-flash");
  void document.body.offsetWidth;
  document.body.classList.add("error-flash");

  window.setTimeout(() => {
    document.body.classList.remove("error-flash");
    passwordHelp.classList.add("is-visible");
  }, 1200);
}

function showWelcome(account) {
  authForm.classList.add("is-authenticated");
  authStatus.textContent = "УСПЕШНО";
  authStatus.className = "auth-status is-success";

  transitionTimer = window.setTimeout(() => {
    if (account.role === "admin") {
      welcomeKicker.textContent = "ВЫ ВОШЛИ КАК";
      welcomeTitle.textContent = "АДМИНИСТРАТОР";
    } else {
      welcomeKicker.textContent = "ДОБРО ПОЖАЛОВАТЬ";
      welcomeTitle.textContent = account.name;
    }

    setPage(welcomePage);
    welcomePage.classList.remove("is-leaving");

    transitionTimer = window.setTimeout(() => {
      welcomePage.classList.add("is-leaving");
      transitionTimer = window.setTimeout(() => showDashboard(account), 650);
    }, 1150);
  }, 1050);
}

function showDashboard(account) {
  currentAccount = account;
  const isAdmin = account.role === "admin";
  roleLabel.textContent = isAdmin ? "[ RKO / АДМИН ]" : "[ RKO / УЧЕНИК ]";
  accountName.textContent = account.name;
  adminMark.classList.toggle("is-visible", isAdmin);
  adminDot.classList.toggle("is-visible", isAdmin);
  setPage(dashboardPage);
}

function animatePageChange(button, page, callback) {
  clearTransitionTimer();
  button.classList.add("is-pressed");

  transitionTimer = window.setTimeout(() => {
    page.classList.add("is-leaving");

    transitionTimer = window.setTimeout(() => {
      button.classList.remove("is-pressed");
      page.classList.remove("is-leaving");
      callback();
    }, 520);
  }, 210);
}

function showAdminPage() {
  if (!currentAccount || currentAccount.role !== "admin") return;
  adminAccountName.textContent = currentAccount.name;
  setPage(adminPage);
}

function logoutFrom(button, page) {
  animatePageChange(button, page, () => {
    currentAccount = null;
    showAuth({ skipIntro: true });
  });
}

loginInput.addEventListener("input", updateReadyState);
passwordInput.addEventListener("input", updateReadyState);

eyeButton.addEventListener("click", () => {
  const reveal = passwordInput.type === "password";
  passwordInput.type = reveal ? "text" : "password";
  eyeButton.setAttribute("aria-pressed", String(reveal));
  eyeButton.setAttribute("aria-label", reveal ? "Скрыть пароль" : "Показать пароль");
  passwordInput.focus({ preventScroll: true });
});

authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const login = loginInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  const account = accounts.find((item) => item.login === login && item.password === password);

  if (!account) {
    triggerError();
    return;
  }

  passwordHelp.classList.remove("is-visible");
  showWelcome(account);
});

adminMark.addEventListener("click", () => {
  if (!adminMark.classList.contains("is-visible")) return;
  animatePageChange(adminMark, dashboardPage, showAdminPage);
});

adminBackButton.addEventListener("click", () => {
  animatePageChange(adminBackButton, adminPage, () => showDashboard(currentAccount));
});

logoutButton.addEventListener("click", () => logoutFrom(logoutButton, dashboardPage));
adminLogoutButton.addEventListener("click", () => logoutFrom(adminLogoutButton, adminPage));

showAuth();
