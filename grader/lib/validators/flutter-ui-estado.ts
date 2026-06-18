/**
 * Validator — Atividade 3 — App Flutter: UI + Estado + Testes (Arquitetura).
 *
 * RUBRICA REAL do enunciado (15 pts):
 *  1. App compila/roda + `flutter analyze` limpo        — 2pts [MANUAL · eliminatório]
 *  2. Ex1 · MovieCard compõe título + nota (⭐) + ano    — 3pts
 *  3. Ex2 · favoritar reflete no card + contador         — 4pts
 *  4. Ex2 · botão limpar zera o estado                   — 2pts
 *  5. Ex3 · teste autoral do provider (favorites_test)   — 3pts
 *  6. README + parágrafo (provider vs prop drilling)     — 1pt  [MANUAL]
 *
 * ESTRUTURAL: só LÊ os .dart da entrega (nunca executa código do aluno) — seguro
 * sob pull_request_target. **Ignora linhas comentadas** (os scaffolds trazem o
 * modelo em comentários; sem stripping daria falso-positivo). Piso = auto (12).
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import {
  type GradeCriterion,
  type GradeResult,
  buildBreakdowns,
  computeScore,
  computeAuto,
  passThreshold,
} from '../compute-score.js';
import { parseArgs, findFiles } from '../utils.js';

function read(path: string): string {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return '';
  }
}
// remove linhas comentadas (// ...) — os scaffolds têm a solução em comentário
function stripComments(s: string): string {
  return s
    .split('\n')
    .filter((l) => !l.trimStart().startsWith('//'))
    .join('\n');
}

async function main() {
  const args = parseArgs();
  const criteria: GradeCriterion[] = [];

  const dartFiles = findFiles(args.entrega, ['.dart']);
  const byName = (n: string) =>
    stripComments(dartFiles.filter((f) => basename(f) === n).map(read).join('\n'));
  const card = byName('movie_card.dart');
  const favorites = byName('favorites.dart');
  const home = byName('home_screen.dart');
  const favTest = byName('favorites_test.dart');

  // ---- 1. Compila/analyze — MANUAL (eliminatório) ----
  criteria.push({
    id: 'compila',
    description: 'App compila/roda e `flutter analyze` limpo (eliminatório)',
    weight: 2,
    manual: true,
    earned: 0,
    publicNote: 'Conferido na correção (flutter analyze / flutter run)',
  });

  // ---- 2. Ex1 — MovieCard compõe (3) ----
  const bits = ['Card', 'Column', 'Row', 'Icon', 'movie.rating', 'movie.year'].filter((b) =>
    card.includes(b),
  ).length;
  criteria.push({
    id: 'ex1-ui',
    description: 'Ex1 · MovieCard compõe título + nota (⭐) + ano',
    weight: 3,
    earned: bits >= 6 ? 3 : bits >= 4 ? 2 : bits >= 2 ? 1 : 0,
    publicNote: `${bits}/6 elementos no card (Card/Column/Row/Icon/rating/ano)`,
  });

  // ---- 3. Ex2 — favoritar reflete (4): provider+toggle · card consumer · header count ----
  const providerOk =
    /NotifierProvider|StateNotifierProvider|ChangeNotifierProvider/.test(favorites) &&
    /\btoggle\b/.test(favorites);
  const cardConsumer =
    /ConsumerWidget/.test(card) && /ref\.watch\(\s*favoritesProvider/.test(card) && /toggle/.test(card);
  const headerCount = /ref\.watch\(\s*favoritesProvider/.test(home) && /\.length/.test(home);
  const favEarned = (providerOk ? 1.5 : 0) + (cardConsumer ? 1.5 : 0) + (headerCount ? 1 : 0);
  criteria.push({
    id: 'ex2-fav',
    description: 'Ex2 · favoritar reflete no card + contador (provider compartilhado)',
    weight: 4,
    earned: +favEarned.toFixed(1),
    publicNote: `provider+toggle=${providerOk} · card ConsumerWidget=${cardConsumer} · contador=${headerCount}`,
  });

  // ---- 4. Ex2 — limpar (2): clear() no provider + botão chamando clear ----
  const clearInProvider = /\bclear\b/.test(favorites);
  const clearButton = /delete_outline/.test(home) || /\.notifier\)\s*\.clear\(\)/.test(home);
  criteria.push({
    id: 'ex2-limpar',
    description: 'Ex2 · botão limpar zera o estado',
    weight: 2,
    earned: clearInProvider && clearButton ? 2 : clearInProvider || clearButton ? 1 : 0,
    publicNote: `clear() no provider=${clearInProvider} · botão limpar=${clearButton}`,
  });

  // ---- 5. Ex3 — teste autoral do provider (3) ----
  const hasTest = /\btest\s*\(/.test(favTest);
  const usesProvider = /favoritesProvider/.test(favTest);
  criteria.push({
    id: 'ex3-teste',
    description: 'Ex3 · teste autoral do provider (test/favorites_test.dart)',
    weight: 3,
    earned: hasTest && usesProvider ? 3 : hasTest || usesProvider ? 1 : 0,
    publicNote:
      hasTest && usesProvider
        ? 'teste do provider escrito (test() usando favoritesProvider)'
        : 'favorites_test.dart sem um test() de verdade usando favoritesProvider',
  });

  // ---- 6. README + parágrafo — MANUAL ----
  criteria.push({
    id: 'readme',
    description: 'README — como rodar + parágrafo (provider vs prop drilling)',
    weight: 1,
    manual: true,
    earned: 0,
    publicNote: 'Lido na correção (Canvas)',
  });

  const { total } = computeScore(criteria);
  const { autoScore, autoTotal, manualTotal } = computeAuto(criteria);
  const minimo = passThreshold(total, 60);
  const { publicBreakdown, privateBreakdown } = buildBreakdowns(criteria);

  const result: GradeResult = {
    atividade: 'MOBILE-A3-Flutter-UI-Estado',
    total,
    score: autoScore,
    autoScore,
    autoTotal,
    manualTotal,
    minimo,
    pass: autoScore >= minimo,
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
