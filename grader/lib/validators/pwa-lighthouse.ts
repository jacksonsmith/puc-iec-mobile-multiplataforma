/**
 * Validator — Atividade 4 — PWA Offline-First (Mobile Multi).
 *
 * Critérios (15 pts total):
 *   1. manifest.json (Web App Manifest) válido                              — 3pts
 *   2. service-worker.js ou sw.js presente                                  — 3pts
 *   3. Workbox importado/configurado                                        — 2pts
 *   4. IndexedDB ou Dexie usado em algum arquivo JS/TS                      — 3pts
 *   5. Lighthouse CI config (lighthouserc.{js,json,yml})                    — 3pts
 *   6. README explicando estratégia de cache                                — 1pt
 */

import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  type GradeCriterion,
  type GradeResult,
  buildBreakdowns,
  computeScore,
  passThreshold,
} from '../compute-score.js';
import { parseArgs, findFiles, fileMatchesAny, findReadme, readJsonSafe } from '../utils.js';

async function main() {
  const args = parseArgs();
  const criteria: GradeCriterion[] = [];

  // Critério 1: manifest.json
  const manifestCandidates = ['manifest.json', 'public/manifest.json', 'src/manifest.json'];
  const manifestPath = manifestCandidates
    .map((c) => join(args.entrega, c))
    .find(existsSync);
  const manifest = manifestPath ? readJsonSafe<any>(manifestPath) : null;
  const manifestValid = manifest && manifest.name && manifest.icons && Array.isArray(manifest.icons) && manifest.icons.length > 0;
  criteria.push({
    id: 'manifest',
    description: 'Web App Manifest válido (name + icons[])',
    weight: 3,
    earned: manifestValid ? 3 : manifestPath ? 1 : 0,
    publicNote: manifestValid
      ? 'Manifest com name e icons válidos'
      : manifestPath
        ? 'Manifest encontrado mas incompleto (faltam name e/ou icons)'
        : 'Manifest não encontrado',
  });

  // Critério 2: service worker
  const swCandidates = [
    'service-worker.js',
    'sw.js',
    'public/service-worker.js',
    'public/sw.js',
    'src/service-worker.ts',
    'src/sw.ts',
  ];
  const swPath = swCandidates.map((c) => join(args.entrega, c)).find(existsSync);
  criteria.push({
    id: 'service-worker',
    description: 'Service Worker presente (sw.js ou service-worker.ts)',
    weight: 3,
    earned: swPath ? 3 : 0,
    publicNote: swPath ? 'Service Worker encontrado' : 'SW não encontrado',
  });

  // Critério 3: Workbox
  const codeFiles = findFiles(args.entrega, ['.js', '.ts', '.jsx', '.tsx']);
  const usesWorkbox = fileMatchesAny(codeFiles, [
    /from\s+['"]workbox-/,
    /precacheAndRoute|registerRoute|CacheFirst|NetworkFirst|StaleWhileRevalidate/,
  ]);
  criteria.push({
    id: 'workbox',
    description: 'Workbox configurado (cache strategies)',
    weight: 2,
    earned: usesWorkbox ? 2 : 0,
    publicNote: usesWorkbox ? 'Workbox detectado' : 'Workbox não encontrado',
  });

  // Critério 4: IndexedDB / Dexie
  const usesIdb = fileMatchesAny(codeFiles, [
    /from\s+['"]dexie['"]/,
    /new\s+Dexie\s*\(/,
    /indexedDB\.open|window\.indexedDB/,
  ]);
  criteria.push({
    id: 'indexeddb',
    description: 'IndexedDB ou Dexie usado para persistência offline',
    weight: 3,
    earned: usesIdb ? 3 : 0,
    publicNote: usesIdb ? 'IndexedDB/Dexie detectado' : 'Não encontrado',
  });

  // Critério 5: Lighthouse CI config
  const lhciCandidates = [
    'lighthouserc.js',
    'lighthouserc.json',
    'lighthouserc.cjs',
    'lighthouserc.yml',
    '.lighthouserc.js',
  ];
  const lhciPath = lhciCandidates.map((c) => join(args.entrega, c)).find(existsSync);
  criteria.push({
    id: 'lighthouse-ci',
    description: 'Lighthouse CI configurado (lighthouserc.{js,json,yml})',
    weight: 3,
    earned: lhciPath ? 3 : 0,
    publicNote: lhciPath ? 'Lighthouse CI config encontrada' : 'Esperado lighthouserc.{js,json,yml}',
  });

  // Critério 6: README
  const readme = findReadme(args.entrega);
  criteria.push({
    id: 'readme',
    description: 'README explicando estratégia de cache',
    weight: 1,
    earned: readme ? 1 : 0,
    publicNote: readme ? 'README encontrado' : 'README.md ausente',
  });

  const { total, score } = computeScore(criteria);
  const minimo = passThreshold(total, 60);
  const { publicBreakdown, privateBreakdown } = buildBreakdowns(criteria);

  const result: GradeResult = {
    atividade: 'MOBILE-A4-PWA-Offline-First',
    total,
    score: +score.toFixed(2),
    minimo,
    pass: score >= minimo,
    criteria,
    publicBreakdown,
    privateBreakdown,
    metadata: {
      studentLogin: args.studentLogin,
      entregaPath: args.entrega,
      timestamp: new Date().toISOString(),
      commitSha: args.commitSha,
    },
  };

  writeFileSync(args.output, JSON.stringify(result, null, 2));
  console.log(`Grade: ${result.score}/${result.total} (min ${result.minimo}) — ${result.pass ? 'PASS' : 'FAIL'}`);
  process.exit(result.pass ? 0 : 1);
}

main().catch((e) => {
  console.error('Validator error:', e);
  process.exit(2);
});
