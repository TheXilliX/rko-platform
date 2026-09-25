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
const welcomeRole = $("#welcomeRole");
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
const courseBrowser = $("#courseBrowser");
const courseList = $("#courseList");
const courseInstruction = $(".course-instruction");
const courseGuideBack = $("#courseGuideBack");
const learningTitle = $("#learningTitle");
const lessonReader = $("#lessonReader");
const readerBack = $("#readerBack");
const readerTitle = $("#readerTitle");
const readerContent = $("#readerContent");
const structureRows = $("#structureRows");
const addButton = $("#addButton");
const saveStructure = $("#saveStructure");
const cancelStructure = $("#cancelStructure");
const notice = $("#notice");
const confirmLayer = $("#confirmLayer");
const confirmCopy = $("#confirmCopy");
const confirmNo = $("#confirmNo");
const confirmYes = $("#confirmYes");
const editorPage = $("#editorPage");
const editorLogoutButton = $("#editorLogoutButton");
const editorBack = $("#editorBack");
const editorPath = $("#editorPath");
const lessonNameInput = $("#lessonNameInput");
const lessonBlocks = $("#lessonBlocks");
const addBlockButton = $("#addBlockButton");
const editorState = $("#editorState");
const lessonVisibility = $("#lessonVisibility");
const allowDownloads = $("#allowDownloads");
const deleteLesson = $("#deleteLesson");
const saveLesson = $("#saveLesson");
const blockPickerLayer = $("#blockPickerLayer");
const blockPickerCancel = $("#blockPickerCancel");
const blockOptions = $$("[data-block-type]");
const previousLesson = $("#previousLesson");
const nextLesson = $("#nextLesson");
const lessonProgress = $("#lessonProgress");
const defaultVisibility = $("#defaultVisibility");
const defaultDownloads = $("#defaultDownloads");
const primaryColor = $("#primaryColor");
const secondaryColor = $("#secondaryColor");
const resetColors = $("#resetColors");
const structureView = $('[data-admin-view="structure"]');
const createAccountButton = $("#createAccountButton");
const accountsList = $("#accountsList");
const accountLayer = $("#accountLayer");
const accountForm = $("#accountForm");
const accountModalClose = $("#accountModalClose");
const accountCancel = $("#accountCancel");
const accountModalTitle = $("#accountModalTitle");
const accountModalKicker = $("#accountModalKicker");
const accountFormNote = $("#accountFormNote");
const accountFirstName = $("#accountFirstName");
const accountLastName = $("#accountLastName");
const accountTelegram = $("#accountTelegram");
const accountLogin = $("#accountLogin");
const accountPassword = $("#accountPassword");
const accountPasswordEye = $("#accountPasswordEye");
const accountPasswordChange = $("#accountPasswordChange");
const accountRole = $("#accountRole");
const accountCourseAccess = $("#accountCourseAccess");
const accountSubmit = $("#accountSubmit");
const accountDelete = $("#accountDelete");
const studentAccountForm = $("#studentAccountForm");
const studentAccountModalClose = $("#studentAccountModalClose");
const studentAccountCancel = $("#studentAccountCancel");
const studentFirstName = $("#studentFirstName");
const studentLastName = $("#studentLastName");
const studentTelegram = $("#studentTelegram");
const studentPasswordChange = $("#studentPasswordChange");
const studentAccountFormNote = $("#studentAccountFormNote");
const passwordLayer = $("#passwordLayer");
const passwordForm = $("#passwordForm");
const passwordModalClose = $("#passwordModalClose");
const passwordCancel = $("#passwordCancel");
const currentPassword = $("#currentPassword");
const newPassword = $("#newPassword");
const repeatPassword = $("#repeatPassword");
const passwordFormNote = $("#passwordFormNote");
const currentPasswordEye = $("#currentPasswordEye");
const newPasswordEye = $("#newPasswordEye");
const repeatPasswordEye = $("#repeatPasswordEye");

const STORAGE_KEY = "rko-course-structure-v1";
const SETTINGS_KEY = "rko-platform-settings-v1";
const PROGRESS_KEY = "rko-lesson-progress-v1";
const ACCOUNT_STORAGE_KEY = "rko-platform-accounts-v1";
const SESSION_KEY = "rko-platform-session-v1";
const DEFAULT_SETTINGS = { newItemsVisible: false, newItemsAllowDownloads: true, primaryColor: "#FFAE42", secondaryColor: "#2F7D57" };
const API_BASE = "/api";
const isOwnerAccount = (account) => account?.role === "owner";
const isStaffAccount = (account) => isOwnerAccount(account) || account?.role === "admin";
const DEFAULT_STRUCTURE = [{
  id: "section-training", type: "section", title: "ОБУЧЕНИЕ", visible: true, children: [{
    id: "module-intro", type: "module", title: "МОДУЛЬ 01 — ВВЕДЕНИЕ В RKO", visible: true, children: [
      { id: "lesson-rko", type: "lesson", title: "Урок 01 — Что такое RKO", visible: true, allowDownloads: false, blocks: [] },
      { id: "lesson-payments", type: "lesson", title: "Урок 02 — Откуда берутся выплаты", visible: true, allowDownloads: false, blocks: [] },
    ],
  }],
}];

let introPlayed = false;
let transitionTimer;
let titleTransitionTimer;
let noticeTimer;
let currentAccount = null;
let dashboardMode = "learning";
let dashboardIsSwitching = false;
let selectedId = null;
let pendingDeleteId = null;
let pendingDeleteContext = "structure";
let openMenuId = null;
let editingId = null;
let coursePath = [];
let collapsedIds = new Set();
let dragItemId = null;
let dragTargetId = null;
let animateStructureId = null;
let blockDragId = null;
let blockDragTargetId = null;
let blockDragAfter = false;
let dragGhost = null;
let editorLessonId = null;
let editorDraft = null;
let editorOriginal = null;
let platformSettings = loadSettings();
let lessonProgressState = {};
let accountStore = loadAccounts();
let accountModalMode = "profile";
let editingAccountLogin = null;
let pendingAccountLogin = null;
let passwordTargetAccount = null;
let passwordResetMode = false;
let savedStructure = loadSavedStructure();
let draftStructure = clone(savedStructure);
let baselineIds = collectIds(savedStructure);
let backendConnected = false;

function clone(value) { return JSON.parse(JSON.stringify(value)); }

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  let body = null;
  try { body = await response.json(); } catch {}
  return { response, body };
}

function normalizeAccount(account) {
  const fallbackName = String(account.name || "").trim().split(/\s+/);
  return {
    ...account,
    firstName: account.firstName ?? fallbackName[0] ?? "",
    lastName: account.lastName ?? fallbackName.slice(1).join(" "),
    telegram: account.telegram ?? "",
    courseAccess: account.courseAccess !== false,
  };
}

function loadAccounts() {
  try {
    const stored = JSON.parse(localStorage.getItem(ACCOUNT_STORAGE_KEY));
    if (Array.isArray(stored) && stored.length) return normalizeAccounts(stored);
  } catch {}
  return normalizeAccounts(accounts);
}

function normalizeAccounts(list) {
  const normalized = list.map(normalizeAccount);
  const owner = normalized.find((account) => isOwnerAccount(account))
    || normalized.find((account) => account.login === "admin" && account.role === "admin")
    || normalized.find((account) => account.role === "admin");
  if (owner) owner.role = "owner";
  return normalized;
}

function saveAccounts() {
  localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accountStore));
}

async function syncCourseToServer() {
  if (!backendConnected) return;
  try {
    await apiRequest("/course", {
      method: "PUT",
      body: JSON.stringify({ structure: savedStructure, settings: platformSettings }),
    });
  } catch {}
}

async function hydrateFromServer(account) {
  try {
    const courseResult = await apiRequest("/course");
    if (courseResult.response.ok && Array.isArray(courseResult.body?.structure)) {
      savedStructure = normalizeStructure(courseResult.body.structure);
      draftStructure = clone(savedStructure);
      baselineIds = collectIds(savedStructure);
      if (courseResult.body.settings && typeof courseResult.body.settings === "object") {
        platformSettings = { ...DEFAULT_SETTINGS, ...courseResult.body.settings };
      }
    }
    const progressResult = await apiRequest("/progress");
    if (progressResult.response.ok && progressResult.body?.progress) {
      lessonProgressState = progressResult.body.progress;
    }
    if (isStaffAccount(account)) {
      const accountsResult = await apiRequest("/accounts");
      if (accountsResult.response.ok && Array.isArray(accountsResult.body?.accounts)) {
        accountStore = normalizeAccounts(accountsResult.body.accounts);
      }
    }
    applyPlatformSettings();
    renderCourse();
    renderStructure();
  } catch {}
}

function accountDisplayName(account) {
  return [account.firstName, account.lastName].filter(Boolean).join(" ") || account.name || account.login;
}

function displayAccountFirstName(account) {
  return account?.firstName || String(account?.name || account?.login || "").trim().split(/\s+/)[0];
}

function loadSettings() {
  try { return { ...DEFAULT_SETTINGS, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}) }; }
  catch { return { ...DEFAULT_SETTINGS }; }
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(platformSettings));
  syncCourseToServer();
}

function progressStorageKey(account = currentAccount) {
  return `${PROGRESS_KEY}:${account?.login || "guest"}`;
}

function loadLessonProgress(account = currentAccount) {
  try {
    const key = progressStorageKey(account);
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored) || {};
    if (account?.login === "student") {
      const legacy = localStorage.getItem(PROGRESS_KEY);
      if (legacy) {
        const migrated = JSON.parse(legacy) || {};
        localStorage.setItem(key, JSON.stringify(migrated));
        localStorage.removeItem(PROGRESS_KEY);
        return migrated;
      }
    }
    return {};
  } catch { return {}; }
}

function saveLessonProgress() {
  localStorage.setItem(progressStorageKey(), JSON.stringify(lessonProgressState));
  if (backendConnected) {
    apiRequest("/progress", {
      method: "PUT",
      body: JSON.stringify({ progress: lessonProgressState }),
    }).catch(() => {});
  }
}

function applyPlatformSettings() {
  document.documentElement.style.setProperty("--amber", platformSettings.primaryColor);
  document.documentElement.style.setProperty("--green", platformSettings.secondaryColor);
  if (primaryColor) primaryColor.value = platformSettings.primaryColor;
  if (secondaryColor) secondaryColor.value = platformSettings.secondaryColor;
  if (defaultVisibility) {
    defaultVisibility.classList.toggle("is-on", platformSettings.newItemsVisible);
    defaultVisibility.setAttribute("aria-pressed", String(platformSettings.newItemsVisible));
    defaultVisibility.querySelector(".setting-switch-label").textContent = platformSettings.newItemsVisible ? "ДЛЯ ВСЕХ" : "ЗАКРЫТ";
  }
  if (defaultDownloads) {
    defaultDownloads.classList.toggle("is-on", platformSettings.newItemsAllowDownloads);
    defaultDownloads.setAttribute("aria-pressed", String(platformSettings.newItemsAllowDownloads));
    defaultDownloads.querySelector(".setting-switch-label").textContent = platformSettings.newItemsAllowDownloads ? "РАЗРЕШЕНО" : "ЗАПРЕЩЕНО";
  }
}

function loadSavedStructure() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return normalizeStructure(Array.isArray(stored) ? stored : clone(DEFAULT_STRUCTURE));
  } catch { return clone(DEFAULT_STRUCTURE); }
}

function normalizeStructure(items) {
  items.forEach((item) => {
    if (item.type === "lesson") {
      item.blocks ??= [];
      item.allowDownloads ??= false;
    }
    if (item.children) normalizeStructure(item.children);
  });
  return items;
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
  const savedNode = findNode(savedStructure, item.id);
  const draftNode = findNode(draftStructure, item.id);
  if (!savedNode || !draftNode) return false;
  const samePosition = savedNode.parent?.id === draftNode.parent?.id
    && savedNode.siblings.findIndex((entry) => entry.id === item.id) === draftNode.siblings.findIndex((entry) => entry.id === item.id);
  return savedNode.item.title === item.title && savedNode.item.visible === item.visible && samePosition;
}

function statusFor(item) {
  if (!baselineIds.has(item.id)) return { label: "НОВОЕ", tone: "amber" };
  if (!isSameAsSaved(item)) return { label: "ИЗМЕНЕНО", tone: "amber" };
  return { label: "СОХРАНЕНО", tone: "green" };
}

function clearTransitionTimer() { window.clearTimeout(transitionTimer); }

function setPage(activePage) {
  [authPage, welcomePage, dashboardPage, editorPage].forEach((page) => page.classList.toggle("is-active", page === activePage));
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
    return;
  }
  setPage(authPage);
  transitionTimer = window.setTimeout(() => {
    introPlayed = true;
    splash.classList.add("is-gone");
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
        if (isStaffAccount(account)) {
          welcomeKicker.textContent = "ДОБРО ПОЖАЛОВАТЬ";
          welcomeTitle.textContent = displayAccountFirstName(account);
          welcomeRole.textContent = isOwnerAccount(account) ? "ВЛАДЕЛЕЦ" : "АДМИНИСТРАТОР";
          welcomePage.classList.add("is-admin-welcome");
        } else {
          welcomeKicker.textContent = "ДОБРО ПОЖАЛОВАТЬ";
          welcomeTitle.textContent = displayAccountFirstName(account);
          welcomeRole.textContent = "";
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
  localStorage.setItem(SESSION_KEY, account.login);
  lessonProgressState = loadLessonProgress(account);
  dashboardIsSwitching = false;
  const isStaff = isStaffAccount(account);
  roleLabel.textContent = isOwnerAccount(account) ? "[ RKO / ВЛАДЕЛЕЦ ]" : isStaff ? "[ RKO / АДМИН ]" : "[ RKO / УЧЕНИК ]";
  accountName.textContent = displayAccountFirstName(account);
  adminMark.classList.toggle("is-visible", isStaff);
  adminDot.classList.toggle("is-visible", isStaff);
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
  const activePage = editorPage.classList.contains("is-active") ? editorPage : dashboardPage;
  transitionTimer = window.setTimeout(() => {
    activePage.classList.add("is-leaving");
    transitionTimer = window.setTimeout(() => {
      button.classList.remove("is-pressed");
      activePage.classList.remove("is-leaving");
      currentAccount = null;
      localStorage.removeItem(SESSION_KEY);
      fetch(`${API_BASE}/auth/logout`, { method: "POST", credentials: "include" }).catch(() => {});
      lessonProgressState = {};
      showAuth({ skipIntro: true });
    }, 520);
  }, 210);
}

function setDashboardMode(nextMode) {
  if (!currentAccount || !isStaffAccount(currentAccount) || nextMode === dashboardMode || dashboardIsSwitching) return;
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
  if (nextMode === "admin") {
    collapseAllStructure();
    renderStructure();
  }
  window.setTimeout(() => adminMark.classList.remove("is-pressed"), 240);
  if (nextMode === "admin") requestAnimationFrame(updateTabIndicator);
  transitionTimer = window.setTimeout(() => {
    outgoing.classList.remove("is-current", "is-leaving");
    outgoing.setAttribute("aria-hidden", "true");
    dashboardIsSwitching = false;
  }, 560);
}

function collapseAllStructure() {
  collapsedIds = new Set();
  const collect = (items) => items.forEach((item) => {
    if (item.children) {
      collapsedIds.add(item.id);
      collect(item.children);
    }
  });
  collect(draftStructure);
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
  const appendRows = (items, depth = 0, ancestorHidden = false, container = fragment) => {
    items.forEach((item) => {
      const hiddenByParent = ancestorHidden || !item.visible;
      const status = statusFor(item);
      const row = document.createElement("div");
      row.className = `structure-row${selectedId === item.id ? " is-selected" : ""}${hiddenByParent ? " is-hidden-row" : ""}${dragTargetId === item.id ? " is-drag-target" : ""}`;
      row.dataset.id = item.id;
      if (openMenuId === item.id) row.classList.add("has-open-menu");
      row.style.setProperty("--depth", depth);
      const canCollapse = item.type !== "lesson";
      row.innerHTML = `<div class="row-main"><button class="drag-handle" type="button" data-action="drag" aria-label="Переместить ${item.title}"><span class="drag-mark" aria-hidden="true">⠿</span></button>${canCollapse ? `<button class="collapse-button${collapsedIds.has(item.id) ? " is-collapsed" : ""}" type="button" data-action="collapse" aria-label="${collapsedIds.has(item.id) ? "Развернуть" : "Свернуть"} ${item.title}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 10 4 4 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>` : '<span class="collapse-spacer"></span>'}<div class="row-select" data-action="select" role="button" tabindex="0" aria-pressed="${selectedId === item.id}"><span class="row-title"></span></div></div><span class="row-status row-status--${status.tone}"><i></i>${status.label}</span><button class="visibility-button" type="button" data-action="visibility" aria-label="${item.visible ? "Скрыть" : "Показать"} ${item.title}"><svg class="eye-svg${item.visible ? "" : " is-closed"}" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="2.6" stroke="currentColor" stroke-width="1.5"/><path class="eye-slash" d="M4 4l16 16" stroke="currentColor" stroke-width="1.5"/></svg></button><div class="row-menu-wrap"><button class="more-button" type="button" data-action="menu" aria-label="Действия для ${item.title}">•••</button>${openMenuId === item.id ? actionMenu(item) : ""}</div>`;
      row.querySelector(".row-title").textContent = item.title;
      container.appendChild(row);
      if (item.children) {
        const children = document.createElement("div");
        children.className = `structure-children${collapsedIds.has(item.id) || animateStructureId === item.id ? " is-collapsed" : ""}`;
        const inner = document.createElement("div");
        inner.className = "structure-children-inner";
        children.appendChild(inner);
        container.appendChild(children);
        appendRows(item.children, depth + 1, hiddenByParent, inner);
      }
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
  const openActionMenu = structureRows.querySelector(".has-open-menu .action-menu");
  if (openActionMenu) {
    const row = openActionMenu.closest(".structure-row");
    requestAnimationFrame(() => {
      if (!row) return;
      const rect = row.getBoundingClientRect();
      if (rect.bottom + openActionMenu.offsetHeight > window.innerHeight - 12) openActionMenu.classList.add("opens-up");
    });
  }
  if (animateStructureId) {
    const opening = structureRows.querySelector(`[data-id="${animateStructureId}"]`)?.nextElementSibling;
    requestAnimationFrame(() => opening?.classList.remove("is-collapsed"));
    animateStructureId = null;
  }
  updateActionState();
}

function actionMenu(item) {
  const edit = item.type === "lesson" ? '<button type="button" data-menu-action="edit">РЕДАКТИРОВАТЬ</button>' : "";
  return `<div class="action-menu" role="menu">${edit}<button type="button" data-menu-action="rename">ПЕРЕИМЕНОВАТЬ</button><button class="delete-action" type="button" data-menu-action="delete">УДАЛИТЬ</button></div>`;
}

function updateActionState() {
  const changed = JSON.stringify(draftStructure) !== JSON.stringify(savedStructure);
  saveStructure.classList.toggle("is-enabled", changed);
  cancelStructure.classList.toggle("is-enabled", changed);
}

function addItem() {
  const target = selectedId ? findNode(draftStructure, selectedId) : null;
  let newItem;
  let parentToExpand = null;
  if (!target || (target.item.type === "lesson" && target.parent?.type !== "module")) {
    newItem = { id: uid("section"), type: "section", title: "Новый раздел", visible: platformSettings.newItemsVisible, children: [] };
    draftStructure.push(newItem);
  } else if (target.item.type === "section") {
    parentToExpand = target.item;
    newItem = { id: uid("module"), type: "module", title: "Новый модуль", visible: platformSettings.newItemsVisible, children: [] };
    target.item.children ??= [];
    target.item.children.push(newItem);
  } else {
    newItem = { id: uid("lesson"), type: "lesson", title: "Новый урок", visible: platformSettings.newItemsVisible, allowDownloads: platformSettings.newItemsAllowDownloads, blocks: [] };
    const module = target.item.type === "module" ? target.item : target.parent;
    parentToExpand = module;
    module.children ??= [];
    module.children.push(newItem);
  }
  if (parentToExpand) collapsedIds.delete(parentToExpand.id);
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
    if (commit && value) found.item.title = value;
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

let dragTargetAfter = false;

function moveStructureItem(sourceId, targetId, placeAfter = false) {
  if (!sourceId || !targetId || sourceId === targetId) return;
  const source = findNode(draftStructure, sourceId);
  let target = findNode(draftStructure, targetId);
  if (!source || !target) return;
  if (source.item.type === target.item.type && source.parent?.id === target.parent?.id) {
    const from = source.siblings.findIndex((item) => item.id === sourceId);
    let to = source.siblings.findIndex((item) => item.id === targetId);
    const [moved] = source.siblings.splice(from, 1);
    if (from < to) to -= 1;
    if (placeAfter) to += 1;
    to = Math.max(0, Math.min(to, source.siblings.length));
    source.siblings.splice(to, 0, moved);
    renderStructure();
    showNotice("ПОРЯДОК ИЗМЕНЁН", "success");
    return;
  }
  if (source.item.type === "module" && target.item.type !== "section") {
    const trail = hierarchyFor(target.item.id, draftStructure) || [];
    const section = [...trail].reverse().find((item) => item.type === "section");
    target = section ? findNode(draftStructure, section.id) : target;
  }
  if (source.item.type === "lesson" && target.item.type === "lesson" && source.parent?.id !== target.parent?.id) {
    target = target.parent ? findNode(draftStructure, target.parent.id) : target;
  }
  if (source.item.type === "module" && target.item.type === "section") {
    if (source.parent?.id === target.item.id) return;
    source.siblings.splice(source.siblings.findIndex((item) => item.id === sourceId), 1);
    target.item.children ??= [];
    target.item.children.push(source.item);
    renderStructure();
    showNotice("МОДУЛЬ ПЕРЕМЕЩЁН", "success");
    return;
  }
  if (source.item.type === "lesson" && target.item.type === "module") {
    if (source.parent?.id === target.item.id) return;
    source.siblings.splice(source.siblings.findIndex((item) => item.id === sourceId), 1);
    target.item.children ??= [];
    target.item.children.push(source.item);
    renderStructure();
    showNotice("УРОК ПЕРЕМЕЩЁН", "success");
    return;
  }
  if (source.item.type !== target.item.type || source.parent?.id !== target.parent?.id) {
    showNotice("МОДУЛЬ МОЖНО ПЕРЕНЕСТИ В ДРУГОЙ РАЗДЕЛ");
    return;
  }
  showNotice("ЭЛЕМЕНТЫ НЕЛЬЗЯ ПОМЕНЯТЬ МЕСТАМИ");
}

function beginStructureDrag(event, id) {
  event.preventDefault();
  event.stopPropagation();
  dragItemId = id;
  dragTargetId = id;
  document.body.classList.add("is-reordering");
  const sourceRow = structureRows.querySelector(`[data-id="${id}"]`);
  dragGhost = createDragGhost(sourceRow?.querySelector(".row-title")?.textContent || "ЭЛЕМЕНТ");
  document.body.appendChild(dragGhost);
  const updateGhost = (moveEvent) => {
    moveEvent.preventDefault();
    moveGhost(moveEvent.clientX, moveEvent.clientY);
    autoScrollWhileDragging(moveEvent.clientY);
  };
  const rowAtPoint = (x, y) => {
    const element = document.elementFromPoint(x, y);
    const directRow = element?.closest(".structure-row");
    if (directRow) return directRow;
    const children = element?.closest(".structure-children-inner");
    const ownerRow = children?.parentElement?.previousElementSibling;
    return ownerRow?.classList.contains("structure-row") ? ownerRow : null;
  };
  const move = (moveEvent) => {
    updateGhost(moveEvent);
    const row = rowAtPoint(moveEvent.clientX, moveEvent.clientY);
    if (row && row.dataset.id !== dragTargetId) {
      structureRows.querySelectorAll(".structure-row.is-drag-target").forEach((target) => target.classList.remove("is-drag-target", "is-drop-after"));
      dragTargetId = row.dataset.id;
      row.classList.add("is-drag-target");
    }
    if (row) {
      dragTargetAfter = moveEvent.clientY > row.getBoundingClientRect().top + row.getBoundingClientRect().height / 2;
      row.classList.toggle("is-drop-after", dragTargetAfter);
    }
  };
  const finish = () => {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", finish);
    document.removeEventListener("pointercancel", finish);
    const sourceId = dragItemId;
    const targetId = dragTargetId;
    dragItemId = null;
    dragTargetId = null;
    document.body.classList.remove("is-reordering");
    removeDragGhost();
    moveStructureItem(sourceId, targetId, dragTargetAfter);
    dragTargetAfter = false;
    if (sourceId === targetId) renderStructure();
  };
  document.addEventListener("pointermove", move, { passive: false });
  document.addEventListener("pointerup", finish, { once: true });
  document.addEventListener("pointercancel", finish, { once: true });
}

function createDragGhost(label) {
  const ghost = document.createElement("div");
  ghost.className = "drag-ghost";
  ghost.textContent = label;
  return ghost;
}

function moveGhost(x, y) {
  if (!dragGhost) return;
  dragGhost.style.left = `${x + 16}px`;
  dragGhost.style.top = `${y + 16}px`;
}

function removeDragGhost() {
  dragGhost?.remove();
  dragGhost = null;
}

function autoScrollWhileDragging(y) {
  const edge = 90;
  const amount = y < edge ? -16 : y > window.innerHeight - edge ? 16 : 0;
  if (!amount) return;
  const scrollContainer = editorPage.classList.contains("is-active")
    ? editorPage
    : adminPanel.classList.contains("is-current") ? adminPanel : document.scrollingElement;
  scrollContainer?.scrollBy({ top: amount, behavior: "auto" });
}

function openDeleteDialog(id) {
  const found = findNode(draftStructure, id);
  if (!found) return;
  pendingDeleteId = id;
  pendingDeleteContext = editorLessonId === id && editorPage.classList.contains("is-active") ? "editor" : "structure";
  openMenuId = null;
  confirmCopy.textContent = `Удалить «${found.item.title}»${found.item.children?.length ? " вместе со всем содержимым" : ""}?`;
  confirmLayer.classList.add("is-visible");
  confirmLayer.setAttribute("aria-hidden", "false");
  window.setTimeout(() => confirmNo.focus(), 100);
}

function openAccountDeleteDialog(account) {
  if (!account || !currentAccount || !isStaffAccount(currentAccount) || account === currentAccount || isOwnerAccount(account)) return;
  if (account.role === "admin" && !isOwnerAccount(currentAccount)) return;
  pendingAccountLogin = account.login;
  pendingDeleteContext = "account";
  confirmCopy.textContent = `Удалить аккаунт «${accountDisplayName(account)}»?`;
  confirmLayer.classList.add("is-visible");
  confirmLayer.setAttribute("aria-hidden", "false");
  window.setTimeout(() => confirmNo.focus(), 100);
}

function closeDeleteDialog() {
  pendingDeleteId = null;
  pendingAccountLogin = null;
  pendingDeleteContext = "structure";
  confirmLayer.classList.remove("is-visible");
  confirmLayer.setAttribute("aria-hidden", "true");
}

async function deletePending() {
  if (pendingDeleteContext === "account") {
    const account = accountStore.find((item) => item.login === pendingAccountLogin);
    const canDelete = account && account !== currentAccount && !isOwnerAccount(account)
      && (account.role !== "admin" || isOwnerAccount(currentAccount));
    if (canDelete) {
      if (backendConnected && account.id) {
        const { response } = await apiRequest(`/accounts/${account.id}`, { method: "DELETE" });
        if (!response.ok) {
          closeDeleteDialog();
          showNotice("НЕ УДАЛОСЬ УДАЛИТЬ АККАУНТ", "error");
          return;
        }
      }
      accountStore = accountStore.filter((item) => item !== account);
      saveAccounts();
      renderAccounts();
      closeDeleteDialog();
      closeAccountModal();
      showNotice("АККАУНТ УДАЛЁН", "success");
    } else closeDeleteDialog();
    return;
  }
  const context = pendingDeleteContext;
  const deletingId = pendingDeleteId;
  const found = findNode(draftStructure, deletingId);
  if (found) found.siblings.splice(found.siblings.findIndex((item) => item.id === deletingId), 1);
  if (context === "editor") {
    savedStructure = clone(draftStructure);
    baselineIds = collectIds(savedStructure);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedStructure));
    syncCourseToServer();
    editorLessonId = null;
    editorDraft = null;
    editorOriginal = null;
  }
  if (selectedId === deletingId) selectedId = null;
  closeDeleteDialog();
  renderStructure();
  renderCourse();
  if (context === "editor") {
    setPage(dashboardPage);
    dashboardMode = "admin";
    collapseAllStructure();
    renderStructure();
    adminMark.classList.add("is-admin-active");
    learningPanel.classList.remove("is-current");
    adminPanel.classList.add("is-current");
    showNotice("УРОК УДАЛЁН");
  }
}

function saveDraft() {
  if (JSON.stringify(draftStructure) === JSON.stringify(savedStructure)) return;
  savedStructure = clone(draftStructure);
  baselineIds = collectIds(savedStructure);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedStructure));
  syncCourseToServer();
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

function renderAccounts() {
  if (!accountsList) return;
  accountsList.innerHTML = "";
  const rank = (account) => isOwnerAccount(account) ? 0 : account.role === "admin" ? 1 : 2;
  const ordered = [...accountStore].sort((a, b) => rank(a) - rank(b));
  ordered.forEach((account) => {
    const row = document.createElement("article");
    row.className = `account-card${isOwnerAccount(account) ? " account-card--owner" : account.role === "admin" ? " account-card--admin" : ""}`;
    row.innerHTML = `<div class="account-card-main"><span class="account-card-type"></span><h3 class="account-card-name"></h3><p class="account-card-login"></p></div><div class="account-card-meta"><span class="account-card-telegram"></span><span class="account-card-status"></span><button class="account-card-action" type="button">НАСТРОЙКИ</button></div>`;
    row.querySelector(".account-card-type").textContent = isOwnerAccount(account) ? "ВЛАДЕЛЕЦ" : account.role === "admin" ? "АДМИНИСТРАТОР" : "УЧЕНИК";
    row.querySelector(".account-card-name").textContent = accountDisplayName(account);
    row.querySelector(".account-card-login").textContent = `ЛОГИН  /  ${account.login}`;
    row.querySelector(".account-card-telegram").textContent = account.telegram || "TELEGRAM  /  —";
    const status = row.querySelector(".account-card-status");
    status.textContent = isStaffAccount(account) || account.courseAccess !== false ? "ДОСТУП ОТКРЫТ" : "ДОСТУП ЗАКРЫТ";
    status.classList.toggle("is-blocked", !isStaffAccount(account) && account.courseAccess === false);
    row.querySelector(".account-card-action").addEventListener("click", () => openAccountModal("profile", account));
    accountsList.appendChild(row);
  });
}

function openAccountModal(mode, account = null) {
  accountModalMode = mode;
  editingAccountLogin = account?.login || null;
  const isCreate = mode === "create";
  const isOwnStudent = !isCreate && account === currentAccount && !isStaffAccount(account);
  const ownerProtected = !isCreate && isOwnerAccount(account) && !isOwnerAccount(currentAccount);
  const staffReadOnly = !isCreate && isStaffAccount(currentAccount) && account !== currentAccount && !isOwnerAccount(currentAccount);
  accountForm.hidden = isOwnStudent;
  studentAccountForm.hidden = !isOwnStudent;
  accountForm.classList.toggle("account-modal--own", !isCreate && account === currentAccount);
  accountForm.classList.toggle("account-modal--readonly", staffReadOnly || ownerProtected);
  if (isOwnStudent) {
    studentFirstName.value = account?.firstName || "";
    studentLastName.value = account?.lastName || "";
    studentTelegram.value = account?.telegram || "";
    studentAccountFormNote.textContent = "";
    studentAccountFormNote.hidden = true;
  }
  accountModalKicker.textContent = isCreate ? "НОВЫЙ АККАУНТ" : "НАСТРОЙКИ АККАУНТА";
  accountModalKicker.hidden = true;
  accountModalTitle.textContent = isCreate ? "СОЗДАТЬ АККАУНТ" : "НАСТРОЙКИ";
  accountSubmit.textContent = isCreate ? "СОЗДАТЬ АККАУНТ" : "СОХРАНИТЬ";
  accountFirstName.value = account?.firstName || "";
  accountLastName.value = account?.lastName || "";
  accountTelegram.value = account?.telegram || "";
  accountLogin.value = account?.login || "";
  accountPassword.value = !isCreate && isStaffAccount(currentAccount) && account && account !== currentAccount
    ? (account.password || "")
    : "";
  accountPasswordChange.hidden = isCreate;
  accountRole.value = account?.role || "student";
  accountRole.closest("label").hidden = !isCreate && account === currentAccount && !isStaffAccount(account);
  const isOwnAccount = !isCreate && account === currentAccount;
  accountLogin.closest("label").hidden = isOwnStudent || isOwnAccount;
  accountPassword.closest("label").hidden = !isCreate;
  accountRole.closest("label").hidden = isOwnStudent || isOwnAccount;
  accountCourseAccess.closest(".account-access-toggle").hidden = isOwnStudent || isOwnAccount;
  const canChangeRole = isCreate ? isOwnerAccount(currentAccount) : isOwnerAccount(currentAccount) && account && account !== currentAccount;
  accountRole.disabled = !canChangeRole;
  const accessOpen = isStaffAccount(account) ? true : account?.courseAccess !== false;
  accountCourseAccess.setAttribute("aria-pressed", String(accessOpen));
  accountCourseAccess.classList.toggle("is-on", accessOpen);
  accountCourseAccess.querySelector(".setting-switch-label").textContent = accessOpen ? "ОТКРЫТ" : "ЗАКРЫТ";
  accountCourseAccess.disabled = (!isCreate && !(isStaffAccount(currentAccount) && account && account !== currentAccount)) || isStaffAccount(account);
  accountLogin.disabled = isOwnStudent || ownerProtected;
  accountFirstName.disabled = false;
  accountLastName.disabled = false;
  accountTelegram.disabled = false;
  accountPasswordChange.disabled = false;
  accountPasswordChange.textContent = !isCreate && isStaffAccount(currentAccount) && !isOwnAccount
    ? "СБРОСИТЬ ПАРОЛЬ"
    : "ИЗМЕНИТЬ ПАРОЛЬ";
  accountSubmit.disabled = false;
  if (staffReadOnly || ownerProtected) {
    accountFirstName.disabled = true;
    accountLastName.disabled = true;
    accountTelegram.disabled = true;
    accountLogin.disabled = true;
    accountRole.disabled = true;
    accountCourseAccess.disabled = true;
    accountPasswordChange.disabled = true;
    accountSubmit.disabled = true;
  }
  accountFormNote.textContent = "";
  accountFormNote.hidden = !(ownerProtected || staffReadOnly);
  if (ownerProtected) accountFormNote.textContent = "НАСТРОЙКИ ВЛАДЕЛЬЦА ДОСТУПНЫ ТОЛЬКО ВЛАДЕЛЬЦУ.";
  if (staffReadOnly) accountFormNote.textContent = "УПРАВЛЯТЬ АККАУНТАМИ МОЖЕТ ТОЛЬКО ВЛАДЕЛЕЦ.";
  accountDelete.hidden = isCreate || !currentAccount || !isStaffAccount(currentAccount) || account === currentAccount || isOwnerAccount(account) || (account?.role === "admin" && !isOwnerAccount(currentAccount));
  accountLayer.classList.add("is-visible");
  accountLayer.setAttribute("aria-hidden", "false");
}

function openPasswordModal() {
  passwordTargetAccount = accountStore.find((item) => item.login === editingAccountLogin) || currentAccount;
  if (!passwordTargetAccount) return;
  if (passwordTargetAccount !== currentAccount && !isOwnerAccount(currentAccount)) {
    showNotice("НЕДОСТАТОЧНО ПРАВ", "error");
    return;
  }
  passwordResetMode = isOwnerAccount(currentAccount) && passwordTargetAccount !== currentAccount;
  const currentField = currentPassword.closest("label");
  const repeatField = repeatPassword.closest("label");
  currentField.hidden = passwordResetMode;
  repeatField.hidden = passwordResetMode;
  currentPassword.value = "";
  currentPassword.readOnly = false;
  currentPassword.required = !passwordResetMode;
  currentPassword.type = "password";
  currentPasswordEye.setAttribute("aria-pressed", "false");
  newPassword.type = "password";
  newPasswordEye.setAttribute("aria-pressed", "false");
  repeatPassword.type = "password";
  repeatPasswordEye.setAttribute("aria-pressed", "false");
  newPassword.value = passwordResetMode ? `${crypto.randomUUID().replaceAll("-", "").slice(0, 12)}!Aa` : "";
  repeatPassword.value = "";
  passwordForm.querySelector("h2").textContent = passwordResetMode ? "СБРОСИТЬ ПАРОЛЬ" : "ИЗМЕНИТЬ ПАРОЛЬ";
  passwordFormNote.textContent = passwordResetMode ? "Новый пароль сгенерирован. Скопируй его и сохрани." : "Введите текущий пароль и новый пароль дважды.";
  let copyButton = $("#passwordCopyButton");
  if (!copyButton) {
    copyButton = document.createElement("button");
    copyButton.id = "passwordCopyButton";
    copyButton.className = "password-copy-button";
    copyButton.type = "button";
    copyButton.textContent = "КОПИРОВАТЬ НОВЫЙ ПАРОЛЬ";
    passwordFormNote.before(copyButton);
    copyButton.addEventListener("click", async () => {
      await navigator.clipboard?.writeText(newPassword.value);
      copyButton.textContent = "ПАРОЛЬ СКОПИРОВАН";
      window.setTimeout(() => { copyButton.textContent = "КОПИРОВАТЬ НОВЫЙ ПАРОЛЬ"; }, 1500);
    });
  }
  copyButton.hidden = !passwordResetMode;
  passwordLayer.classList.add("is-visible");
  passwordLayer.setAttribute("aria-hidden", "false");
}

function closePasswordModal() {
  passwordLayer.classList.remove("is-visible");
  passwordLayer.setAttribute("aria-hidden", "true");
  passwordTargetAccount = null;
  passwordResetMode = false;
  const copyButton = $("#passwordCopyButton");
  if (copyButton) copyButton.hidden = true;
  const currentField = currentPassword.closest("label");
  const repeatField = repeatPassword.closest("label");
  currentField.hidden = false;
  repeatField.hidden = false;
  passwordForm.querySelector("h2").textContent = "ИЗМЕНИТЬ ПАРОЛЬ";
  currentPassword.readOnly = false;
  currentPassword.required = true;
  currentPassword.type = "password";
  newPassword.type = "password";
  repeatPassword.type = "password";
}

async function submitPasswordForm(event) {
  event.preventDefault();
  if (!passwordTargetAccount) return closePasswordModal();
  if (!newPassword.value || (!passwordResetMode && newPassword.value !== repeatPassword.value)) {
    passwordFormNote.textContent = "Новые пароли должны совпадать.";
    return;
  }
  if (backendConnected && passwordTargetAccount.id) {
    const isAdminReset = passwordResetMode;
    const path = isAdminReset ? `/accounts/${passwordTargetAccount.id}/password` : "/me/password";
    const payload = isAdminReset
      ? { password: newPassword.value }
      : { currentPassword: currentPassword.value, password: newPassword.value };
    const { response, body } = await apiRequest(path, { method: "POST", body: JSON.stringify(payload) });
    if (!response.ok) {
      passwordFormNote.textContent = body?.error === "CURRENT_PASSWORD_INVALID" ? "Старый пароль введён неверно." : body?.error === "OWNER_REQUIRED" ? "Недостаточно прав. Сбросить пароль может только владелец." : "Не удалось изменить пароль.";
      return;
    }
    closePasswordModal();
    closeAccountModal();
    showNotice("ПАРОЛЬ ИЗМЕНЁН", "success");
    return;
  }
  if (!passwordResetMode && currentPassword.value !== passwordTargetAccount.password) {
    passwordFormNote.textContent = "Старый пароль введён неверно.";
    return;
  }
  passwordTargetAccount.password = newPassword.value;
  saveAccounts();
  closePasswordModal();
  closeAccountModal();
  showNotice("ПАРОЛЬ ИЗМЕНЁН", "success");
}

function closeAccountModal() {
  accountLayer.classList.remove("is-visible");
  accountLayer.setAttribute("aria-hidden", "true");
  accountPassword.type = "password";
  accountPasswordEye.textContent = "◉";
  editingAccountLogin = null;
}

async function submitAccountForm(event) {
  event.preventDefault();
  const firstName = accountFirstName.value.trim();
  const lastName = accountLastName.value.trim();
  const telegram = accountTelegram.value.trim();
  const login = accountLogin.value.trim().toLowerCase();
  const password = accountPassword.value;
  const currentEditingAccount = accountModalMode === "profile" ? accountStore.find((item) => item.login === editingAccountLogin) : null;
  const isOwnStudent = currentEditingAccount === currentAccount && !isStaffAccount(currentAccount);
  if (currentEditingAccount && isOwnerAccount(currentEditingAccount) && !isOwnerAccount(currentAccount)) return;
  if (!firstName || !login || (accountModalMode === "create" && !password)) {
    accountFormNote.textContent = "Заполни имя, логин и пароль.";
    accountFormNote.hidden = false;
    return;
  }
  if (accountStore.some((account) => account.login === login && account.login !== editingAccountLogin)) {
    accountFormNote.textContent = "Такой логин уже используется.";
    accountFormNote.hidden = false;
    return;
  }
  if (accountModalMode === "create") {
    const payload = { firstName, lastName, telegram, login, password, role: accountRole.value, courseAccess: accountCourseAccess.getAttribute("aria-pressed") === "true" };
    if (backendConnected) {
      const { response, body } = await apiRequest("/accounts", { method: "POST", body: JSON.stringify(payload) });
      if (!response.ok) {
        accountFormNote.textContent = body?.error === "LOGIN_TAKEN" ? "Такой логин уже используется." : "Не удалось создать аккаунт.";
        accountFormNote.hidden = false;
        return;
      }
      accountStore.push(normalizeAccount(body.account));
    } else {
      accountStore.push(normalizeAccount(payload));
    }
    saveAccounts();
    renderAccounts();
    closeAccountModal();
    showNotice("АККАУНТ СОЗДАН", "success");
    return;
  }
  const account = accountStore.find((item) => item.login === editingAccountLogin);
  if (!account) return closeAccountModal();
  const previousLogin = account.login;
  account.firstName = firstName;
  account.lastName = lastName;
  account.telegram = telegram;
  if (!isOwnStudent) {
    account.login = login;
    if (password) account.password = password;
  }
  if (!accountRole.disabled) {
    const nextRole = accountRole.value;
    const canAssignRole = isOwnerAccount(currentAccount) || account.role !== "admin";
    if (canAssignRole && !isOwnerAccount(account)) account.role = nextRole;
  }
  if (!accountCourseAccess.disabled && !isStaffAccount(account)) account.courseAccess = accountCourseAccess.getAttribute("aria-pressed") === "true";
  if (backendConnected && account.id) {
    const ownProfile = account === currentAccount;
    const { response, body } = await apiRequest(ownProfile ? "/me/profile" : `/accounts/${account.id}`, {
      method: "PATCH",
      body: JSON.stringify(ownProfile ? {
        firstName: account.firstName,
        lastName: account.lastName,
        telegram: account.telegram,
      } : {
        firstName: account.firstName,
        lastName: account.lastName,
        telegram: account.telegram,
        login: account.login,
        role: account.role,
        courseAccess: account.courseAccess,
      }),
    });
    if (!response.ok) {
      accountFormNote.textContent = body?.error === "LOGIN_TAKEN" ? "Такой логин уже используется." : body?.error === "OWNER_REQUIRED" ? "Недостаточно прав. Управлять аккаунтами может только владелец." : "Не удалось сохранить аккаунт.";
      accountFormNote.hidden = false;
      return;
    }
    Object.assign(account, normalizeAccount(body.account));
    if (currentAccount === account) currentAccount = account;
  }
  if (!isOwnStudent && currentAccount === account && previousLogin !== login) {
    const previousProgressKey = `${PROGRESS_KEY}:${previousLogin}`;
    const nextProgressKey = `${PROGRESS_KEY}:${login}`;
    const previousProgress = localStorage.getItem(previousProgressKey);
    if (previousProgress) localStorage.setItem(nextProgressKey, previousProgress);
    localStorage.removeItem(previousProgressKey);
    localStorage.setItem(SESSION_KEY, login);
  }
  saveAccounts();
  if (currentAccount === account) accountName.textContent = displayAccountFirstName(account);
  renderAccounts();
  closeAccountModal();
  showNotice("АККАУНТ СОХРАНЁН", "success");
}

async function submitStudentAccountForm(event) {
  event.preventDefault();
  if (!currentAccount || isStaffAccount(currentAccount)) return;
  const firstName = studentFirstName.value.trim();
  if (!firstName) {
    studentAccountFormNote.textContent = "Заполни имя.";
    studentAccountFormNote.hidden = false;
    return;
  }
  currentAccount.firstName = firstName;
  currentAccount.lastName = studentLastName.value.trim();
  currentAccount.telegram = studentTelegram.value.trim();
  if (backendConnected && currentAccount.id) {
    const { response, body } = await apiRequest("/me/profile", {
      method: "PATCH",
      body: JSON.stringify({ firstName: currentAccount.firstName, lastName: currentAccount.lastName, telegram: currentAccount.telegram }),
    });
    if (!response.ok) {
      studentAccountFormNote.textContent = body?.error === "ACCOUNT_FIELDS_REQUIRED" ? "Заполни имя." : "Не удалось сохранить настройки.";
      studentAccountFormNote.hidden = false;
      return;
    }
  }
  saveAccounts();
  accountName.textContent = displayAccountFirstName(currentAccount);
  closeAccountModal();
  showNotice("НАСТРОЙКИ СОХРАНЕНЫ", "success");
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

function lessonProgressFor(item) {
  if (item.type === "lesson") return lessonProgressState[item.id] || "new";
  const lessons = [];
  const collectLessons = (items) => items.forEach((entry) => {
    if (entry.type === "lesson") lessons.push(entry);
    else if (entry.children) collectLessons(entry.children);
  });
  collectLessons(item.children || []);
  if (!lessons.length) return lessonProgressState[item.id] || "new";
  const completed = lessons.filter((lesson) => lessonProgressState[lesson.id] === "completed").length;
  const started = lessonProgressState[item.id] || lessons.some((lesson) => lessonProgressState[lesson.id]);
  return completed === lessons.length ? "completed" : started ? "visited" : "new";
}

function setLearningTitle(title = "ОБУЧЕНИЕ") {
  const value = String(title || "ОБУЧЕНИЕ").trim() || "ОБУЧЕНИЕ";
  learningTitle.replaceChildren();
  const initial = document.createElement("span");
  initial.className = "display-initial";
  initial.textContent = value[0];
  learningTitle.append(initial, document.createTextNode(value.slice(1)));
}

function transitionLearningTitle(title = "ОБУЧЕНИЕ") {
  const value = String(title || "ОБУЧЕНИЕ").trim() || "ОБУЧЕНИЕ";
  if (learningTitle.dataset.title === value) return;
  window.clearTimeout(titleTransitionTimer);
  learningTitle.dataset.title = value;
  learningTitle.classList.add("is-title-changing");
  titleTransitionTimer = window.setTimeout(() => {
    setLearningTitle(value);
    requestAnimationFrame(() => learningTitle.classList.remove("is-title-changing"));
  }, 260);
}

function renderCourse() {
  courseBrowser.classList.remove("is-hidden");
  lessonReader.classList.remove("is-visible");
  lessonReader.setAttribute("aria-hidden", "true");
  learningTitle.classList.remove("is-reader-hidden");
  const currentPlace = coursePath.length ? findNode(savedStructure, coursePath.at(-1))?.item.title : "ОБУЧЕНИЕ";
  transitionLearningTitle(currentPlace);
  courseList.classList.add("is-changing");
  window.setTimeout(() => {
    const items = courseItemsAtPath();
    courseList.innerHTML = "";
    const courseBlocked = !isStaffAccount(currentAccount) && currentAccount?.courseAccess === false;
    courseInstruction.textContent = courseBlocked && coursePath.length > 0
      ? "ДОСТУП К МАТЕРИАЛАМ ОГРАНИЧЕН АДМИНИСТРАТОРОМ."
      : coursePath.length === 0 ? "ВЫБЕРИ РАЗДЕЛ, ЧТОБЫ ПЕРЕЙТИ К МОДУЛЯМ КУРСА." : coursePath.length === 1 ? "ВЫБЕРИ МОДУЛЬ, ЧТОБЫ ПЕРЕЙТИ К УРОКАМ И МАТЕРИАЛАМ КУРСА." : "ВЫБЕРИ УРОК, ЧТОБЫ ПЕРЕЙТИ К МАТЕРИАЛАМ.";
    courseGuideBack.classList.toggle("is-visible", coursePath.length > 0);
    items.forEach((item, index) => {
      const accessible = isEffectivelyVisible(item.id) && (!courseBlocked || item.type === "section");
      const button = document.createElement("button");
      const progress = lessonProgressFor(item);
      button.className = `course-row${accessible ? "" : " is-locked"} course-row--${progress}`;
      button.type = "button";
      button.dataset.courseId = item.id;
      button.innerHTML = `<span class="course-number">[${String(index + 1).padStart(2, "0")}]</span><span class="course-name"></span><span class="course-state" aria-hidden="true"></span><span class="course-arrow">→</span>`;
      button.querySelector(".course-name").textContent = item.title;
      courseList.appendChild(button);
    });
    courseList.classList.remove("is-changing");
  }, 90);
}

function handleCourseClick(event) {
  const row = event.target.closest("[data-course-id]");
  if (!row) return;
  const id = row.dataset.courseId;
  const found = findNode(savedStructure, id);
  const courseBlocked = !isStaffAccount(currentAccount) && currentAccount?.courseAccess === false;
  if (!found || !isEffectivelyVisible(id) || (courseBlocked && found.item.type !== "section")) {
    row.classList.add("is-denied");
    showNotice("ЭТОТ МАТЕРИАЛ ПОКА НЕДОСТУПЕН", "error");
    window.setTimeout(() => row.classList.remove("is-denied"), 500);
    return;
  }
  row.classList.add("is-opening");
  if (found.item.children) {
    if (!lessonProgressState[id]) {
      lessonProgressState[id] = "visited";
      saveLessonProgress();
    }
    window.setTimeout(() => { coursePath.push(id); renderCourse(); }, 170);
  } else window.setTimeout(() => openLessonReader(found.item), 170);
}

function hierarchyFor(id, items = savedStructure, trail = []) {
  for (const item of items) {
    const nextTrail = [...trail, item];
    if (item.id === id) return nextTrail;
    if (item.children) {
      const result = hierarchyFor(id, item.children, nextTrail);
      if (result) return result;
    }
  }
  return null;
}

function openLessonReader(lesson) {
  const hierarchy = hierarchyFor(lesson.id) ?? [lesson];
  markLessonVisited(lesson.id);
  courseBrowser.classList.add("is-hidden");
  learningTitle.classList.add("is-reader-hidden");
  lessonReader.classList.add("is-visible");
  lessonReader.setAttribute("aria-hidden", "false");
  readerTitle.textContent = lesson.title;
  readerTitle.dataset.lessonId = lesson.id;
  renderLessonNavigation(lesson);
  renderReaderBlocks(lesson.blocks ?? [], lesson.allowDownloads);
}

async function renderReaderBlocks(blocks, downloadsAllowed = false) {
  readerContent.innerHTML = "";
  if (!blocks.length) {
    const empty = document.createElement("p");
    empty.className = "reader-empty";
    empty.textContent = "МАТЕРИАЛ УРОКА ПОКА НЕ ДОБАВЛЕН.";
    readerContent.appendChild(empty);
    return;
  }
  for (const block of blocks) {
    const element = document.createElement("section");
    element.className = `reader-block reader-block--${block.type}`;
    if (block.type === "heading") {
      const heading = document.createElement(block.level || "h2");
      heading.textContent = block.text || "";
      element.appendChild(heading);
    } else if (block.type === "text") {
      element.innerHTML = block.html || "";
    } else {
      const asset = await getAsset(block.id);
      if (!asset?.blob) {
        element.innerHTML = `<p class="missing-asset">Локальный файл недоступен: <strong></strong></p>`;
        element.querySelector("strong").textContent = block.fileName || "файл";
      } else {
        const url = URL.createObjectURL(asset.blob);
        if (block.type === "image") {
          const image = document.createElement("img"); image.src = url; image.alt = block.fileName || "Изображение урока"; element.appendChild(image);
        } else if (block.type === "video") {
          const video = document.createElement("video"); video.src = url; video.controls = true; element.appendChild(video);
        } else if (block.type === "audio") {
          const audio = document.createElement("audio"); audio.src = url; audio.controls = true; element.appendChild(audio);
        } else {
          if (downloadsAllowed) {
            const link = document.createElement("a"); link.href = url; link.download = block.fileName || "file"; link.textContent = `СКАЧАТЬ — ${block.fileName || "ФАЙЛ"}`; element.appendChild(link);
          } else {
            const label = document.createElement("p"); label.className = "attachment-label"; label.textContent = block.fileName || "ФАЙЛ"; element.appendChild(label);
          }
        }
      }
    }
    readerContent.appendChild(element);
  }
}

function openAssetDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("rko-local-assets", 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains("assets")) request.result.createObjectStore("assets", { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function putAsset(id, file) {
  const db = await openAssetDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("assets", "readwrite");
    transaction.objectStore("assets").put({ id, blob: file, name: file.name, type: file.type });
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
}

async function getAsset(id) {
  try {
    const db = await openAssetDb();
    return await new Promise((resolve, reject) => {
      const request = db.transaction("assets", "readonly").objectStore("assets").get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch { return null; }
}

async function clearLocalAssetStorage() {
  try {
    const db = await openAssetDb();
    await new Promise((resolve, reject) => {
      const transaction = db.transaction("assets", "readwrite");
      transaction.objectStore("assets").clear();
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
    showNotice("ЛОКАЛЬНЫЕ ФАЙЛЫ ОЧИЩЕНЫ", "success");
  } catch {
    showNotice("НЕ УДАЛОСЬ ОЧИСТИТЬ ФАЙЛЫ", "error");
  }
}

function lessonSequence(lessonId) {
  const found = findNode(savedStructure, lessonId);
  if (!found || found.item.type !== "lesson" || found.parent?.type !== "module") return [found?.item].filter(Boolean);
  return found.parent.children.filter((item) => item.type === "lesson" && isEffectivelyVisible(item.id));
}

function visibleModules() {
  const modules = [];
  const collect = (items) => items.forEach((item) => {
    if (!isEffectivelyVisible(item.id)) return;
    if (item.type === "module") modules.push(item);
    else if (item.children) collect(item.children);
  });
  collect(savedStructure);
  return modules;
}

function neighboringLesson(lessonId, direction) {
  const found = findNode(savedStructure, lessonId);
  if (!found || found.item.type !== "lesson" || found.parent?.type !== "module") return null;
  const currentLessons = lessonSequence(lessonId);
  const currentIndex = currentLessons.findIndex((item) => item.id === lessonId);
  const nearby = currentLessons[currentIndex + direction];
  if (nearby) return nearby;
  const modules = visibleModules();
  const moduleIndex = modules.findIndex((item) => item.id === found.parent.id);
  const nextModule = modules[moduleIndex + direction];
  if (!nextModule) return null;
  const nextLessons = (nextModule.children || []).filter((item) => item.type === "lesson" && isEffectivelyVisible(item.id));
  return direction > 0 ? nextLessons[0] || null : nextLessons[nextLessons.length - 1] || null;
}

function lessonLocation(lessonId) {
  const trail = hierarchyFor(lessonId) || [];
  return {
    module: [...trail].reverse().find((item) => item.type === "module") || null,
    section: [...trail].reverse().find((item) => item.type === "section") || null,
  };
}

function isLastModuleInSection(module) {
  if (!module) return false;
  const location = lessonLocation(module.children?.[0]?.id);
  const modules = location.section?.children?.filter((item) => item.type === "module" && isEffectivelyVisible(item.id)) || [];
  return modules.at(-1)?.id === module.id;
}

function markLessonVisited(lessonId) {
  lessonProgressState[lessonId] ??= "visited";
  saveLessonProgress();
}

function markLessonComplete(lessonId) {
  lessonProgressState[lessonId] = "completed";
  saveLessonProgress();
}

function renderLessonNavigation(lesson) {
  const lessons = lessonSequence(lesson.id);
  const currentIndex = Math.max(0, lessons.findIndex((item) => item.id === lesson.id));
  const previous = neighboringLesson(lesson.id, -1);
  const next = neighboringLesson(lesson.id, 1);
  const currentLocation = lessonLocation(lesson.id);
  const previousLocation = previous ? lessonLocation(previous.id) : null;
  const nextLocation = next ? lessonLocation(next.id) : null;
  previousLesson.disabled = !previous;
  previousLesson.textContent = !previous
    ? "← НАЗАД"
    : previousLocation?.module?.id !== currentLocation.module?.id
      ? (previousLocation?.section?.id !== currentLocation.section?.id ? "← ПРЕДЫДУЩИЙ РАЗДЕЛ" : "← ПРЕДЫДУЩИЙ МОДУЛЬ")
      : "← НАЗАД";
  const isLast = currentIndex >= lessons.length - 1;
  const isCompleted = lessonProgressState[lesson.id] === "completed";
  const previousIncomplete = lessons.slice(0, currentIndex).some((item) => lessonProgressState[item.id] !== "completed");
  const isLastModule = isLastModuleInSection(currentLocation.module);
  if (!isLast) nextLesson.textContent = "ДАЛЕЕ →";
  else if (previousIncomplete) nextLesson.textContent = "ПРОЙДИТЕ ПРЕДЫДУЩИЕ УРОКИ";
  else if (isCompleted && next) nextLesson.textContent = nextLocation?.section?.id !== currentLocation.section?.id ? "СЛЕДУЮЩИЙ РАЗДЕЛ →" : "СЛЕДУЮЩИЙ МОДУЛЬ →";
  else if (isCompleted) nextLesson.textContent = isLastModule ? "РАЗДЕЛ ЗАВЕРШЁН" : "МОДУЛЬ ЗАВЕРШЁН";
  else nextLesson.textContent = isLastModule ? "ЗАВЕРШИТЬ РАЗДЕЛ" : "ЗАВЕРШИТЬ МОДУЛЬ";
  nextLesson.disabled = isLast && (previousIncomplete || (isCompleted && !next));
  lessonProgress.innerHTML = "";
  lessons.forEach((item) => {
    const dot = document.createElement("span");
    dot.className = "progress-dot progress-dot--" + (lessonProgressState[item.id] || "new") + (item.id === lesson.id ? " is-current" : "");
    dot.title = item.title;
    lessonProgress.appendChild(dot);
  });
}

function openLessonEditor(id) {
  const found = findNode(draftStructure, id);
  if (!found || found.item.type !== "lesson") return;
  editorLessonId = id;
  editorDraft = clone(found.item);
  editorDraft.blocks ??= [];
  editorDraft.allowDownloads ??= false;
  editorOriginal = clone(editorDraft);
  const path = hierarchyFor(id, draftStructure) ?? [found.item];
  editorPath.textContent = path.map((item) => item.title).join("  /  ");
  lessonNameInput.value = editorDraft.title;
  allowDownloads.checked = editorDraft.allowDownloads;
  updateEditorVisibility();
  renderEditorBlocks();
  updateEditorState();
  setPage(editorPage);
}

function closeLessonEditor() {
  editorLessonId = null;
  editorDraft = null;
  editorOriginal = null;
  setPage(dashboardPage);
  dashboardMode = "admin";
  collapseAllStructure();
  renderStructure();
  adminMark.classList.add("is-admin-active");
  learningPanel.classList.remove("is-current");
  learningPanel.setAttribute("aria-hidden", "true");
  adminPanel.classList.add("is-current");
  adminPanel.setAttribute("aria-hidden", "false");
  requestAnimationFrame(updateTabIndicator);
}

function updateEditorVisibility() {
  const visible = Boolean(editorDraft?.visible);
  lessonVisibility.classList.toggle("is-on", visible);
  lessonVisibility.setAttribute("aria-pressed", String(visible));
  $("#lessonVisibilityLabel").textContent = visible ? "ДЛЯ ВСЕХ" : "ЗАКРЫТ";
}

function updateEditorState() {
  if (!editorDraft || !editorOriginal) return;
  const changed = JSON.stringify(editorDraft) !== JSON.stringify(editorOriginal);
  editorState.classList.toggle("is-changed", changed);
  editorState.lastChild.textContent = changed ? "ИЗМЕНЕНО" : "СОХРАНЕНО";
  saveLesson.classList.toggle("is-enabled", changed);
}

function renderEditorBlocks() {
  lessonBlocks.innerHTML = "";
  editorDraft.blocks.forEach((block) => {
    const row = document.createElement("div");
    row.className = `lesson-block lesson-block--${block.type}${blockDragId === block.id ? " is-dragging" : ""}${blockDragTargetId === block.id && blockDragId !== block.id ? " is-drag-target" : ""}${blockDragTargetId === block.id && blockDragAfter ? " is-drop-after" : ""}`;
    row.dataset.blockId = block.id;
    const label = { heading: "ЗАГОЛОВОК", text: "ТЕКСТ", image: "ИЗОБРАЖЕНИЕ", video: "ВИДЕО", audio: "АУДИО", file: "ФАЙЛ" }[block.type];
    row.innerHTML = `<button class="block-drag" type="button" aria-label="Переместить блок">⠿</button><strong class="block-label">${label}</strong><div class="block-editor"></div><button class="block-more" type="button" aria-label="Действия блока">•••</button><div class="block-menu"><button type="button" data-block-action="delete">УДАЛИТЬ</button></div>`;
    const editor = row.querySelector(".block-editor");
    if (block.type === "heading") renderHeadingBlock(editor, block);
    else if (block.type === "text") renderTextBlock(editor, block);
    else renderFileBlock(editor, block);
    lessonBlocks.appendChild(row);
  });
  updateEditorState();
}

function renderHeadingBlock(container, block) {
  const select = document.createElement("select");
  ["H1", "H2", "H3"].forEach((level) => {
    const option = document.createElement("option"); option.value = level.toLowerCase(); option.textContent = level; option.selected = block.level === option.value; select.appendChild(option);
  });
  const input = document.createElement("input");
  input.type = "text"; input.value = block.text || ""; input.placeholder = "Текст заголовка";
  select.addEventListener("change", () => { block.level = select.value; updateEditorState(); });
  input.addEventListener("input", () => { block.text = input.value; updateEditorState(); });
  container.append(select, input);
}

function renderTextBlock(container, block) {
  const toolbar = document.createElement("div");
  toolbar.className = "text-toolbar";
  toolbar.innerHTML = '<button type="button" data-command="bold"><b>B</b></button><button type="button" data-command="italic"><i>I</i></button><button type="button" data-command="createLink">ССЫЛКА</button><button type="button" data-command="insertUnorderedList">СПИСОК</button>';
  const area = document.createElement("div");
  area.className = "rich-text"; area.contentEditable = "true"; area.dataset.placeholder = "Введите текст урока"; area.innerHTML = block.html || "";
  const syncToolbar = () => {
    toolbar.querySelectorAll("[data-command]").forEach((button) => {
      const command = button.dataset.command;
      let active = false;
      if (["bold", "italic", "insertUnorderedList"].includes(command)) active = document.queryCommandState(command);
      if (command === "createLink") {
        const node = window.getSelection()?.anchorNode;
        active = Boolean(node?.parentElement?.closest("a"));
      }
      button.classList.toggle("is-active", active);
    });
  };
  toolbar.addEventListener("mousedown", (event) => {
    const button = event.target.closest("[data-command]");
    if (!button) return;
    event.preventDefault();
    area.focus();
    const command = button.dataset.command;
    const value = command === "createLink" ? window.prompt("Вставьте ссылку") : null;
    if (command !== "createLink" || value) document.execCommand(command, false, value);
    block.html = area.innerHTML;
    syncToolbar();
    updateEditorState();
  });
  ["input", "keyup", "mouseup", "focus"].forEach((eventName) => area.addEventListener(eventName, () => {
    block.html = area.innerHTML;
    syncToolbar();
    updateEditorState();
  }));
  syncToolbar();
  container.append(toolbar, area);
}

async function renderFileBlock(container, block) {
  const info = document.createElement("div");
  info.className = "file-block-info";
  const name = document.createElement("span");
  name.textContent = block.fileName || "Файл не выбран";
  const choose = document.createElement("button");
  choose.type = "button"; choose.textContent = block.fileName ? "ЗАМЕНИТЬ" : "ВЫБРАТЬ";
  const input = document.createElement("input");
  input.type = "file"; input.hidden = true;
  if (block.type === "image") input.accept = "image/*";
  if (block.type === "video") input.accept = "video/*";
  if (block.type === "audio") input.accept = "audio/*";
  choose.addEventListener("click", () => input.click());
  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) return;
    await putAsset(block.id, file);
    block.fileName = file.name;
    block.mime = file.type;
    renderEditorBlocks();
  });
  info.append(name, choose, input);
  container.appendChild(info);
  const asset = block.fileName ? await getAsset(block.id) : null;
  if (asset?.blob && (block.type === "image" || block.type === "video" || block.type === "audio")) {
    const preview = document.createElement(block.type === "image" ? "img" : block.type);
    preview.className = "block-preview";
    preview.src = URL.createObjectURL(asset.blob);
    if (block.type !== "image") preview.controls = true;
    container.appendChild(preview);
  }
}

function openBlockPicker() {
  blockPickerLayer.classList.add("is-visible");
  blockPickerLayer.setAttribute("aria-hidden", "false");
}

function closeBlockPicker() {
  blockPickerLayer.classList.remove("is-visible");
  blockPickerLayer.setAttribute("aria-hidden", "true");
}

function addLessonBlock(type) {
  const block = { id: uid("block"), type };
  if (type === "heading") Object.assign(block, { level: "h1", text: "" });
  if (type === "text") block.html = "";
  editorDraft.blocks.push(block);
  closeBlockPicker();
  renderEditorBlocks();
  requestAnimationFrame(() => lessonBlocks.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "center" }));
}

function beginBlockDrag(event, id) {
  event.preventDefault();
  event.stopPropagation();
  blockDragId = id;
  blockDragTargetId = id;
  blockDragAfter = false;
  document.body.classList.add("is-reordering");
  const sourceRow = lessonBlocks.querySelector(`[data-block-id="${id}"]`);
  dragGhost = createDragGhost(sourceRow?.querySelector(".block-label")?.textContent || "БЛОК");
  document.body.appendChild(dragGhost);
  sourceRow?.classList.add("is-dragging");
  const move = (moveEvent) => {
    moveEvent.preventDefault();
    moveGhost(moveEvent.clientX, moveEvent.clientY);
    autoScrollWhileDragging(moveEvent.clientY);
    const row = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY)?.closest(".lesson-block");
    if (row) {
      lessonBlocks.querySelectorAll(".lesson-block.is-drag-target").forEach((target) => target.classList.remove("is-drag-target", "is-drop-after"));
      blockDragTargetId = row.dataset.blockId;
      blockDragAfter = moveEvent.clientY > row.getBoundingClientRect().top + row.getBoundingClientRect().height / 2;
      if (blockDragTargetId !== blockDragId) {
        row.classList.add("is-drag-target");
        row.classList.toggle("is-drop-after", blockDragAfter);
      }
    }
  };
  const finish = () => {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", finish);
    document.removeEventListener("pointercancel", finish);
    const scrollTop = editorPage.scrollTop;
    const from = editorDraft.blocks.findIndex((block) => block.id === blockDragId);
    const to = editorDraft.blocks.findIndex((block) => block.id === blockDragTargetId);
    if (from >= 0 && to >= 0 && from !== to) {
      const [moved] = editorDraft.blocks.splice(from, 1);
      const insertAt = blockDragAfter ? (from < to ? to : to + 1) : (from < to ? to - 1 : to);
      editorDraft.blocks.splice(Math.max(0, insertAt), 0, moved);
    }
    blockDragId = null;
    blockDragTargetId = null;
    blockDragAfter = false;
    document.body.classList.remove("is-reordering");
    removeDragGhost();
    renderEditorBlocks();
    requestAnimationFrame(() => { editorPage.scrollTop = scrollTop; });
  };
  document.addEventListener("pointermove", move, { passive: false });
  document.addEventListener("pointerup", finish, { once: true });
  document.addEventListener("pointercancel", finish, { once: true });
}

function saveEditorLesson() {
  if (!editorDraft) return;
  editorDraft.title = lessonNameInput.value.trim() || "Без названия";
  editorDraft.allowDownloads = allowDownloads.checked;
  const found = findNode(draftStructure, editorLessonId);
  if (!found) return;
  Object.assign(found.item, clone(editorDraft));
  savedStructure = clone(draftStructure);
  baselineIds = collectIds(savedStructure);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedStructure));
  syncCourseToServer();
  editorOriginal = clone(editorDraft);
  renderStructure();
  renderCourse();
  updateEditorState();
  showNotice("УРОК СОХРАНЁН", "success");
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
authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const login = loginInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  let account = null;
  let authenticatedViaApi = false;
  try {
    const { response, body } = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ login, password }),
    });
    if (response.ok) {
      account = normalizeAccount(body.account);
      authenticatedViaApi = true;
      accountStore = normalizeAccounts([account, ...accountStore.filter((item) => item.login !== account.login)]);
    } else if (response.status === 401 || response.status === 400) {
      return triggerError();
    }
  } catch {}
  if (!account) account = accountStore.find((item) => item.login === login && item.password === password);
  if (!account) return triggerError();
  backendConnected = authenticatedViaApi;
  if (backendConnected) await hydrateFromServer(account);
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
  if (tab.dataset.tab === "accounts") renderAccounts();
}));
structureRows.addEventListener("click", (event) => {
  const row = event.target.closest(".structure-row");
  if (!row || editingId) return;
  const id = row.dataset.id;
  const action = event.target.closest("[data-action]")?.dataset.action;
  const menuAction = event.target.closest("[data-menu-action]")?.dataset.menuAction;
  if (menuAction) {
    if (menuAction === "edit") openLessonEditor(id);
    if (menuAction === "rename") startInlineRename(id, true);
    if (menuAction === "delete") openDeleteDialog(id);
    return;
  }
  if (action === "visibility") return toggleVisibility(id);
  if (action === "collapse") {
    const collapseButton = event.target.closest("[data-action='collapse']");
    const children = row.nextElementSibling?.classList.contains("structure-children") ? row.nextElementSibling : null;
    const willCollapse = !collapsedIds.has(id);
    willCollapse ? collapsedIds.add(id) : collapsedIds.delete(id);
    collapseButton?.classList.toggle("is-collapsed", willCollapse);
    children?.classList.toggle("is-collapsed", willCollapse);
    return;
  }
  if (action === "drag") return;
  if (action === "menu") {
    openMenuId = openMenuId === id ? null : id;
    renderStructure();
    return;
  }
  selectedId = selectedId === id ? null : id;
  openMenuId = null;
  renderStructure();
});
structureRows.addEventListener("pointerdown", (event) => {
  const handle = event.target.closest("[data-action='drag']");
  const row = event.target.closest(".structure-row");
  if (handle && row) beginStructureDrag(event, row.dataset.id);
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
  const clickedControl = event.target.closest("button, input, select, textarea, .action-menu, .structure-row");
  if (structureView?.classList.contains("is-current") && !clickedControl && (selectedId || openMenuId)) {
    selectedId = null;
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
courseGuideBack.addEventListener("click", () => {
  if (!coursePath.length) return;
  coursePath.pop();
  renderCourse();
});
readerBack.addEventListener("click", renderCourse);
previousLesson.addEventListener("click", () => {
  const previous = neighboringLesson(readerTitle.dataset.lessonId, -1);
  if (previous) openLessonReader(previous);
});
nextLesson.addEventListener("click", () => {
  const currentId = readerTitle.dataset.lessonId;
  const lessons = lessonSequence(currentId);
  const currentIndex = lessons.findIndex((item) => item.id === currentId);
  if (currentIndex < 0) return;
  const previousIncomplete = lessons.slice(0, currentIndex).some((item) => lessonProgressState[item.id] !== "completed");
  if (currentIndex >= lessons.length - 1 && previousIncomplete) {
    showNotice("СНАЧАЛА ПРОЙДИТЕ ПРЕДЫДУЩИЕ УРОКИ", "error");
    return;
  }
  markLessonComplete(currentId);
  const next = neighboringLesson(currentId, 1);
  if (next) openLessonReader(next);
  else {
    renderLessonNavigation(lessons[currentIndex]);
    const location = lessonLocation(currentId);
    showNotice(isLastModuleInSection(location.module) ? "РАЗДЕЛ ЗАВЕРШЁН" : "МОДУЛЬ ЗАВЕРШЁН", "success");
  }
});

editorBack.addEventListener("click", closeLessonEditor);
editorLogoutButton.addEventListener("click", () => logoutFrom(editorLogoutButton));
lessonNameInput.addEventListener("input", () => {
  if (!editorDraft) return;
  editorDraft.title = lessonNameInput.value;
  updateEditorState();
});
lessonVisibility.addEventListener("click", () => {
  if (!editorDraft) return;
  editorDraft.visible = !editorDraft.visible;
  updateEditorVisibility();
  updateEditorState();
});
allowDownloads.addEventListener("change", () => {
  if (!editorDraft) return;
  editorDraft.allowDownloads = allowDownloads.checked;
  updateEditorState();
});
addBlockButton.addEventListener("click", openBlockPicker);
blockPickerCancel.addEventListener("click", closeBlockPicker);
blockPickerLayer.addEventListener("click", (event) => { if (event.target === blockPickerLayer) closeBlockPicker(); });
blockOptions.forEach((button) => button.addEventListener("click", () => addLessonBlock(button.dataset.blockType)));
lessonBlocks.addEventListener("click", (event) => {
  const row = event.target.closest(".lesson-block");
  if (!row) return;
  if (event.target.closest(".block-more")) {
    row.classList.toggle("is-menu-open");
    return;
  }
  if (event.target.closest("[data-block-action='delete']")) {
    const scrollTop = editorPage.scrollTop;
    editorDraft.blocks = editorDraft.blocks.filter((block) => block.id !== row.dataset.blockId);
    renderEditorBlocks();
    requestAnimationFrame(() => { editorPage.scrollTop = scrollTop; });
  }
});
lessonBlocks.addEventListener("pointerdown", (event) => {
  const handle = event.target.closest(".block-drag");
  const row = event.target.closest(".lesson-block");
  if (handle && row) beginBlockDrag(event, row.dataset.blockId);
});
saveLesson.addEventListener("click", saveEditorLesson);
deleteLesson.addEventListener("click", () => openDeleteDialog(editorLessonId));
defaultVisibility.addEventListener("click", () => {
  platformSettings.newItemsVisible = !platformSettings.newItemsVisible;
  saveSettings();
  applyPlatformSettings();
  showNotice("НАСТРОЙКА СОХРАНЕНА", "success");
});
defaultDownloads.addEventListener("click", () => {
  platformSettings.newItemsAllowDownloads = !platformSettings.newItemsAllowDownloads;
  saveSettings();
  applyPlatformSettings();
  showNotice("НАСТРОЙКА СОХРАНЕНА", "success");
});
primaryColor.addEventListener("input", () => {
  platformSettings.primaryColor = primaryColor.value.toUpperCase();
  saveSettings();
  applyPlatformSettings();
});
secondaryColor.addEventListener("input", () => {
  platformSettings.secondaryColor = secondaryColor.value.toUpperCase();
  saveSettings();
  applyPlatformSettings();
});
resetColors.addEventListener("click", () => {
  platformSettings.primaryColor = DEFAULT_SETTINGS.primaryColor;
  platformSettings.secondaryColor = DEFAULT_SETTINGS.secondaryColor;
  saveSettings();
  applyPlatformSettings();
  showNotice("ЦВЕТА ВОССТАНОВЛЕНЫ", "success");
});
window.addEventListener("resize", updateTabIndicator);
logoutButton.addEventListener("click", () => logoutFrom(logoutButton));
accountName.addEventListener("click", () => { if (currentAccount) openAccountModal("profile", currentAccount); });
createAccountButton.addEventListener("click", () => {
  if (!isOwnerAccount(currentAccount)) {
    showNotice("НЕДОСТАТОЧНО ПРАВ", "error");
    return;
  }
  openAccountModal("create");
});
accountForm.addEventListener("submit", submitAccountForm);
studentAccountForm.addEventListener("submit", submitStudentAccountForm);
accountModalClose.addEventListener("click", closeAccountModal);
accountCancel.addEventListener("click", closeAccountModal);
studentAccountModalClose.addEventListener("click", closeAccountModal);
studentAccountCancel.addEventListener("click", closeAccountModal);
accountPasswordChange.addEventListener("click", openPasswordModal);
studentPasswordChange.addEventListener("click", openPasswordModal);
passwordModalClose.addEventListener("click", closePasswordModal);
passwordCancel.addEventListener("click", closePasswordModal);
passwordForm.addEventListener("submit", submitPasswordForm);
currentPasswordEye.addEventListener("click", () => {
  const reveal = currentPassword.type === "password";
  currentPassword.type = reveal ? "text" : "password";
  currentPasswordEye.setAttribute("aria-pressed", String(reveal));
  currentPasswordEye.setAttribute("aria-label", reveal ? "Скрыть старый пароль" : "Показать старый пароль");
});
function togglePasswordField(input, button, visibleLabel, hiddenLabel) {
  const reveal = input.type === "password";
  input.type = reveal ? "text" : "password";
  button.setAttribute("aria-pressed", String(reveal));
  button.setAttribute("aria-label", reveal ? hiddenLabel : visibleLabel);
}
newPasswordEye.addEventListener("click", () => togglePasswordField(newPassword, newPasswordEye, "Показать новый пароль", "Скрыть новый пароль"));
repeatPasswordEye.addEventListener("click", () => togglePasswordField(repeatPassword, repeatPasswordEye, "Показать повтор нового пароля", "Скрыть повтор нового пароля"));
passwordLayer.addEventListener("click", (event) => { if (event.target === passwordLayer) closePasswordModal(); });
accountDelete.addEventListener("click", () => {
  const account = accountStore.find((item) => item.login === editingAccountLogin);
  openAccountDeleteDialog(account);
});
accountLayer.addEventListener("click", (event) => { if (event.target === accountLayer) closeAccountModal(); });
accountPasswordEye.addEventListener("click", () => {
  const reveal = accountPassword.type === "password";
  accountPassword.type = reveal ? "text" : "password";
  accountPasswordEye.textContent = reveal ? "○" : "◉";
});
accountCourseAccess.addEventListener("click", () => {
  if (accountCourseAccess.disabled) return;
  const open = accountCourseAccess.getAttribute("aria-pressed") !== "true";
  accountCourseAccess.setAttribute("aria-pressed", String(open));
  accountCourseAccess.classList.toggle("is-on", open);
  accountCourseAccess.querySelector(".setting-switch-label").textContent = open ? "ОТКРЫТ" : "ЗАКРЫТ";
});

async function restoreSession() {
  applyPlatformSettings();
  renderCourse();
  renderStructure();
  try {
    const { response, body } = await apiRequest("/auth/session");
    if (response.ok && body?.account) {
      const account = normalizeAccount(body.account);
      backendConnected = true;
      accountStore = normalizeAccounts([account, ...accountStore.filter((item) => item.login !== account.login)]);
      await hydrateFromServer(account);
      splash.classList.add("is-gone");
      showDashboard(account);
      return;
    }
  } catch {}
  const savedSessionLogin = localStorage.getItem(SESSION_KEY);
  const savedSessionAccount = accountStore.find((account) => account.login === savedSessionLogin);
  if (savedSessionAccount) {
    splash.classList.add("is-gone");
    showDashboard(savedSessionAccount);
  } else showAuth();
}

restoreSession();
