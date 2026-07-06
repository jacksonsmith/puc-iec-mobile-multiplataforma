/**
 * Validator — Atividade 3 — Native Module + Relatório Comparativo (Mobile Multi).
 *
 * RUBRICA REAL do enunciado (15 pts) — calibrado pela Aula 3:
 *  Parte 1 — Native Module (8):
 *   1. Compila/roda sem crash                                  — 2pts [MANUAL · eliminatório]
 *   2. ≥2 métodos JS expostos e funcionando                    — 2pts
 *   3. Módulo nativo + tipos TS (Expo Modules OU TurboModule)  — 2pts
 *   4. Uso real no app (chamada com efeito na UI)              — 2pts
 *  Parte 2 — Relatório (7):
 *   5. Mecanismo técnico de cada stack (RN/Flutter/Nativo) — 3pts [MANUAL]
 *   6. Matriz quantitativa com pesos                           — 2pts
 *   7. Decisão final defendida                                 — 1pt  [MANUAL]
 *   8. ≥3 referências                                          — 1pt
 *
 * NOTA MÍNIMA: só credita o auto-verificável (estrutura). Compilação e qualidade
 * argumentativa são `manual: true` (Canvas). Piso ≤ nota manual. Min: 60% (9/15).
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

async function main() {
  const args = parseArgs();
  const criteria: GradeCriterion[] = [];

  const ktFiles = findFiles(args.entrega, ['.kt']);
  const tsFiles = findFiles(args.entrega, ['.ts']);
  const tsxFiles = findFiles(args.entrega, ['.tsx']);
  const mdFiles = findFiles(args.entrega, ['.md']);
  const jsonFiles = findFiles(args.entrega, ['.json']);
  const ktCode = ktFiles.map(read).join('\n');
  const allTs = [...tsFiles, ...tsxFiles].map(read).join('\n');

  // ---- 1. Compila/roda — MANUAL (eliminatório, prof roda) ----
  criteria.push({
    id: 'compila',
    description: 'Módulo compila e executa sem crash (eliminatório)',
    weight: 2,
    manual: true,
    earned: 0,
    publicNote: 'Compilação/execução conferida na correção (npx expo run:android / gradle)',
  });

  // ---- 2. ≥2 métodos JS expostos ----
  // Expo Modules: Function("...") · TurboModule/clássico: override fun / @ReactMethod
  const expoFns = (ktCode.match(/\bFunction\s*\(/g) ?? []).length;
  const classicFns = (ktCode.match(/@ReactMethod|override\s+fun\s+\w+\s*\(/g) ?? []).length;
  const methodCount = Math.max(expoFns, classicFns);
  criteria.push({
    id: 'metodos',
    description: '≥2 métodos JS expostos e funcionando',
    weight: 2,
    earned: methodCount >= 2 ? 2 : methodCount === 1 ? 1 : 0,
    publicNote: methodCount >= 2
      ? `${methodCount} métodos nativos detectados`
      : `Só ${methodCount} método nativo (mínimo 2)`,
    privateNote: `expoFns=${expoFns} classicFns=${classicFns}`,
  });

  // ---- 3. Módulo nativo + tipos TS (Expo Modules OU TurboModule) ----
  const hasExpoConfig = jsonFiles.some((f) => basename(f) === 'expo-module.config.json');
  const isExpoModule = hasExpoConfig || /:\s*Module\(\)|ModuleDefinition\s*\{/.test(ktCode);
  const isTurbo = /TurboModuleRegistry|extends\s+TurboModule|ReactContextBaseJavaModule|TurboReactPackage/.test(
    ktCode + allTs,
  );
  const hasTsType =
    /requireNativeModule|TurboModuleRegistry\.getEnforcing|interface\s+\w*Module|export\s+(interface|type)\s+\w+/.test(
      allTs,
    );
  const nativeOk = (isExpoModule || isTurbo) && hasTsType;
  criteria.push({
    id: 'modulo-tipos',
    description: 'Módulo nativo + tipos TS (Expo Modules ou TurboModule+Codegen)',
    weight: 2,
    earned: nativeOk ? 2 : isExpoModule || isTurbo || hasTsType ? 1 : 0,
    publicNote: nativeOk
      ? `${isExpoModule ? 'Expo Modules' : 'TurboModule'} + tipos TS detectados`
      : 'Faltou o módulo nativo OU o tipo TS (precisa dos dois)',
    privateNote: `expo=${isExpoModule} turbo=${isTurbo} tsType=${hasTsType}`,
  });

  // ---- 4. Uso real no app (import + chamada numa tela .tsx) ----
  const usedInScreen = tsxFiles.some((f) => {
    const c = read(f);
    return /requireNativeModule|device-extras|NativeModules|from\s+['"][^'"]*modules\//.test(c);
  });
  criteria.push({
    id: 'uso',
    description: 'Uso real no app (chamada com efeito visível na UI)',
    weight: 2,
    earned: usedInScreen ? 2 : 0,
    publicNote: usedInScreen ? 'Módulo importado/usado numa tela' : 'Não vi o módulo sendo usado numa tela (.tsx)',
  });

  // ---- 5. Mecanismo técnico de cada stack — MANUAL ----
  criteria.push({
    id: 'mecanismo',
    description: 'Relatório: mecanismo técnico de cada stack (RN/Flutter/Nativo)',
    weight: 3,
    manual: true,
    earned: 0,
    publicNote: 'Profundidade técnica do relatório — avaliada na leitura (Canvas)',
  });

  // Relatório comparativo = o .md que cita as 3 stacks (Flutter + nativo)
  const reportFile = mdFiles
    .filter((f) => !/readme/i.test(basename(f)))
    .map((f) => read(f))
    .find((c) => /flutter/i.test(c) && /nativo/i.test(c));
  const report = reportFile ?? '';

  // ---- 6. Matriz quantitativa com pesos ----
  const hasMatrix = /\|/.test(report) && /flutter/i.test(report) && /(peso|weight|%)/i.test(report);
  criteria.push({
    id: 'matriz',
    description: 'Relatório: matriz quantitativa com pesos',
    weight: 2,
    earned: hasMatrix ? 2 : /\|[^\n]*flutter/i.test(report) ? 1 : 0,
    publicNote: hasMatrix
      ? 'Matriz com stacks + pesos detectada'
      : report
        ? 'Tabela comparativa sem pesos claros (peso/%/weight)'
        : 'Relatório comparativo (cita Flutter+nativo) não encontrado',
  });

  // ---- 7. Decisão final defendida — MANUAL ----
  criteria.push({
    id: 'decisao',
    description: 'Relatório: decisão final defendida (não "depende" genérico)',
    weight: 1,
    manual: true,
    earned: 0,
    publicNote: 'Qualidade da decisão — avaliada na leitura (Canvas)',
  });

  // ---- 8. ≥3 referências ----
  const refs = (report.match(/https?:\/\/\S+/g) ?? []).length;
  criteria.push({
    id: 'referencias',
    description: 'Relatório: ≥3 referências',
    weight: 1,
    earned: refs >= 3 ? 1 : 0,
    publicNote: refs >= 3 ? `${refs} referências (links) no relatório` : `Só ${refs} referência(s) — mínimo 3`,
  });

  const { total } = computeScore(criteria);
  const { autoScore, autoTotal, manualTotal } = computeAuto(criteria);
  const minimo = passThreshold(total, 60);
  const { publicBreakdown, privateBreakdown } = buildBreakdowns(criteria);

  const result: GradeResult = {
    atividade: 'MOBILE-A3-Native-Module',
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
