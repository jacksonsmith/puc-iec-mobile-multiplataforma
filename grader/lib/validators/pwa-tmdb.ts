/**
 * Validator — Atividade 7 — PWA TMDB (Arquitetura Mobile Multiplataforma).
 *
 * RUBRICA REAL do enunciado (15 pts):
 *   1. fetchPopularMovies chama tmdbClient.get('/movie/popular', language:'pt-BR')  — 8 pts
 *   2. fetchPopularMovies propaga erro (ex.: 401 inválido)                          — 4 pts
 *   3. useFavorites testes 3+4+5 implementados (não-todo, asserções reais)          — 3 pts
 *
 * Lê a saída JSON do Vitest (--reporter=json --outputFile=) e pontua com base
 * nos testes que passaram. NUNCA executa código do aluno — o test harness vem do main.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { basename } from 'node:path';
import {
  type GradeCriterion,
  type GradeResult,
  buildBreakdowns,
  computeAuto,
  passThreshold,
} from '../compute-score.js';

interface CliArgs {
  results: string;
  output: string;
  studentLogin: string;
  commitSha: string;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const get = (flag: string, def?: string) => {
    const i = args.indexOf(flag);
    if (i === -1) {
      if (def !== undefined) return def;
      throw new Error(`Missing required flag: ${flag}`);
    }
    return args[i + 1] ?? '';
  };
  return {
    results: get('--results'),
    output: get('--output'),
    studentLogin: get('--student-login', 'unknown'),
    commitSha: get('--commit-sha', 'unknown'),
  };
}

function readJsonSafe(path: string): any | null {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

/** Status de um teste específico pelo nome do arquivo + substring do título.
 *  Vitest usa 'todo' (não 'skipped') para it.todo(). Normalizamos pra 'skipped'. */
function testStatus(
  results: any,
  fileKey: string,
  titleSubstring: string,
): 'passed' | 'failed' | 'skipped' | 'not-found' {
  const file = (results?.testResults ?? []).find((r: any) =>
    basename(r.name ?? '').toLowerCase().includes(fileKey.toLowerCase()),
  );
  if (!file) return 'not-found';
  const test = (file.assertionResults ?? []).find((a: any) =>
    String(a.fullName ?? a.title ?? '').toLowerCase().includes(titleSubstring.toLowerCase()),
  );
  if (!test) return 'not-found';
  const s = String(test.status);
  if (s === 'todo' || s === 'skipped' || s === 'pending') return 'skipped';
  return s as 'passed' | 'failed';
}

async function main() {
  const args = parseArgs();
  const results = readJsonSafe(args.results);
  const ran = !!results && (results.numTotalTests ?? 0) > 0;
  const criteria: GradeCriterion[] = [];

  // 1) fetchPopularMovies chama tmdbClient.get + language:'pt-BR' (teste 1 do service)
  const t1 = testStatus(results, '02-tmdb-service', 'retorna lista');
  criteria.push({
    id: 'tmdb-get-call',
    description: 'fetchPopularMovies chama tmdbClient.get com endpoint e language:pt-BR',
    weight: 8,
    earned: ran && t1 === 'passed' ? 8 : 0,
    publicNote:
      !ran
        ? 'suíte não executou'
        : t1 === 'passed'
          ? 'tmdbClient.get chamado com parâmetros corretos'
          : t1 === 'not-found'
            ? '02-tmdb-service.test.ts não encontrado — abra a pasta pratica/ corretamente'
            : 'teste 1 falhou — verifique o endpoint e os params',
    privateNote: `t1=${t1}`,
  });

  // 2) fetchPopularMovies propaga erro (teste 2 do service)
  const t2 = testStatus(results, '02-tmdb-service', 'propaga erro');
  criteria.push({
    id: 'tmdb-error-propagation',
    description: 'fetchPopularMovies propaga erro quando API lança (ex.: 401)',
    weight: 4,
    earned: ran && t2 === 'passed' ? 4 : 0,
    publicNote:
      !ran
        ? 'suíte não executou'
        : t2 === 'passed'
          ? 'erro propagado corretamente'
          : t2 === 'not-found'
            ? 'teste 2 não encontrado'
            : 'teste 2 falhou — o throw do tmdbClient deve se propagar',
    privateNote: `t2=${t2}`,
  });

  // 3a) useFavorites teste 3 — toggle duas vezes remove
  // manual=true: aluno escreve o próprio teste — trivialmente gameable (expect(true).toBe(true)).
  // Bot mostra no breakdown como informativo; nota manual confirmada no Canvas.
  const f3 = testStatus(results, '03-useFavorites', 'toggle duas vezes');
  criteria.push({
    id: 'fav-toggle-remove',
    description: 'useFavorites: toggle duas vezes remove o favorito (teste 3)',
    weight: 1,
    earned: ran && f3 === 'passed' ? 1 : 0,
    manual: true,
    publicNote:
      !ran
        ? 'suíte não executou'
        : f3 === 'passed'
          ? 'implementado'
          : f3 === 'skipped'
            ? 'ainda como it.todo — implemente o corpo do teste'
            : f3 === 'not-found'
              ? 'teste 3 não encontrado'
              : 'teste 3 falhou',
    privateNote: `f3=${f3}`,
  });

  // 3b) useFavorites teste 4 — persiste no localStorage
  const f4 = testStatus(results, '03-useFavorites', 'persiste');
  criteria.push({
    id: 'fav-localstorage',
    description: 'useFavorites: persiste favoritos no localStorage (teste 4)',
    weight: 1,
    earned: ran && f4 === 'passed' ? 1 : 0,
    manual: true,
    publicNote:
      !ran
        ? 'suíte não executou'
        : f4 === 'passed'
          ? 'implementado'
          : f4 === 'skipped'
            ? 'ainda como it.todo — implemente o corpo do teste'
            : f4 === 'not-found'
              ? 'teste 4 não encontrado'
              : 'teste 4 falhou',
    privateNote: `f4=${f4}`,
  });

  // 3c) useFavorites teste 5 — setAppBadge
  const f5 = testStatus(results, '03-useFavorites', 'setAppBadge');
  criteria.push({
    id: 'fav-badge',
    description: 'useFavorites: chama navigator.setAppBadge (teste 5)',
    weight: 1,
    earned: ran && f5 === 'passed' ? 1 : 0,
    manual: true,
    publicNote:
      !ran
        ? 'suíte não executou'
        : f5 === 'passed'
          ? 'implementado'
          : f5 === 'skipped'
            ? 'ainda como it.todo — implemente o corpo do teste'
            : f5 === 'not-found'
              ? 'teste 5 não encontrado'
              : 'teste 5 falhou',
    privateNote: `f5=${f5}`,
  });

  const total = criteria.reduce((acc, c) => acc + c.weight, 0);
  const { autoScore, autoTotal, manualTotal } = computeAuto(criteria);
  const minimo = passThreshold(autoTotal, 60); // 60% dos pontos auto-verificáveis (12 pts)
  const { publicBreakdown, privateBreakdown } = buildBreakdowns(criteria);

  const result: GradeResult = {
    atividade: 'ARQ-A7-PWA-TMDB',
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
      entregaPath: args.results,
      timestamp: new Date().toISOString(),
      commitSha: args.commitSha,
    },
  };

  writeFileSync(args.output, JSON.stringify(result, null, 2));
  console.log(
    `Grade: ${result.score}/${result.total} (min ${result.minimo}) — ${result.pass ? 'PASS' : 'FAIL'}`,
  );
  process.exit(result.pass ? 0 : 1);
}

main().catch((e) => {
  console.error('Validator error:', e);
  process.exit(2);
});
