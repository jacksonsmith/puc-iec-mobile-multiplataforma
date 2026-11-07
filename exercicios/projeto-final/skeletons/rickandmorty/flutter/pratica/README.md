# Projeto Final — Rick and Morty em Flutter

Skeleton **opcional** de ponto de partida do **Projeto Final** (30 pts). A estrutura de telas e a lógica das
5 features básicas vêm marcadas com `// TODO 1` a `// TODO 5`. **O visual é básico de propósito**: persistência,
estados de loading/vazio/erro e todo o checklist de UI/UX (tema escuro, design tokens, responsividade,
acessibilidade, ícone/splash) são **trabalho do grupo** — veja o [`enunciado.md`](../../../../enunciado.md).

**API deste tema:** Rick and Morty API — personagens paginados; filtro por `status`; id `Int`.
Endpoints exatos, fixtures dos testes e gotchas: [`temas/02-rickandmorty/README.md`](../../../../temas/02-rickandmorty/README.md).
Regras completas e rubrica: [`enunciado.md`](../../../../enunciado.md).

> ⚠️ Antes de codar: seu grupo **reservou** a combinação `rickandmorty + flutter` abrindo issue no
> repo da disciplina? Cada combinação tema+framework é de um grupo só.

## Como rodar

```bash
# a partir da raiz do SEU clone (do fork do grupo):
cd exercicios/projeto-final/skeletons/rickandmorty/flutter/pratica
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
flutter build apk --debug
```

Entrega em grupo: **um repositório do grupo** (todos como *collaborators*), branches + PRs internos; a **URL do repo** vai no Canvas.
Adicionem `README.md` (com ≥ 3 screenshots) e `ADR.md` nesta pasta. Sem autograder: o professor clona, builda e avalia. Detalhes no
[`enunciado.md`](../../../../enunciado.md).
