# Projeto Final — TheCocktailDB (drinks) em React Native (Expo)

Skeleton do **Projeto Final** (30 pts). A UI já está pronta — telas, navegação e `testID`s que os
testes E2E (Maestro) procuram. Falta a **lógica das 5 features**, marcada com `// TODO 1` a
`// TODO 5` nos arquivos de tela. Vocês não escrevem UI do zero.

**API deste tema:** TheCocktailDB — drinks; filtro por categoria (`filter.php?c=`); id `String`.
Endpoints exatos, fixtures dos testes e gotchas: [`temas/04-thecocktaildb/README.md`](../../../../temas/04-thecocktaildb/README.md).
Regras completas e rubrica: [`enunciado.md`](../../../../enunciado.md).

> ⚠️ Antes de codar: seu grupo **reservou** a combinação `thecocktaildb + react-native` abrindo issue no
> repo da disciplina? Cada combinação tema+framework é de um grupo só.

## Como rodar

```bash
# a partir da raiz do SEU clone (do fork do grupo):
cd exercicios/projeto-final/skeletons/thecocktaildb/react-native/pratica
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

## Como saber se passou

Os mesmos flows que o autograder roda no CI estão em `flows/`. Para rodar localmente
([instalar Maestro](https://docs.maestro.dev/getting-started/installing-maestro)):

```bash
# com o app instalado e aberto no emulador:
maestro test flows/
```

Sem Maestro local, dá pra validar na mão: cada flow descreve o passo-a-passo (abrir lista, tocar
num item, buscar, filtrar, favoritar) — se funciona no emulador com os dados das fixtures do tema,
tende a passar no CI.

## Antes de abrir/atualizar o PR

O build precisa passar — **critério eliminatório** (app que não builda zera os 15 pts de E2E):

```bash
npx expo prebuild --platform android
```

Entrega em grupo: 1 fork por grupo; integrantes trabalham via PRs internos no fork do grupo; o PR
final (fork → repo da disciplina) dispara o autograder a cada commit. Detalhes no
[`enunciado.md`](../../../../enunciado.md).
