/**
 * Captures the screenshots embedded in the client questions PDF.
 *
 * Runs entirely against the LOCAL dev servers (frontend :5173, backend :4000).
 * Nothing is deployed and no URL is exposed — the images are the only artefact
 * that leaves this machine.
 *
 *   node scripts/client-screenshots.mjs
 *
 * Auth note: the route guards are currently removed from `App.tsx`, but the
 * pages still need a token in localStorage to fetch anything, so each session
 * is seeded with a real one before navigating.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const API = 'http://localhost:4000/api';
const APP = 'http://localhost:5173';
const OUT = resolve(process.cwd(), '../knowledge/05-audits/screenshots');

const ADMIN = { email: 'admin@ecolunch.local', password: 'admin1234' };
const CATERER = { email: 'jane@testkitchen.example', password: 'TestPass1234!' };

async function token(path, body) {
  const r = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`login failed ${path}: ${r.status}`);
  return (await r.json()).token;
}

/** Waits for the page to actually have content, not just for navigation to resolve. */
async function settle(page, mustContain) {
  await page.waitForLoadState('networkidle');
  if (mustContain) {
    await page.getByText(mustContain, { exact: false }).first()
      .waitFor({ timeout: 15000 })
      .catch(() => console.warn(`   ! never saw "${mustContain}" — check this shot`));
  }
  await page.waitForTimeout(900); // let progress bars/animations land
}

/**
 * `maxRatio` caps how tall a shot may be relative to its width. A full-page
 * capture of a long list runs to 1:2.4, which shrinks to an illegible strip once
 * placed in an A4 document — so it is clipped from the top instead, keeping the
 * part that carries the point (the heading, the counts, the first rows).
 */
async function shot(page, name, opts = {}) {
  const file = `${OUT}/${name}.png`;
  const fullPage = opts.fullPage ?? false;
  let clip;

  if (fullPage && opts.maxRatio) {
    const h = await page.evaluate(() => document.body.scrollHeight);
    const w = page.viewportSize().width;
    const cap = Math.round(w * opts.maxRatio);
    if (h > cap) clip = { x: 0, y: 0, width: w, height: cap };
  }

  await page.screenshot({ path: file, fullPage: clip ? false : fullPage, ...(clip ? { clip } : {}) });
  console.log(`   ✓ ${name}.png${clip ? `  (clipped to ${clip.height}px)` : ''}`);
}

const run = async () => {
  mkdirSync(OUT, { recursive: true });

  const [adminToken, catererToken] = await Promise.all([
    token('/auth/login', ADMIN),
    token('/caterer/auth/login', CATERER),
  ]);

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2, // retina — stays sharp when placed in a PDF
  });

  // Seed both tokens before any page script runs. Language is pinned to English
  // so the images match the client's own documents, which are English — the app
  // otherwise renders a French sidebar against English page content.
  await ctx.addInitScript(
    ([a, c]) => {
      localStorage.setItem('authToken', a);
      localStorage.setItem('catererAuthToken', c);
      localStorage.setItem('ecolunch-lang', 'en');
    },
    [adminToken, catererToken],
  );

  const page = await ctx.newPage();

  console.log('\nQ5 — the seven modules an admin can activate');
  await page.goto(`${APP}/admin/modules-pricing`, { waitUntil: 'domcontentloaded' });
  await settle(page, 'Dashboard');
  // The page opens on its Dashboard tab; the module list lives behind "Modules".
  await page.getByText('Modules', { exact: true }).first().click();
  await settle(page, 'Parent Subscriptions');
  await shot(page, 'q5a-admin-seven-modules', { fullPage: true });

  console.log('Q5 — what the caterer actually sees');
  await page.goto(`${APP}/caterer/modules`, { waitUntil: 'domcontentloaded' });
  await settle(page, 'Modules');
  await shot(page, 'q5b-caterer-five-modules', { fullPage: true, maxRatio: 1.15 });

  console.log('Q3 — the documents every caterer is asked for');
  await page.goto(`${APP}/caterer/document-vault`, { waitUntil: 'domcontentloaded' });
  await settle(page, 'Document Vault');
  await shot(page, 'q3-required-documents', { fullPage: true, maxRatio: 1.15 });

  console.log('Q4 — Quebec and French bank details in one form');
  await page.goto(`${APP}/caterer/banking`, { waitUntil: 'domcontentloaded' });
  await settle(page, 'Banking');
  // Overview only shows completion bars; the Bank Details tab shows the stored
  // fields themselves — Quebec transit/institution numbers next to the French
  // RIB requirement, which is the whole point of the question.
  await page.getByText('Bank Details', { exact: false }).first().click();
  await settle(page, 'Transit');
  await shot(page, 'q4-banking-regions', { fullPage: true, maxRatio: 1.15 });

  console.log('Q6 — establishments stuck on pending');
  await page.goto(`${APP}/caterer/establishments`, { waitUntil: 'domcontentloaded' });
  await settle(page, 'Establishments');
  await shot(page, 'q6-establishments-pending', { fullPage: true, maxRatio: 1.15 });

  await browser.close();
  console.log(`\nSaved to ${OUT}\n`);
};

run().catch((e) => {
  console.error('\nFAILED:', e.message);
  process.exit(1);
});
