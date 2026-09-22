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
const learningPanel = document.querySelector("#learningPanel");
const adminPanel = document.querySelector("#adminPanel");
const adminTabs = [...document.querySelectorAll(".admin-tab")];
const tabIndicator = document.querySelector("#tabIndicator");

let introPlayed = false;
let transitionTimer;
let currentAccount = null;
let dashboardMode = "learning";
let dashboardIsSwitching = false;

function clearTransitionTimer() {
  window.clearTimeout(transitionTimer);
}

function setPage(activePage) {
  [authPage, welcomePage, dashboardPage].forEach((page) => {
    page.classList.toggle("is-active", page === activePage);
  });
}

function showAuth({ skipIntro = false } = {}) {
  clearTransitionTimer();
  authForm.reset();
  authForm.classList.remove("is-ready", "is-authenticated", "is-success");
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
  authForm.classList.remove("is-ready");
  authForm.classList.add("is-authenticated");
  authStatus.textContent = "УСПЕШНО";
  authStatus.className = "auth-status";

  transitionTimer = window.setTimeout(() => {
    authStatus.classList.add("is-success");
    transitionTimer = window.setTimeout(() => {
      authForm.classList.add("is-success");
      transitionTimer = window.setTimeout(() => {
        if (account.role === "admin") {
          welcomeKicker.textContent = "ВЫ ВОШЛИ КАК";
          welcomeTitle.textContent = "АДМИНИСТРАТОР";
          welcomePage.classList.add("is-admin-welcome");
        } else {
          welcomeKicker.textContent = "ДОБРО ПОЖАЛОВАТЬ";
          welcomeTitle.textContent = account.name;
          welcomePage.classList.remove("is-admin-welcome");
        }

        setPage(welcomePage);
        welcomePage.classList.remove("is-leaving");

        transitionTimer = window.setTimeout(() => {
          welcomePage.classList.add("is-leaving");
          transitionTimer = window.setTimeout(() => showDashboard(account), 650);
        }, 1150);
      }, 700);
    }, 700);
  }, 300);
}

function showDashboard(account) {
  currentAccount = account;
  dashboardIsSwitching = false;
  const isAdmin = account.role === "admin";
  roleLabel.textContent = isAdmin ? "[ RKO / АДМИН ]" : "[ RKO / УЧЕНИК ]";
  accountName.textContent = account.name;
  adminMark.classList.toggle("is-visible", isAdmin);
  adminDot.classList.toggle("is-visible", isAdmin);
  dashboardMode = "learning";
  adminMark.classList.remove("is-admin-active", "is-pressed");
  learningPanel.classList.add("is-current");
  learningPanel.setAttribute("aria-hidden", "false");
  adminPanel.classList.remove("is-current");
  adminPanel.setAttribute("aria-hidden", "true");
  setPage(dashboardPage);
}

function logoutFrom(button) {
  clearTransitionTimer();
  button.classList.add("is-pressed");

  transitionTimer = window.setTimeout(() => {
    dashboardPage.classList.add("is-leaving");

    transitionTimer = window.setTimeout(() => {
      button.classList.remove("is-pressed");
      dashboardPage.classList.remove("is-leaving");
      currentAccount = null;
      showAuth({ skipIntro: true });
    }, 520);
  }, 210);
}

function setDashboardMode(nextMode) {
  if (!currentAccount || currentAccount.role !== "admin" || nextMode === dashboardMode || dashboardIsSwitching) return;
  clearTransitionTimer();
  dashboardIsSwitching = true;
  adminMark.classList.add("is-pressed");
  adminMark.classList.toggle("is-admin-active", nextMode === "admin");

  const outgoing = dashboardMode === "admin" ? adminPanel : learningPanel;
  const incoming = nextMode === "admin" ? adminPanel : learningPanel;
  outgoing.classList.add("is-leaving");
  incoming.classList.add("is-current");
  incoming.setAttribute("aria-hidden", "false");
  dashboardMode = nextMode;

  window.setTimeout(() => adminMark.classList.remove("is-pressed"), 240);
  if (nextMode === "admin") requestAnimationFrame(updateTabIndicator);

  transitionTimer = window.setTimeout(() => {
    outgoing.classList.remove("is-current", "is-leaving");
    outgoing.setAttribute("aria-hidden", "true");
    dashboardIsSwitching = false;
  }, 560);
}

function updateTabIndicator() {
  const activeTab = document.querySelector(".admin-tab.is-current");
  if (!activeTab) return;
  tabIndicator.style.width = `${activeTab.offsetWidth}px`;
  tabIndicator.style.transform = `translateX(${activeTab.offsetLeft}px)`;
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
  setDashboardMode(dashboardMode === "admin" ? "learning" : "admin");
});

adminTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    adminTabs.forEach((item) => item.classList.toggle("is-current", item === tab));
    updateTabIndicator();
  });
});

window.addEventListener("resize", updateTabIndicator);

logoutButton.addEventListener("click", () => logoutFrom(logoutButton));

showAuth();
