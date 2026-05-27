# README — Mini-app RN Atividade 2 — [Seu Nome]

> Use isso como base do README.md do seu projeto.

## Identificação

- **Aluno:** [seu nome]
- **Store escolhido:** [A counter / B favorites / C theme]
- **Repo (seu fork):** [URL]

## Como rodar

```bash
npm install
npx expo start --web
```

App abre em `http://localhost:8081` (Expo padrão).

## O que o app faz

[1-3 frases descrevendo: 2 telas Stack, 2 tabs, store X com action Y]

## Screenshot

![Home com estado](./screenshot-home.png)

> Substitua a imagem real. Pode tirar com Cmd+Shift+4 no Mac ou Snip & Sketch no Windows.

## Arquitetura

```
src/
├── navigation/         ← Stack + Tabs config
├── screens/
│   ├── HomeScreen.tsx
│   ├── DetailScreen.tsx
│   └── SettingsScreen.tsx
└── store/
    └── <nome>Store.ts  ← Zustand store (1 arquivo, sem Provider)
```

## Referência

[1 referência — Material aula 2, RN docs, Zustand docs, Reanimated docs]

---

## 🎁 Bonus implementado (opcional)

- [ ] Deep link `expo://detail/<id>`
- [ ] MMKV persistindo estado
- [ ] Animação Reanimated
- [ ] TanStack Query com API
- [ ] Hermes habilitado (verificar `app.json` ou `app.config.ts`)

[Liste o que implementou e cole código relevante OU print de execução]
