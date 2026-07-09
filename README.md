# Arquitetura de Aplicações Móveis e Multiplataforma

> **Curso:** Pós-Graduação em Arquitetura de Software Distribuído — PUC Minas IEC
> **Modalidade:** Online ao vivo · 24h · 1º/2026
> **Professor:** Jackson Smith Moisés Matias

Repositório público com **exercícios e materiais de referência** desta disciplina. Para alunos da Oferta 10 — Turma 1 (20/05 a 15/07/2026).

## Calendário

| # | Data | Tema |
|---|------|------|
| 1 | 20/05/2026 | Fundamentos & Panorama Mobile/Multiplataforma |
| 2 | 27/05/2026 | React Native em profundidade — New Architecture |
| 3 | 17/06/2026 | Flutter — UI, Estado & Testes |
| 4 | 01/07/2026 | PWA, Service Workers, Offline-First |
| 5 | 08/07/2026 | Kotlin Multiplatform + lançamento do Projeto Final |
| 6 | 15/07/2026 | Performance, Observabilidade, BFF/GraphQL & Apresentações |

Todas quartas-feiras, 19:00–22:30.

## Ementa

Conceitos, requisitos e padrões arquiteturais para aplicações móveis e multiplataforma. Estratégias de portabilidade e adaptação de interfaces para diferentes dispositivos. Tipos de aplicações móveis: nativas, híbridas, progressivas (PWA) e multiplataforma. Tecnologias e frameworks de desenvolvimento cross-platform. Web Workers, Service Workers e Progressive Web Apps. Arquitetura de integração de middlewares, API Gateway, serviços REST e GraphQL. Desafios de escalabilidade, segurança e desempenho. Tendências em desenvolvimento multiplataforma. Projeto prático.

## Stack didática

- **Principal hands-on:** React Native (Expo SDK + bare workflow)
- **Comparativo aprofundado:** Flutter, Kotlin Multiplatform
- **Native bridging:** Android (Kotlin), iOS (Swift) com TurboModules
- **PWA:** React + Workbox + IndexedDB
- **IA:** Cursor + Claude API + LLMs on-device (MLC-LLM, llama.cpp)

## Estrutura do repo

```
.
├── exercicios/          # Atividades por aula (sem gabarito) — cada uma com pratica/
├── slides/              # PDFs das aulas
├── material-de-apoio/   # Leituras e referências por aula
├── grader/              # Autograder (J.A.R.V.I.S.)
├── README.md            # Você está aqui
└── BIBLIOGRAFIA.md      # Referências completas
```

## Avaliação (100 pts)

| Item | Pontos |
|------|--------|
| Atividade 1 — ADR Arquitetural | 15 |
| Atividade 2 — App RN: navegação + estado | 15 |
| Atividade 3 — Flutter: UI + Estado + Testes | 15 |
| Atividade 4 — PWA TMDB offline-first | 15 |
| Atividade 5 — KMP: Filmes Populares | 10 |
| **Projeto Final em Grupo** | **30** |

Cronograma com prazos: [`exercicios/README.md`](./exercicios/README.md).

## Como usar

```bash
# Fork primeiro (entregas são via PR), depois clone o SEU fork:
git clone https://github.com/<seu-usuario>/puc-iec-mobile-multiplataforma.git
cd puc-iec-mobile-multiplataforma

# Cada atividade vive em exercicios/NN-<slug>/pratica/ — ex.:
cd exercicios/02-app-rn-navegacao-estado/pratica
npm install
npx expo start
```

## Pré-requisitos

- **Node.js** ≥ 22 LTS
- **Xcode** (macOS) — para iOS
- **Android Studio** + emulador — para Android
- **Watchman** (`brew install watchman`)
- Conta GitHub para entregas

## Bibliografia principal

- EISENMAN, B. *Learning React Native*, 2nd ed. O'Reilly.
- WINDMILL, E. *Flutter in Action*. Manning.
- NEWMAN, S. *Building Microservices*, 2nd ed. O'Reilly.
- ATER, T. *Building Progressive Web Apps*. O'Reilly.
- MARTIN, R. C. *Clean Architecture*. Prentice Hall.

Bibliografia completa em [`BIBLIOGRAFIA.md`](./BIBLIOGRAFIA.md).

## Como entregar atividades

Guia completo passo-a-passo: [`COMO_ENTREGAR.md`](./COMO_ENTREGAR.md) (fork → clone → branch → commit → push → PR → link Canvas).

Slides da abertura da Aula 2 com tutorial Fork+PR: [`slides/intro-fluxo-pr-github.pdf`](./slides/intro-fluxo-pr-github.pdf).

## Auto-grading via CI 🤖

Atividades 2, 3, 4, 5 e o Projeto Final são avaliadas automaticamente em PR. Workflow:

1. **Fork** este repositório
2. Edite a pasta `pratica/` do exercício (os `TODO` marcados no código)
3. Push + abra PR para `main`
4. CI dispara: **J.A.R.V.I.S.** (autograder) comenta a nota mínima automática no PR a cada commit

Atividades disponíveis:
- [A2 — App RN: navegação + estado](./exercicios/02-app-rn-navegacao-estado/)
- [A3 — Flutter: UI + Estado + Testes](./exercicios/03-flutter-ui-estado/)
- [A4 — PWA TMDB offline-first](./exercicios/04-pwa-tmdb/)
- [A5 — KMP: Filmes Populares](./exercicios/05-kmp/)
- [PF — Projeto Final em Grupo](./exercicios/projeto-final/)

A1 (ADR) é correção manual.

Documentação técnica do autograder: [`grader/README.md`](./grader/README.md).

## Contato

Dúvidas: **Teams da turma** ou jackson.96@gmail.com.

---

Material didático autoral. Licenciado MIT — ver [LICENSE](./LICENSE).
