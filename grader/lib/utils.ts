/**
 * Helpers compartilhados pelos validators do grader.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

export interface CliArgs {
  entrega: string;
  output: string;
  studentLogin: string;
  commitSha: string;
}

export function parseArgs(): CliArgs {
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

export function readFileSafe(path: string): string | null {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return null;
  }
}

export function findFiles(dir: string, exts: string[], depth = 8): string[] {
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

export function fileMatchesAny(files: string[], patterns: RegExp[]): boolean {
  return files.some((f) => {
    const content = readFileSafe(f);
    if (!content) return false;
    return patterns.some((p) => p.test(content));
  });
}

export function findReadme(entrega: string): string | null {
  return ['README.md', 'README.MD', 'readme.md']
    .map((n) => join(entrega, n))
    .find(existsSync) ?? null;
}

export function readJsonSafe<T = any>(path: string): T | null {
  const raw = readFileSafe(path);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
