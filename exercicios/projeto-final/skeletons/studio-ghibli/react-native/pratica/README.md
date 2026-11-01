# Projeto Final — Studio Ghibli (filmes) em React Native (Expo)

Skeleton **opcional** de ponto de partida do **Projeto Final** (30 pts). A estrutura de telas e a lógica das
5 features básicas vêm marcadas com `// TODO 1` a `// TODO 5`. **O visual é básico de propósito**: persistência,
estados de loading/vazio/erro e todo o checklist de UI/UX (tema escuro, design tokens, responsividade,
acessibilidade, ícone/splash) são **trabalho do grupo** — veja o [`enunciado.md`](../../../../enunciado.md).

**API deste tema:** Studio Ghibli API — 22 filmes; filtro por `director`; id `String` (UUID).
Endpoints exatos, fixtures dos testes e gotchas: [`temas/05-studio-ghibli/README.md`](../../../../temas/05-studio-ghibli/README.md).
Regras completas e rubrica: [`enunciado.md`](../../../../enunciado.md).

> ⚠️ Antes de codar: seu grupo **reservou** a combinação `studio-ghibli + react-native` abrindo issue no
> repo da disciplina? Cada combinação tema+framework é de um grupo só.

## Como rodar

```bash
# a partir da raiz do SEU clone (do fork do grupo):
cd exercicios/projeto-final/skeletons/studio-ghibli/react-native/pratica
ls flows   # confere que está no lugar certo: 01-list.yaml … 05-favorites.yaml

npm install
npx expo run:android   # primeira vez compila o projeto nativo — demora; precisa de emulador
```

## Onde estão os TODOs

| Feature | TODO | Arquivo |
|---|---|---|
| 1 — Lista consumindo a API | `TODO 1` | `src/screens/ListScreen.tsx` |
| 2 — Navegação lista → detalhe | `TODO 2` | `src/screens/DetailScreen.tsx` |
| 3 — Busca por texto | `TODO 3` | `src/screens/ListScreen.tsx` |
| 4 — Categoria/filtro (parâmetro real da API) | `TODO 4` | `src/screens/ListScreen.tsx` |
| 5 — Favoritos persistidos | `TODO 5` | `src/screens/DetailScreen.tsx` + `src/screens/FavoritesScreen.tsx` |

## Como se autoverificar (opcional)

Os flows Maestro em `flows/` **não são mais avaliados pelo CI** — servem para vocês conferirem
a mão que as 5 features funcionam. Para rodar localmente
([instalar Maestro](https://docs.maestro.dev/getting-started/installing-maestro)):

```bash
# com o app instalado e aberto no emulador:
maestro test flows/
```

Se mudarem a UI e um flow quebrar, tudo bem: ajustem o flow (ou ignorem) — o que vale é o app
funcionar bem e o checklist do enunciado.


## Antes de abrir/atualizar o PR

O build precisa passar — **critério eliminatório** (app que não builda não pode ser demonstrado e zera a Funcionalidade):

```bash
npx expo prebuild --platform android
```

Entrega em grupo: **um repositório do grupo** (todos como *collaborators*), branches + PRs internos; a **URL do repo** vai no Canvas.
Adicionem `README.md` (com ≥ 3 screenshots) e `ADR.md` nesta pasta. Sem autograder: o professor clona, builda e avalia. Detalhes no
[`enunciado.md`](../../../../enunciado.md).
