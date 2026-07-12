import * as fs from 'fs'

// Acha qual (tema, framework) um PR do Projeto Final tocou, a partir dos arquivos
// mudados. Convenção de path fixa: skeletons/<tema>/<framework>/pratica/... —
// não precisa achar package.json nem adivinhar pasta (diferente do discover
// genérico de outras atividades), porque o aluno só pode editar dentro desse
// prefixo.
//
// Uso: ts-node discover.ts --owner <owner> --repo <repo> --pr <number>
// Requer env GITHUB_TOKEN. Escreve as saídas em $GITHUB_OUTPUT (formato Actions)
// quando essa env existir; sempre imprime um resumo em stdout.

interface Args {
  owner: string
  repo: string
  pr: number
}

function parseArgs(argv: string[]): Args {
  const get = (flag: string) => {
    const i = argv.indexOf(flag)
    return i >= 0 ? argv[i + 1] : undefined
  }
  const owner = get('--owner')
  const repo = get('--repo')
  const prRaw = get('--pr')
  if (!owner || !repo || !prRaw) {
    throw new Error('Uso: discover.ts --owner <owner> --repo <repo> --pr <number>')
  }
  return { owner, repo, pr: Number(prRaw) }
}

export interface DiscoverResult {
  ok: boolean
  tema?: string
  framework?: string
  entregaPath?: string
  error?: string
}

const SKELETONS_PREFIX = 'exercicios/projeto-final/skeletons/'

export function groupByTemaFramework(paths: string[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const filePath of paths) {
    if (!filePath.startsWith(SKELETONS_PREFIX)) continue
    const rest = filePath.slice(SKELETONS_PREFIX.length)
    const segments = rest.split('/')
    if (segments.length < 2) continue
    const [tema, framework] = segments
    const key = `${tema}/${framework}`
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return counts
}

export function resolveDiscovery(paths: string[]): DiscoverResult {
  const counts = groupByTemaFramework(paths)
  if (counts.size === 0) {
    return { ok: false, error: 'PR não tocou nenhum arquivo em skeletons/<tema>/<framework>/' }
  }
  if (counts.size > 1) {
    const combos = Array.from(counts.keys()).join(', ')
    return {
      ok: false,
      error: `PR toca múltiplas combinações tema/framework (${combos}) — o grupo deve editar só 1 pasta.`,
    }
  }
  const [key] = counts.keys()
  const [tema, framework] = key.split('/')
  return {
    ok: true,
    tema,
    framework,
    entregaPath: `${SKELETONS_PREFIX}${tema}/${framework}/pratica`,
  }
}

async function listPullFiles(owner: string, repo: string, pr: number, token: string): Promise<string[]> {
  const filenames: string[] = []
  let url: string | null = `https://api.github.com/repos/${owner}/${repo}/pulls/${pr}/files?per_page=100`

  while (url) {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    })
    if (!res.ok) {
      throw new Error(`GitHub API respondeu ${res.status}: ${await res.text()}`)
    }
    const body = (await res.json()) as { filename: string }[]
    filenames.push(...body.map((f) => f.filename))

    const link = res.headers.get('link')
    const next = link?.split(',').find((part) => part.includes('rel="next"'))
    url = next ? next.split(';')[0].trim().replace(/^<|>$/g, '') : null
  }

  return filenames
}

async function main() {
  const { owner, repo, pr } = parseArgs(process.argv.slice(2))
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error('GITHUB_TOKEN não definido')

  const filenames = await listPullFiles(owner, repo, pr, token)
  const result = resolveDiscovery(filenames)

  console.log(JSON.stringify(result, null, 2))

  const githubOutput = process.env.GITHUB_OUTPUT
  if (githubOutput) {
    const lines = [
      `ok=${result.ok}`,
      `tema=${result.tema ?? ''}`,
      `framework=${result.framework ?? ''}`,
      `entrega_path=${result.entregaPath ?? ''}`,
      `error=${result.error ?? ''}`,
    ]
    fs.appendFileSync(githubOutput, lines.join('\n') + '\n')
  }

  if (!result.ok) {
    process.exitCode = 1
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
}
