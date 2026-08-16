# Atividade 2 — App RN navegação + estado (15 pts)

> **Disciplina:** Arquitetura Mobile Multiplataforma — PUC IEC 2026
> **Aula correspondente:** Aula 2 (27/05/2026)
> **Prazo:** 09/06/2026 — 23:59
> **Auto-grading:** ✅ ativo via CI

## Objetivo

Estender app RN da Aula 2 com favoritos persistentes (MMKV), animação Reanimated não trivial e medição de TTI.

## Como entregar

1. **Fork** do repo
2. Cria pasta: `exercicios/02-app-rn-navegacao-estado/aluno-<seu-github-username>/`
3. Implementa app
4. Push + abre PR para `main` do upstream
5. CI roda autograder; J.A.R.V.I.S. comenta status

## Estrutura esperada

```
exercicios/02-app-rn-navegacao-estado/aluno-<github-username>/
├── package.json                 # com RN + react-navigation + RTK
├── App.tsx (ou index.tsx)
├── src/
│   ├── navigation/              # NavigationContainer + Stack/Tab
│   ├── store/                   # RTK slice ou Zustand
│   └── screens/
└── README.md                    # como rodar + features
```

## Critérios de avaliação automatizada

| # | Critério | Peso |
|---|----------|------|
| 1 | package.json com RN + react-navigation + RTK | 4 |
| 2 | Ponto de entrada (App.tsx/index.tsx) | 2 |
| 3 | NavigationContainer configurado | 3 |
| 4 | Estado RTK ou Zustand | 3 |
| 5 | Reanimated importado/usado | 2 |
| 6 | README presente | 1 |

**Pass threshold:** 60%.

## Anexar vídeo

Mostre app rodando: navegação + estado + animação. ≤ 2min.

## Pitfalls

- Path errado → CI ignora
- README ausente → -1pt
- AsyncStorage em vez de MMKV → critério 4 não detecta MMKV mas valor pedagógico recomenda MMKV
