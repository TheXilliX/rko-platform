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
const coniferWidget = $("#coniferWidget");
const coniferTreeButton = $("#coniferTreeButton");
const coniferMiniOrigin = $("#coniferMiniOrigin");
const coniferScene = $("#coniferScene");
const coniferBackButton = $("#coniferBackButton");
const readerBack = $("#readerBack");
const readerTitle = $("#readerTitle");
const readerContent = $("#readerContent");
const readerProgram = $("#readerProgram");
const readerProgramSection = $("#readerProgramSection");
const readerProgramList = $("#readerProgramList");
const structureRows = $("#structureRows");
const addButton = $("#addButton");
const saveStructure = $("#saveStructure");
const cancelStructure = $("#cancelStructure");
const structureDirtyIndicator = $("#structureDirtyIndicator");
const notice = $("#notice");
const confirmLayer = $("#confirmLayer");
const confirmKicker = $(".confirm-kicker", confirmLayer);
const confirmTitle = $("#confirmTitle");
const confirmCopy = $("#confirmCopy");
const confirmNo = $("#confirmNo");
const confirmYes = $("#confirmYes");
const exitConfirmLayer = $("#exitConfirmLayer");
const exitConfirmCopy = $("#exitConfirmCopy");
const exitConfirmCancel = $("#exitConfirmCancel");
const exitConfirmDiscard = $("#exitConfirmDiscard");
const exitConfirmSave = $("#exitConfirmSave");
const editorPage = $("#editorPage");
const offersPage = $("#offersPage");
const editorLogoutButton = $("#editorLogoutButton");
const editorRoleLabel = $("#editorRoleLabel");
const editorServiceLabel = $("#editorServiceLabel");
const editorBack = $("#editorBack");
const editorPath = $("#editorPath");
const lessonNameInput = $("#lessonNameInput");
const lessonBlocks = $("#lessonBlocks");
const addBlockButton = $("#addBlockButton");
const editorState = $("#editorState");
const editorDirtyIndicator = $("#editorDirtyIndicator");
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
const addLessonButton = $("#addLessonButton");
const allowWhenBlocked = $("#allowWhenBlocked");
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
const COLLAPSED_STORAGE_KEY = "rko-course-collapsed-v1";
const SETTINGS_KEY = "rko-platform-settings-v1";
const PROGRESS_KEY = "rko-lesson-progress-v1";
const READER_PROGRAM_COLLAPSED_KEY = "rko-reader-program-state-v2";
const DEFAULT_SETTINGS = {
  newItemsVisible: false,
  newItemsAllowDownloads: true,
  primaryColor: "#FFAE42",
  secondaryColor: "#2F7D57",
  club: {
    title: "Клуб Влад 2Hard",
    description: "Закрытое пространство для участников курса: общение, поддержка, разборы и рабочие обновления без лишнего шума.",
    telegram: "https://t.me/Vlad_2Hard",
    buttonText: "Закрытый чат",
    chatUrl: "https://t.me/+je1JF-48PyU3NzYy",
  },
  offers: [
    { id: "offers-rko", title: "РКО", content: "Актуальные предложения по расчётным счетам будут опубликованы здесь." },
    { id: "offers-debit", title: "Дебетовки", content: "Актуальные предложения по дебетовым картам будут опубликованы здесь." },
    { id: "offers-credit", title: "Кредитки", content: "Актуальные предложения по кредитным картам будут опубликованы здесь." },
    { id: "offers-mfo", title: "МФО", content: "Актуальные предложения МФО будут опубликованы здесь." },
  ],
  offersUpdatedAt: "2026-10-08",
  offersAllowWhenBlocked: true,
  clubAllowWhenBlocked: true,
};
const HIGHLIGHT_COLORS = [
  { name: "МЯГКИЙ ЗЕЛЁНЫЙ", value: "#DDEBDD" },
  { name: "ЯНТАРНЫЙ", value: "#F6E0B8" },
  { name: "СИНЕ-СЕРЫЙ", value: "#DCE5ED" },
  { name: "СВЕТЛО-СЕРЫЙ", value: "#E7E8E5" },
  { name: "МЯГКИЙ КРАСНЫЙ", value: "#F1D7D2" },
];
const CALLOUT_META = {
  important: { label: "ВАЖНО", icon: "!" },
  tip: { label: "ПОДСКАЗКА", icon: "?" },
  result: { label: "РЕЗУЛЬТАТ", icon: "✓" },
};
const CALLOUT_ICONS = ["!", "?", "✓"];
const CALLOUT_ICON_VARIANTS = { "!": "important", "?": "tip", "✓": "result" };
const CALLOUT_DEFAULT_COLOR = "#2F7D57";
const CALLOUT_COLORS = [
  { label: "ЗЕЛЁНЫЙ", value: "#2F7D57" },
  { label: "ЯНТАРНЫЙ", value: "#FFAE42" },
  { label: "СИНИЙ", value: "#5C7EA6" },
  { label: "СЕРЫЙ", value: "#71869B" },
  { label: "КРАСНЫЙ", value: "#B45D59" },
];
const HEADING_COLORS = [
  { label: "ПО УМОЛЧАНИЮ", value: "" },
  { label: "ЗЕЛЁНЫЙ", value: "#2F7D57" },
  { label: "ЯНТАРНЫЙ", value: "#FFAE42" },
  { label: "СИНИЙ", value: "#5C7EA6" },
  { label: "СЕРЫЙ", value: "#71869B" },
  { label: "КРАСНЫЙ", value: "#B45D59" },
];
const normalizeCalloutVariant = (variant) => CALLOUT_META[variant] ? variant : "important";
const normalizeCalloutIcon = (icon, variant = "important") => CALLOUT_ICONS.includes(icon) ? icon : CALLOUT_META[variant]?.icon || "!";
const normalizeCalloutColor = (color) => {
  const value = String(color || "").toUpperCase();
  return CALLOUT_COLORS.some((item) => item.value === value) ? value : CALLOUT_DEFAULT_COLOR;
};
function normalizeCalloutBlock(block) {
  block.variant = normalizeCalloutVariant(block.variant);
  const meta = CALLOUT_META[block.variant];
  if (!Object.prototype.hasOwnProperty.call(block, "label")) block.label = meta.label;
  block.label = String(block.label ?? "");
  block.icon = normalizeCalloutIcon(block.icon, block.variant);
  block.color = normalizeCalloutColor(block.color);
  block.html ??= "";
  return block;
}
function normalizeHeadingColor(color) {
  const value = String(color || "").toUpperCase();
  return HEADING_COLORS.some((item) => item.value === value) ? value : "";
}

function normalizeHeadingBlock(block) {
  block.level = ["h1", "h2", "h3", "h4", "h5", "h6"].includes(block.level) ? block.level : "h2";
  block.align = ["left", "center", "right"].includes(block.align) ? block.align : "left";
  block.color = normalizeHeadingColor(block.color);
  block.text ??= "";
  return block;
}

const API_BASE = "/api";
const IS_GITHUB_PREVIEW = window.location.hostname === "thexillix.github.io";
const GITHUB_PREVIEW_ACCOUNTS = [
  { id: "preview-owner", firstName: "Влад", lastName: "2Hard", login: "admin", telegram: "@Vlad_2Hard", role: "owner", courseAccess: true },
  { id: "preview-student", firstName: "Тестовый", lastName: "Ученик", login: "student-demo", telegram: "@student", role: "student", courseAccess: false },
];
let githubPreviewArchive = [{ id: "preview-archived", firstName: "Архивный", lastName: "Аккаунт", login: "archive-demo", telegram: "@archive", role: "student", courseAccess: false, createdAt: "2026-10-01T09:00:00Z", archivedAt: "2026-10-08T09:00:00Z" }];
const isOwnerAccount = (account) => account?.role === "owner";
const isStaffAccount = (account) => isOwnerAccount(account) || account?.role === "admin";
const sameAccount = (a, b) => Boolean(a && b && ((a.id && b.id && a.id === b.id) || (a.login && b.login && a.login === b.login)));
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
let pendingDeleteBlockId = null;
let pendingDeleteContext = "structure";
let openMenuId = null;
let pendingExitTarget = null;
let editingId = null;
let coursePath = [];
let collapsedIds = new Set();
let dragItemId = null;
let dragTargetId = null;
let animateStructureId = null;
let statusTransitionId = null;
let blockDragId = null;
let blockDragTargetId = null;
let blockDragAfter = false;
let dragGhost = null;
let editorLessonId = null;
let editorDraft = null;
let editorOriginal = null;
let platformSettings = loadSettings();
let lessonProgressState = {};
let readerProgramCollapsed = new Set();
let readerMediaUrls = [];
let readerRenderToken = 0;
let accountStore = [];
let pendingAuthenticatedAccount = null;
let pendingConsentState = null;
let accountModalMode = "profile";
let editingAccountLogin = null;
let pendingAccountLogin = null;
let pendingConfirmAction = null;
let passwordTargetAccount = null;
let passwordResetMode = false;
let savedStructure = loadSavedStructure();
let draftStructure = clone(savedStructure);
let baselineIds = collectIds(savedStructure);
let backendConnected = false;
let coniferPressCount = 0;
let coniferPressResetTimer;
let coniferRitualTimers = [];
let coniferHideTimer;
const CONIFER_REQUIRED_PRESSES = 5;
const CONIFER_PRESS_WINDOW = 6000;

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
  return [];
}

function normalizeAccounts(list) {
  const normalized = list.map(normalizeAccount);
  const owner = normalized.find((account) => isOwnerAccount(account))
    || normalized.find((account) => account.role === "admin");
  if (owner) owner.role = "owner";
  return normalized;
}

function saveAccounts() {
  // Accounts are server-owned. Never persist credentials or account records in the browser.
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
  [["#offersBlockedAccess", "offersAllowWhenBlocked", "ОФФЕРЫ"], ["#clubBlockedAccess", "clubAllowWhenBlocked", "КЛУБ"]].forEach(([selector, key, label]) => {
    const button = $(selector); if (!button) return;
    const open = platformSettings[key] !== false;
    button.classList.toggle("is-on", open); button.setAttribute("aria-pressed", String(open));
    button.querySelector(".setting-switch-label").textContent = `${label} ${open ? "ДОСТУПЕН" : "ЗАКРЫТ"}`;
  });
  if ($("#clubTitleSetting")) fillClubSettingsForm();
}

function loadSavedStructure() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return normalizeStructure(Array.isArray(stored) ? stored : clone(DEFAULT_STRUCTURE));
  } catch { return clone(DEFAULT_STRUCTURE); }
}

function collapsedStorageKey(account = currentAccount) {
  return COLLAPSED_STORAGE_KEY + ":" + (account?.login || "guest");
}

function loadCollapsedIds(account = currentAccount) {
  try {
    const stored = JSON.parse(localStorage.getItem(collapsedStorageKey(account)));
    return new Set(Array.isArray(stored) ? stored : []);
  } catch {
    return new Set();
  }
}

function saveCollapsedIds() {
  try {
    localStorage.setItem(collapsedStorageKey(), JSON.stringify([...collapsedIds]));
  } catch {}
}

function normalizeStructure(items) {
  items.forEach((item) => {
    if (item.type === "lesson") {
      if (!Array.isArray(item.blocks)) item.blocks = [];
      item.allowDownloads ??= false;
      item.allowWhenBlocked ??= false;
      item.blocks.forEach((block) => {
        if (block.type === "heading") normalizeHeadingBlock(block);
        if (block.type === "callout") normalizeCalloutBlock(block);
        if (block.type === "accordion") {
          block.title ??= "Раскрывающийся заголовок";
          block.html ??= "";
        }
      });
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

function clearConiferTimers() {
  coniferRitualTimers.forEach((timer) => window.clearTimeout(timer));
  coniferRitualTimers = [];
  window.clearTimeout(coniferPressResetTimer);
  window.clearTimeout(coniferHideTimer);
}

function resetConiferCult({ resetCount = true } = {}) {
  clearConiferTimers();
  coniferScene?.classList.remove("is-regalia-content", "is-regalia", "is-flight", "is-title", "is-awake");
  coniferMiniOrigin?.classList.remove("is-burst");
  coniferTreeButton?.classList.remove("is-pressing");
  coniferWidget?.classList.remove("is-fullscreen");
  if (resetCount) coniferPressCount = 0;
}

function setConiferAvailability(available) {
  if (!coniferWidget) return;
  if (!available) resetConiferCult();
  coniferWidget.classList.toggle("is-hidden", !available);
  coniferWidget.setAttribute("aria-hidden", String(!available));
}

function syncConiferAvailability() {
  const available = Boolean(
    currentAccount
      && dashboardMode === "learning"
      && coursePath.length === 0
      && !lessonReader?.classList.contains("is-visible")
      && dashboardPage?.classList.contains("is-active"),
  );
  setConiferAvailability(available);
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function randomizeConiferMiniPaths() {
  const cones = coniferMiniOrigin?.querySelectorAll(".conifer-mini-cone");
  if (!cones?.length) return;

  const mobile = window.matchMedia("(max-width: 650px)").matches;
  const width = Math.max(window.innerWidth || 0, 320);
  const height = Math.max(window.innerHeight || 0, 568);
  const maxRadius = mobile
    ? Math.min(210, Math.max(150, width * .42))
    : Math.min(250, Math.max(170, Math.min(width * .22, height * .3)));
  const minX = mobile ? -34 : -52;
  const maxX = mobile ? Math.min(220, width * .55) : Math.min(280, width * .24);
  const minY = -Math.min(mobile ? 190 : 220, height * .3);
  const maxY = mobile ? 42 : Math.min(58, height * .08);

  cones.forEach((cone) => {
    const angle = randomBetween(0, Math.PI * 2);
    const radius = randomBetween(maxRadius * .56, maxRadius);
    const x = Math.max(minX, Math.min(maxX, Math.cos(angle) * radius));
    const y = Math.max(minY, Math.min(maxY, Math.sin(angle) * radius));
    const rotation = randomBetween(-145, 145);
    cone.style.setProperty("--mini-x", `${Math.round(x)}px`);
    cone.style.setProperty("--mini-y", `${Math.round(y)}px`);
    cone.style.setProperty("--mini-r", `${Math.round(rotation)}deg`);
  });
}

function triggerConiferMiniBurst() {
  coniferMiniOrigin?.classList.remove("is-burst");
  void coniferMiniOrigin?.offsetWidth;
  coniferMiniOrigin?.classList.add("is-burst");
  window.setTimeout(() => coniferMiniOrigin?.classList.remove("is-burst"), 760);
}

function openConiferCult() {
  clearConiferTimers();
  coniferMiniOrigin?.classList.remove("is-burst");
  coniferWidget?.classList.add("is-fullscreen");
  coniferScene?.classList.remove("is-regalia-content", "is-regalia", "is-flight", "is-title", "is-awake");
  void coniferScene?.offsetWidth;
  coniferScene?.classList.add("is-awake", "is-flight");
  coniferTreeButton?.classList.remove("is-pressing");
  coniferRitualTimers.push(window.setTimeout(() => coniferScene?.classList.add("is-title"), 360));
  coniferRitualTimers.push(window.setTimeout(() => {
    coniferScene?.classList.remove("is-title");
    coniferScene?.classList.add("is-regalia");
  }, 1250));
  coniferRitualTimers.push(window.setTimeout(() => coniferScene?.classList.add("is-regalia-content"), 2050));
}

function closeConiferCult() {
  clearConiferTimers();
  coniferPressCount = 0;
  coniferScene?.classList.remove("is-regalia-content", "is-regalia", "is-flight", "is-title", "is-awake");
  coniferHideTimer = window.setTimeout(() => {
    coniferWidget?.classList.remove("is-fullscreen");
  }, 760);
}

function setPage(activePage) {
  [authPage, welcomePage, dashboardPage, editorPage, offersPage].forEach((page) => page.classList.toggle("is-active", page === activePage));
}

function showAuth({ skipIntro = false } = {}) {
  clearTransitionTimer();
  setConiferAvailability(false);
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

function openConsentLayer() {
  const layer = $("#consentLayer");
  ["#consentPersonalData", "#consentAgreement", "#consentAge"].forEach((selector) => { const input = $(selector); if (input) input.checked = false; });
  $("#consentSubmit").disabled = true;
  $("#consentError").textContent = "";
  layer.classList.add("is-visible");
  layer.setAttribute("aria-hidden", "false");
}

function closeConsentLayer() {
  const layer = $("#consentLayer");
  layer.classList.remove("is-visible");
  layer.setAttribute("aria-hidden", "true");
}

function showWelcome(account, consent = null) {
  if (consent?.required) {
    pendingAuthenticatedAccount = account;
    pendingConsentState = consent;
    openConsentLayer();
    return;
  }
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
  collapsedIds = loadCollapsedIds(account);
  readerProgramCollapsed = loadReaderProgramCollapsed(account);
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
  syncConiferAvailability();
  const lessonMatch = location.pathname.match(/^\/lesson\/([^/]+)$/);
  if (location.pathname === "/offers") {
    window.setTimeout(openOffers, 0);
  } else if (lessonMatch) {
    const found = findNode(savedStructure, decodeURIComponent(lessonMatch[1]));
    if (found?.item?.type === "lesson") window.setTimeout(() => openLessonReader(found.item, { historyMode: "replace" }), 0);
    else showNotice("ЭТОТ МАТЕРИАЛ ПОКА НЕДОСТУПЕН", "error");
  }
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
      fetch(`${API_BASE}/auth/logout`, { method: "POST", credentials: "include" }).catch(() => {});
      lessonProgressState = {};
      readerProgramCollapsed = new Set();
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
  if (nextMode === "admin") setConiferAvailability(false);
  outgoing.classList.add("is-leaving");
  incoming.classList.add("is-current");
  incoming.setAttribute("aria-hidden", "false");
  dashboardMode = nextMode;
  if (nextMode === "learning") syncConiferAvailability();
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
  const ids = collectIds(draftStructure);
  collapsedIds = new Set([...collapsedIds].filter((id) => ids.has(id)));
  saveCollapsedIds();
}

function updateTabIndicator() {
  const activeTab = $(".admin-tab.is-current");
  if (!activeTab) return;
  tabIndicator.style.width = `${activeTab.offsetWidth}px`;
  tabIndicator.style.transform = `translateX(${activeTab.offsetLeft}px)`;
}

function renderStructure() {
  const transitionId = statusTransitionId;
  structureRows.innerHTML = "";
  const fragment = document.createDocumentFragment();
  const appendRows = (items, depth = 0, ancestorHidden = false, container = fragment) => {
    items.forEach((item) => {
      const hiddenByParent = ancestorHidden || !item.visible;
      const status = statusFor(item);
      const row = document.createElement("div");
      row.className = "structure-row"
        + (selectedId === item.id ? " is-selected" : "")
        + (hiddenByParent ? " is-hidden-row" : "")
        + (dragTargetId === item.id ? " is-drag-target" : "");
      row.dataset.id = item.id;
      row.style.setProperty("--depth", depth);
      const canCollapse = item.type !== "lesson";
      const editorEnabled = item.type === "lesson";
      const editorDisabled = !editorEnabled;
      const eyeClass = item.visible ? "" : " is-closed";
      const eyeLabel = item.visible ? "Скрыть" : "Показать";
      const collapseMarkup = canCollapse
        ? '<button class="collapse-button' + (collapsedIds.has(item.id) ? ' is-collapsed' : '') + '" type="button" data-action="collapse" aria-label="' + (collapsedIds.has(item.id) ? 'Развернуть' : 'Свернуть') + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 10 4 4 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>'
        : '<span class="collapse-spacer"></span>';
      const editClass = "structure-icon-button lesson-edit-button" + (editorDisabled ? " is-disabled" : " is-active");
      row.innerHTML =
        '<div class="row-main"><button class="drag-handle" type="button" data-action="drag" aria-label="Переместить"><span class="drag-mark" aria-hidden="true">⠿</span></button>'
        + collapseMarkup
        + '<div class="row-select" data-action="select" role="button" tabindex="0" aria-pressed="' + (selectedId === item.id) + '"><span class="row-title"></span></div></div>'
        + '<span class="row-status row-status--' + status.tone + (transitionId === item.id ? " status-transition" : "") + '"><i></i><span>' + status.label + '</span></span>'
        + '<div class="row-actions" aria-label="Действия">'
        + '<button class="visibility-button" type="button" data-action="visibility" aria-label="' + eyeLabel + '"><svg class="eye-svg' + eyeClass + '" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="2.6" stroke="currentColor" stroke-width="1.5"/><path class="eye-slash" d="M4 4l16 16" stroke="currentColor" stroke-width="1.5"/></svg></button>'
        + '<button class="structure-icon-button rename-button" type="button" data-action="rename" aria-label="Переименовать"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 16.5V20h3.5L18.8 8.7l-3.5-3.5L4 16.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="m14.2 6.7 3.5 3.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></button>'
        + '<button class="' + editClass + '" type="button" data-action="edit" aria-label="Открыть редактор урока"' + (editorDisabled ? " disabled" : "") + '><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 3.5h9l5 5V20.5H5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 3.5v5h5M9 16.5l4.9-4.9 2.1 2.1-4.9 4.9L9 19zM13.9 11.6l1.2-1.2 2.1 2.1-1.2 1.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg></button>'
        + '<button class="structure-icon-button delete-button" type="button" data-action="delete" aria-label="Удалить"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7h14M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>'
        + '</div>';
      row.querySelector(".row-title").textContent = item.title;
      container.appendChild(row);
      if (item.children) {
        const children = document.createElement("div");
        children.className = "structure-children"
          + (collapsedIds.has(item.id) || animateStructureId === item.id ? " is-collapsed" : "");
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
    empty.textContent = "СТРУКТУРА ПОКА ПУСТА. НАЖМИ «+ РАЗДЕЛ / МОДУЛЬ», ЧТОБЫ СОЗДАТЬ РАЗДЕЛ.";
    fragment.appendChild(empty);
  }
  structureRows.appendChild(fragment);
  if (animateStructureId) {
    const opening = structureRows.querySelector('[data-id="' + animateStructureId + '"]')?.nextElementSibling;
    requestAnimationFrame(() => opening?.classList.remove("is-collapsed"));
    animateStructureId = null;
  }
  statusTransitionId = null;
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
  structureDirtyIndicator?.classList.toggle("is-visible", changed);
  structureView?.classList.toggle("has-unsaved", changed);
  const selected = selectedId ? findNode(draftStructure, selectedId)?.item : null;
  const canAddLesson = Boolean(selected && (selected.type === "section" || selected.type === "module" || selected.type === "lesson"));
  addLessonButton.disabled = !canAddLesson;
  addLessonButton.setAttribute("aria-disabled", String(!canAddLesson));
}

function addItem() {
  const target = selectedId ? findNode(draftStructure, selectedId) : null;
  let newItem;
  let parentToExpand = null;
  if (!target) {
    newItem = { id: uid("section"), type: "section", title: "Новый раздел", visible: platformSettings.newItemsVisible, children: [] };
    draftStructure.push(newItem);
  } else if (target.item.type === "section") {
    parentToExpand = target.item;
    newItem = { id: uid("module"), type: "module", title: "Новый модуль", visible: platformSettings.newItemsVisible, children: [] };
    target.item.children ??= [];
    target.item.children.push(newItem);
  } else {
    const moduleNode = target.item.type === "module"
      ? target
      : target.parent?.type === "module"
        ? findNode(draftStructure, target.parent.id)
        : null;
    if (!moduleNode) {
      showNotice("ВЫБЕРИ РАЗДЕЛ ИЛИ МОДУЛЬ", "error");
      return;
    }
    newItem = { id: uid("module"), type: "module", title: "Новый модуль", visible: platformSettings.newItemsVisible, children: [] };
    const index = moduleNode.siblings.findIndex((item) => item.id === moduleNode.item.id);
    moduleNode.siblings.splice(index + 1, 0, newItem);
    parentToExpand = moduleNode.parent || moduleNode.item;
  }
  if (parentToExpand) collapsedIds.delete(parentToExpand.id);
  saveCollapsedIds();
  selectedId = newItem.id;
  statusTransitionId = newItem.id;
  renderStructure();
  startInlineRename(newItem.id, true);
}

function addLesson() {
  const target = selectedId ? findNode(draftStructure, selectedId) : null;
  if (!target || !["section", "module", "lesson"].includes(target.item.type)) {
    showNotice("СНАЧАЛА ВЫБЕРИ РАЗДЕЛ, МОДУЛЬ ИЛИ УРОК", "error");
    return;
  }
  const newItem = { id: uid("lesson"), type: "lesson", title: "Новый урок", visible: platformSettings.newItemsVisible, allowDownloads: platformSettings.newItemsAllowDownloads, blocks: [] };
  if (target.item.type === "lesson") {
    const index = target.siblings.findIndex((item) => item.id === target.item.id);
    target.siblings.splice(index + 1, 0, newItem);
    if (target.parent) collapsedIds.delete(target.parent.id);
  } else {
    target.item.children ??= [];
    target.item.children.push(newItem);
    collapsedIds.delete(target.item.id);
  }
  saveCollapsedIds();
  selectedId = newItem.id;
  statusTransitionId = newItem.id;
  renderStructure();
  startInlineRename(newItem.id, true);
}

function startInlineRename(id, selectAll = false) {
  const found = findNode(draftStructure, id);
  const row = structureRows.querySelector(`[data-id="${id}"]`);
  if (!found || !row) return;
  editingId = id;
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
    if (commit && value && value !== found.item.title) {
      found.item.title = value;
      statusTransitionId = id;
    }
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
  statusTransitionId = id;
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
  if (source.item.type === "lesson" && target.item.type === "section") {
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

function openBlockDeleteDialog(id) {
  const block = editorDraft?.blocks?.find((item) => item.id === id);
  if (!block) return;
  pendingDeleteBlockId = id;
  pendingDeleteContext = "block";
  pendingConfirmAction = null;
  confirmCopy.textContent = "Удалить этот блок урока?";
  confirmKicker.textContent = "УДАЛЕНИЕ";
  confirmTitle.textContent = "УДАЛИТЬ БЛОК?";
  confirmLayer.classList.add("is-visible");
  confirmLayer.setAttribute("aria-hidden", "false");
  window.setTimeout(() => confirmNo.focus(), 100);
}

function openDeleteDialog(id) {
  const found = findNode(draftStructure, id);
  if (!found) return;
  pendingDeleteId = id;
  pendingDeleteContext = editorLessonId === id && editorPage.classList.contains("is-active") ? "editor" : "structure";
  pendingConfirmAction = null;
  openMenuId = null;
  confirmCopy.textContent = `Удалить «${found.item.title}»${found.item.children?.length ? " вместе со всем содержимым" : ""}?`;
  confirmKicker.textContent = "УДАЛЕНИЕ";
  confirmTitle.textContent = "УДАЛИТЬ ЭЛЕМЕНТ?";
  confirmLayer.classList.add("is-visible");
  confirmLayer.setAttribute("aria-hidden", "false");
  window.setTimeout(() => confirmNo.focus(), 100);
}

function openAccountDeleteDialog(account) {
  if (!account || !currentAccount || !isStaffAccount(currentAccount) || sameAccount(account, currentAccount) || isOwnerAccount(account)) return;
  if (account.role === "admin" && !isOwnerAccount(currentAccount)) return;
  pendingAccountLogin = account.login;
  pendingDeleteContext = "account";
  pendingConfirmAction = null;
  confirmCopy.textContent = `Переместить аккаунт «${accountDisplayName(account)}» в архив? Вход будет сразу заблокирован.`;
  confirmKicker.textContent = "АРХИВ";
  confirmTitle.textContent = "ПЕРЕМЕСТИТЬ В АРХИВ?";
  confirmLayer.classList.add("is-visible");
  confirmLayer.setAttribute("aria-hidden", "false");
  window.setTimeout(() => confirmNo.focus(), 100);
}

function closeDeleteDialog() {
  pendingDeleteId = null;
  pendingDeleteBlockId = null;
  pendingAccountLogin = null;
  pendingDeleteContext = "structure";
  pendingConfirmAction = null;
  confirmKicker.textContent = "УДАЛЕНИЕ";
  confirmTitle.textContent = "УДАЛИТЬ ЭЛЕМЕНТ?";
  confirmLayer.classList.remove("is-visible");
  confirmLayer.setAttribute("aria-hidden", "true");
}

async function deletePending() {
  if (pendingDeleteContext === "account") {
    const account = accountStore.find((item) => item.login === pendingAccountLogin);
    const canDelete = account && !sameAccount(account, currentAccount) && !isOwnerAccount(account)
      && (account.role !== "admin" || isOwnerAccount(currentAccount));
    if (canDelete) {
      if (backendConnected && account.id) {
        const { response } = await apiRequest("/accounts/" + account.id, { method: "DELETE" });
        if (!response.ok) {
          closeDeleteDialog();
          showNotice("НЕ УДАЛОСЬ УДАЛИТЬ АККАУНТ", "error");
          return;
        }
      }
      if (IS_GITHUB_PREVIEW) githubPreviewArchive.unshift({ ...account, archivedAt: new Date().toISOString(), createdAt: account.createdAt || new Date().toISOString() });
      accountStore = accountStore.filter((item) => item !== account);
      saveAccounts();
      renderAccounts();
      closeDeleteDialog();
      closeAccountModal();
      showNotice("АККАУНТ ПЕРЕМЕЩЁН В АРХИВ", "success");
    } else closeDeleteDialog();
    return;
  }
  if (pendingDeleteContext === "block") {
    const blockId = pendingDeleteBlockId;
    const scrollTop = editorPage.scrollTop;
    if (editorDraft) editorDraft.blocks = editorDraft.blocks.filter((block) => block.id !== blockId);
    closeDeleteDialog();
    renderEditorBlocks();
    requestAnimationFrame(() => { editorPage.scrollTop = scrollTop; });
    showNotice("БЛОК УДАЛЁН", "success");
    return;
  }
  const context = pendingDeleteContext;
  const deletingId = pendingDeleteId;
  const found = findNode(draftStructure, deletingId);
  if (found) found.siblings.splice(found.siblings.findIndex((item) => item.id === deletingId), 1);
  if (context === "editor") {
    const persisted = findNode(savedStructure, deletingId);
    if (persisted) {
      persisted.siblings.splice(persisted.siblings.findIndex((item) => item.id === deletingId), 1);
      baselineIds = collectIds(savedStructure);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedStructure));
      syncCourseToServer();
    }
    editorLessonId = null;
    editorDraft = null;
    editorOriginal = null;
  }
  if (selectedId === deletingId) selectedId = null;
  closeDeleteDialog();
  saveCollapsedIds();
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
  saveCollapsedIds();
  renderStructure();
  coursePath = [];
  renderCourse();
  showNotice("ИЗМЕНЕНИЯ СОХРАНЕНЫ", "success");
}

function cancelDraft() {
  if (JSON.stringify(draftStructure) === JSON.stringify(savedStructure)) return;
  draftStructure = clone(savedStructure);
  selectedId = null;
  renderStructure();
  showNotice("ИЗМЕНЕНИЯ ОТМЕНЕНЫ");
}

function hasUnsavedStructureChanges() {
  return JSON.stringify(draftStructure) !== JSON.stringify(savedStructure);
}

function hasUnsavedEditorChanges() {
  return Boolean(editorDraft && editorOriginal && JSON.stringify(editorDraft) !== JSON.stringify(editorOriginal));
}

function openExitConfirm() {
  if (!exitConfirmLayer) return;
  exitConfirmLayer.dataset.mode = "structure";
  exitConfirmCopy.textContent = "У вас есть несохранённые изменения. Что сделать перед выходом?";
  exitConfirmLayer.classList.add("is-visible");
  exitConfirmLayer.setAttribute("aria-hidden", "false");
  window.setTimeout(() => exitConfirmCancel?.focus(), 100);
}

function openEditorExitConfirm() {
  if (!exitConfirmLayer) return;
  exitConfirmLayer.dataset.mode = "editor";
  exitConfirmCopy.textContent = "В уроке есть несохранённые изменения. Что сделать перед выходом?";
  exitConfirmLayer.classList.add("is-visible");
  exitConfirmLayer.setAttribute("aria-hidden", "false");
  window.setTimeout(() => exitConfirmCancel?.focus(), 100);
}

function closeExitConfirm() {
  exitConfirmLayer?.classList.remove("is-visible");
  exitConfirmLayer?.setAttribute("aria-hidden", "true");
  if (exitConfirmLayer) delete exitConfirmLayer.dataset.mode;
}

function leaveAdmin({ save = false } = {}) {
  if (save) saveDraft();
  else if (hasUnsavedStructureChanges()) cancelDraft();
  closeExitConfirm();
  setDashboardMode("learning");
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
    row.innerHTML = `<div class="account-card-main"><span class="account-card-type"></span><h3 class="account-card-name"></h3></div><div class="account-card-meta"><span class="account-card-telegram"></span><span class="account-card-status"></span><button class="account-consents-action" type="button">СОГЛАСИЯ</button><button class="account-card-action" type="button">НАСТРОЙКИ</button></div>`;
    row.querySelector(".account-card-type").textContent = isOwnerAccount(account) ? "ВЛАДЕЛЕЦ" : account.role === "admin" ? "АДМИНИСТРАТОР" : "УЧЕНИК";
    row.querySelector(".account-card-name").textContent = accountDisplayName(account);
    row.querySelector(".account-card-telegram").textContent = account.telegram || "TELEGRAM";
    const status = row.querySelector(".account-card-status");
    status.textContent = isStaffAccount(account) || account.courseAccess !== false ? "ДОСТУП ОТКРЫТ" : "ДОСТУП ЗАКРЫТ";
    status.classList.toggle("is-blocked", !isStaffAccount(account) && account.courseAccess === false);
    row.querySelector(".account-card-action").addEventListener("click", () => openAccountModal("profile", account));
    row.querySelector(".account-consents-action").addEventListener("click", () => openConsentsFor(account));
    accountsList.appendChild(row);
  });
}

function openAccountModal(mode, account = null) {
  accountModalMode = mode;
  editingAccountLogin = account?.login || null;
  const isCreate = mode === "create";
  const isOwnProfile = mode === "self" && !isCreate && account === currentAccount;
  const isOwnStudent = isOwnProfile && !isStaffAccount(account);
  const ownerProtected = !isCreate && isOwnerAccount(account) && !isOwnerAccount(currentAccount);
  const staffReadOnly = !isCreate && isStaffAccount(currentAccount) && !sameAccount(account, currentAccount) && !isOwnerAccount(currentAccount);
  accountForm.hidden = isOwnProfile;
  studentAccountForm.hidden = !isOwnProfile;
  accountForm.classList.toggle("account-modal--own", !isCreate && sameAccount(account, currentAccount));
  accountForm.classList.toggle("account-modal--readonly", staffReadOnly || ownerProtected);
  if (isOwnProfile) {
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
  accountPassword.value = "";
  accountPasswordChange.hidden = isCreate;
  accountRole.value = account?.role || "student";
  accountRole.closest("label").hidden = !isCreate && account === currentAccount && !isStaffAccount(account);
  const isOwnAccount = !isCreate && sameAccount(account, currentAccount);
  accountLogin.closest("label").hidden = isOwnProfile;
  accountPassword.closest("label").hidden = !isCreate;
  accountRole.closest("label").hidden = isOwnProfile;
  accountCourseAccess.closest(".account-access-toggle").hidden = isOwnProfile;
  const canChangeRole = isCreate ? isOwnerAccount(currentAccount) : isOwnerAccount(currentAccount) && account && !sameAccount(account, currentAccount);
  accountRole.disabled = !canChangeRole;
  const accessOpen = isStaffAccount(account) ? true : account?.courseAccess !== false;
  accountCourseAccess.setAttribute("aria-pressed", String(accessOpen));
  accountCourseAccess.classList.toggle("is-on", accessOpen);
  accountCourseAccess.querySelector(".setting-switch-label").textContent = accessOpen ? "ОТКРЫТ" : "ЗАКРЫТ";
  accountCourseAccess.disabled = (!isCreate && !(isStaffAccount(currentAccount) && account && !sameAccount(account, currentAccount))) || isStaffAccount(account);
  accountLogin.disabled = isOwnProfile || ownerProtected;
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
  accountDelete.hidden = isCreate || !currentAccount || !isStaffAccount(currentAccount) || sameAccount(account, currentAccount) || isOwnerAccount(account) || (account?.role === "admin" && !isOwnerAccount(currentAccount));
  accountLayer.classList.add("is-visible");
  accountLayer.setAttribute("aria-hidden", "false");
}

function openPasswordModal() {
  passwordTargetAccount = accountStore.find((item) => item.login === editingAccountLogin) || currentAccount;
  if (!passwordTargetAccount) return;
  const isSameAccount = sameAccount(passwordTargetAccount, currentAccount);
  if (!isSameAccount && !isOwnerAccount(currentAccount)) {
    showNotice("НЕДОСТАТОЧНО ПРАВ", "error");
    return;
  }
  passwordResetMode = isOwnerAccount(currentAccount) && !isSameAccount;
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

function openPasswordResetConfirm() {
  const account = accountStore.find((item) => item.login === editingAccountLogin);
  if (!account || !currentAccount || !isOwnerAccount(currentAccount) || sameAccount(account, currentAccount)) {
    openPasswordModal();
    return;
  }
  pendingAccountLogin = account.login;
  pendingDeleteContext = "account";
  pendingConfirmAction = "password-reset";
  confirmKicker.textContent = "СБРОС ПАРОЛЯ";
  confirmTitle.textContent = "ВЫ ТОЧНО ХОТИТЕ СБРОСИТЬ ПАРОЛЬ?";
  confirmCopy.textContent = `Для аккаунта «${accountDisplayName(account)}» будет создан новый пароль.`;
  confirmLayer.classList.add("is-visible");
  confirmLayer.setAttribute("aria-hidden", "false");
  window.setTimeout(() => confirmNo.focus(), 100);
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
  }
  if (!accountRole.disabled) {
    const nextRole = accountRole.value;
    const canAssignRole = isOwnerAccount(currentAccount) || account.role !== "admin";
    if (canAssignRole && !isOwnerAccount(account)) account.role = nextRole;
  }
  if (!accountCourseAccess.disabled && !isStaffAccount(account)) account.courseAccess = accountCourseAccess.getAttribute("aria-pressed") === "true";
  if (backendConnected && account.id) {
    const ownProfile = sameAccount(account, currentAccount);
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
    if (sameAccount(currentAccount, account)) currentAccount = account;
  }
  if (!isOwnStudent && sameAccount(currentAccount, account) && previousLogin !== login) {
    const previousProgressKey = `${PROGRESS_KEY}:${previousLogin}`;
    const nextProgressKey = `${PROGRESS_KEY}:${login}`;
    const previousProgress = localStorage.getItem(previousProgressKey);
    if (previousProgress) localStorage.setItem(nextProgressKey, previousProgress);
    localStorage.removeItem(previousProgressKey);
  }
  saveAccounts();
  if (sameAccount(currentAccount, account)) {
    currentAccount = account;
    accountName.textContent = displayAccountFirstName(account);
  }
  renderAccounts();
  closeAccountModal();
  showNotice("АККАУНТ СОХРАНЁН", "success");
}

async function submitStudentAccountForm(event) {
  event.preventDefault();
  if (!currentAccount) return;
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

function setLearningTitle(title = "РКО Влад 2Hard") {
  const value = String(title || "РКО Влад 2Hard").trim() || "РКО Влад 2Hard";
  learningTitle.textContent = value;
}

function transitionLearningTitle(title = "РКО Влад 2Hard") {
  const value = String(title || "РКО Влад 2Hard").trim() || "РКО Влад 2Hard";
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
  syncConiferAvailability();
  courseBrowser.classList.remove("is-hidden");
  lessonReader.classList.remove("is-visible");
  lessonReader.setAttribute("aria-hidden", "true");
  readerRenderToken += 1;
  clearReaderMediaUrls();
  learningTitle.classList.remove("is-reader-hidden");
  $("#learningActions")?.classList.toggle("is-hidden", coursePath.length > 0);
  const currentPlace = coursePath.length ? findNode(savedStructure, coursePath.at(-1))?.item.title : "РКО Влад 2Hard";
  transitionLearningTitle(currentPlace);
  courseList.classList.add("is-changing");
  window.setTimeout(() => {
    const items = courseItemsAtPath();
    courseList.innerHTML = "";
    const courseBlocked = currentAccount?.courseAccess === false;
    courseInstruction.textContent = courseBlocked && coursePath.length > 0
      ? "ДОСТУП К МАТЕРИАЛАМ ОГРАНИЧЕН АДМИНИСТРАТОРОМ."
      : coursePath.length === 0 ? "ВЫБЕРИ РАЗДЕЛ, ЧТОБЫ ПЕРЕЙТИ К МОДУЛЯМ КУРСА." : coursePath.length === 1 ? "ВЫБЕРИ МОДУЛЬ, ЧТОБЫ ПЕРЕЙТИ К УРОКАМ И МАТЕРИАЛАМ КУРСА." : "ВЫБЕРИ УРОК, ЧТОБЫ ПЕРЕЙТИ К МАТЕРИАЛАМ.";
    courseGuideBack.classList.toggle("is-visible", coursePath.length > 0);
    items.forEach((item, index) => {
      const structurallyVisible = isEffectivelyVisible(item.id);
      const accessible = item.type === "section"
        ? true
        : item.type === "module"
          ? structurallyVisible && !courseBlocked
          : structurallyVisible && (!courseBlocked || item.allowWhenBlocked === true);
      const visuallyLocked = !accessible;
      const button = document.createElement("button");
      const progress = lessonProgressFor(item);
      button.className = `course-row${visuallyLocked ? " is-locked" : ""}${accessible ? "" : " is-denied-row"} course-row--${progress}`;
      button.type = "button";
      button.dataset.courseId = item.id;
      button.innerHTML = `<span class="course-number">[${String(index + 1).padStart(2, "0")}]</span><span class="course-name"></span><span class="course-state" aria-hidden="true"></span><span class="course-arrow">→</span>`;
      button.querySelector(".course-name").textContent = item.title;
      courseList.appendChild(button);
    });
    courseList.classList.remove("is-changing");
    syncConiferAvailability();
  }, 90);
}

function handleCourseClick(event) {
  const row = event.target.closest("[data-course-id]");
  if (!row) return;
  const id = row.dataset.courseId;
  const found = findNode(savedStructure, id);
  const courseBlocked = currentAccount?.courseAccess === false;
  const structurallyVisible = found ? isEffectivelyVisible(id) : false;
  const unavailable = !found
    || (found.item.type === "module" && (!structurallyVisible || courseBlocked))
    || (found.item.type === "lesson" && (!structurallyVisible || (courseBlocked && found.item.allowWhenBlocked !== true)));
  if (unavailable) {
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


function readerProgramStorageKey(account = currentAccount) {
  return READER_PROGRAM_COLLAPSED_KEY + ":" + (account?.login || "guest");
}

function loadReaderProgramCollapsed(account = currentAccount) {
  try {
    const stored = JSON.parse(localStorage.getItem(readerProgramStorageKey(account)) || "[]");
    return new Set(Array.isArray(stored) ? stored : []);
  } catch {
    return new Set();
  }
}

function saveReaderProgramCollapsed() {
  try {
    localStorage.setItem(readerProgramStorageKey(), JSON.stringify([...readerProgramCollapsed]));
  } catch {}
}

function countReaderLessons(item) {
  if (!item) return 0;
  if (item.type === "lesson") return 1;
  return (item.children || []).reduce((total, child) => total + countReaderLessons(child), 0);
}

function renderReaderProgram(currentLessonId) {
  if (!readerProgramList) return;
  readerProgramList.innerHTML = "";

  const path = hierarchyFor(currentLessonId) || [];
  const section = path.find((item) => item.type === "section") || path[0];
  const currentModule = path.find((item) => item.type === "module") || null;
  if (readerProgramSection) readerProgramSection.textContent = section?.title || "";
  if (!section) return;

  const visibleChildren = (section.children || [])
    .filter((child) => child.visible !== false && isEffectivelyVisible(child.id));
  const moduleIds = visibleChildren.filter((child) => child.type === "module").map((child) => child.id);

  // Keep the current module open, but collapse every other module whenever
  // the reader is opened or the lesson changes.
  const nextCollapsed = new Set(readerProgramCollapsed);
  moduleIds.forEach((id) => {
    if (id === currentModule?.id) nextCollapsed.delete(id);
    else nextCollapsed.add(id);
  });
  readerProgramCollapsed = nextCollapsed;
  saveReaderProgramCollapsed();

  const appendLesson = (lesson, host) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "reader-program-lesson";
    button.dataset.programLesson = lesson.id;
    button.classList.toggle("is-current", lesson.id === currentLessonId);
    button.innerHTML = '<span class="reader-program-lesson-title"></span>';
    button.querySelector(".reader-program-lesson-title").textContent = lesson.title || "БЕЗ НАЗВАНИЯ";
    button.setAttribute("aria-current", lesson.id === currentLessonId ? "page" : "false");
    host.appendChild(button);
  };

  const appendGroup = (item, host, depth = 0) => {
    const children = (item.children || [])
      .filter((child) => child.visible !== false && isEffectivelyVisible(child.id));
    if (!children.length) return;

    const group = document.createElement("section");
    group.className = "reader-program-group reader-program-group--" + item.type;
    group.dataset.programGroup = item.id;
    group.dataset.depth = String(depth);

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "reader-program-toggle";
    toggle.dataset.programToggle = item.id;
    const expanded = !readerProgramCollapsed.has(item.id);
    toggle.setAttribute("aria-expanded", String(expanded));
    toggle.innerHTML = '<span class="reader-program-chevron" aria-hidden="true"></span><span class="reader-program-group-title"></span>';
    toggle.querySelector(".reader-program-group-title").textContent = item.title || "БЕЗ НАЗВАНИЯ";

    const childList = document.createElement("div");
    childList.className = "reader-program-children";
    childList.classList.toggle("is-collapsed", !expanded);
    children.forEach((child) => {
      if (child.type === "lesson") appendLesson(child, childList);
      else appendGroup(child, childList, depth + 1);
    });
    group.append(toggle, childList);
    host.appendChild(group);
  };

  visibleChildren.forEach((item) => {
    if (item.type === "lesson") appendLesson(item, readerProgramList);
    else appendGroup(item, readerProgramList, 0);
  });
}

function openLessonReader(lesson, { historyMode = "push" } = {}) {
  const courseBlocked = currentAccount?.courseAccess === false;
  if (!isEffectivelyVisible(lesson.id) || (courseBlocked && lesson.allowWhenBlocked !== true)) {
    showNotice("ЭТОТ МАТЕРИАЛ ПОКА НЕДОСТУПЕН", "error");
    return;
  }
  const hierarchy = hierarchyFor(lesson.id) ?? [lesson];
  markLessonVisited(lesson.id);
  courseBrowser.classList.add("is-hidden");
  learningTitle.classList.add("is-reader-hidden");
  lessonReader.classList.add("is-visible");
  lessonReader.setAttribute("aria-hidden", "false");
  lessonReader.scrollTop = 0;
  requestAnimationFrame(() => { lessonReader.scrollTop = 0; });
  syncConiferAvailability();
  readerTitle.textContent = lesson.title;
  readerTitle.dataset.lessonId = lesson.id;
  const nextUrl = `/lesson/${encodeURIComponent(lesson.id)}`;
  if (historyMode === "replace") history.replaceState({ lessonId: lesson.id }, "", nextUrl);
  else if (location.pathname !== nextUrl) history.pushState({ lessonId: lesson.id }, "", nextUrl);
  renderLessonNavigation(lesson);
  renderReaderProgram(lesson.id);
  renderReaderBlocks(lesson.blocks ?? [], lesson.allowDownloads);
}


function formatMediaTime(value) {
  const seconds = Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
  const minutes = Math.floor(seconds / 60);
  const remainder = String(seconds % 60).padStart(2, "0");
  return minutes + ":" + remainder;
}

function clearReaderMediaUrls() {
  readerMediaUrls.forEach((url) => {
    try { URL.revokeObjectURL(url); } catch {}
  });
  readerMediaUrls = [];
}

function createReaderMediaPlayer(type, url) {
  const player = document.createElement("div");
  player.className = "reader-media-player";
  player.dataset.mediaType = type;

  const media = document.createElement(type);
  media.className = "reader-media-element";
  media.src = url;
  media.preload = "metadata";
  media.controls = true;
  media.setAttribute("controls", "");
  if (type === "video") {
    media.playsInline = true;
    media.setAttribute("playsinline", "");
  }

  player.appendChild(media);
  return player;
}

async function renderReaderBlocks(blocks, downloadsAllowed = false) {
  const renderToken = ++readerRenderToken;
  clearReaderMediaUrls();
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
    element.className = "reader-block reader-block--" + block.type;
    if (block.type === "heading") {
      normalizeHeadingBlock(block);
      const heading = document.createElement(block.level || "h2");
      element.classList.add("reader-heading--" + block.align);
      if (block.color) heading.style.color = block.color;
      heading.textContent = block.text || "";
      element.appendChild(heading);
    } else if (block.type === "text") {
      element.innerHTML = block.html || "";
    } else if (block.type === "callout") {
      normalizeCalloutBlock(block);
      const variant = normalizeCalloutVariant(block.variant);
      const meta = CALLOUT_META[variant];
      element.classList.add("callout--" + variant);
      element.style.setProperty("--callout-color", normalizeCalloutColor(block.color));
      element.setAttribute("role", "note");
      const marker = document.createElement("span");
      marker.className = "callout-marker";
      marker.textContent = block.icon || meta.icon;
      const copy = document.createElement("div");
      copy.className = "callout-copy";
      const label = document.createElement("strong");
      label.className = "callout-label";
      label.textContent = block.label || meta.label;
      const body = document.createElement("div");
      body.className = "callout-body";
      body.innerHTML = block.html || "";
      copy.append(label, body);
      element.append(marker, copy);
    } else if (block.type === "divider") {
      element.setAttribute("role", "separator");
      element.setAttribute("aria-label", "Разделитель");
    } else if (block.type === "accordion") {
      const details = document.createElement("details");
      details.className = "reader-accordion";
      const summary = document.createElement("summary");
      summary.textContent = block.title || "Подробнее";
      const content = document.createElement("div");
      content.className = "reader-accordion-content";
      content.innerHTML = block.html || "";
      details.append(summary, content);
      element.appendChild(details);
    } else {
      const asset = await getAsset(block.id);
      if (renderToken !== readerRenderToken) return;
      if (!asset?.blob) {
        element.innerHTML = '<p class="missing-asset">Локальный файл недоступен: <strong></strong></p>';
        element.querySelector("strong").textContent = block.fileName || "файл";
      } else {
        const url = URL.createObjectURL(asset.blob);
        readerMediaUrls.push(url);
        if (block.type === "image") {
          const image = document.createElement("img");
          image.src = url;
          image.alt = block.fileName || "Изображение урока";
          element.appendChild(image);
        } else if (block.type === "video" || block.type === "audio") {
          element.appendChild(createReaderMediaPlayer(block.type, url));
        } else if (downloadsAllowed) {
          const link = document.createElement("a");
          link.href = url;
          link.download = block.fileName || "file";
          link.textContent = "СКАЧАТЬ — " + (block.fileName || "ФАЙЛ");
          element.appendChild(link);
        } else {
          const label = document.createElement("p");
          label.className = "attachment-label";
          label.textContent = block.fileName || "ФАЙЛ";
          element.appendChild(label);
        }
      }
    }
    if (renderToken !== readerRenderToken) return;
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
  editorDraft.blocks.forEach((block) => {
    if (block.type === "heading") normalizeHeadingBlock(block);
    if (block.type === "callout") normalizeCalloutBlock(block);
  });
  editorDraft.allowDownloads ??= false;
  editorDraft.allowWhenBlocked ??= false;
  editorOriginal = clone(editorDraft);
  const path = hierarchyFor(id, draftStructure) ?? [found.item];
  editorPath.textContent = path.map((item) => item.title).join("  /  ");
  const editorRole = isOwnerAccount(currentAccount) ? "ВЛАДЕЛЕЦ" : currentAccount?.role === "admin" ? "АДМИН" : "УЧЕНИК";
  if (editorServiceLabel) editorServiceLabel.textContent = "[ RKO / " + editorRole + " ]";
  editorRoleLabel.textContent = "АДМИН";
  lessonNameInput.value = editorDraft.title;
  allowDownloads.checked = editorDraft.allowDownloads;
  if (allowWhenBlocked) allowWhenBlocked.checked = editorDraft.allowWhenBlocked;
  updateEditorVisibility();
  renderEditorBlocks();
  updateEditorState();
  setPage(editorPage);
}

function leaveEditorToCourse({ force = false } = {}) {
  if (!force && hasUnsavedEditorChanges()) {
    openEditorExitConfirm();
    return;
  }
  editorLessonId = null;
  editorDraft = null;
  editorOriginal = null;
  coursePath = [];
  closeExitConfirm();
  setPage(dashboardPage);
  renderCourse();
  if (dashboardMode === "admin") setDashboardMode("learning");
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
  const editorStateLabel = editorState.querySelector("span");
  if (editorStateLabel) editorStateLabel.textContent = changed ? "ИЗМЕНЕНО" : "СОХРАНЕНО";
  editorDirtyIndicator?.classList.toggle("is-visible", changed);
  saveLesson.classList.toggle("is-enabled", changed);
}

function renderEditorBlocks() {
  lessonBlocks.innerHTML = "";
  editorDraft.blocks.forEach((block) => {
    const row = document.createElement("div");
    if (block.type === "callout") normalizeCalloutBlock(block);
    row.className = `lesson-block lesson-block--${block.type}${blockDragId === block.id ? " is-dragging" : ""}${blockDragTargetId === block.id && blockDragId !== block.id ? " is-drag-target" : ""}${blockDragTargetId === block.id && blockDragAfter ? " is-drop-after" : ""}`;
    row.dataset.blockId = block.id;
    if (block.type === "callout") row.style.setProperty("--callout-color", block.color);
    const label = { heading: "ЗАГОЛОВОК", accordion: "РАСКРЫВАЮЩИЙСЯ ЗАГОЛОВОК", text: "ТЕКСТ", callout: "ВАЖНО", divider: "РАЗДЕЛИТЕЛЬ", image: "ИЗОБРАЖЕНИЕ", video: "ВИДЕО", audio: "АУДИО", file: "ФАЙЛ" }[block.type] || "БЛОК";
    row.innerHTML = `<button class="block-drag" type="button" aria-label="Переместить блок">⠿</button><strong class="block-label">${label}</strong><div class="block-editor"></div><button class="block-delete" type="button" data-block-action="delete" aria-label="Удалить блок"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7h14M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`;
    const editor = row.querySelector(".block-editor");
    if (block.type === "heading") renderHeadingBlock(editor, block);
    else if (block.type === "accordion") renderAccordionBlock(editor, block);
    else if (block.type === "text") renderTextBlock(editor, block);
    else if (block.type === "callout") renderCalloutBlock(editor, block);
    else if (block.type === "divider") renderDividerBlock(editor);
    else renderFileBlock(editor, block);
    lessonBlocks.appendChild(row);
  });
  updateEditorState();
}

function renderHeadingBlock(container, block) {
  normalizeHeadingBlock(block);
  const fields = document.createElement("div");
  fields.className = "heading-fields";
  const select = document.createElement("select");
  ["H1", "H2", "H3", "H4", "H5", "H6"].forEach((level) => {
    const option = document.createElement("option");
    option.value = level.toLowerCase();
    option.textContent = level;
    option.selected = block.level === option.value;
    select.appendChild(option);
  });
  const input = document.createElement("input");
  input.type = "text";
  input.value = block.text || "";
  input.placeholder = "Текст заголовка";
  select.addEventListener("change", () => {
    block.level = select.value;
    updateEditorState();
  });
  input.addEventListener("input", () => {
    block.text = input.value;
    updateEditorState();
  });
  fields.append(select, input);

  const alignToolbar = document.createElement("div");
  alignToolbar.className = "heading-align-toolbar";
  alignToolbar.setAttribute("aria-label", "Выравнивание заголовка");
  const alignments = [
    { value: "left", label: "По левому краю", path: "M4 6h16M4 12h11M4 18h16" },
    { value: "center", label: "По центру", path: "M4 6h16M7 12h10M4 18h16" },
    { value: "right", label: "По правому краю", path: "M4 6h16M9 12h11M4 18h16" },
  ];
  const syncAlignment = () => {
    alignToolbar.querySelectorAll("[data-align]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.align === block.align);
      button.setAttribute("aria-pressed", String(button.dataset.align === block.align));
    });
  };
  alignments.forEach(({ value, label, path }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "heading-align-button";
    button.dataset.align = value;
    button.title = label;
    button.setAttribute("aria-label", label);
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + path + '" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
    button.addEventListener("click", () => {
      block.align = value;
      syncAlignment();
      updateEditorState();
    });
    alignToolbar.appendChild(button);
  });
  syncAlignment();

  const colorToolbar = document.createElement("div");
  colorToolbar.className = "heading-color-toolbar";
  colorToolbar.setAttribute("aria-label", "Цвет заголовка");
  const syncColor = () => {
    colorToolbar.querySelectorAll("[data-heading-color]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.headingColor === block.color);
      button.setAttribute("aria-pressed", String(button.dataset.headingColor === block.color));
    });
  };
  HEADING_COLORS.forEach(({ label, value }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "heading-color-button" + (value ? "" : " is-default");
    button.dataset.headingColor = value;
    button.title = label;
    button.setAttribute("aria-label", "Цвет заголовка: " + label);
    const swatch = document.createElement("i");
    swatch.setAttribute("aria-hidden", "true");
    if (value) swatch.style.background = value;
    button.appendChild(swatch);
    button.addEventListener("click", () => {
      block.color = value;
      syncColor();
      updateEditorState();
    });
    colorToolbar.appendChild(button);
  });
  syncColor();
  container.append(fields, alignToolbar, colorToolbar);
}

function buildRichTextToolbar(toolbar, area, block) {
  toolbar.className = "text-toolbar";
  const highlightButtons = HIGHLIGHT_COLORS.map(({ name, value }) => `<button class="highlight-swatch" type="button" data-highlight="${value}" title="Выделить: ${name}" aria-label="Выделить: ${name}"><i style="background:${value}"></i></button>`).join("");
  toolbar.innerHTML = `<button type="button" data-command="bold" title="Жирный"><b>B</b></button><button type="button" data-command="italic" title="Курсив"><i>I</i></button><button type="button" data-command="createLink">ССЫЛКА</button><button type="button" data-command="insertUnorderedList">СПИСОК</button><span class="text-toolbar-caption">МАРКЕР</span><span class="highlight-palette">${highlightButtons}</span>`;
  let savedRange = null;
  const rememberSelection = () => {
    const selection = window.getSelection();
    if (!selection?.rangeCount || !area.contains(selection.anchorNode) || !area.contains(selection.focusNode)) return;
    savedRange = selection.getRangeAt(0).cloneRange();
  };
  const restoreSelection = () => {
    if (!savedRange) return;
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedRange);
  };
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
    const button = event.target.closest("[data-command], [data-highlight]");
    if (!button) return;
    event.preventDefault();
    rememberSelection();
    area.focus({ preventScroll: true });
    restoreSelection();
    const highlight = button.dataset.highlight;
    const command = button.dataset.command;
    if (highlight) {
      document.execCommand("styleWithCSS", false, true);
      document.execCommand("hiliteColor", false, highlight);
    } else {
      const value = command === "createLink" ? window.prompt("Вставьте ссылку") : null;
      if (command !== "createLink" || value) document.execCommand(command, false, value);
    }
    block.html = area.innerHTML;
    syncToolbar();
    updateEditorState();
  });
  ["input", "keyup", "mouseup", "focus", "blur"].forEach((eventName) => area.addEventListener(eventName, () => {
    rememberSelection();
    block.html = area.innerHTML;
    syncToolbar();
    updateEditorState();
  }));
  syncToolbar();
}

function renderTextBlock(container, block) {
  const toolbar = document.createElement("div");
  const area = document.createElement("div");
  area.className = "rich-text"; area.contentEditable = "true"; area.dataset.placeholder = "Введите текст урока"; area.innerHTML = block.html || "";
  buildRichTextToolbar(toolbar, area, block);
  container.append(toolbar, area);
}

function renderAccordionBlock(container, block) {
  const title = document.createElement("input");
  title.type = "text";
  title.className = "accordion-title-input";
  title.placeholder = "Заголовок";
  title.value = block.title || "";
  const toolbar = document.createElement("div");
  const area = document.createElement("div");
  area.className = "rich-text";
  area.contentEditable = "true";
  area.dataset.placeholder = "Содержимое раскрывающегося блока";
  area.innerHTML = block.html || "";
  title.addEventListener("input", () => { block.title = title.value; updateEditorState(); });
  buildRichTextToolbar(toolbar, area, block);
  container.append(title, toolbar, area);
}

function renderCalloutBlock(container, block) {
  normalizeCalloutBlock(block);
  const settings = document.createElement("div");
  settings.className = "callout-editor-settings";

  const iconLabel = document.createElement("span");
  iconLabel.className = "callout-setting-label";
  iconLabel.textContent = "ЗНАЧОК";

  const iconPicker = document.createElement("div");
  iconPicker.className = "callout-icon-picker";
  iconPicker.setAttribute("aria-label", "Значок блока");
  const syncIcon = () => {
    iconPicker.querySelectorAll("[data-callout-icon]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.calloutIcon === block.icon);
      button.setAttribute("aria-pressed", String(button.dataset.calloutIcon === block.icon));
    });
  };
  CALLOUT_ICONS.forEach((icon) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "callout-icon-button";
    button.dataset.calloutIcon = icon;
    button.textContent = icon;
    button.title = icon === "!" ? "Восклицательный знак" : icon === "?" ? "Вопросительный знак" : "Галочка";
    button.setAttribute("aria-label", button.title);
    button.addEventListener("click", () => {
      block.icon = icon;
      block.variant = CALLOUT_ICON_VARIANTS[icon] || block.variant;
      syncIcon();
      updateEditorState();
    });
    iconPicker.appendChild(button);
  });
  syncIcon();

  const colorLabel = document.createElement("span");
  colorLabel.className = "callout-setting-label";
  colorLabel.textContent = "ЦВЕТ";

  const colorPicker = document.createElement("div");
  colorPicker.className = "callout-color-picker";
  colorPicker.setAttribute("aria-label", "Цвет блока");
  const syncColor = () => {
    colorPicker.querySelectorAll("[data-callout-color]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.calloutColor === block.color);
      button.setAttribute("aria-pressed", String(button.dataset.calloutColor === block.color));
    });
  };
  CALLOUT_COLORS.forEach((color) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "callout-color-button";
    button.dataset.calloutColor = color.value;
    button.title = color.label;
    button.setAttribute("aria-label", color.label);
    button.style.setProperty("--swatch", color.value);
    button.addEventListener("click", () => {
      block.color = color.value;
      syncColor();
      updateEditorState();
    });
    colorPicker.appendChild(button);
  });
  syncColor();

  const label = document.createElement("input");
  label.className = "callout-label-input";
  label.type = "text";
  label.value = block.label;
  label.placeholder = "Название блока";
  label.setAttribute("aria-label", "Название блока");
  label.addEventListener("input", () => {
    block.label = label.value;
    updateEditorState();
  });

  settings.append(iconLabel, iconPicker, colorLabel, colorPicker, label);

  const toolbar = document.createElement("div");
  const area = document.createElement("div");
  area.className = "rich-text callout-rich-text";
  area.contentEditable = "true";
  area.dataset.placeholder = "Введите текст блока";
  area.innerHTML = block.html || "";
  buildRichTextToolbar(toolbar, area, block);
  container.append(settings, toolbar, area);
}
function renderDividerBlock(container) {
  const preview = document.createElement("div");
  preview.className = "divider-editor-preview";
  preview.setAttribute("role", "separator");
  preview.textContent = "РАЗДЕЛИТЕЛЬНАЯ ЛИНИЯ";
  container.appendChild(preview);
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
  if (type === "heading") Object.assign(block, { level: "h1", align: "left", color: "", text: "" });
  if (type === "accordion") Object.assign(block, { title: "Раскрывающийся заголовок", html: "" });
  if (type === "text" || type === "callout") block.html = "";
  if (type === "callout") Object.assign(block, { variant: "important", label: "ВАЖНО", icon: "!", color: CALLOUT_DEFAULT_COLOR });
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
  editorDraft.allowWhenBlocked = Boolean(allowWhenBlocked?.checked);
  const draftFound = findNode(draftStructure, editorLessonId);
  const persisted = findNode(savedStructure, editorLessonId);
  if (!draftFound || !persisted) {
    showNotice("СНАЧАЛА СОХРАНИ СТРУКТУРУ", "error");
    return;
  }
  Object.assign(draftFound.item, clone(editorDraft));
  Object.assign(persisted.item, clone(editorDraft));
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
  if (IS_GITHUB_PREVIEW && login === "admin" && password === "admin") {
    const account = normalizeAccount(GITHUB_PREVIEW_ACCOUNTS.find((item) => item.login === "admin"));
    backendConnected = false;
    accountStore = normalizeAccounts(GITHUB_PREVIEW_ACCOUNTS);
    passwordHelp.classList.remove("is-visible");
    showWelcome(account, { required: true, accepted: false, version: "1.0" });
    return;
  }
  try {
    const { response, body } = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ login, password }),
    });
    if (response.ok) {
      const account = normalizeAccount(body.account);
      backendConnected = true;
      accountStore = normalizeAccounts([account, ...accountStore.filter((item) => item.login !== account.login)]);
      await hydrateFromServer(account);
      passwordHelp.classList.remove("is-visible");
      showWelcome(account, body.consent);
      return;
    }
  } catch {}
  triggerError();
});
adminMark.addEventListener("click", () => {
  if (!adminMark.classList.contains("is-visible")) return;
  if (dashboardMode === "admin" && hasUnsavedStructureChanges()) {
    openExitConfirm();
    return;
  }
  setDashboardMode(dashboardMode === "admin" ? "learning" : "admin");
});
exitConfirmCancel?.addEventListener("click", closeExitConfirm);
exitConfirmDiscard?.addEventListener("click", () => {
  if (exitConfirmLayer?.dataset.mode === "editor") {
    leaveEditorToCourse({ force: true });
    return;
  }
  leaveAdmin({ save: false });
});
exitConfirmSave?.addEventListener("click", () => {
  if (exitConfirmLayer?.dataset.mode === "editor") {
    saveEditorLesson();
    if (!hasUnsavedEditorChanges()) leaveEditorToCourse({ force: true });
    return;
  }
  leaveAdmin({ save: true });
});
exitConfirmLayer?.addEventListener("click", (event) => { if (event.target === exitConfirmLayer) closeExitConfirm(); });
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
  if (action === "visibility") return toggleVisibility(id);
  if (action === "collapse") {
    const collapseButton = event.target.closest("[data-action='collapse']");
    const children = row.nextElementSibling?.classList.contains("structure-children") ? row.nextElementSibling : null;
    const willCollapse = !collapsedIds.has(id);
    willCollapse ? collapsedIds.add(id) : collapsedIds.delete(id);
    saveCollapsedIds();
    collapseButton?.classList.toggle("is-collapsed", willCollapse);
    children?.classList.toggle("is-collapsed", willCollapse);
    return;
  }
  if (action === "drag") return;
  if (action === "rename") {
    selectedId = id;
    renderStructure();
    startInlineRename(id, true);
    return;
  }
  if (action === "edit") {
    const item = findNode(draftStructure, id)?.item;
    if (item?.type === "lesson") {
      selectedId = id;
      renderStructure();
      openLessonEditor(id);
    }
    return;
  }
  if (action === "delete") return openDeleteDialog(id);
  selectedId = selectedId === id ? null : id;
  renderStructure();
});
structureRows.addEventListener("keydown", (event) => {
  const row = event.target.closest(".structure-row");
  if (!row || editingId || event.key !== "Enter") return;
  const id = row.dataset.id;
  if (!id || event.target.matches("input, textarea, select, button, [contenteditable='true']")) return;
  event.preventDefault();
  selectedId = id;
  renderStructure();
  startInlineRename(id, true);
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || editingId || !selectedId || !structureView?.classList.contains("is-current")) return;
  const target = event.target;
  if (target.matches("input, textarea, select, button, [contenteditable='true']")) return;
  event.preventDefault();
  startInlineRename(selectedId, true);
});
structureRows.addEventListener("pointerdown", (event) => {
  const handle = event.target.closest("[data-action='drag']");
  const row = event.target.closest(".structure-row");
  if (handle && row) beginStructureDrag(event, row.dataset.id);
});
$("#structureTable").addEventListener("click", (event) => {
  if (event.target.closest(".structure-row")) return;
  selectedId = null;
  renderStructure();
});
addButton.addEventListener("click", addItem);
addLessonButton.addEventListener("click", addLesson);
saveStructure.addEventListener("click", saveDraft);
cancelStructure.addEventListener("click", cancelDraft);
confirmNo.addEventListener("click", closeDeleteDialog);
confirmYes.addEventListener("click", () => {
  if (pendingConfirmAction === "password-reset") {
    const login = pendingAccountLogin;
    closeDeleteDialog();
    editingAccountLogin = login;
    openPasswordModal();
    return;
  }
  deletePending();
});
confirmLayer.addEventListener("click", (event) => { if (event.target === confirmLayer) closeDeleteDialog(); });
courseList.addEventListener("click", handleCourseClick);
courseGuideBack.addEventListener("click", () => {
  if (!coursePath.length) return;
  coursePath.pop();
  renderCourse();
});

readerBack.addEventListener("click", () => {
  history.pushState({ view: "course" }, "", "/");
  renderCourse();
});

window.addEventListener("popstate", () => {
  if (location.pathname === "/offers" && currentAccount) return openOffers({ push: false });
  const match = location.pathname.match(/^\/lesson\/([^/]+)$/);
  if (match && currentAccount) {
    const found = findNode(savedStructure, decodeURIComponent(match[1]));
    if (found?.item?.type === "lesson") openLessonReader(found.item, { historyMode: "replace" });
    else renderCourse();
  } else if (currentAccount) renderCourse();
});

readerProgramList?.addEventListener("click", (event) => {
  const toggle = event.target.closest("[data-program-toggle]");
  if (toggle) {
    const id = toggle.dataset.programToggle;
    const children = toggle.nextElementSibling;
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    children?.classList.toggle("is-collapsed", expanded);
    if (expanded) readerProgramCollapsed.add(id);
    else readerProgramCollapsed.delete(id);
    saveReaderProgramCollapsed();
    return;
  }
  const lessonButton = event.target.closest("[data-program-lesson]");
  if (!lessonButton) return;
  const found = findNode(savedStructure, lessonButton.dataset.programLesson);
  if (found?.item?.type === "lesson") openLessonReader(found.item);
});

["copy", "cut", "contextmenu", "selectstart", "dragstart"].forEach((eventName) => {
  lessonReader?.addEventListener(eventName, (event) => {
    if (event.target.closest(".reader-program, button, a, input, video, audio")) return;
    if (event.target.closest(".reader-title, .reader-content")) event.preventDefault();
  });
});

coniferTreeButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  if (coniferWidget?.classList.contains("is-fullscreen")) return;
  coniferTreeButton.classList.add("is-pressing");
  window.setTimeout(() => coniferTreeButton.classList.remove("is-pressing"), 220);
  coniferPressCount = Math.min(coniferPressCount + 1, CONIFER_REQUIRED_PRESSES);
  if (coniferPressCount < CONIFER_REQUIRED_PRESSES) {
    randomizeConiferMiniPaths();
    triggerConiferMiniBurst();
    window.clearTimeout(coniferPressResetTimer);
    coniferPressResetTimer = window.setTimeout(() => { coniferPressCount = 0; }, CONIFER_PRESS_WINDOW);
    return;
  }
  coniferPressCount = 0;
  openConiferCult();
});

coniferBackButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  closeConiferCult();
});
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
editorRoleLabel?.addEventListener("click", leaveEditorToCourse);
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
allowWhenBlocked?.addEventListener("change", () => {
  if (!editorDraft) return;
  editorDraft.allowWhenBlocked = allowWhenBlocked.checked;
  updateEditorState();
});
addBlockButton.addEventListener("click", openBlockPicker);
blockPickerCancel.addEventListener("click", closeBlockPicker);
blockPickerLayer.addEventListener("click", (event) => { if (event.target === blockPickerLayer) closeBlockPicker(); });
blockOptions.forEach((button) => button.addEventListener("click", () => addLessonBlock(button.dataset.blockType)));
lessonBlocks.addEventListener("click", (event) => {
  const row = event.target.closest(".lesson-block");
  if (!row) return;
  if (event.target.closest("[data-block-action='delete']")) {
    openBlockDeleteDialog(row.dataset.blockId);
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
[["#offersBlockedAccess", "offersAllowWhenBlocked"], ["#clubBlockedAccess", "clubAllowWhenBlocked"]].forEach(([selector, key]) => {
  $(selector)?.addEventListener("click", () => {
    platformSettings[key] = platformSettings[key] === false;
    saveSettings(); applyPlatformSettings(); showNotice("НАСТРОЙКА СОХРАНЕНА", "success");
  });
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Delete" || editingId || !selectedId || !structureView?.classList.contains("is-current")) return;
  const target = event.target;
  if (target.matches("input, textarea, select, [contenteditable='true']")) return;
  event.preventDefault();
  openDeleteDialog(selectedId);
});

window.addEventListener("resize", updateTabIndicator);
logoutButton.addEventListener("click", () => logoutFrom(logoutButton));
accountName.addEventListener("click", () => { if (currentAccount) openAccountModal("self", currentAccount); });
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
accountPasswordChange.addEventListener("click", () => {
  const target = accountStore.find((item) => item.login === editingAccountLogin) || currentAccount;
  if (!sameAccount(target, currentAccount) && isOwnerAccount(currentAccount)) openPasswordResetConfirm();
  else openPasswordModal();
});
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

function clubSettings() {
  return { ...DEFAULT_SETTINGS.club, ...(platformSettings.club || {}) };
}
function fillClubSettingsForm() {
  const club = clubSettings();
  $("#clubTitleSetting").value = club.title;
  $("#clubDescriptionSetting").value = club.description;
  $("#clubTelegramSetting").value = club.telegram;
  $("#clubButtonTextSetting").value = club.buttonText;
  $("#clubChatSetting").value = club.chatUrl;
}
function openClub() {
  if (currentAccount?.courseAccess === false && platformSettings.clubAllowWhenBlocked !== true) return showNotice("ЭТОТ МАТЕРИАЛ ПОКА НЕДОСТУПЕН", "error");
  const club = clubSettings();
  $("#clubTitle").textContent = club.title.toUpperCase();
  $("#clubDescription").textContent = club.description;
  $("#clubTelegram").href = club.telegram;
  $("#clubTelegram").textContent = club.telegram.replace(/^https?:\/\/t\.me\//, "@");
  $("#clubChat").href = club.chatUrl;
  $("#clubChat").textContent = club.buttonText.toUpperCase();
  $("#clubLayer").classList.add("is-visible");
  $("#clubLayer").setAttribute("aria-hidden", "false");
}
$("#clubButton")?.addEventListener("click", openClub);
$("#clubClose")?.addEventListener("click", () => {
  $("#clubLayer").classList.remove("is-visible");
  $("#clubLayer").setAttribute("aria-hidden", "true");
});
$("#saveClubSettings")?.addEventListener("click", () => {
  platformSettings.club = {
    title: $("#clubTitleSetting").value.trim() || DEFAULT_SETTINGS.club.title,
    description: $("#clubDescriptionSetting").value.trim() || DEFAULT_SETTINGS.club.description,
    telegram: $("#clubTelegramSetting").value.trim() || DEFAULT_SETTINGS.club.telegram,
    buttonText: $("#clubButtonTextSetting").value.trim() || DEFAULT_SETTINGS.club.buttonText,
    chatUrl: $("#clubChatSetting").value.trim() || DEFAULT_SETTINGS.club.chatUrl,
  };
  saveSettings();
  showNotice("НАСТРОЙКИ КЛУБА СОХРАНЕНЫ", "success");
});

function formatOffersDate(value) {
  const date = new Date(`${value || "2026-10-08"}T12:00:00`);
  const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  return `Обновлено ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} года`;
}
function renderOffers(editing = false) {
  const host = $("#offersContent");
  host.innerHTML = "";
  const offers = Array.isArray(platformSettings.offers) ? platformSettings.offers : clone(DEFAULT_SETTINGS.offers);
  $("#offersUpdated").textContent = formatOffersDate(platformSettings.offersUpdatedAt);
  offers.forEach((offer, index) => {
    if (!editing) {
      const details = document.createElement("details");
      details.className = "offers-group";
      const summary = document.createElement("summary");
      summary.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><strong></strong><i>+</i>`;
      summary.querySelector("strong").textContent = offer.title;
      const content = document.createElement("div"); content.className = "offers-group-content"; content.innerHTML = offer.content || "";
      details.append(summary, content); host.appendChild(details);
      return;
    }
    const row = document.createElement("section"); row.className = "offers-editor-row"; row.dataset.offerId = offer.id;
    row.innerHTML = `<input class="offers-editor-title" aria-label="Название раздела"><div class="offers-editor-toolbar"><button data-offer-bold type="button" title="Жирный текст"><strong>B</strong></button></div><textarea class="offers-editor-copy" rows="7" aria-label="Содержимое"></textarea><div class="offers-editor-row-actions"><button data-offer-up type="button">↑</button><button data-offer-down type="button">↓</button><button data-offer-delete type="button">УДАЛИТЬ</button></div>`;
    row.querySelector("input").value = offer.title; row.querySelector("textarea").value = offer.content || ""; host.appendChild(row);
  });
  if (editing) {
    const actions = document.createElement("div"); actions.className = "offers-editor-actions";
    actions.innerHTML = '<button data-offer-add type="button">+ РАЗДЕЛ</button><button data-offer-save type="button">СОХРАНИТЬ</button>';
    host.appendChild(actions);
  }
}
function openOffers({ push = true } = {}) {
  if (currentAccount?.courseAccess === false && platformSettings.offersAllowWhenBlocked !== true) return showNotice("ЭТОТ МАТЕРИАЛ ПОКА НЕДОСТУПЕН", "error");
  renderOffers(false);
  $("#offersEdit").hidden = !isStaffAccount(currentAccount);
  setPage(offersPage);
  if (push && location.pathname !== "/offers") history.pushState({ view: "offers" }, "", "/offers");
}
$("#offersButton")?.addEventListener("click", openOffers);
$("#offersBack")?.addEventListener("click", () => { setPage(dashboardPage); history.pushState({ view: "course" }, "", "/"); });
$("#offersClose")?.addEventListener("click", () => { setPage(dashboardPage); history.pushState({ view: "course" }, "", "/"); });
$("#offersEdit")?.addEventListener("click", () => renderOffers(true));
$("#offersContent")?.addEventListener("click", (event) => {
  const rows = [...$("#offersContent").querySelectorAll(".offers-editor-row")];
  const row = event.target.closest(".offers-editor-row");
  if (event.target.closest("[data-offer-add]")) {
    platformSettings.offers = [...(platformSettings.offers || []), { id: uid("offer"), title: "Новый раздел", content: "" }];
    return renderOffers(true);
  }
  if (!row) {
    if (event.target.closest("[data-offer-save]")) {
      platformSettings.offers = rows.map((item) => ({ id: item.dataset.offerId, title: item.querySelector("input").value.trim() || "Без названия", content: item.querySelector("textarea").value }));
      platformSettings.offersUpdatedAt = new Date().toISOString().slice(0, 10);
      saveSettings(); renderOffers(false); showNotice("ОФФЕРЫ СОХРАНЕНЫ", "success");
    }
    return;
  }
  const index = rows.indexOf(row);
  if (event.target.closest("[data-offer-bold]")) {
    const input = row.querySelector("textarea");
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const selected = input.value.slice(start, end) || "жирный текст";
    input.setRangeText(`<strong>${selected}</strong>`, start, end, "select");
    input.focus();
    return;
  }
  const data = rows.map((item) => ({ id: item.dataset.offerId, title: item.querySelector("input").value, content: item.querySelector("textarea").value }));
  if (event.target.closest("[data-offer-delete]")) data.splice(index, 1);
  if (event.target.closest("[data-offer-up]") && index > 0) [data[index - 1], data[index]] = [data[index], data[index - 1]];
  if (event.target.closest("[data-offer-down]") && index < data.length - 1) [data[index + 1], data[index]] = [data[index], data[index + 1]];
  platformSettings.offers = data; renderOffers(true);
});

async function openConsentsFor(account) {
  if (IS_GITHUB_PREVIEW) {
    const acceptedAt = "2026-10-08T12:00:00Z";
    const demo = ["personal_data", "agreement", "age_18"].map((documentType, index) => ({ id: `preview-consent-${index + 1}`, documentType, version: "1.0", accepted: true, acceptedAt }));
    renderConsentRecords(demo);
    return;
  }
  const { response, body } = await apiRequest(`/accounts/${account.id}/consents`);
  if (!response.ok) return showNotice("НЕ УДАЛОСЬ ЗАГРУЗИТЬ СОГЛАСИЯ", "error");
  renderConsentRecords(body.consents);
}
function renderConsentRecords(consents) {
  const names = { privacy: "Политика персональных данных", personal_data: "Согласие на обработку данных", agreement: "Пользовательское соглашение", age_18: "Подтверждение 18+" };
  $("#consentsAdminList").innerHTML = consents.length ? consents.map((item) => `<article class="consent-record"><strong>${names[item.documentType] || item.documentType}</strong><span>Версия ${item.version}</span><span>${item.accepted ? "Принято" : "Не принято"}</span><time>${new Date(item.acceptedAt).toLocaleString("ru-RU")}</time><small>ID: ${item.id}</small></article>`).join("") : "<p>Согласия пока не зафиксированы.</p>";
  $("#consentsAdminLayer").classList.add("is-visible"); $("#consentsAdminLayer").setAttribute("aria-hidden", "false");
}
$("#consentsAdminClose")?.addEventListener("click", () => { $("#consentsAdminLayer").classList.remove("is-visible"); $("#consentsAdminLayer").setAttribute("aria-hidden", "true"); });

async function openArchive() {
  let accounts;
  if (IS_GITHUB_PREVIEW) accounts = githubPreviewArchive;
  else {
    const { response, body } = await apiRequest("/accounts?archived=true");
    if (!response.ok) return showNotice("НЕ УДАЛОСЬ ОТКРЫТЬ АРХИВ", "error");
    accounts = body.accounts;
  }
  const host = $("#archiveList"); host.innerHTML = "";
  accounts.forEach((account) => {
    const card = document.createElement("article"); card.className = "archive-card";
    card.innerHTML = `<div><strong></strong><span class="archive-telegram"></span><span class="archive-login"></span><span class="archive-role"></span><small class="archive-dates"></small><small class="archive-id"></small></div><div class="archive-card-actions"><button data-archive-restore type="button">ВОССТАНОВИТЬ</button><button data-archive-consents type="button">СОГЛАСИЯ</button><button data-archive-delete type="button">УДАЛИТЬ НАВСЕГДА</button></div>`;
    card.querySelector("strong").textContent = accountDisplayName(account);
    card.querySelector(".archive-telegram").textContent = account.telegram || "Telegram";
    card.querySelector(".archive-login").textContent = `Логин: ${account.login}`;
    card.querySelector(".archive-role").textContent = `Роль: ${account.role}`;
    card.querySelector(".archive-dates").textContent = `Создан: ${new Date(account.createdAt).toLocaleString("ru-RU")} · В архиве: ${new Date(account.archivedAt).toLocaleString("ru-RU")}`;
    card.querySelector(".archive-id").textContent = `ID: ${account.id}`;
    card.querySelector("[data-archive-consents]").addEventListener("click", () => openConsentsFor(account));
    card.querySelector("[data-archive-restore]").addEventListener("click", async () => {
      if (IS_GITHUB_PREVIEW) {
        githubPreviewArchive = githubPreviewArchive.filter((item) => item.id !== account.id);
        accountStore.push(normalizeAccount({ ...account, archivedAt: null, isActive: true }));
        renderAccounts(); openArchive(); showNotice("АККАУНТ ВОССТАНОВЛЕН", "success"); return;
      }
      const result = await apiRequest(`/archive/${account.id}/restore`, { method: "POST" });
      if (result.response.ok) { accountStore.push(normalizeAccount(result.body.account)); renderAccounts(); openArchive(); showNotice("АККАУНТ ВОССТАНОВЛЕН", "success"); }
    });
    card.querySelector("[data-archive-delete]").addEventListener("click", async () => {
      if (!confirm(`Удалить аккаунт «${accountDisplayName(account)}» навсегда? Это действие нельзя отменить.`)) return;
      if (IS_GITHUB_PREVIEW) { githubPreviewArchive = githubPreviewArchive.filter((item) => item.id !== account.id); card.remove(); showNotice("АККАУНТ УДАЛЁН НАВСЕГДА", "success"); return; }
      const result = await apiRequest(`/archive/${account.id}`, { method: "DELETE" });
      if (result.response.ok) { card.remove(); showNotice("АККАУНТ УДАЛЁН НАВСЕГДА", "success"); }
    }); host.appendChild(card);
  });
  if (!accounts.length) host.innerHTML = "<p>Архив пуст.</p>";
}
$$('[data-accounts-view]').forEach((button) => button.addEventListener('click', () => {
  const view = button.dataset.accountsView;
  $$('[data-accounts-view]').forEach((item) => item.classList.toggle('is-current', item === button));
  $$('[data-accounts-panel]').forEach((panel) => panel.classList.toggle('is-current', panel.dataset.accountsPanel === view));
  $("#createAccountButton").hidden = view === "archive";
  if (view === "archive") openArchive();
}));

const documentsLayer = $("#documentsLayer");
$("#documentsButton")?.addEventListener("click", () => {
  documentsLayer.classList.add("is-visible");
  documentsLayer.setAttribute("aria-hidden", "false");
});
$("[data-close-documents]")?.addEventListener("click", () => {
  documentsLayer.classList.remove("is-visible");
  documentsLayer.setAttribute("aria-hidden", "true");
});
documentsLayer?.addEventListener("click", (event) => {
  if (event.target === documentsLayer) $("[data-close-documents]")?.click();
});
if (new URLSearchParams(location.search).has("documents")) {
  window.setTimeout(() => $("#documentsButton")?.click(), 50);
}

const consentInputs = [$("#consentPersonalData"), $("#consentAgreement"), $("#consentAge")];
const syncConsentButton = () => { $("#consentSubmit").disabled = !consentInputs.every((input) => input?.checked); };
consentInputs.forEach((input) => input?.addEventListener("change", syncConsentButton));
$("#consentSubmit")?.addEventListener("click", async () => {
  if (!consentInputs.every((input) => input?.checked) || !pendingAuthenticatedAccount) return;
  const button = $("#consentSubmit");
  button.disabled = true;
  let body = { consent: { required: false, accepted: true, version: pendingConsentState?.version || "1.0" } };
  if (!IS_GITHUB_PREVIEW) {
    const result = await apiRequest("/consents/accept", {
      method: "POST",
      body: JSON.stringify({ version: pendingConsentState?.version || "1.0", privacy: true, personalData: true, agreement: true, age18: true }),
    });
    if (!result.response.ok) {
      $("#consentError").textContent = "Не удалось сохранить согласие. Проверьте соединение и попробуйте снова.";
      button.disabled = false;
      return;
    }
    body = result.body;
  }
  const account = pendingAuthenticatedAccount;
  pendingAuthenticatedAccount = null;
  pendingConsentState = body.consent;
  closeConsentLayer();
  showWelcome(account, body.consent);
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
      if (body.consent?.required) {
        setPage(authPage);
        pendingAuthenticatedAccount = account;
        pendingConsentState = body.consent;
        openConsentLayer();
      } else showDashboard(account);
      return;
    }
  } catch {}
  showAuth();
}

restoreSession();
