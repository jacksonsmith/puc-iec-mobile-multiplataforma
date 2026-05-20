/**
 * Validator — Atividade 1 — ADR Arquitetural (Mobile Multiplataforma).
 *
 * Critérios (15 pts total):
 *   1. Arquivo ADR-*.md presente                                            — 2pts
 *   2. Seções obrigatórias (Status, Contexto, Decisão, Alternativas, Consequências) — 3pts
 *   3. Matriz quantitativa (tabela com ≥4 rows + colunas numéricas)         — 3pts
 *   4. ≥4 alternativas analisadas (heurística por linhas da matriz)         — 2pts
 *   5. Seção Referências com ≥3 itens                                       — 2pts
 *   6. ≥1 referência acadêmica detectada (paper/livro/CACM/ACM/IEEE/O'Reilly) — 2pts
 *   7. README.md descrevendo a entrega                                      — 1pt
 *
 * Min pra status check verde: 60% (9/15).
 *
 * Heurísticas têm falsos negativos. Pontuação final é manual no Canvas.
 * Esse autograder serve só pra dar feedback rápido ao aluno.
 */

import { readFileSync, existsSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  type GradeCriterion,
  type GradeResult,
  buildBreakdowns,
  computeScore,
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
      if (stat.isDirectory()) {
        result.push(...findMarkdownFiles(path, depth - 1));
      } else if (entry.toLowerCase().endsWith('.md')) {
        result.push(path);
      }
    } catch {
      // skip
    }
  }
  return result;
}

interface MatrixAnalysis {
  found: boolean;
  rowCount: number;
  numericCols: number;
}

function isNumericCell(cell: string): boolean {
  const stripped = cell.replace(/\*+/g, '').trim();
  return /^\d+(\.\d+)?\s*(%|pts?)?$/i.test(stripped);
}

function analyzeMatrix(content: string): MatrixAnalysis {
  // Identifica matriz de scoring (não tabela de critérios+pesos):
  // - 1ª coluna não-numérica (nomes das alternativas)
  // - Demais colunas majoritariamente numéricas (notas por critério)
  // - ≥3 linhas de dados (alternativas)
  // - ≥3 colunas numéricas (critérios avaliados)
  // - ≥70% das células das colunas 2+ são numéricas
  const lines = content.split('\n');
  let bestRows = 0;
  let bestNumeric = 0;

  for (let i = 0; i < lines.length - 2; i++) {
    const header = lines[i];
    const sep = lines[i + 1];
    if (!header.includes('|') || !sep.match(/^\s*\|[\s\-:|]+\|\s*$/)) continue;

    let rows = 0;
    let firstColNumeric = 0;
    let restNumeric = 0;
    let restTotal = 0;
    let cols = 0;
    for (let j = i + 2; j < lines.length; j++) {
      const row = lines[j];
      if (!row.includes('|') || row.trim() === '') break;
      const cells = row.split('|').slice(1, -1).map((c) => c.trim());
      if (cells.length < 4) continue; // exige ≥4 colunas (alternativa + ≥3 critérios)
      rows++;
      cols = Math.max(cols, cells.length);
      if (isNumericCell(cells[0])) firstColNumeric++;
      for (let k = 1; k < cells.length; k++) {
        restTotal++;
        if (isNumericCell(cells[k])) restNumeric++;
      }
    }

    if (rows < 3) continue;
    // 1ª coluna deve ser majoritariamente texto (alternativas, não pesos numéricos)
    if (firstColNumeric / rows > 0.3) continue;
    // Demais colunas devem ser majoritariamente numéricas
    if (restTotal === 0 || restNumeric / restTotal < 0.7) continue;
    if (cols < 4) continue;

    if (rows > bestRows) {
      bestRows = rows;
      bestNumeric = restNumeric;
    }
  }

  return {
    found: bestRows >= 3,
    rowCount: bestRows,
    numericCols: bestNumeric,
  };
}

function countReferences(content: string): number {
  const refSection = content.match(
    /^##+\s*(refer[êe]ncias?|bibliography|sources|fontes)[\s\S]*?(?=^##+\s|\z)/im,
  );
  if (!refSection) return 0;
  const items = refSection[0].match(/^[\s]*[-*\d]+[.)]?\s+\S/gm) || [];
  return items.length;
}

function hasAcademicReference(content: string): boolean {
  const refSection = content.match(
    /^##+\s*(refer[êe]ncias?|bibliography|sources|fontes)[\s\S]*?(?=^##+\s|\z)/im,
  );
  const text = refSection ? refSection[0] : content;

  const academicPatterns = [
    /\b(ACM|IEEE|Springer|Elsevier|CACM|Communications of the ACM)\b/i,
    /\bO['']Reilly\b/i,
    /\bManning\b/i,
    /\bAddison[- ]Wesley\b/i,
    /\bPrentice[- ]Hall\b/i,
    /\bISBN[\s:-]?\d/i,
    /\bdoi[:\s]/i,
    /\barxiv\b/i,
    /\b(Nygard|Charland|Leroux|Eisenman|Uncle Bob|Martin Fowler|Fielding)\b/i,
    /\([12]\d{3}\)/,
    /Bachelor|Master|Ph\.?D/i,
    /Lecture Notes|Proceedings|Journal/i,
  ];

  return academicPatterns.some((p) => p.test(text));
}

async function main() {
  const args = parseArgs();
  const criteria: GradeCriterion[] = [];

  const markdownFiles = findMarkdownFiles(args.entrega);
  const adrFile = markdownFiles.find((f) => /ADR-?\d+/i.test(f.split('/').pop() || ''));
  const adrContent = adrFile ? readFileSafe(adrFile) : null;

  criteria.push({
    id: 'adr-file',
    description: 'Arquivo ADR-NNNN-*.md presente',
    weight: 2,
    earned: adrFile && adrContent ? 2 : 0,
    publicNote: adrFile
      ? `Encontrado: ${adrFile.split('/').pop()}`
      : 'Nenhum arquivo no formato ADR-NNNN-*.md encontrado',
  });

  const sections = ['status', 'contexto', 'decis[ãa]o', 'alternativas', 'consequ[êe]ncias'];
  const sectionsFound = adrContent
    ? sections.filter((s) => new RegExp(`^##+\\s*${s}`, 'im').test(adrContent)).length
    : 0;
  criteria.push({
    id: 'sections',
    description: 'Seções obrigatórias (Status, Contexto, Decisão, Alternativas, Consequências)',
    weight: 3,
    earned: +((sectionsFound / sections.length) * 3).toFixed(2),
    publicNote: `${sectionsFound}/${sections.length} seções obrigatórias encontradas`,
  });

  const matrix = adrContent ? analyzeMatrix(adrContent) : { found: false, rowCount: 0, numericCols: 0 };
  criteria.push({
    id: 'matrix',
    description: 'Matriz quantitativa com notas numéricas por critério',
    weight: 3,
    earned: matrix.found ? 3 : 0,
    publicNote: matrix.found
      ? `Matriz detectada com ${matrix.rowCount} linhas e ${matrix.numericCols} células numéricas`
      : 'Nenhuma tabela markdown com ≥3 alternativas e células numéricas encontrada',
  });

  criteria.push({
    id: 'alternatives',
    description: '≥4 alternativas analisadas (linhas da matriz)',
    weight: 2,
    earned: matrix.rowCount >= 4 ? 2 : matrix.rowCount >= 3 ? 1 : 0,
    publicNote: matrix.rowCount >= 4
      ? `${matrix.rowCount} alternativas`
      : matrix.rowCount >= 3
        ? `Só ${matrix.rowCount} alternativas — esperadas ≥4`
        : 'Não detectei matriz com alternativas',
  });

  const refCount = adrContent ? countReferences(adrContent) : 0;
  criteria.push({
    id: 'references',
    description: 'Seção de referências com ≥3 itens',
    weight: 2,
    earned: refCount >= 3 ? 2 : refCount >= 1 ? 1 : 0,
    publicNote:
      refCount >= 3
        ? `${refCount} referências detectadas`
        : `Só ${refCount} referência(s) detectada(s) — esperadas ≥3`,
  });

  const academic = adrContent ? hasAcademicReference(adrContent) : false;
  criteria.push({
    id: 'academic',
    description: '≥1 referência acadêmica (paper, livro, CACM/ACM/IEEE/O\'Reilly etc.)',
    weight: 2,
    earned: academic ? 2 : 0,
    publicNote: academic
      ? 'Padrão acadêmico detectado (heurística — pode ter falso positivo)'
      : 'Nenhuma referência claramente acadêmica detectada',
  });

  const readmePath = ['README.md', 'README.MD', 'readme.md']
    .map((n) => join(args.entrega, n))
    .find(existsSync);
  criteria.push({
    id: 'readme',
    description: 'README.md descrevendo a entrega',
    weight: 1,
    earned: readmePath ? 1 : 0,
    publicNote: readmePath ? 'README encontrado' : 'README.md ausente',
  });

  const { total, score } = computeScore(criteria);
  const minimo = passThreshold(total, 60);
  const { publicBreakdown, privateBreakdown } = buildBreakdowns(criteria);

  const result: GradeResult = {
    atividade: 'MOBILE-A1-ADR-Arquitetural',
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
