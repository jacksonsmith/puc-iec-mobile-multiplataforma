# Projeto Final — Studio Ghibli (filmes) em Flutter

Skeleton do **Projeto Final** (30 pts). A UI já está pronta — telas, navegação e `testID`s que os
testes E2E (Maestro) procuram. Falta a **lógica das 5 features**, marcada com `// TODO 1` a
`// TODO 5` nos arquivos de tela. Vocês não escrevem UI do zero.

**API deste tema:** Studio Ghibli API — 22 filmes; filtro por `director`; id `String` (UUID).
Endpoints exatos, fixtures dos testes e gotchas: [`temas/05-studio-ghibli/README.md`](../../../../temas/05-studio-ghibli/README.md).
Regras completas e rubrica: [`enunciado.md`](../../../../enunciado.md).

> ⚠️ Antes de codar: seu grupo **reservou** a combinação `studio-ghibli + flutter` abrindo issue no
> repo da disciplina? Cada combinação tema+framework é de um grupo só.

## Como rodar

```bash
# a partir da raiz do SEU clone (do fork do grupo):
cd exercicios/projeto-final/skeletons/studio-ghibli/flutter/pratica
ls flows   # confere que está no lugar certo: 01-list.yaml … 05-favorites.yaml

flutter pub get
flutter run          # com emulador Android aberto (ou dispositivo conectado)
```

## Onde estão os TODOs

| Feature | TODO | Arquivo |
|---|---|---|
| 1 — Lista consumindo a API | `TODO 1` | `lib/screens/list_screen.dart` |
| 2 — Navegação lista → detalhe | `TODO 2` | `lib/screens/detail_screen.dart` |
| 3 — Busca por texto | `TODO 3` | `lib/screens/list_screen.dart` |
| 4 — Categoria/filtro (parâmetro real da API) | `TODO 4` | `lib/screens/list_screen.dart` |
| 5 — Favoritos persistidos | `TODO 5` | `lib/screens/detail_screen.dart` + `lib/screens/favorites_screen.dart` |

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
flutter build apk --debug
```

Entrega em grupo: 1 fork por grupo; integrantes trabalham via PRs internos no fork do grupo; o PR
final (fork → repo da disciplina) dispara o autograder a cada commit. Detalhes no
[`enunciado.md`](../../../../enunciado.md).
