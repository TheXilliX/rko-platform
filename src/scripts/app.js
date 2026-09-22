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
const courseBrowser = $("#courseBrowser");
const courseList = $("#courseList");
const courseInstruction = $(".course-instruction");
const courseGuideBack = $("#courseGuideBack");
const learningTitle = $("#learningTitle");
const lessonReader = $("#lessonReader");
const readerBack = $("#readerBack");
const readerPath = $("#readerPath");
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

const STORAGE_KEY = "rko-course-structure-v1";
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
let blockDragId = null;
let blockDragTargetId = null;
let editorLessonId = null;
let editorDraft = null;
let editorOriginal = null;
let savedStructure = loadSavedStructure();
let draftStructure = clone(savedStructure);
let baselineIds = collectIds(savedStructure);

function clone(value) { return JSON.parse(JSON.stringify(value)); }

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
  const activePage = editorPage.classList.contains("is-active") ? editorPage : dashboardPage;
  transitionTimer = window.setTimeout(() => {
    activePage.classList.add("is-leaving");
    transitionTimer = window.setTimeout(() => {
      button.classList.remove("is-pressed");
      activePage.classList.remove("is-leaving");
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
      row.className = `structure-row${selectedId === item.id ? " is-selected" : ""}${hiddenByParent ? " is-hidden-row" : ""}${dragTargetId === item.id ? " is-drag-target" : ""}`;
      row.dataset.id = item.id;
      row.style.setProperty("--depth", depth);
      const canCollapse = item.type !== "lesson";
      row.innerHTML = `<div class="row-main"><button class="drag-handle" type="button" data-action="drag" aria-label="Переместить ${item.title}"><span class="drag-mark" aria-hidden="true">⠿</span></button>${canCollapse ? `<button class="collapse-button${collapsedIds.has(item.id) ? " is-collapsed" : ""}" type="button" data-action="collapse" aria-label="${collapsedIds.has(item.id) ? "Развернуть" : "Свернуть"} ${item.title}">⌄</button>` : '<span class="collapse-spacer"></span>'}<div class="row-select" data-action="select" role="button" tabindex="0" aria-pressed="${selectedId === item.id}"><span class="row-title"></span></div></div><span class="row-status row-status--${status.tone}"><i></i>${status.label}</span><button class="visibility-button" type="button" data-action="visibility" aria-label="${item.visible ? "Скрыть" : "Показать"} ${item.title}"><svg class="eye-svg${item.visible ? "" : " is-closed"}" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="2.6" stroke="currentColor" stroke-width="1.5"/><path class="eye-slash" d="M4 4l16 16" stroke="currentColor" stroke-width="1.5"/></svg></button><div class="row-menu-wrap"><button class="more-button" type="button" data-action="menu" aria-label="Действия для ${item.title}">•••</button>${openMenuId === item.id ? actionMenu(item) : ""}</div>`;
      row.querySelector(".row-title").textContent = item.title;
      fragment.appendChild(row);
      if (item.children && !collapsedIds.has(item.id)) appendRows(item.children, depth + 1, hiddenByParent);
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
  if (!target || (target.item.type === "lesson" && target.parent?.type !== "module")) {
    newItem = { id: uid("section"), type: "section", title: "Новый раздел", visible: true, children: [] };
    draftStructure.push(newItem);
  } else if (target.item.type === "section") {
    newItem = { id: uid("module"), type: "module", title: "Новый модуль", visible: true, children: [] };
    target.item.children ??= [];
    target.item.children.push(newItem);
  } else {
    newItem = { id: uid("lesson"), type: "lesson", title: "Новый урок", visible: true, allowDownloads: false, blocks: [] };
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

function moveStructureItem(sourceId, targetId) {
  if (!sourceId || !targetId || sourceId === targetId) return;
  const source = findNode(draftStructure, sourceId);
  const target = findNode(draftStructure, targetId);
  if (!source || !target || source.item.type !== target.item.type || source.parent?.id !== target.parent?.id) {
    showNotice("ПЕРЕМЕЩАТЬ МОЖНО ТОЛЬКО ВНУТРИ ОДНОГО УРОВНЯ");
    return;
  }
  const from = source.siblings.findIndex((item) => item.id === sourceId);
  const to = source.siblings.findIndex((item) => item.id === targetId);
  const [moved] = source.siblings.splice(from, 1);
  source.siblings.splice(to, 0, moved);
  renderStructure();
}

function beginStructureDrag(event, id) {
  event.preventDefault();
  dragItemId = id;
  dragTargetId = id;
  document.body.classList.add("is-reordering");
  const move = (moveEvent) => {
    const row = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY)?.closest(".structure-row");
    if (row && row.dataset.id !== dragTargetId) {
      dragTargetId = row.dataset.id;
      renderStructure();
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
    moveStructureItem(sourceId, targetId);
    renderStructure();
  };
  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", finish, { once: true });
  document.addEventListener("pointercancel", finish, { once: true });
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

function closeDeleteDialog() {
  pendingDeleteId = null;
  pendingDeleteContext = "structure";
  confirmLayer.classList.remove("is-visible");
  confirmLayer.setAttribute("aria-hidden", "true");
}

function deletePending() {
  const context = pendingDeleteContext;
  const deletingId = pendingDeleteId;
  const found = findNode(draftStructure, deletingId);
  if (found) found.siblings.splice(found.siblings.findIndex((item) => item.id === deletingId), 1);
  if (context === "editor") {
    savedStructure = clone(draftStructure);
    baselineIds = collectIds(savedStructure);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedStructure));
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
  courseBrowser.classList.remove("is-hidden");
  lessonReader.classList.remove("is-visible");
  lessonReader.setAttribute("aria-hidden", "true");
  learningTitle.classList.remove("is-reader-hidden");
  courseList.classList.add("is-changing");
  window.setTimeout(() => {
    const items = courseItemsAtPath();
    courseList.innerHTML = "";
    courseInstruction.textContent = coursePath.length === 0 ? "ВЫБЕРИ РАЗДЕЛ, ЧТОБЫ ПЕРЕЙТИ К МОДУЛЯМ КУРСА." : coursePath.length === 1 ? "ВЫБЕРИ МОДУЛЬ, ЧТОБЫ ПЕРЕЙТИ К УРОКАМ И МАТЕРИАЛАМ КУРСА." : "ВЫБЕРИ УРОК, ЧТОБЫ ПЕРЕЙТИ К МАТЕРИАЛАМ.";
    courseGuideBack.classList.toggle("is-visible", coursePath.length > 0);
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
  }, 90);
}

function handleCourseClick(event) {
  const row = event.target.closest("[data-course-id]");
  if (!row) return;
  const id = row.dataset.courseId;
  const found = findNode(savedStructure, id);
  if (!found || !isEffectivelyVisible(id)) {
    row.classList.add("is-denied");
    showNotice("ЭТОТ МАТЕРИАЛ ПОКА НЕДОСТУПЕН", "error");
    window.setTimeout(() => row.classList.remove("is-denied"), 500);
    return;
  }
  row.classList.add("is-opening");
  if (found.item.children) {
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
  courseBrowser.classList.add("is-hidden");
  learningTitle.classList.add("is-reader-hidden");
  lessonReader.classList.add("is-visible");
  lessonReader.setAttribute("aria-hidden", "false");
  readerPath.textContent = hierarchy.slice(0, -1).map((item) => item.title).join("  /  ");
  readerTitle.textContent = lesson.title;
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
  adminMark.classList.add("is-admin-active");
  learningPanel.classList.remove("is-current");
  learningPanel.setAttribute("aria-hidden", "true");
  adminPanel.classList.add("is-current");
  adminPanel.setAttribute("aria-hidden", "false");
  requestAnimationFrame(updateTabIndicator);
}

function updateEditorVisibility() {
  lessonVisibility.firstChild.textContent = editorDraft?.visible ? "ДЛЯ ВСЕХ " : "ЗАКРЫТ ";
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
    row.className = `lesson-block lesson-block--${block.type}${blockDragTargetId === block.id ? " is-drag-target" : ""}`;
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
  toolbar.addEventListener("mousedown", (event) => {
    const button = event.target.closest("[data-command]");
    if (!button) return;
    event.preventDefault();
    area.focus();
    const command = button.dataset.command;
    const value = command === "createLink" ? window.prompt("Вставьте ссылку") : null;
    if (command !== "createLink" || value) document.execCommand(command, false, value);
    block.html = area.innerHTML;
    updateEditorState();
  });
  area.addEventListener("input", () => { block.html = area.innerHTML; updateEditorState(); });
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
  blockDragId = id;
  blockDragTargetId = id;
  document.body.classList.add("is-reordering");
  const move = (moveEvent) => {
    const row = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY)?.closest(".lesson-block");
    if (row && row.dataset.blockId !== blockDragTargetId) {
      blockDragTargetId = row.dataset.blockId;
      renderEditorBlocks();
    }
  };
  const finish = () => {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", finish);
    const from = editorDraft.blocks.findIndex((block) => block.id === blockDragId);
    const to = editorDraft.blocks.findIndex((block) => block.id === blockDragTargetId);
    if (from >= 0 && to >= 0) {
      const [moved] = editorDraft.blocks.splice(from, 1);
      editorDraft.blocks.splice(to, 0, moved);
    }
    blockDragId = null;
    blockDragTargetId = null;
    document.body.classList.remove("is-reordering");
    renderEditorBlocks();
  };
  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", finish, { once: true });
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
    if (menuAction === "edit") openLessonEditor(id);
    if (menuAction === "rename") startInlineRename(id, true);
    if (menuAction === "delete") openDeleteDialog(id);
    return;
  }
  if (action === "visibility") return toggleVisibility(id);
  if (action === "collapse") {
    collapsedIds.has(id) ? collapsedIds.delete(id) : collapsedIds.add(id);
    renderStructure();
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
    editorDraft.blocks = editorDraft.blocks.filter((block) => block.id !== row.dataset.blockId);
    renderEditorBlocks();
  }
});
lessonBlocks.addEventListener("pointerdown", (event) => {
  const handle = event.target.closest(".block-drag");
  const row = event.target.closest(".lesson-block");
  if (handle && row) beginBlockDrag(event, row.dataset.blockId);
});
saveLesson.addEventListener("click", saveEditorLesson);
deleteLesson.addEventListener("click", () => openDeleteDialog(editorLessonId));
window.addEventListener("resize", updateTabIndicator);
logoutButton.addEventListener("click", () => logoutFrom(logoutButton));

renderCourse();
renderStructure();
showAuth();
