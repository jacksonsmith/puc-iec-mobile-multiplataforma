# Arquitetura de Aplicações Móveis e Multiplataforma

> **Curso:** Pós-Graduação em Arquitetura de Software Distribuído — PUC Minas IEC
> **Modalidade:** Online ao vivo · 24h · 1º/2026
> **Professor:** Jackson Smith Moisés Matias

Repositório público com **exercícios, repos starter de aulas e materiais de referência** desta disciplina. Para alunos da Oferta 10 — Turma 1 (20/05 a 01/07/2026).

## Calendário

| # | Data | Tema |
|---|------|------|
| 1 | 20/05/2026 | Fundamentos & Panorama Mobile/Multiplataforma |
| 2 | 27/05/2026 | React Native em profundidade — New Architecture |
| 3 | 10/06/2026 | Cross-Platform Comparativo — Flutter, KMP, Native Bridging |
| 4 | 17/06/2026 | PWA, Service Workers, Web Workers, Offline-First |
| 5 | 24/06/2026 | Backend para Frontend — APIs, Middlewares, GraphQL, Segurança |
| 6 | 01/07/2026 | Performance, Observabilidade, IA on-Device & Apresentações |

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
├── exercicios/      # Atividades por aula (sem gabarito)
├── starters/        # Repos starter pra cada aula (clone & build)
├── labs/            # Hands-on labs feitos em sala
├── README.md        # Você está aqui
└── BIBLIOGRAFIA.md  # Referências completas
```

## Avaliação (100 pts)

| Item | Pontos |
|------|--------|
| Atividade 1 — ADR Arquitetural | 15 |
| Atividade 2 — App RN navegação + estado | 15 |
| Atividade 3 — Native Module + comparativo | 15 |
| Atividade 4 — PWA Offline-First | 15 |
| Atividade 5 — Integração GraphQL + auth | 10 |
| Quiz IA aplicada | 10 |
| **Projeto Final Individual** | **20** |

## Como usar

```bash
# Clone
git clone https://github.com/jacksonsmith/puc-iec-mobile-multiplataforma.git
cd puc-iec-mobile-multiplataforma

# Cada aula tem seu próprio starter em starters/aula-XX/
cd starters/aula-01
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

## Auto-grading via CI 🤖

Atividades 2, 3, 4 e 5 são avaliadas automaticamente em PR. Workflow:

1. **Fork** este repositório
2. Crie pasta: `exercicios/<NN>-<atividade>/aluno-<seu-github-username>/`
3. Implemente seguindo o `README.md` de cada exercício
4. Push + abra PR para `main`
5. CI dispara: **J.A.R.V.I.S.** (autograder) posta status no PR + sobe artifact privado pro prof

Atividades disponíveis:
- [A2 — App RN navegação + estado](./exercicios/02-app-rn-navegacao-estado/)
- [A3 — Native Module + comparativo](./exercicios/03-native-module-comparativo/)
- [A4 — PWA Offline-First](./exercicios/04-pwa-offline-first/)
- [A5 — GraphQL + Auth](./exercicios/05-graphql-auth/)

A1 (ADR) é correção manual.

Documentação técnica do autograder: [`grader/README.md`](./grader/README.md).

## Contato

Dúvidas: **Teams da turma** ou jackson.96@gmail.com.

---

Material didático autoral. Licenciado MIT — ver [LICENSE](./LICENSE).
