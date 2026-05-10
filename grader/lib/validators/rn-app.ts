/**
 * Validator — Atividade 2 — App RN navegação + estado (Mobile Multiplataforma).
 *
 * Critérios (15 pts total):
 *   1. package.json com dependências esperadas (RN + react-navigation + RTK)  — 4pts
 *   2. App.tsx ou index.tsx ponto de entrada presente                          — 2pts
 *   3. NavigationContainer configurado (stack ou tab)                          — 3pts
 *   4. Slice RTK ou Zustand store configurado                                  — 3pts
 *   5. Animação Reanimated ou shared element (presença de import)              — 2pts
 *   6. README descrevendo features                                              — 1pt
 *
 * Min pra status check verde: 60% (9/15).
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

function findFiles(dir: string, exts: string[], depth = 4): string[] {
  if (!existsSync(dir) || depth <= 0) return [];
  const result: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue;
    const path = join(dir, entry);
    try {
      const stat = statSync(path);
      if (stat.isDirectory()) {
        result.push(...findFiles(path, exts, depth - 1));
      } else if (exts.some((e) => entry.endsWith(e))) {
        result.push(path);
      }
    } catch {
      // skip
    }
  }
  return result;
}

function fileMatchesAny(files: string[], patterns: RegExp[]): boolean {
  return files.some((f) => {
    const content = readFileSafe(f);
    if (!content) return false;
    return patterns.some((p) => p.test(content));
  });
}

async function main() {
  const args = parseArgs();
  const criteria: GradeCriterion[] = [];

  const pkgPath = join(args.entrega, 'package.json');
  const pkgRaw = readFileSafe(pkgPath);
  let pkg: any = null;
  try {
    pkg = pkgRaw ? JSON.parse(pkgRaw) : null;
  } catch {
    pkg = null;
  }

  // Critério 1: package.json com deps esperadas
  const expectedDeps = ['react-native', '@react-navigation/native', '@reduxjs/toolkit'];
  const allDeps = pkg ? { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) } : {};
  const foundDeps = expectedDeps.filter((d) => d in allDeps);
  criteria.push({
    id: 'package-json',
    description: 'package.json com dependências esperadas (RN + Navigation + RTK)',
    weight: 4,
    earned: pkg ? +((foundDeps.length / expectedDeps.length) * 4).toFixed(2) : 0,
    publicNote: pkg ? `${foundDeps.length}/${expectedDeps.length} deps esperadas presentes` : 'package.json ausente ou inválido',
  });

  // Critério 2: ponto de entrada
  const entryCandidates = ['App.tsx', 'App.js', 'index.tsx', 'index.js', 'src/App.tsx', 'src/App.js'];
  const entryFound = entryCandidates.some((c) => existsSync(join(args.entrega, c)));
  criteria.push({
    id: 'entry-point',
    description: 'Ponto de entrada do app presente (App.tsx/index.tsx)',
    weight: 2,
    earned: entryFound ? 2 : 0,
    publicNote: entryFound ? 'Encontrado' : `Esperado um de: ${entryCandidates.slice(0, 3).join(', ')}`,
  });

  // Critério 3: NavigationContainer
  const codeFiles = findFiles(args.entrega, ['.tsx', '.ts', '.jsx', '.js']);
  const hasNavigation = fileMatchesAny(codeFiles, [
    /from\s+['"]@react-navigation\/native['"]/,
    /NavigationContainer/,
    /createNativeStackNavigator|createBottomTabNavigator/,
  ]);
  criteria.push({
    id: 'navigation',
    description: 'NavigationContainer + Stack ou Tab Navigator configurado',
    weight: 3,
    earned: hasNavigation ? 3 : 0,
    publicNote: hasNavigation ? 'Navigation encontrada' : 'Não encontrei imports de @react-navigation/native em arquivos TS/JS',
  });

  // Critério 4: estado (RTK ou Zustand)
  const hasRtk = fileMatchesAny(codeFiles, [
    /createSlice|configureStore|createApi/,
    /from\s+['"]@reduxjs\/toolkit/,
  ]);
  const hasZustand = fileMatchesAny(codeFiles, [/from\s+['"]zustand['"]/, /create\(/]);
  const hasState = hasRtk || hasZustand;
  criteria.push({
    id: 'state',
    description: 'Gestão de estado configurada (RTK Query/slice ou Zustand)',
    weight: 3,
    earned: hasState ? 3 : 0,
    publicNote: hasRtk ? 'Redux Toolkit detectado' : hasZustand ? 'Zustand detectado' : 'Nenhuma lib de estado encontrada',
  });

  // Critério 5: animação Reanimated ou shared element
  const hasReanimated = fileMatchesAny(codeFiles, [
    /from\s+['"]react-native-reanimated['"]/,
    /useSharedValue|useAnimatedStyle|withSpring|withTiming/,
  ]);
  criteria.push({
    id: 'animation',
    description: 'Animação Reanimated v3 (worklet ou shared value)',
    weight: 2,
    earned: hasReanimated ? 2 : 0,
    publicNote: hasReanimated ? 'Reanimated detectado' : 'Não encontrei imports de react-native-reanimated',
  });

  // Critério 6: README
  const readmePath = ['README.md', 'README.MD', 'readme.md']
    .map((n) => join(args.entrega, n))
    .find(existsSync);
  criteria.push({
    id: 'readme',
    description: 'README.md descrevendo features e como rodar',
    weight: 1,
    earned: readmePath ? 1 : 0,
    publicNote: readmePath ? 'README encontrado' : 'README.md ausente',
  });

  const { total, score } = computeScore(criteria);
  const minimo = passThreshold(total, 60);
  const { publicBreakdown, privateBreakdown } = buildBreakdowns(criteria);

  const result: GradeResult = {
    atividade: 'MOBILE-A2-RN-App',
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
