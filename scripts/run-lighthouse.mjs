import fs from 'node:fs';
import path from 'node:path';
import { TEMPLATE_CANONICAL_DOMAIN, TEMPLATE_SITE_URL } from './template-site.mjs';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import * as chromeLauncher from 'chrome-launcher';

const url = process.env.LH_URL ?? 'http://127.0.0.1:4325/';
const outDir = path.resolve('docs');
fs.mkdirSync(outDir, { recursive: true });

function failingAudits(report) {
  const categoryAudits = new Set();
  for (const cat of Object.values(report.categories)) {
    for (const ref of cat.auditRefs ?? []) {
      if (ref.weight) categoryAudits.add(ref.id);
    }
  }
  return Object.entries(report.audits)
    .filter(([id, audit]) => categoryAudits.has(id) && audit.score !== null && audit.score < 1)
    .map(([id, audit]) => ({
      id,
      title: audit.title,
      score: audit.score,
      displayValue: audit.displayValue,
      description: audit.description?.slice(0, 120),
    }))
    .sort((a, b) => (a.score ?? 0) - (b.score ?? 0));
}

const auditPort = process.env.LH_HTTPS === '1' ? (process.env.HTTPS_PORT ?? '4326') : (process.env.PORT ?? '4325');
const useHttps = process.env.LH_HTTPS === '1';
const auditUrl =
  process.env.LH_CANONICAL_URL ??
  (useHttps
    ? `${TEMPLATE_SITE_URL}:${auditPort}/`
    : `http://localhost:${auditPort}/`);
const chromeFlags = [
  '--headless=new',
  '--no-sandbox',
  `--host-resolver-rules=MAP ${TEMPLATE_CANONICAL_DOMAIN} 127.0.0.1`,
  ...(useHttps
    ? [
        '--ignore-certificate-errors',
        '--allow-insecure-localhost',
        '--allow-running-insecure-content',
      ]
    : []),
];

for (const mode of ['mobile', 'desktop']) {
  const chrome = await chromeLauncher.launch({ chromeFlags });
  try {
    const options = {
      logLevel: 'error',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: chrome.port,
    };
    const config = mode === 'desktop' ? desktopConfig : undefined;
    const runner = await lighthouse(auditUrl, options, config);
    const report = runner.lhr;
    fs.writeFileSync(path.join(outDir, `lighthouse-${mode}.json`), runner.report);
    const scores = Object.fromEntries(
      Object.entries(report.categories).map(([key, value]) => [key, Math.round(value.score * 100)]),
    );
    console.log(`\n=== ${mode} ===`);
    console.log(JSON.stringify(scores, null, 2));
    const fails = failingAudits(report);
    if (fails.length) {
      console.log('Failing / partial audits:');
      for (const fail of fails.slice(0, 25)) {
        console.log(`  [${fail.score}] ${fail.id}: ${fail.title}${fail.displayValue ? ` (${fail.displayValue})` : ''}`);
      }
    }
  } finally {
    await chrome.kill();
  }
}

const mobileReport = JSON.parse(fs.readFileSync(path.join(outDir, 'lighthouse-mobile.json'), 'utf8'));
const desktopReport = JSON.parse(fs.readFileSync(path.join(outDir, 'lighthouse-desktop.json'), 'utf8'));
const required = ['performance', 'accessibility', 'best-practices', 'seo'];
const summary = ['mobile', 'desktop'].map((mode, i) => {
  const report = i === 0 ? mobileReport : desktopReport;
  return { mode, scores: Object.fromEntries(required.map((k) => [k, Math.round(report.categories[k].score * 100)])) };
});
const failed = summary.flatMap(({ mode, scores }) =>
  Object.entries(scores).filter(([, score]) => score < 100).map(([cat, score]) => `${mode}/${cat}=${score}`),
);
if (failed.length) {
  console.error('\nScores below 100:', failed.join(', '));
  process.exitCode = 1;
} else {
  console.log('\nAll Lighthouse categories scored 100 (mobile + desktop).');
}
