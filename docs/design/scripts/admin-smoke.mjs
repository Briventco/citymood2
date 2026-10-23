// End-to-end smoke test of the newsroom against a running dev server.
// Usage: node docs/design/scripts/admin-smoke.mjs [baseUrl]
//
// As a Reporter (demo switcher): writes a story, waits for autosave, uploads a
// photo (resized in the browser), adds alt text, marks it Breaking and
// publishes. Then checks the homepage ticker shows it, that the reporter can't
// reach the Front page, and (as an Editor) pins it as the lead. Leaves the
// story in data/admin-dev.json; delete that file to reseed.

import { chromium } from 'playwright';

const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const headline = `Smoke test story ${new Date().toISOString().slice(11, 19)} (fake)`;
const browser = await chromium.launch();
let failed = 0;
const check = (ok, label) => {
  console.log(`${ok ? '✓' : '✗'} ${label}`);
  if (!ok) failed++;
};

async function as(role, width = 1440) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();
  page.on('pageerror', (e) => console.log('  page error:', e.message));
  await page.goto(`${base}/admin/sign-in`);
  await page.getByRole('button', { name: role, exact: true }).click();
  await page.waitForURL(/\/admin\/articles/);
  return { context, page };
}

// ── Reporter writes and publishes ──
{
  const { context, page } = await as('Reporter');
  await page.goto(`${base}/admin/articles/new`);
  await page.locator('#headline').fill(headline);
  await page.locator('#category').selectOption({ label: 'Local News' });
  await page.locator('#standfirst').fill('A fake standfirst written by the smoke test.');
  await page.locator('.ProseMirror').click();
  await page.keyboard.type('Fake body text from the smoke test. Not CityMood reporting.');
  await page.locator('#standfirst').click(); // blur → autosave
  await page.waitForURL(/\/admin\/articles\/[0-9a-f-]{36}$/, { timeout: 15000 });
  check(/\/admin\/articles\/[0-9a-f-]{36}$/.test(page.url()), 'first save creates the draft and updates the URL');
  await page.getByText(/Saved (just now|\d+ minutes? ago)/).waitFor({ timeout: 15000 });
  check(true, 'autosave shows "Saved …"');

  check((await page.getByRole('switch', { name: 'Feature on homepage' }).count()) === 0, 'reporters do not see the Feature switch');

  await page.locator('input[type=file]:not([capture])').first().setInputFiles('public/seed/landscape-3.jpg');
  await page.locator('#image-alt').waitFor({ timeout: 20000 });
  check(true, 'photo uploads after resizing in the browser');

  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  check(await page.getByText(/Before publishing, add: image alt text/).isVisible(), 'publishing is blocked until the photo has alt text');

  await page.locator('#image-alt').fill('A fake photo of a lagoon for the smoke test');
  await page.getByRole('switch', { name: 'Breaking news' }).click();
  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  await page.getByText('Published. It’s live on the site now.').waitFor({ timeout: 15000 }).catch(async (e) => {
    await page.screenshot({ path: 'docs/design/screenshots/admin/smoke-failure.png', fullPage: true });
    console.log('  alerts:', await page.getByRole('alert').allTextContents());
    throw e;
  });
  check(true, 'publishes');

  const home = await context.newPage();
  await home.goto(base + '/');
  check((await home.content()).includes(headline), 'the homepage shows the story (breaking ticker)');

  await page.goto(`${base}/admin/front-page`);
  check(await page.getByText('You don’t have access to this page').isVisible(), 'reporters get "no access" on the Front page');
  await context.close();
}

// ── Editor pins it as the lead ──
{
  const { context, page } = await as('Editor');
  await page.goto(`${base}/admin/front-page`);
  const lead = page.getByRole('region', { name: 'Lead story' });
  if (await lead.count()) {
    await lead.getByRole('button', { name: /Change|Pin a story/ }).click();
    await page.getByRole('dialog').getByRole('button').filter({ hasText: headline }).first().click();
    await page.waitForTimeout(1000);
    const home = await context.newPage();
    await home.goto(base + '/');
    const h1 = await home.locator('h1').first().textContent();
    check(h1?.includes(headline), 'the pinned lead is the homepage lead');
  } else {
    console.log('- front page not built yet, skipping the lead pin');
  }
  await context.close();
}

await browser.close();
console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
process.exit(failed ? 1 : 0);
