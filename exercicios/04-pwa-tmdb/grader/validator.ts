// grader/validator.ts — A4 PWA (Arquitetura)
// Validação ESTRUTURAL e ESTÁTICA: só LÊ os arquivos da entrega (nunca executa código do aluno).
// Uso: npx ts-node validator.ts --entrega <path-to-pratica>
//
// Rubrica (enunciado.md): 12 pts automáticos (piso) + 3 pts manuais (ENTREGA.md, lançados no Canvas).

import * as fs from 'fs';
import * as path from 'path';

const args = process.argv.slice(2);
const entregaIdx = args.indexOf('--entrega');
const entregaPath = entregaIdx !== -1 ? args[entregaIdx + 1] : '.';

function read(rel: string): string {
  const p = path.join(entregaPath, rel);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}

// Remove comentários (// , /* */ e {/* */}) pra não pontuar texto que só está no enunciado do scaffold.
function code(rel: string): string {
  // Cuidado: globs como '**/*.{js}' contêm "/*" dentro de string — só remove comentário "de verdade":
  // bloco no início da linha, bloco JSX {/* */}, linha inteira // e comentário no fim da linha (" // ...").
  return read(rel)
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '')
    .replace(/(^|\n)[ \t]*\/\*[\s\S]*?\*\//g, '$1')
    .replace(/^[ \t]*\/\/.*$/gm, '')
    .replace(/[ \t]\/\/[ \t].*$/gm, '');
}

type Check = { pass: boolean; note: string };

// ─── TODO 1: fetchPopularMovies (2 pts) ─────────────────────────────────────
function checkTodo1(): Check {
  const src = code('src/services/tmdb.ts');
  if (src.includes("throw new Error('TODO 1")) return { pass: false, note: 'fetchPopularMovies ainda lança o stub' };
  const fn = src.slice(src.indexOf('fetchPopularMovies'));
  // `.get<MoviesResponse>(...)`: o <Tipo> genérico fica entre `.get` e `(`
  if (!/\.get\s*(<[^>]*>)?\s*\(/.test(fn)) return { pass: false, note: 'não chama tmdbClient.get(...)' };
  if (!/\/movie\/popular/.test(src)) return { pass: false, note: "endpoint '/movie/popular' não encontrado" };
  if (!/pt-BR/.test(fn)) return { pass: false, note: "falta params { language: 'pt-BR', page }" };
  if (!/return\s+(await\s+)?[^;]*\.data|return\s+data/.test(fn)) return { pass: false, note: 'não retorna o data da resposta' };
  return { pass: true, note: 'fetchPopularMovies implementada' };
}

// ─── TODO 2: runtimeCaching (4 pts = 2 + 2) ─────────────────────────────────
// Devolve o texto do objeto { ... } que envolve a primeira menção ao host (independe da ordem das chaves).
function blockFor(cfg: string, hostRegex: RegExp): string {
  const idx = cfg.search(hostRegex);
  if (idx === -1) return '';
  let depth = 0;
  let start = -1;
  for (let i = idx; i >= 0; i--) {
    if (cfg[i] === '}') depth++;
    else if (cfg[i] === '{') {
      if (depth === 0) { start = i; break; }
      depth--;
    }
  }
  if (start === -1) return '';
  depth = 0;
  for (let i = start; i < cfg.length; i++) {
    if (cfg[i] === '{') depth++;
    else if (cfg[i] === '}') { depth--; if (depth === 0) return cfg.slice(start, i + 1); }
  }
  return cfg.slice(start);
}

function checkTodo2a(): Check {
  const cfg = code('vite.config.ts');
  const b = blockFor(cfg, /api\\?\.themoviedb\\?\.org/);
  if (!b) return { pass: false, note: 'nenhuma regra para api.themoviedb.org no runtimeCaching' };
  if (!/handler\s*:\s*['"]NetworkFirst['"]/.test(b)) return { pass: false, note: 'API: use NetworkFirst (rede primeiro, cache como reserva)' };
  if (!/networkTimeoutSeconds\s*:\s*3\b/.test(b)) return { pass: false, note: 'API: falta networkTimeoutSeconds: 3' };
  if (!/cacheName\s*:\s*['"]tmdb-api['"]/.test(b)) return { pass: false, note: "API: cacheName deve ser 'tmdb-api'" };
  if (!/expiration\s*:/.test(b) || !/maxEntries\s*:\s*50\b/.test(b)) return { pass: false, note: 'API: expiration com maxEntries: 50 ausente' };
  if (!/maxAgeSeconds/.test(b)) return { pass: false, note: 'API: expiration sem maxAgeSeconds (1 dia)' };
  return { pass: true, note: 'API: NetworkFirst + timeout 3s + expiration' };
}

function checkTodo2b(): Check {
  const cfg = code('vite.config.ts');
  if (/image\\?\.themoviedb\\?\.org/.test(cfg) && !/image\\?\.tmdb\\?\.org/.test(cfg))
    return { pass: false, note: 'Pôsteres: o host do urlPattern não casa com as URLs dos pôsteres (confira no DevTools → Network)' };
  const b = blockFor(cfg, /image\\?\.tmdb\\?\.org/);
  if (!b) return { pass: false, note: 'nenhuma regra para image.tmdb.org no runtimeCaching' };
  if (!/handler\s*:\s*['"]CacheFirst['"]/.test(b)) return { pass: false, note: 'Pôsteres: use CacheFirst' };
  if (!/cacheName\s*:\s*['"]tmdb-images['"]/.test(b)) return { pass: false, note: "Pôsteres: cacheName deve ser 'tmdb-images'" };
  if (!/maxEntries\s*:\s*200\b/.test(b)) return { pass: false, note: 'Pôsteres: expiration com maxEntries: 200 ausente' };
  if (!/cacheableResponse\s*:\s*\{[^}]*statuses\s*:\s*\[[^\]]*\b0\b[^\]]*\]/.test(b))
    return { pass: false, note: 'Pôsteres: resposta opaca (status 0) precisa de cacheableResponse.statuses incluindo 0' };
  return { pass: true, note: 'Pôsteres: CacheFirst + expiration + cacheableResponse [0, 200]' };
}

// ─── TODO 3: atualização do app (3 pts = 1 + 2) ─────────────────────────────
function checkTodo3a(): Check {
  const cfg = code('vite.config.ts');
  if (!/registerType\s*:\s*['"]prompt['"]/.test(cfg)) return { pass: false, note: "registerType ainda não é 'prompt'" };
  return { pass: true, note: "registerType: 'prompt'" };
}

function checkTodo3b(): Check {
  const src = code('src/components/UpdatePrompt.tsx');
  if (!/useRegisterSW/.test(src)) return { pass: false, note: 'UpdatePrompt não usa useRegisterSW' };
  if (!/virtual:pwa-register\/react/.test(src)) return { pass: false, note: "import de 'virtual:pwa-register/react' ausente" };
  if (!/needRefresh/.test(src) || !/updateServiceWorker\s*\(/.test(src))
    return { pass: false, note: 'falta tratar needRefresh e chamar updateServiceWorker(...)' };
  if (!/offlineReady/.test(src)) return { pass: false, note: 'falta tratar offlineReady (aviso "pronto para uso offline")' };
  if (!/setNeedRefresh|setOfflineReady/.test(src)) return { pass: false, note: 'falta o botão que dispensa o aviso (setNeedRefresh/setOfflineReady)' };
  if (!/return\s+null/.test(src)) return { pass: false, note: 'sem nenhum aviso ativo o componente deve retornar null' };
  const app = code('src/App.tsx');
  if (!/<UpdatePrompt\s*\/>/.test(app)) return { pass: false, note: 'UpdatePrompt não está renderizado em App.tsx' };
  return { pass: true, note: 'UpdatePrompt com needRefresh + offlineReady + dispensar' };
}

// ─── TODO 4: aba Favoritos (2 pts = 1 + 1) ──────────────────────────────────
function checkTodo4a(): Check {
  const src = code('src/screens/HomeScreen.tsx');
  if (src.includes('🚧')) return { pass: false, note: 'Passo 1: placeholder ainda presente' };
  if (!/isFavorite\s*\(\s*m\.id\s*\)/.test(src)) return { pass: false, note: 'Passo 1: filtro por isFavorite(m.id) não encontrado' };
  if (!/favMovies\s*\.\s*map/.test(src)) return { pass: false, note: 'Passo 1: favMovies.map não encontrado' };
  return { pass: true, note: 'Passo 1: aba Favoritos renderiza a lista' };
}

function checkTodo4b(): Check {
  const src = code('src/screens/HomeScreen.tsx');
  if (!src.includes('Nenhum favorito') || !src.includes('Nenhum filme carregado'))
    return { pass: false, note: 'Passo 2: estado vazio (as duas mensagens) não implementado' };
  return { pass: true, note: 'Passo 2: estado vazio presente' };
}

// ─── TODO 5: useOfflineStatus (1 pt) ────────────────────────────────────────
function checkTodo5(): Check {
  const hook = code('src/hooks/useOfflineStatus.ts');
  if (!/navigator\.onLine/.test(hook)) return { pass: false, note: 'não usa navigator.onLine no estado inicial' };
  if (!/addEventListener\s*\(\s*['"]online['"]/.test(hook) || !/addEventListener\s*\(\s*['"]offline['"]/.test(hook))
    return { pass: false, note: 'listeners "online"/"offline" ausentes' };
  if (!/removeEventListener/.test(hook)) return { pass: false, note: 'cleanup (removeEventListener) ausente' };
  const screen = code('src/screens/HomeScreen.tsx');
  if (!/!\s*isOnline/.test(screen) || !/Offline/.test(screen)) return { pass: false, note: 'banner offline não aparece na aba Favoritos (!isOnline)' };
  return { pass: true, note: 'hook com listeners + cleanup, banner na tela' };
}

// ─── Manual (não conta no piso) ─────────────────────────────────────────────
function entregaNote(): string {
  const e = read('ENTREGA.md');
  if (!e) return 'ENTREGA.md não encontrado — avaliar no Canvas';
  return 'ENTREGA.md presente — avaliar evidências e reflexão no Canvas';
}

const auto = [
  { id: 'todo1',  label: 'TODO 1 — fetchPopularMovies',                 weight: 2, ...checkTodo1() },
  { id: 'todo2a', label: 'TODO 2a — runtimeCaching da API (NetworkFirst)', weight: 2, ...checkTodo2a() },
  { id: 'todo2b', label: 'TODO 2b — runtimeCaching dos pôsteres (CacheFirst)', weight: 2, ...checkTodo2b() },
  { id: 'todo3a', label: "TODO 3a — registerType: 'prompt'",            weight: 1, ...checkTodo3a() },
  { id: 'todo3b', label: 'TODO 3b — UpdatePrompt (useRegisterSW)',      weight: 2, ...checkTodo3b() },
  { id: 'todo4a', label: 'TODO 4 Passo 1 — aba Favoritos (lista)',      weight: 1, ...checkTodo4a() },
  { id: 'todo4b', label: 'TODO 4 Passo 2 — estado vazio',               weight: 1, ...checkTodo4b() },
  { id: 'todo5',  label: 'TODO 5 — useOfflineStatus + banner',          weight: 1, ...checkTodo5() },
];
const manual = [
  { id: 'evid',   label: 'ENTREGA.md — evidências (DevTools/offline/instalação) e comparação site × PWA', weight: 2, manual: true, pass: false, note: entregaNote() },
  { id: 'refl',   label: "ENTREGA.md — reflexão: autoUpdate × prompt, por que?", weight: 1, manual: true, pass: false, note: '📝 avaliação manual (Canvas)' },
];
const results = [...auto, ...manual];

for (const r of auto) console.log(`${r.pass ? '✅' : '❌'} ${r.label} (${r.pass ? r.weight : 0}/${r.weight}): ${r.note}`);
for (const r of manual) console.log(`📝 ${r.label} (/${r.weight}): ${r.note}`);

const autoScore = auto.reduce((s, r) => s + (r.pass ? r.weight : 0), 0);
const autoMax = auto.reduce((s, r) => s + r.weight, 0);
const maxScore = results.reduce((s, r) => s + r.weight, 0);
const allPass = auto.every((r) => r.pass);

fs.writeFileSync('grade.json', JSON.stringify({
  results, allPass, autoScore, autoMax, maxScore,
  summary: allPass ? 'Todos os critérios automáticos passaram (piso). Evidências e reflexão: nota manual no Canvas.' : 'Há critérios automáticos pendentes — ver detalhes.',
}, null, 2));
console.log(`\nPiso automático: ${autoScore}/${autoMax} (total do lab: ${maxScore})\ngrade.json gerado.`);
process.exit(allPass ? 0 : 1);
