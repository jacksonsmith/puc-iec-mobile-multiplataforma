import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Acesso somente-leitura à entrega do aluno. O grader NUNCA executa o código da entrega
// (regra de segurança do autograder): só LÊ os arquivos e checa estrutura.
export class FileCtx {
  constructor(
    public readonly root: string,
    public readonly changed: string[] = [],
  ) {}

  read(rel: string): string | null {
    const p = join(this.root, rel);
    return existsSync(p) ? readFileSync(p, 'utf8') : null;
  }

  exists(rel: string): boolean {
    return existsSync(join(this.root, rel));
  }

  // Lista recursiva de arquivos sob um subdir (relativo à entrega), com filtro opcional.
  list(rel: string, ext?: string): string[] {
    const base = join(this.root, rel);
    if (!existsSync(base)) return [];
    const out: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        if (name === 'node_modules' || name.startsWith('.')) continue;
        const full = join(dir, name);
        if (statSync(full).isDirectory()) walk(full);
        else if (!ext || name.endsWith(ext)) out.push(full);
      }
    };
    walk(base);
    return out;
  }
}
