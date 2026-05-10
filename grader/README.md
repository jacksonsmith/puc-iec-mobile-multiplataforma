# Grader — Arquitetura Mobile Multiplataforma (autograder CI)

Sistema de auto-correção das atividades práticas via GitHub Actions. Aluno faz fork → commit em `exercicios/<NN>-<atividade>/aluno-<github-username>/` → abre PR → CI roda validator → posta score no PR + sobe artifact com breakdown completo (acesso prof).

## Atividades cobertas

| # | Atividade | Validator | Status |
|---|-----------|-----------|--------|
| A1 | Análise de Cobertura | manual (textual) | — |
| A2 | Setup + Suíte Unitária | `unit-coverage.ts` | Fase 2 |
| A3 | Suíte Native UI | `espresso-android.ts` | Fase 2 |
| A4 | **Suíte Maestro Cross-Platform** | `maestro-suite.ts` | **MVP ativo** |
| A5 | Performance + Security | manual (relatório) | — |

## Como funciona

1. Aluno cria fork do repo público
2. Implementa em path: `exercicios/<NN>-<atividade>/aluno-<github-username>/`
3. Push e abre PR para `main` do upstream
4. Workflow `.github/workflows/grade-atividade-NN.yml` dispara em PR (filtro `paths`)
5. Validator roda em runner ubuntu-latest:
   - Setup ambiente (Node 22, emulator Android, Maestro CLI)
   - Executa validator TS via `tsx`
   - Gera `grade.json` com score + breakdown
6. Bot posta comment no PR com:
   - Score numérico (X/Y)
   - Status (PASS / REVIEW NEEDED)
   - Breakdown público (critério → status emoji)
7. `grade.json` completo sobe como artifact (privado, só prof acessa)
8. Status check do job pass/fail. Pra merge: prof revisa + aprova manualmente.

## Estrutura

```
grader/
├── package.json
├── tsconfig.json
├── lib/
│   ├── compute-score.ts           # tipos + helpers (rubrica → score)
│   └── validators/
│       └── maestro-suite.ts       # MVP A4
└── README.md
```

## Rodar localmente (smoke test do prof)

```bash
cd grader
npm install

# Validar entrega real com execução em emulator
npx tsx lib/validators/maestro-suite.ts \
  --entrega ../exercicios/04-suite-maestro-cross-platform/aluno-jacksonsmith \
  --output /tmp/grade.json \
  --student-login jacksonsmith \
  --commit-sha local

# Modo dry-run (sem executar flows; só valida estrutura + parse)
npx tsx lib/validators/maestro-suite.ts \
  --entrega ../exercicios/04-suite-maestro-cross-platform/aluno-jacksonsmith \
  --output /tmp/grade.json \
  --no-run \
  --student-login jacksonsmith \
  --commit-sha local
```

## Critérios — A4 Maestro (15pts)

1. **Mín 5 flows YAML** em `flows/` — 4pts
2. **appId em cada flow** — 2pts
3. **Parse válido** (`maestro check`) — 4pts
4. **Execução real em emulator** (mín 5 passam) — 4pts
5. **README descrevendo flows** — 1pt

Pass threshold: 60% (9/15).

## Adicionar novo validator (Fase 2+)

1. Criar `lib/validators/<tipo>.ts` exportando função `main()` que escreve `grade.json`
2. Adicionar workflow `.github/workflows/grade-atividade-<NN>.yml`
3. Path filter no `paths:` do workflow apontando pro path da atividade
4. Update README com novo validator

## Ambiente esperado em CI

Workflow `.github/workflows/grade-atividade-04.yml` provê:
- Node 22
- Java 17 (Android SDK)
- Android SDK + emulator (via `reactivecircus/android-emulator-runner`)
- Maestro CLI (instalado via `curl -Ls https://get.maestro.mobile.dev | bash`)

## Privacidade

- **Comment público**: score + status + breakdown público (sem detalhes sensíveis)
- **Artifact privado** (`grade.json`): breakdown completo + private notes; só prof baixa via UI Actions
- **Logs do workflow**: visíveis em PR público (atenção a logs verbose)

## Autoria

Material didático autoral. © 2026 Jackson Smith Moisés Matias.
