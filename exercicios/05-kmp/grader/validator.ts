import * as fs from 'fs'
import * as path from 'path'
import { Criterion, computeAuto, buildBreakdowns } from './lib/compute-score'

// Validator da Atividade 5 (KMP — filmes populares). Sem emulador: o único artefato
// dinâmico é o build (`./gradlew :androidApp:assembleDebug`, rodado pelo workflow ANTES
// de chamar este script, resultado passado via --build-ok). O resto é checagem
// estrutural de App.kt — os 3 TODOs descritos no enunciado.
//
// Diferente do grader de projeto-final, aqui não tem discover multi-tema/framework:
// a entrega é sempre `exercicios/05-kmp/pratica/` (projeto Gradle editado in-place,
// não uma pasta escolhida pelo aluno) — o path filter do workflow já garante isso.

const APP_KT_REL = 'shared/src/commonMain/kotlin/org/example/project/App.kt'

function extractFunctionBody(source: string, fnStart: RegExp): string | null {
  const match = fnStart.exec(source)
  if (!match) return null
  const braceStart = source.indexOf('{', match.index)
  if (braceStart === -1) return null
  let depth = 0
  for (let i = braceStart; i < source.length; i++) {
    if (source[i] === '{') depth++
    else if (source[i] === '}') {
      depth--
      if (depth === 0) return source.slice(braceStart, i + 1)
    }
  }
  return null
}

function todoCriteria(
  todoNum: number,
  weightTotal: number,
  placeholder: string,
  body: string | null,
  checks: { key: string; label: string; test: (b: string) => boolean }[],
): Criterion[] {
  const gateOk = body != null && !body.includes(placeholder)
  if (!gateOk) {
    return [
      {
        key: `todo${todoNum}`,
        label: `TODO ${todoNum}`,
        weight: weightTotal,
        earned: 0,
        note: body == null ? 'função não encontrada em App.kt' : 'placeholder do TODO ainda presente — não implementado',
      },
    ]
  }
  return checks.map((c) => ({
    key: `todo${todoNum}-${c.key}`,
    label: `TODO ${todoNum} — ${c.label}`,
    weight: weightTotal / checks.length,
    earned: c.test(body as string) ? weightTotal / checks.length : 0,
  }))
}

function main() {
  const args = process.argv.slice(2)
  const get = (flag: string) => {
    const i = args.indexOf(flag)
    return i >= 0 ? args[i + 1] : undefined
  }
  const entregaPath = path.resolve(get('--entrega') ?? '.')
  const buildOk = get('--build-ok') === 'true'

  const appKtPath = path.join(entregaPath, APP_KT_REL)
  const source = fs.existsSync(appKtPath) ? fs.readFileSync(appKtPath, 'utf8') : null

  const criteria: Criterion[] = []

  if (source == null) {
    criteria.push({
      key: 'app-kt',
      label: 'App.kt encontrado',
      weight: 10,
      earned: 0,
      note: `não encontrado em ${APP_KT_REL}`,
    })
  } else {
    const appBody = extractFunctionBody(source, /fun App\(/)
    const movieListBody = extractFunctionBody(source, /fun MovieList\(/)
    const movieCardBody = extractFunctionBody(source, /fun MovieCard\(/)

    criteria.push(
      ...todoCriteria(1, 4, 'TODO 1: implemente os estados', appBody, [
        { key: 'when', label: 'usa `when` pra escolher a tela', test: (b) => /\bwhen\b/.test(b) },
        {
          key: 'token-missing',
          label: 'chama TokenMissingMessage() quando token em branco',
          test: (b) => b.includes('TokenMissingMessage()'),
        },
        {
          key: 'loading',
          label: 'mostra CircularProgressIndicator() enquanto carrega',
          test: (b) => b.includes('CircularProgressIndicator'),
        },
        {
          key: 'error-list',
          label: 'chama ErrorMessage() no erro e MovieList() com a lista',
          test: (b) => b.includes('ErrorMessage(') && b.includes('MovieList('),
        },
      ]),
      ...todoCriteria(2, 3, 'TODO 2: monte o LazyColumn', movieListBody, [
        { key: 'lazycolumn', label: 'usa LazyColumn', test: (b) => b.includes('LazyColumn') },
        {
          key: 'items',
          label: 'itera a lista com items(movies)',
          test: (b) => /items\(\s*movies\b/.test(b),
        },
        {
          key: 'moviecard-call',
          label: 'renderiza MovieCard(...) por item',
          test: (b) => b.includes('MovieCard('),
        },
      ]),
      ...todoCriteria(3, 3, 'TODO 3: card de $', movieCardBody, [
        { key: 'title', label: 'mostra movie.title', test: (b) => b.includes('movie.title') },
        { key: 'overview', label: 'mostra movie.overview', test: (b) => b.includes('movie.overview') },
        {
          key: 'nota-ano',
          label: 'mostra nota/ano (voteAverage ou releaseDate)',
          test: (b) => /movie\.(voteAverage|releaseDate)/.test(b),
        },
      ]),
    )
  }

  const { pub, priv } = buildBreakdowns(criteria)
  const structuralScore = computeAuto(criteria)
  const maxStructuralScore = 10
  // Critério eliminatório: build falhou -> os 10 pts estruturais ficam zerados,
  // mesmo que a checagem estática ache tudo certo.
  const autoScore = buildOk ? structuralScore : 0

  const result = {
    autoScore,
    maxAutoScore: maxStructuralScore,
    buildOk,
    criteria,
    breakdown: pub,
    privateBreakdown: priv,
  }

  fs.writeFileSync(path.join(__dirname, 'grade.json'), JSON.stringify(result, null, 2))

  console.log('\n=== VALIDATOR — Atividade 5 (KMP) ===')
  console.log(`buildOk: ${buildOk}`)
  console.log(`autoScore: ${autoScore}/${maxStructuralScore}`)
  console.log(priv)

  if (autoScore < maxStructuralScore) {
    process.exitCode = 1
  }
}

main()
