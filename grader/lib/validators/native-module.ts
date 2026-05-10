/**
 * Validator — Atividade 3 — Native Module + comparativo (Mobile Multi).
 *
 * Critérios (15 pts total):
 *   1. Spec TS do módulo (turbo module spec) presente                      — 3pts
 *   2. Implementação Android Kotlin presente                               — 3pts
 *   3. Implementação iOS Swift presente                                    — 3pts
 *   4. Uso do TurboModuleRegistry no spec (não Bridge legado)              — 2pts
 *   5. Relatório comparativo (RN vs Flutter vs KMP vs nativo) presente     — 3pts
 *   6. README com instruções de execução                                   — 1pt
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
import { parseArgs, findFiles, fileMatchesAny, findReadme } from '../utils.js';

async function main() {
  const args = parseArgs();
  const criteria: GradeCriterion[] = [];

  // Critério 1: spec TS
  const tsFiles = findFiles(args.entrega, ['.ts']);
  const hasTurboSpec = fileMatchesAny(tsFiles, [
    /TurboModuleRegistry|TurboModule\b/,
    /interface\s+Spec\s+extends\s+TurboModule/,
  ]);
  criteria.push({
    id: 'turbo-spec',
    description: 'Spec TS do módulo nativo (TurboModule)',
    weight: 3,
    earned: hasTurboSpec ? 3 : 0,
    publicNote: hasTurboSpec ? 'Spec TurboModule encontrado' : 'Spec TS com TurboModuleRegistry não encontrado',
  });

  // Critério 2: Kotlin
  const kotlinFiles = findFiles(args.entrega, ['.kt']);
  const hasKotlin = kotlinFiles.length > 0;
  criteria.push({
    id: 'android-kotlin',
    description: 'Implementação Android em Kotlin',
    weight: 3,
    earned: hasKotlin ? 3 : 0,
    publicNote: hasKotlin ? `${kotlinFiles.length} arquivo(s) .kt encontrado(s)` : 'Nenhum .kt encontrado',
  });

  // Critério 3: Swift
  const swiftFiles = findFiles(args.entrega, ['.swift']);
  const hasSwift = swiftFiles.length > 0;
  criteria.push({
    id: 'ios-swift',
    description: 'Implementação iOS em Swift',
    weight: 3,
    earned: hasSwift ? 3 : 0,
    publicNote: hasSwift ? `${swiftFiles.length} arquivo(s) .swift encontrado(s)` : 'Nenhum .swift encontrado',
  });

  // Critério 4: TurboModule (não bridge legado)
  const usesTurbo = fileMatchesAny(tsFiles, [/TurboModuleRegistry\.getEnforcing/]);
  criteria.push({
    id: 'turbo-architecture',
    description: 'New Architecture (TurboModule via Codegen, não Bridge legado)',
    weight: 2,
    earned: usesTurbo ? 2 : 0,
    publicNote: usesTurbo ? 'TurboModuleRegistry.getEnforcing detectado' : 'Bridge legado ou padrão antigo detectado',
  });

  // Critério 5: relatório comparativo
  const mdFiles = findFiles(args.entrega, ['.md']);
  const hasReport = mdFiles.some((f) => /relatorio|report|comparativo|comparison/i.test(f));
  criteria.push({
    id: 'comparative-report',
    description: 'Relatório comparativo RN vs Flutter vs KMP vs nativo',
    weight: 3,
    earned: hasReport ? 3 : 0,
    publicNote: hasReport ? 'Relatório encontrado' : 'Esperado arquivo *relatorio*.md ou *comparativo*.md',
  });

  // Critério 6: README
  const readme = findReadme(args.entrega);
  criteria.push({
    id: 'readme',
    description: 'README com instruções de execução',
    weight: 1,
    earned: readme ? 1 : 0,
    publicNote: readme ? 'README encontrado' : 'README.md ausente',
  });

  const { total, score } = computeScore(criteria);
  const minimo = passThreshold(total, 60);
  const { publicBreakdown, privateBreakdown } = buildBreakdowns(criteria);

  const result: GradeResult = {
    atividade: 'MOBILE-A3-Native-Module',
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
