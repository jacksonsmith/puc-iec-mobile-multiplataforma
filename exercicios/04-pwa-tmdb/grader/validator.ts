// grader/validator.ts — A4 PWA (Arquitetura)
// Valida TODO 1, TODO 2 e TODO 3 estruturalmente.
// Uso: npx ts-node grader/validator.ts --entrega <path-to-pratica>

import * as fs from 'fs';
import * as path from 'path';

const args = process.argv.slice(2);
const entregaIdx = args.indexOf('--entrega');
const entregaPath = entregaIdx !== -1 ? args[entregaIdx + 1] : '.';

function read(rel: string): string {
  const p = path.join(entregaPath, rel);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}

// ─── TODO 1: fetchPopularMovies ──────────────────────────────────────────────
function checkTodo1(): { pass: boolean; note: string } {
  const src = read('src/services/tmdb.ts');
  const hasThrow = src.includes("throw new Error('TODO 1");
  // `.get<MoviesResponse>(...)` — o `<Tipo>` genérico do TS fica entre `.get` e `(`,
  // então checagem por substring literal ('.get(') dava falso-negativo no próprio gabarito.
  const hasGet = /\.get\s*(<[^>]*>)?\s*\(/.test(src);
  const hasReturn = /return\s+(await\s+)?.*\.data/.test(src) || /return\s+data/.test(src);

  if (hasThrow) return { pass: false, note: 'fetchPopularMovies ainda lança TODO stub' };
  if (!hasGet)  return { pass: false, note: 'fetchPopularMovies não chama tmdbClient.get()' };
  if (!hasReturn) return { pass: false, note: 'fetchPopularMovies não retorna os dados' };
  return { pass: true, note: 'fetchPopularMovies implementada' };
}

// ─── TODO 2: it.todo → testes reais ─────────────────────────────────────────
function checkTodo2(): { pass: boolean; note: string; count: number } {
  const src = read('src/__tests__/unit/03-useFavorites.test.ts');
  const todos  = (src.match(/it\.todo\(/g) ?? []).length;
  const reals  = (src.match(/\bit\s*\(/g) ?? []).length;
  // expect at least 3 real tests beyond the 2 model ones (= 5 total)
  if (todos > 0) return { pass: false, note: `${todos} caso(s) ainda como it.todo — implemente todos`, count: reals };
  if (reals < 5) return { pass: false, note: `esperado ≥5 it() em 03-useFavorites, encontrado ${reals}`, count: reals };
  return { pass: true, note: `03-useFavorites: ${reals} testes implementados`, count: reals };
}

// ─── TODO 3a: favorites tab renders list ─────────────────────────────────────
function checkTodo3a(): { pass: boolean; note: string } {
  const src = read('src/screens/HomeScreen.tsx');
  const hasFavMovies = src.includes('isFavorite(m.id)') || src.includes("activeTab === 'favorites'");
  const hasMap       = /favMovies\s*\.\s*map/.test(src) || /movies\s*\.\s*filter/.test(src);
  const hasPlaceholder = src.includes('🚧 Passo 1');

  if (hasPlaceholder) return { pass: false, note: 'Passo 1: placeholder ainda presente, lista não implementada' };
  if (!hasFavMovies)  return { pass: false, note: 'Passo 1: filtro por isFavorite não encontrado' };
  if (!hasMap)        return { pass: false, note: 'Passo 1: .map sobre favoritos não encontrado' };
  return { pass: true, note: 'Passo 1: aba Favoritos renderiza lista' };
}

// ─── TODO 3b: empty state ────────────────────────────────────────────────────
function checkTodo3b(): { pass: boolean; note: string } {
  const src = read('src/screens/HomeScreen.tsx');
  const hasEmptyMsg = src.includes('Nenhum favorito') || src.includes('Nenhum filme carregado');
  if (!hasEmptyMsg) return { pass: false, note: 'Passo 2: estado vazio não implementado' };
  return { pass: true, note: 'Passo 2: estado vazio presente' };
}

// ─── TODO 3c: useOfflineStatus hook ──────────────────────────────────────────
function checkTodo3c(): { pass: boolean; note: string } {
  const hookSrc = read('src/hooks/useOfflineStatus.ts');
  const hasOnline    = hookSrc.includes("'online'") || hookSrc.includes('"online"');
  const hasOffline   = hookSrc.includes("'offline'") || hookSrc.includes('"offline"');
  const hasListener  = hookSrc.includes('addEventListener');
  const hasCleanup   = hookSrc.includes('removeEventListener');
  const hasNavOnline = hookSrc.includes('navigator.onLine');
  const isStub       = hookSrc.includes('return { isOnline: true }') && !hasListener;

  if (isStub)         return { pass: false, note: 'Passo 3: useOfflineStatus ainda é stub (sem listeners)' };
  if (!hasNavOnline)  return { pass: false, note: 'Passo 3: não usa navigator.onLine para estado inicial' };
  if (!hasOnline || !hasOffline) return { pass: false, note: 'Passo 3: listeners "online"/"offline" ausentes' };
  if (!hasCleanup)    return { pass: false, note: 'Passo 3: removeEventListener (cleanup) ausente' };

  // Also check it's actually used in HomeScreen
  const screen = read('src/screens/HomeScreen.tsx');
  const usedInScreen = screen.includes('useOfflineStatus') && screen.includes('isOnline');
  if (!usedInScreen) return { pass: false, note: 'Passo 3: useOfflineStatus não usado em HomeScreen' };

  return { pass: true, note: 'Passo 3: hook offline com cleanup + usado na tela' };
}

// ─── Run ─────────────────────────────────────────────────────────────────────
const t1  = checkTodo1();
const t2  = checkTodo2();
const t3a = checkTodo3a();
const t3b = checkTodo3b();
const t3c = checkTodo3c();

// Pesos batem com a rubrica do enunciado.md (Critérios de avaliação) — soma 15.
const results = [
  { id: 'todo1',   label: 'TODO 1 — fetchPopularMovies', weight: 4, ...t1 },
  { id: 'todo2',   label: 'TODO 2 — 3 testes useFavorites', weight: 4, ...t2 },
  { id: 'todo3a',  label: 'TODO 3 Passo 1 — render favorites list', weight: 3, ...t3a },
  { id: 'todo3b',  label: 'TODO 3 Passo 2 — empty state', weight: 2, ...t3b },
  { id: 'todo3c',  label: 'TODO 3 Passo 3 — useOfflineStatus hook', weight: 2, ...t3c },
];

let allPass = true;
for (const r of results) {
  const icon = r.pass ? '✅' : '❌';
  console.log(`${icon} ${r.label} (${r.pass ? r.weight : 0}/${r.weight}): ${r.note}`);
  if (!r.pass) allPass = false;
}

const autoScore = results.reduce((sum, r) => sum + (r.pass ? r.weight : 0), 0);
const maxScore = results.reduce((sum, r) => sum + r.weight, 0);

const grade = {
  results,
  allPass,
  autoScore,
  maxScore,
  summary: allPass ? 'Todos os critérios estruturais passaram.' : 'Há critérios pendentes — ver detalhes acima.',
};

fs.writeFileSync('grade.json', JSON.stringify(grade, null, 2));
console.log('\ngrade.json gerado.');
process.exit(allPass ? 0 : 1);
