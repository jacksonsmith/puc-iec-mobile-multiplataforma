# Grader do CineHub

Valida a entrega de **uma task** contra a rubrica do catálogo (`tasks-eng/` · `tasks-qa/`) e
produz a **nota mínima auto-verificável**. Não substitui a avaliação manual no Canvas — apenas
estabelece um **piso** (`autoScore ≤ nota final`).

## Princípio de segurança
O validator **nunca executa** o código da entrega — só **lê** arquivos e checa estrutura
(`lib/fs-ctx.ts`). Combina com o autograder `../.github/workflows/grade.yml` (two-checkout:
grader confiável da base + entrega isolada em `_pr/`, somente leitura).

## Rodar local
```bash
npm install
# por id de task:
npx tsx validator.ts --task eng-sec-sqli --entrega /caminho/da/capstone --out grade.json
# ou pelo nome da branch do aluno:
npx tsx validator.ts --branch task/eng-sec-sqli-jackson --entrega /caminho/da/capstone
```

## Como pontua
- `lib/compute-score.ts` — `computeScore` (tudo) · `computeAuto` (ignora `manual`, é o piso) · `buildBreakdowns` (markdown pub/priv).
- `lib/rubrics.ts` — registry por task. Critério **automático** tem `check()` (regex/estrutura); critério **manual** (`manual: true`) entra no breakdown como 📝 mas **não conta** no número auto.
- Defeitos plantados e suas correções: `../bugs-vulns-MAPA.md` (interno).

## Calibração (regra: validar 2 casos antes de soltar)
- **scaffold/baseline** (defeito presente) → nota baixa.
- **solução de referência** → nota cheia nos critérios automáticos.
Os ENG de correção de defeito foram smoke-testados nos dois casos (0/N no baseline, N/N no fix).
Soluções de referência: `../solucoes-referencia/<id-da-task>/` (interno; nunca em PR público).

## Tasks cobertas
Use `npx tsx validator.ts` sem args pra listar todas. Auto-verificáveis mais ricos:
correções ENG (`eng-sec-*`, `eng-bug-*`), `qa-maestro-e2e` (estrutura dos flows), `qa-unit-jest`,
`qa-ci-pipeline`. Achados de QA (`qa-sec-*`, `qa-bug-*`) pontuam o artefato (PoC/teste + report) e
deixam a análise pro Canvas (📝).
