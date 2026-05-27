# README — Mini-app RN Atividade 2 — [Seu Nome]

> Use isso como base do README.md do seu projeto.

## Identificação

- **Aluno:** [seu nome]
- **Bonus implementado:** [se houver — Bottom Tabs, MMKV, etc]
- **Repo (seu fork):** [URL]

## Como rodar

```bash
npm install
npx expo start --web
```

App abre em `http://localhost:8081` (Expo padrão).

## O que o app faz

[1-3 frases descrevendo: 2 telas Stack (Home + Detail), Zustand counter com increment/decrement/reset]

## Screenshot

![Home com estado](./screenshot-home.png)

> Substitua a imagem real. Pode tirar com Cmd+Shift+4 no Mac ou Snip & Sketch no Windows.

## Arquitetura

```
src/
├── navigation/
│   └── RootStack.tsx
├── screens/
│   ├── HomeScreen.tsx
│   └── DetailScreen.tsx
└── store/
    └── counterStore.ts  ← Zustand store (1 arquivo, sem Provider)
```

## Referência

[1 referência — Material aula 2, RN docs, Zustand docs, Reanimated docs]

---

## 🎁 Bonus implementado (opcional)

- [ ] **Bottom Tabs com 2 tabs (Home + Settings) — +2pt**
- [ ] Deep link `expo://detail/<id>`
- [ ] MMKV persistindo estado
- [ ] Animação Reanimated
- [ ] TanStack Query com API
- [ ] Hermes habilitado (verificar `app.json` ou `app.config.ts`)
- [ ] Store `favorites` ou `theme` (em vez de counter)

[Liste o que implementou e cole código relevante OU print de execução]
