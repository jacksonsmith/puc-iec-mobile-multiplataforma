# CineHub — Capstone (app de filmes + backend próprio)

> **Fonte canônica (interna).** Este diretório vive no repo interno `puc-iec-disciplinas`.
> Ele é **distribuído fatiado** pros repos públicos das disciplinas (ver `../README-capstone-interno.md`):
> Arquitetura recebe só as tasks `track:eng`; Testes só as `track:qa`.
> **Nunca** publicar `bugs-vulns-MAPA.md` nem `solucoes-referencia/`.

CineHub é o **mesmo projeto** usado como trabalho final em duas disciplinas, a partir de papéis diferentes:

- **Engenheiro de software (Arquitetura):** constrói features, melhora arquitetura/design, performance, native module, BFF/GraphQL, auth, PWA, IA on-device.
- **Engenheiro de qualidade (Testes):** escreve testes, caça bugs, identifica problemas de segurança, mede performance, monta CI.

O que torna isso possível: um **app de filmes** (continuidade dos apps das aulas, domínio TMDB) **+ um backend local próprio** (GraphQL + SQLite). Como o backend é "nosso", dá pra plantar features, **bugs e vulnerabilidades** de propósito — o substrato que ENG e QA atacam pelos dois lados.

## Estrutura

```
capstone/
  server/            # Node + Apollo GraphQL + SQLite (BFF). Auth, filmes, favoritos, listas.
  apps/
    mobile/          # Expo RN (base: CineFav) — fala com o server local
    web/             # (opcional) Vite + React PWA
  packages/types/    # tipos TS compartilhados app <-> server
  tasks-eng/         # catálogo de tasks da trilha Arquitetura
  tasks-qa/          # catálogo de tasks da trilha Testes
  grader/            # validators (eng + qa) + lib/compute-score.ts
  bugs-vulns-MAPA.md     # INTERNO — mapa dos bugs/vulns plantados
  solucoes-referencia/   # INTERNO — gabaritos das tasks
```

## Fluxo do aluno

1. Escolhe uma task no board (GitHub Issues / `tasks-*/TASKS.md`) e comenta pra "pegar".
2. Abre uma branch `task/<id>-<slug>`.
3. Resolve, commita, abre **PR** (1 PR = 1 task).
4. O bot (J.A.R.V.I.S.) roda o grader e comenta a **nota mínima** (auto-verificável). O restante (qualidade de design, relatório, achados de segurança) é avaliação manual no Canvas.
5. **Apresenta** as tasks que mergeou (~10 min + Q&A).

## Rodar o server

```bash
cd server
npm install
npm run seed     # cria e popula data/cinehub.db
npm run dev      # Apollo em http://localhost:4000/  (GraphQL Sandbox)
```

Usuários de seed: `ada@cinehub.dev` / `senha1234` e `alan@cinehub.dev` / `senha1234`.

