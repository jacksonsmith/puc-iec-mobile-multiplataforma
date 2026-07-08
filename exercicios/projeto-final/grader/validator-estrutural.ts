import * as fs from 'fs'
import * as path from 'path'
import { Criterion, computeAuto, buildBreakdowns } from './lib/compute-score'

// Checagem estrutural (sem emulador) — roda sempre, é o piso rápido do CI.
// NÃO substitui o E2E real (ver parse-maestro-results.ts): aqui só validamos
// que os testIDs esperados existem ligados a algo visível, e sinalizamos
// (nota, não reprova sozinho) padrões suspeitos de "hack pra passar o teste
// sem implementar a feature de verdade".

// Alguns testIDs são literais (fixos no código); outros são gerados por
// interpolação (`item-card-$id`, `category-chip-$category`) — pra esses,
// procuramos só o prefixo (o sufixo é dinâmico, não aparece literal no fonte).
const EXPECTED_TEST_IDS = [
  'item-list-screen',
  'item-card-',
  'search-input',
  'category-chip-',
  'detail-screen',
  'detail-title',
  'detail-favorite-button',
  'detail-back-button',
  'tab-favorites',
  'favorite-item-',
]

// Padrões de "esconder" um elemento — se aparecerem perto (poucas linhas) de
// onde o testID é aplicado, é sinal de que o elemento pode estar invisível
// só pra passar o assert (não reprova sozinho, vira nota pro professor).
const HIDE_PATTERNS = [
  /opacity:\s*0\b/,
  /display:\s*['"]?none['"]?/,
  /visibility:\s*['"]?hidden['"]?/,
  /Offstage\(\s*offstage:\s*true/,
  /alpha\s*=\s*0f\b/,
  /width:\s*0.*height:\s*0/,
]

const SOURCE_EXTENSIONS = new Set(['.dart', '.ts', '.tsx', '.js', '.jsx', '.kt'])
const EXCLUDED_DIR_NAMES = new Set([
  'node_modules',
  'build',
  '.gradle',
  '.dart_tool',
  '.kotlin',
  'test',
  '__tests__',
  'android', // pasta gerada (expo prebuild) — olhamos só o código-fonte do app
  'ios',
])

interface SourceFile {
  relPath: string
  lines: string[]
}

function walk(dir: string, out: SourceFile[], root: string) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDED_DIR_NAMES.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full, out, root)
    } else if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      const content = fs.readFileSync(full, 'utf8')
      out.push({ relPath: path.relative(root, full), lines: content.split('\n') })
    }
  }
}

function findOccurrences(files: SourceFile[], testId: string): { file: SourceFile; lineIndex: number }[] {
  const hits: { file: SourceFile; lineIndex: number }[] = []
  for (const file of files) {
    file.lines.forEach((line, idx) => {
      if (line.includes(testId)) hits.push({ file, lineIndex: idx })
    })
  }
  return hits
}

function hasNearbyHidePattern(file: SourceFile, lineIndex: number, radius = 3): boolean {
  const start = Math.max(0, lineIndex - radius)
  const end = Math.min(file.lines.length, lineIndex + radius + 1)
  const window = file.lines.slice(start, end).join('\n')
  return HIDE_PATTERNS.some((pattern) => pattern.test(window))
}

function main() {
  const args = process.argv.slice(2)
  const entregaIdx = args.indexOf('--entrega')
  const entregaPath = path.resolve(entregaIdx >= 0 ? args[entregaIdx + 1] : '.')

  const files: SourceFile[] = []
  walk(entregaPath, files, entregaPath)

  const criteria: Criterion[] = []
  const suspiciousNotes: string[] = []

  for (const testId of EXPECTED_TEST_IDS) {
    const hits = findOccurrences(files, testId)
    if (hits.length === 0) {
      criteria.push({
        key: `testid-${testId}`,
        label: `testID "${testId}" presente no código`,
        weight: 1,
        earned: 0,
        note: 'não encontrado em nenhum arquivo-fonte',
      })
      continue
    }
    const suspicious = hits.filter((h) => hasNearbyHidePattern(h.file, h.lineIndex))
    if (suspicious.length > 0) {
      suspiciousNotes.push(
        `"${testId}" aparece perto de um padrão de "esconder elemento" em ${suspicious[0].file.relPath}:${suspicious[0].lineIndex + 1} — revisar se o elemento é visível de verdade.`,
      )
    }
    criteria.push({
      key: `testid-${testId}`,
      label: `testID "${testId}" presente no código`,
      weight: 1,
      earned: 1,
      note: suspicious.length > 0 ? 'suspeito — ver nota de revisão manual' : undefined,
    })
  }

  // Critério manual — revisão humana do que o validator sinalizou como suspeito
  // + cruzamento de commits por autor (não automatizável de forma confiável).
  criteria.push({
    key: 'revisao-manual-testid',
    label: 'Revisão manual — testID não hardcoded pra enganar o teste + contribuição individual',
    weight: 0,
    earned: 0,
    manual: true,
    note: suspiciousNotes.length > 0 ? suspiciousNotes.join(' ') : 'nenhum padrão suspeito detectado automaticamente',
    privateNote: suspiciousNotes.join(' | '),
  })

  const { pub, priv } = buildBreakdowns(criteria)
  const autoScore = computeAuto(criteria)
  const maxAutoScore = criteria.filter((c) => !c.manual).reduce((s, c) => s + c.weight, 0)

  const result = {
    autoScore,
    maxAutoScore,
    criteria,
    breakdown: pub,
    privateBreakdown: priv,
  }

  fs.writeFileSync(path.join(__dirname, 'grade-estrutural.json'), JSON.stringify(result, null, 2))

  console.log(`\n=== VALIDATOR ESTRUTURAL ===`)
  console.log(`autoScore: ${autoScore}/${maxAutoScore}`)
  console.log(priv)

  if (autoScore < maxAutoScore) {
    process.exitCode = 1
  }
}

main()
