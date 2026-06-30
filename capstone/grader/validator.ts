// Validator do capstone. NÃO executa a entrega — só lê arquivos e checa estrutura.
//   npx tsx validator.ts --task <id> --entrega <path-da-capstone> [--changed a,b] [--out grade.json]
import { writeFileSync } from 'node:fs';
import { FileCtx } from './lib/fs-ctx.js';
import { getRubric, evaluate, allTasks } from './lib/rubrics.js';
import { toGradeResult } from './lib/compute-score.js';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const entrega = arg('entrega') ?? '.';
const out = arg('out');
const changed = (arg('changed') ?? '').split(',').filter(Boolean);

// Resolve a task: explícita (--task) ou pelo nome da branch (--branch task/<id>-<login>).
function resolveTask(): string | undefined {
  const explicit = arg('task');
  if (explicit) return explicit;
  const branch = arg('branch');
  if (!branch) return undefined;
  const name = branch.replace(/^.*?task\//, ''); // task/<id>-<login> -> <id>-<login>
  // maior id de task que prefixa o nome da branch
  return allTasks()
    .map((t) => t.task)
    .filter((id) => name === id || name.startsWith(`${id}-`) || name.startsWith(`${id}_`))
    .sort((a, b) => b.length - a.length)[0];
}

const task = resolveTask();

if (!task) {
  console.error('uso: validator (--task <id> | --branch task/<id>-<login>) --entrega <path> [--out grade.json]');
  console.error('tasks:', allTasks().map((t) => t.task).join(', '));
  process.exit(2);
}

const rubric = getRubric(task);
if (!rubric) {
  console.error(`task desconhecida: ${task}`);
  process.exit(2);
}

const f = new FileCtx(entrega, changed);
const criteria = evaluate(rubric, f);
const result = toGradeResult(criteria);

console.log(`\n## ${rubric.track.toUpperCase()} · ${task}`);
console.log(result.breakdown);
console.log(
  `\n**Nota mínima (auto): ${result.autoScore}/${result.maxAutoScore}** · ` +
    `total da rubrica: ${result.maxTotalScore} pts (📝 = avaliação manual no Canvas)`,
);

if (out) {
  writeFileSync(out, JSON.stringify(result, null, 2));
  console.log(`\ngrade.json → ${out}`);
}
