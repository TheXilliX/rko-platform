import { accounts } from "../data/accounts.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const splash = $("#splash");
const authPage = $("#authPage");
const authForm = $("#authForm");
const loginInput = $("#login");
const passwordInput = $("#password");
const eyeButton = $("#eyeButton");
const authStatus = $("#authStatus");
const passwordHelp = $("#passwordHelp");
const welcomePage = $("#welcomePage");
const welcomeKicker = $("#welcomeKicker");
const welcomeTitle = $("#welcomeTitle");
const dashboardPage = $("#dashboardPage");
const roleLabel = $("#roleLabel");
const accountName = $("#accountName");
const adminMark = $("#adminMark");
const adminDot = $("#adminDot");
const logoutButton = $("#logoutButton");
const learningPanel = $("#learningPanel");
const adminPanel = $("#adminPanel");
const adminTabs = $$(".admin-tab");
const adminViews = $$(".admin-view");
const tabIndicator = $("#tabIndicator");
const courseList = $("#courseList");
const courseInstruction = $(".course-instruction");
const structureRows = $("#structureRows");
const addButton = $("#addButton");
const saveStructure = $("#saveStructure");
const cancelStructure = $("#cancelStructure");
const notice = $("#notice");
const confirmLayer = $("#confirmLayer");
const confirmCopy = $("#confirmCopy");
const confirmNo = $("#confirmNo");
const confirmYes = $("#confirmYes");

const STORAGE_KEY = "rko-course-structure-v1";
const DEFAULT_STRUCTURE = [{
  id: "section-training", type: "section", title: "ОБУЧЕНИЕ", visible: true, children: [{
    id: "module-intro", type: "module", title: "МОДУЛЬ 01 — ВВЕДЕНИЕ В RKO", visible: true, children: [
      { id: "lesson-rko", type: "lesson", title: "УРОК 01 — ЧТО ТАКОЕ RKO", visible: true },
      { id: "lesson-payments", type: "lesson", title: "УРОК 02 — ОТКУДА БЕРУТСЯ ВЫПЛАТЫ", visible: true },
    ],
  }],
}];

let introPlayed = false;
let transitionTimer;
let noticeTimer;
let currentAccount = null;
let dashboardMode = "learning";
let dashboardIsSwitching = false;
let selectedId = null;
let pendingDeleteId = null;
let openMenuId = null;
let editingId = null;
let coursePath = [];
let savedStructure = loadSavedStructure();
let draftStructure = clone(savedStructure);
let baselineIds = collectIds(savedStructure);

function clone(value) { return JSON.parse(JSON.stringify(value)); }

function loadSavedStructure() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : clone(DEFAULT_STRUCTURE);
  } catch { return clone(DEFAULT_STRUCTURE); }
}

function collectIds(items, result = new Set()) {
  items.forEach((item) => {
    result.add(item.id);
    if (item.children) collectIds(item.children, result);
  });
  return result;
}

function uid(type) { return `${type}-${Date.now()}-${Math.random().toString(16).slice(2)}`; }

function findNode(items, id, parent = null) {
  for (const item of items) {
    if (item.id === id) return { item, parent, siblings: items };
    if (item.children) {
      const result = findNode(item.children, id, item);
      if (result) return result;
    }
  }
  return null;
}

function isSameAsSaved(item) {
  const saved = findNode(savedStructure, item.id)?.item;
  return saved && saved.title === item.title && saved.visible === item.visible;
}

function statusFor(item) {
  if (!baselineIds.has(item.id)) return { label: "НОВОЕ", tone: "amber" };
  if (!isSameAsSaved(item)) return { label: "ИЗМЕНЕНО", tone: "amber" };
  return { label: "СОХРАНЕНО", tone: "green" };
}

function clearTransitionTimer() { window.clearTimeout(transitionTimer); }

function setPage(activePage) {
  [authPage, welcomePage, dashboardPage].forEach((page) => page.classList.toggle("is-active", page === activePage));
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
  coursePath = [];
  adminMark.classList.remove("is-admin-active", "is-pressed");
  learningPanel.classList.add("is-current");
  learningPanel.setAttribute("aria-hidden", "false");
  adminPanel.classList.remove("is-current");
  adminPanel.setAttribute("aria-hidden", "true");
  renderCourse();
  renderStructure();
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
  const activeTab = $(".admin-tab.is-current");
  if (!activeTab) return;
  tabIndicator.style.width = `${activeTab.offsetWidth}px`;
  tabIndicator.style.transform = `translateX(${activeTab.offsetLeft}px)`;
}

function renderStructure() {
  structureRows.innerHTML = "";
  const fragment = document.createDocumentFragment();
  const appendRows = (items, depth = 0, ancestorHidden = false) => {
    items.forEach((item) => {
      const hiddenByParent = ancestorHidden || !item.visible;
      const status = statusFor(item);
      const row = document.createElement("div");
      row.className = `structure-row${selectedId === item.id ? " is-selected" : ""}${hiddenByParent ? " is-hidden-row" : ""}`;
      row.dataset.id = item.id;
      row.style.setProperty("--depth", depth);
      row.innerHTML = `<button class="row-main" type="button" data-action="select" aria-pressed="${selectedId === item.id}"><span class="drag-mark" aria-hidden="true">⠿</span><span class="row-chevron" aria-hidden="true">${item.children ? "⌄" : "›"}</span><span class="row-title"></span></button><span class="row-status row-status--${status.tone}"><i></i>${status.label}</span><button class="visibility-button" type="button" data-action="visibility" aria-label="${item.visible ? "Скрыть" : "Показать"} ${item.title}"><span class="eye-icon${item.visible ? "" : " is-closed"}" aria-hidden="true"></span></button><div class="row-menu-wrap"><button class="more-button" type="button" data-action="menu" aria-label="Действия для ${item.title}">•••</button>${openMenuId === item.id ? actionMenu(item) : ""}</div>`;
      row.querySelector(".row-title").textContent = item.title;
      fragment.appendChild(row);
      if (item.children) appendRows(item.children, depth + 1, hiddenByParent);
    });
  };
  appendRows(draftStructure);
  if (!fragment.childNodes.length) {
    const empty = document.createElement("p");
    empty.className = "structure-empty";
    empty.textContent = "СТРУКТУРА ПОКА ПУСТА. НАЖМИ «+ ДОБАВИТЬ», ЧТОБЫ СОЗДАТЬ РАЗДЕЛ.";
    fragment.appendChild(empty);
  }
  structureRows.appendChild(fragment);
  updateActionState();
}

function actionMenu(item) {
  const edit = item.type === "lesson" ? '<button type="button" disabled>РЕДАКТИРОВАТЬ <small>СКОРО</small></button>' : "";
  return `<div class="action-menu" role="menu">${edit}<button type="button" data-menu-action="rename">ПЕРЕИМЕНОВАТЬ</button><button type="button" data-menu-action="toggle">${item.visible ? "СКРЫТЬ" : "ПОКАЗАТЬ"}</button><button class="delete-action" type="button" data-menu-action="delete">УДАЛИТЬ</button></div>`;
}

function updateActionState() {
  const changed = JSON.stringify(draftStructure) !== JSON.stringify(savedStructure);
  saveStructure.classList.toggle("is-enabled", changed);
  cancelStructure.classList.toggle("is-enabled", changed);
}

function addItem() {
  const target = selectedId ? findNode(draftStructure, selectedId) : null;
  let newItem;
  if (!target || (target.item.type === "lesson" && target.parent?.type !== "module")) {
    newItem = { id: uid("section"), type: "section", title: "НОВЫЙ РАЗДЕЛ", visible: true, children: [] };
    draftStructure.push(newItem);
  } else if (target.item.type === "section") {
    newItem = { id: uid("module"), type: "module", title: "НОВЫЙ МОДУЛЬ", visible: true, children: [] };
    target.item.children ??= [];
    target.item.children.push(newItem);
  } else {
    newItem = { id: uid("lesson"), type: "lesson", title: "НОВЫЙ УРОК", visible: true };
    const module = target.item.type === "module" ? target.item : target.parent;
    module.children ??= [];
    module.children.push(newItem);
  }
  selectedId = newItem.id;
  renderStructure();
  startInlineRename(newItem.id, true);
}

function startInlineRename(id, selectAll = false) {
  const found = findNode(draftStructure, id);
  const row = structureRows.querySelector(`[data-id="${id}"]`);
  if (!found || !row) return;
  editingId = id;
  openMenuId = null;
  const title = row.querySelector(".row-title");
  const input = document.createElement("input");
  input.className = "rename-input";
  input.value = found.item.title;
  title.replaceWith(input);
  input.focus();
  if (selectAll) input.select();
  const finish = (commit) => {
    if (editingId !== id) return;
    const value = input.value.trim();
    if (commit && value) found.item.title = value.toUpperCase();
    editingId = null;
    renderStructure();
  };
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") finish(true);
    if (event.key === "Escape") finish(false);
  });
  input.addEventListener("blur", () => finish(true), { once: true });
}

function toggleVisibility(id) {
  const found = findNode(draftStructure, id);
  if (!found) return;
  found.item.visible = !found.item.visible;
  openMenuId = null;
  renderStructure();
}

function openDeleteDialog(id) {
  const found = findNode(draftStructure, id);
  if (!found) return;
  pendingDeleteId = id;
  openMenuId = null;
  confirmCopy.textContent = `Удалить «${found.item.title}»${found.item.children?.length ? " вместе со всем содержимым" : ""}?`;
  confirmLayer.classList.add("is-visible");
  confirmLayer.setAttribute("aria-hidden", "false");
  window.setTimeout(() => confirmNo.focus(), 100);
}

function closeDeleteDialog() {
  pendingDeleteId = null;
  confirmLayer.classList.remove("is-visible");
  confirmLayer.setAttribute("aria-hidden", "true");
}

function deletePending() {
  const found = findNode(draftStructure, pendingDeleteId);
  if (found) found.siblings.splice(found.siblings.findIndex((item) => item.id === pendingDeleteId), 1);
  if (selectedId === pendingDeleteId) selectedId = null;
  closeDeleteDialog();
  renderStructure();
}

function saveDraft() {
  if (JSON.stringify(draftStructure) === JSON.stringify(savedStructure)) return;
  savedStructure = clone(draftStructure);
  baselineIds = collectIds(savedStructure);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedStructure));
  selectedId = null;
  renderStructure();
  coursePath = [];
  renderCourse();
  showNotice("ИЗМЕНЕНИЯ СОХРАНЕНЫ", "success");
}

function cancelDraft() {
  if (JSON.stringify(draftStructure) === JSON.stringify(savedStructure)) return;
  draftStructure = clone(savedStructure);
  selectedId = null;
  openMenuId = null;
  renderStructure();
  showNotice("ИЗМЕНЕНИЯ ОТМЕНЕНЫ");
}

function showNotice(message, tone = "default") {
  window.clearTimeout(noticeTimer);
  notice.textContent = message;
  notice.className = `notice is-visible notice--${tone}`;
  noticeTimer = window.setTimeout(() => notice.classList.remove("is-visible"), 1700);
}

function courseItemsAtPath() {
  let items = savedStructure;
  for (const id of coursePath) {
    const next = items.find((item) => item.id === id);
    if (!next?.children) break;
    items = next.children;
  }
  return items;
}

function isEffectivelyVisible(id) {
  const walk = (items, parentVisible = true) => {
    for (const item of items) {
      const visible = parentVisible && item.visible;
      if (item.id === id) return visible;
      if (item.children) {
        const result = walk(item.children, visible);
        if (result !== null) return result;
      }
    }
    return null;
  };
  return walk(savedStructure);
}

function renderCourse() {
  courseList.classList.add("is-changing");
  window.setTimeout(() => {
    const items = courseItemsAtPath();
    courseList.innerHTML = "";
    courseInstruction.textContent = coursePath.length === 0 ? "ВЫБЕРИ РАЗДЕЛ, ЧТОБЫ ПЕРЕЙТИ К МОДУЛЯМ КУРСА." : coursePath.length === 1 ? "ВЫБЕРИ МОДУЛЬ, ЧТОБЫ ПЕРЕЙТИ К УРОКАМ И МАТЕРИАЛАМ КУРСА." : "ВЫБЕРИ УРОК, ЧТОБЫ ПЕРЕЙТИ К МАТЕРИАЛАМ.";
    if (coursePath.length) {
      const back = document.createElement("button");
      back.className = "course-back";
      back.type = "button";
      back.dataset.courseAction = "back";
      back.textContent = "← НАЗАД";
      courseList.appendChild(back);
    }
    items.forEach((item, index) => {
      const accessible = isEffectivelyVisible(item.id);
      const button = document.createElement("button");
      button.className = `course-row${accessible ? "" : " is-locked"}`;
      button.type = "button";
      button.dataset.courseId = item.id;
      button.innerHTML = `<span class="course-number">[${String(index + 1).padStart(2, "0")}]</span><span class="course-name"></span><span class="course-state" aria-hidden="true"></span><span class="course-arrow">→</span>`;
      button.querySelector(".course-name").textContent = item.title;
      courseList.appendChild(button);
    });
    courseList.classList.remove("is-changing");
  }, 180);
}

function handleCourseClick(event) {
  if (event.target.closest("[data-course-action='back']")) {
    coursePath.pop();
    renderCourse();
    return;
  }
  const row = event.target.closest("[data-course-id]");
  if (!row) return;
  const id = row.dataset.courseId;
  const found = findNode(savedStructure, id);
  if (!found || !isEffectivelyVisible(id)) {
    row.classList.add("is-denied");
    showNotice("ЭТОТ МАТЕРИАЛ ПОКА НЕДОСТУПЕН");
    window.setTimeout(() => row.classList.remove("is-denied"), 500);
    return;
  }
  row.classList.add("is-opening");
  if (found.item.children) {
    window.setTimeout(() => { coursePath.push(id); renderCourse(); }, 310);
  } else showNotice("РЕДАКТОР УРОКА БУДЕТ ДОБАВЛЕН СЛЕДУЮЩИМ ЭТАПОМ");
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
  const account = accounts.find((item) => item.login === loginInput.value.trim().toLowerCase() && item.password === passwordInput.value);
  if (!account) return triggerError();
  passwordHelp.classList.remove("is-visible");
  showWelcome(account);
});
adminMark.addEventListener("click", () => {
  if (adminMark.classList.contains("is-visible")) setDashboardMode(dashboardMode === "admin" ? "learning" : "admin");
});
adminTabs.forEach((tab) => tab.addEventListener("click", () => {
  adminTabs.forEach((item) => item.classList.toggle("is-current", item === tab));
  adminViews.forEach((view) => view.classList.toggle("is-current", view.dataset.adminView === tab.dataset.tab));
  updateTabIndicator();
}));
structureRows.addEventListener("click", (event) => {
  const row = event.target.closest(".structure-row");
  if (!row || editingId) return;
  const id = row.dataset.id;
  const action = event.target.closest("[data-action]")?.dataset.action;
  const menuAction = event.target.closest("[data-menu-action]")?.dataset.menuAction;
  if (menuAction) {
    if (menuAction === "rename") startInlineRename(id, true);
    if (menuAction === "toggle") toggleVisibility(id);
    if (menuAction === "delete") openDeleteDialog(id);
    return;
  }
  if (action === "visibility") return toggleVisibility(id);
  if (action === "menu") {
    openMenuId = openMenuId === id ? null : id;
    renderStructure();
    return;
  }
  selectedId = selectedId === id ? null : id;
  openMenuId = null;
  renderStructure();
});
$("#structureTable").addEventListener("click", (event) => {
  if (event.target.closest(".structure-row")) return;
  selectedId = null;
  openMenuId = null;
  renderStructure();
});
document.addEventListener("click", (event) => {
  if (openMenuId && !event.target.closest(".row-menu-wrap")) {
    openMenuId = null;
    renderStructure();
  }
});
addButton.addEventListener("click", addItem);
saveStructure.addEventListener("click", saveDraft);
cancelStructure.addEventListener("click", cancelDraft);
confirmNo.addEventListener("click", closeDeleteDialog);
confirmYes.addEventListener("click", deletePending);
confirmLayer.addEventListener("click", (event) => { if (event.target === confirmLayer) closeDeleteDialog(); });
courseList.addEventListener("click", handleCourseClick);
window.addEventListener("resize", updateTabIndicator);
logoutButton.addEventListener("click", () => logoutFrom(logoutButton));

renderCourse();
renderStructure();
showAuth();
