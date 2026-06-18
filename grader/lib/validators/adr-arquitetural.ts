/**
 * Validator — Atividade 1 — ADR Arquitetural (Mobile Multiplataforma).
 *
 * RUBRICA REAL do enunciado (15 pts) — calibrado pela Aula 1 (Nygard 2011):
 *   1. Estrutura ADR (Status, Contexto, Decisão, Alternativas, Consequências) — 5pts
 *   2. ≥4 alternativas + matriz quantitativa (peso × score)                   — 5pts
 *   3. ≥3 referências · ≥1 acadêmica · atualizadas (≤5 anos)                  — 3pts
 *   4. Clareza, profundidade e coerência argumentativa                        — 2pts [MANUAL]
 *
 * PRINCÍPIO: nota MÍNIMA. Só credita o auto-verificável (estrutura/matriz/refs).
 * Clareza/profundidade é subjetiva → `manual: true` (avaliada no Canvas).
 * Heurística tem falso-negativo → o piso nunca passa da nota manual. Min: 60% (9/15).
 */

import { readFileSync, existsSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  type GradeCriterion,
  type GradeResult,
  buildBreakdowns,
  computeScore,
  computeAuto,
  passThreshold,
} from '../compute-score.js';

interface CliArgs {
  entrega: string;
  output: string;
  studentLogin: string;
  commitSha: string;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const get = (flag: string, defaultValue?: string) => {
    const idx = args.indexOf(flag);
    if (idx === -1) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`Missing required flag: ${flag}`);
    }
    return args[idx + 1] ?? '';
  };
  return {
    entrega: get('--entrega'),
    output: get('--output'),
    studentLogin: get('--student-login', 'unknown'),
    commitSha: get('--commit-sha', 'unknown'),
  };
}

function readFileSafe(path: string): string | null {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return null;
  }
}

function findMarkdownFiles(dir: string, depth = 3): string[] {
  if (!existsSync(dir) || depth <= 0) return [];
  const result: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('.') || entry === 'node_modules') continue;
    const path = join(dir, entry);
    try {
      const stat = statSync(path);
      if (stat.isDirectory()) result.push(...findMarkdownFiles(path, depth - 1));
      else if (entry.toLowerCase().endsWith('.md')) result.push(path);
    } catch {
      // skip
    }
  }
  return result;
}

// As 5 seções Nygard que a rubrica exige.
const SECTIONS = ['status', 'contexto', 'decis[ãa]o', 'alternativas', 'consequ[êe]ncias'];

function countSections(content: string): number {
  return SECTIONS.filter((s) => new RegExp(`^#{1,4}\\s*${s}`, 'im').test(content)).length;
}

/** Acha o doc ADR = o .md com mais seções Nygard (cai pro maior .md se nenhum tem). */
function pickAdr(files: string[]): { path: string; content: string } | null {
  let best: { path: string; content: string; score: number; size: number } | null = null;
  for (const f of files) {
    if (/readme/i.test(f.split('/').pop() || '')) continue;
    const content = readFileSafe(f);
    if (!content) continue;
    const score = countSections(content);
    const size = content.length;
    if (!best || score > best.score || (score === best.score && size > best.size)) {
      best = { path: f, content, score, size };
    }
  }
  return best ? { path: best.path, content: best.content } : null;
}

interface MatrixAnalysis {
  found: boolean;
  rowCount: number;
}

/** Detecta a melhor tabela markdown de comparação (≥3 linhas com células numéricas). */
function analyzeMatrix(content: string): MatrixAnalysis {
  const lines = content.split('\n');
  let bestRows = 0;
  for (let i = 0; i < lines.length - 2; i++) {
    if (!lines[i].includes('|') || !/^\s*\|[\s\-:|]+\|\s*$/.test(lines[i + 1])) continue;
    let rows = 0;
    let numeric = 0;
    let cells = 0;
    for (let j = i + 2; j < lines.length; j++) {
      const row = lines[j];
      if (!row.includes('|') || row.trim() === '') break;
      rows++;
      for (const cell of row.split('|').slice(1, -1).map((c) => c.trim())) {
        cells++;
        if (/\d/.test(cell)) numeric++;
      }
    }
    if (rows >= 3 && cells > 0 && numeric / cells >= 0.3 && rows > bestRows) bestRows = rows;
  }
  return { found: bestRows >= 3, rowCount: bestRows };
}

function refSection(content: string): string | null {
  const m = content.match(/^#{1,4}\s*(refer[êe]ncias?|bibliography|sources|fontes)[\s\S]*$/im);
  return m ? m[0] : null;
}

function countReferences(content: string): number {
  const sec = refSection(content);
  if (!sec) return 0;
  // itens de lista OU links markdown OU URLs cruas
  const items = sec.match(/^\s*[-*\d]+[.)]?\s+\S/gm) || [];
  const links = sec.match(/\[[^\]]+\]\([^)]+\)|https?:\/\/\S+/g) || [];
  return Math.max(items.length, links.length);
}

function hasAcademicReference(content: string): boolean {
  const sec = refSection(content) ?? content;
  return [
    /\b(ACM|IEEE|Springer|Elsevier|CACM|Communications of the ACM)\b/i,
    /\bO['']Reilly\b/i,
    /\bManning\b/i,
    /\bAddison[- ]Wesley\b|\bPrentice[- ]Hall\b/i,
    /\bISBN[\s:-]?\d/i,
    /\bdoi[:\s.]/i,
    /\barxiv\b/i,
    /\b(Nygard|Charland|Leroux|Eisenman|Fowler|Fielding|Knott)\b/i,
    /\([12]\d{3}\)/, // (2024) — citação com ano entre parênteses
    /Lecture Notes|Proceedings|Journal|peer[- ]review/i,
  ].some((p) => p.test(sec));
}

/** Alguma referência com ano dentro da janela de recência (≤ N anos). */
function hasRecentReference(content: string, years = 5): boolean {
  const sec = refSection(content) ?? content;
  const cutoff = new Date().getFullYear() - years;
  const found = sec.match(/\b(20\d{2})\b/g) || [];
  return found.some((y) => Number(y) >= cutoff);
}

async function main() {
  const args = parseArgs();
  const criteria: GradeCriterion[] = [];

  const adr = pickAdr(findMarkdownFiles(args.entrega));
  const content = adr?.content ?? '';
  const hasDoc = !!adr && content.length > 0;

  // 1) Estrutura ADR (5 seções Nygard) — 5pts
  const sectionsFound = hasDoc ? countSections(content) : 0;
  criteria.push({
    id: 'estrutura-adr',
    description: 'Estrutura ADR (Status, Contexto, Decisão, Alternativas, Consequências)',
    weight: 5,
    earned: +((sectionsFound / SECTIONS.length) * 5).toFixed(2),
    publicNote: !hasDoc
      ? 'Nenhum documento ADR em markdown encontrado (se entregou PDF, avalio no Canvas)'
      : `${sectionsFound}/5 seções Nygard encontradas`,
    privateNote: `doc=${adr?.path?.split('/').pop()} sections=${sectionsFound}`,
  });

  // 2) ≥4 alternativas + matriz quantitativa (peso × score) — 5pts
  const matrix = hasDoc ? analyzeMatrix(content) : { found: false, rowCount: 0 };
  const weighted = hasDoc && /\bpeso\b|\bponderad|\bweight\b|score\s*ponderado/i.test(content);
  const altPts = matrix.rowCount >= 4 ? 2 : matrix.rowCount >= 3 ? 1 : 0;
  const matrixPts = matrix.found ? (weighted ? 3 : 2) : 0;
  criteria.push({
    id: 'matriz-alternativas',
    description: '≥4 alternativas + matriz quantitativa (peso × score)',
    weight: 5,
    earned: Math.min(altPts + matrixPts, 5),
    publicNote: !matrix.found
      ? 'Nenhuma matriz comparativa (tabela com notas numéricas) encontrada'
      : `${matrix.rowCount} alternativas · ${weighted ? 'com pesos/score ponderado' : 'sem pesos detectados (peso × score)'}`,
    privateNote: `rows=${matrix.rowCount} weighted=${weighted} altPts=${altPts} matrixPts=${matrixPts}`,
  });

  // 3) ≥3 refs · ≥1 acadêmica · ≤5 anos — 3pts
  const refCount = hasDoc ? countReferences(content) : 0;
  const academic = hasDoc && hasAcademicReference(content);
  const recent = hasDoc && hasRecentReference(content);
  const refPts = (refCount >= 3 ? 1.5 : refCount >= 1 ? 0.75 : 0) + (academic ? 1 : 0) + (recent ? 0.5 : 0);
  criteria.push({
    id: 'referencias',
    description: '≥3 referências · ≥1 acadêmica · atualizadas (≤5 anos)',
    weight: 3,
    earned: +Math.min(refPts, 3).toFixed(2),
    publicNote: !hasDoc
      ? 'Sem documento pra checar referências'
      : `${refCount} refs · ${academic ? '✅ acadêmica' : '❌ sem acadêmica clara'} · ${recent ? '✅ recente (≤5a)' : '❌ sem ano recente'}`,
    privateNote: `refs=${refCount} academic=${academic} recent=${recent}`,
  });

  // 4) Clareza, profundidade, coerência — 2pts [MANUAL]
  criteria.push({
    id: 'clareza',
    description: 'Clareza, profundidade e coerência argumentativa',
    weight: 2,
    manual: true,
    earned: 0,
    publicNote: 'Qualidade do argumento — avaliada na leitura (Canvas)',
  });

  const { total } = computeScore(criteria);
  const { autoScore, autoTotal, manualTotal } = computeAuto(criteria);
  const minimo = passThreshold(total, 60);
  const { publicBreakdown, privateBreakdown } = buildBreakdowns(criteria);

  const result: GradeResult = {
    atividade: 'MOBILE-A1-ADR-Arquitetural',
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
