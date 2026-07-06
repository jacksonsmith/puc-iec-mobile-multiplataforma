import * as fs from 'fs'
import * as path from 'path'
import { XMLParser } from 'fast-xml-parser'
import { Criterion, computeAuto, computeScore, buildBreakdowns } from './lib/compute-score'

// Lê o JUnit XML que o Maestro gera (`maestro test flows/ --format junit
// --output results.xml`) e converte em critérios de nota (3pts por flow,
// 5 flows = 15pts — bate com a rubrica do enunciado). Roda DEPOIS do job
// de emulador no workflow; combina com validator-estrutural.ts pra montar
// o grade.json final.

const FLOWS = [
  { file: '01-list', label: 'Feature 1 — lista consumindo API real' },
  { file: '02-detail-navigation', label: 'Feature 2 — navegação lista → detalhe' },
  { file: '03-search', label: 'Feature 3 — busca por texto' },
  { file: '04-category-filter', label: 'Feature 4 — categoria/filtro estruturado' },
  { file: '05-favorites', label: 'Feature 5 — favoritos persistidos localmente' },
]

const POINTS_PER_FLOW = 3

interface JUnitTestCase {
  '@_name'?: string
  '@_classname'?: string
  failure?: unknown
  error?: unknown
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return []
  return Array.isArray(value) ? value : [value]
}

function main() {
  const args = process.argv.slice(2)
  const resultsIdx = args.indexOf('--results')
  const resultsPath = path.resolve(resultsIdx >= 0 ? args[resultsIdx + 1] : 'results.xml')

  const criteria: Criterion[] = []

  if (!fs.existsSync(resultsPath)) {
    // App não buildou / Maestro nem chegou a rodar — critério eliminatório
    // do enunciado ("se o app não builda, os 15pts do E2E ficam zerados").
    for (const flow of FLOWS) {
      criteria.push({
        key: flow.file,
        label: flow.label,
        weight: POINTS_PER_FLOW,
        earned: 0,
        note: 'results.xml não encontrado — app não buildou ou Maestro não rodou',
      })
    }
  } else {
    const xml = fs.readFileSync(resultsPath, 'utf8')
    const parser = new XMLParser({ ignoreAttributes: false })
    const parsed = parser.parse(xml)

    const suites = asArray(parsed.testsuites?.testsuite ?? parsed.testsuite)
    const testcases: JUnitTestCase[] = suites.flatMap((suite: any) => asArray(suite.testcase))

    for (const flow of FLOWS) {
      const testcase = testcases.find(
        (tc) => tc['@_name']?.includes(flow.file) || tc['@_classname']?.includes(flow.file),
      )
      if (!testcase) {
        criteria.push({
          key: flow.file,
          label: flow.label,
          weight: POINTS_PER_FLOW,
          earned: 0,
          note: 'flow não encontrado no resultado do Maestro',
        })
        continue
      }
      const passed = testcase.failure === undefined && testcase.error === undefined
      criteria.push({
        key: flow.file,
        label: flow.label,
        weight: POINTS_PER_FLOW,
        earned: passed ? POINTS_PER_FLOW : 0,
        note: passed ? undefined : 'flow falhou — ver log do Maestro no artifact',
      })
    }
  }

  const { pub, priv } = buildBreakdowns(criteria)
  const autoScore = computeAuto(criteria)
  const totalScore = computeScore(criteria)
  const maxScore = criteria.reduce((s, c) => s + c.weight, 0)

  const result = {
    autoScore,
    totalScore,
    maxScore,
    criteria,
    breakdown: pub,
    privateBreakdown: priv,
  }

  fs.writeFileSync(path.join(__dirname, 'grade-e2e.json'), JSON.stringify(result, null, 2))

  console.log(`\n=== E2E RESULT ===`)
  console.log(`score: ${autoScore}/${maxScore}`)
  console.log(priv)

  if (autoScore < maxScore) {
    process.exitCode = 1
  }
}

main()
