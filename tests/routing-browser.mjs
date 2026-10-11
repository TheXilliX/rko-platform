import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const require = createRequire(import.meta.url);
const { chromium } = require('@playwright/test');
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };

await context.route('**/*', async route => {
  const url = new URL(route.request().url());
  if (url.hostname !== 'thexillix.github.io') return route.abort();
  let pathname = decodeURIComponent(url.pathname.replace(/^\/rko-platform\/?/, ''));
  if (!pathname) pathname = 'index.html';
  try {
    const body = await readFile(path.resolve('dist', pathname));
    await route.fulfill({ body, contentType: mime[path.extname(pathname)] || 'application/octet-stream' });
  } catch {
    await route.fulfill({ status: 404, body: 'not found' });
  }
});

await page.addInitScript(() => {
  localStorage.setItem('rko-preview-consents-v1', JSON.stringify({ 'preview-owner': { acceptedAt: new Date().toISOString() } }));
  localStorage.setItem('rko-course-structure-v1', JSON.stringify([{
    id: 'section-test', type: 'section', title: 'Раздел', visible: true, children: [{
      id: 'module-test', type: 'module', title: 'Модуль', visible: true, children: [{
        id: 'lesson-test', type: 'lesson', title: 'Урок', visible: true, allowDownloads: true,
        blocks: [{ id: 'doc', type: 'text', documentVersion: 1, html: '<h2>Заголовок</h2><p>Текст урока</p>' }],
      }],
    }],
  }]));
});

await page.goto('https://thexillix.github.io/rko-platform/#/lesson/lesson-test');
await page.locator('#login').fill('admin');
await page.locator('#password').fill('admin');
await page.locator('.submit-button').click();
await page.locator('#lessonReader.is-visible').waitFor({ timeout: 20000 });
assert.match(page.url(), /#\/lesson\/lesson-test$/);

await page.reload();
await page.locator('#lessonReader.is-visible').waitFor({ timeout: 20000 });
assert.equal(await page.locator('#readerTitle').textContent(), 'Урок');

await page.goto('https://thexillix.github.io/rko-platform/#/admin/accounts');
await page.locator('#adminPanel.is-current').waitFor();
assert.ok(await page.locator('.admin-tab[data-tab="accounts"]').evaluate(el => el.classList.contains('is-current')));
await page.reload();
await page.locator('#adminPanel.is-current').waitFor();
assert.ok(await page.locator('.admin-tab[data-tab="accounts"]').evaluate(el => el.classList.contains('is-current')));

await page.goto('https://thexillix.github.io/rko-platform/#/course/section-test/module-test');
await page.locator('.course-row[data-course-id="lesson-test"]').waitFor();
await page.reload();
await page.locator('.course-row[data-course-id="lesson-test"]').waitFor();

for (const [route, selector] of [
  ['/offers', '#offersPage.is-active'],
  ['/club', '#clubLayer.is-visible'],
  ['/conifer', '#coniferWidget.is-fullscreen'],
]) {
  await page.goto(`https://thexillix.github.io/rko-platform/#${route}`);
  await page.locator(selector).waitFor();
  await page.reload();
  await page.locator(selector).waitFor();
  assert.match(page.url(), new RegExp(`#${route.replaceAll('/', '\\/')}$`));
}

await page.goto('https://thexillix.github.io/rko-platform/#/does-not-exist');
await page.locator('#dashboardPage.is-active').waitFor();
assert.match(page.url(), /#\/$/);
assert.deepEqual(errors, []);
console.log('PASS: direct lesson/auth return, reload persistence, admin tab, course path, offers, club, conifer, and unknown-route fallback.');
await browser.close();
