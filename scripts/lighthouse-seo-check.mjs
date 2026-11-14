import fs from 'node:fs';
import { chromium } from '../.seo-tools/node_modules/playwright/index.mjs';
import lighthouse from '../.seo-tools/node_modules/lighthouse/core/index.js';
import desktop from '../.seo-tools/node_modules/lighthouse/core/config/desktop-config.js';

const mode = process.argv.includes('--desktop') ? 'desktop' : 'mobile';
const port = mode === 'desktop' ? 9438 : 9437;
let browser;
try {
  browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, ignoreDefaultArgs: ['--disable-back-forward-cache'], args: [`--remote-debugging-port=${port}`] });
  const result = await lighthouse('http://localhost:4325/', { port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] }, mode === 'desktop' ? desktop : undefined);
  fs.writeFileSync(`docs/seo-lighthouse-${mode}.json`, result.report);
  const r = result.lhr;
  console.log(JSON.stringify({ mode, scores: Object.fromEntries(Object.entries(r.categories).map(([key, value]) => [key, value.score])), lcp: r.audits['largest-contentful-paint'].numericValue, cls: r.audits['cumulative-layout-shift'].numericValue, tbt: r.audits['total-blocking-time'].numericValue, error: r.runtimeError }));
  if (r.runtimeError) process.exitCode = 1;
} catch (error) { console.error(error); process.exitCode = 1; }
finally { if (browser) await browser.close(); }
// Lighthouse can retain its protocol connection after report generation.
// Chrome is closed above; no long-lived audit process is required.
process.exit(process.exitCode ?? 0);
