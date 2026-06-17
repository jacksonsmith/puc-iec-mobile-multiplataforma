# Atividade 3 — App Flutter: UI + Estado (15 pts)

**Disciplina:** Arquitetura de Aplicações Móveis e Multiplataforma
**Aula:** 3 (17/06/2026) · **Entrega:** até **23/06/2026 23:59**
**Modalidade:** individual · **Dificuldade:** ⭐⭐ Médio
**Auto-grade:** ✅ (J.A.R.V.I.S. roda `flutter test` no seu PR)

> Na Aula 3 você viu Flutter por dentro — **widgets, composição e estado com Riverpod** — e começou a montar o `MovieCard` no DartPad. **Esta atividade é o término disso, num projeto Flutter de verdade.** Você baixa o projeto (que já roda), completa os scaffolds e faz os **testes ficarem verdes**.

## Objetivos de aprendizagem (Bloom)
- **Entender** — explicar como a UI do Flutter é uma **árvore de widgets** composta, e por que estado compartilhado pede um *provider* (e não prop drilling).
- **Aplicar (Ex1)** — **compor** um `MovieCard` com `Card`/`Column`/`Row`/`Text`/`Icon`.
- **Aplicar/Analisar (Ex2)** — **modelar estado compartilhado** com **Riverpod** (favoritos) refletindo em dois lugares (card + header) a partir de uma única fonte.
- **Avaliar** — argumentar (1 parágrafo no README) por que o provider escala melhor que passar o estado por parâmetro.

---

## Pré-requisito — setup (na aula a gente começa o download)
```bash
# 1. instale o Flutter:  https://docs.flutter.dev/get-started/install
flutter doctor          # tudo verde o suficiente pra rodar no Chrome

# 2. fork + clone do SEU fork (repo público da disciplina)
cd exercicios/03-flutter-ui-estado/pratica
flutter pub get
flutter run -d chrome   # o app já abre (lista de filmes) — sem emulador, sem rede
```
> **Não precisa de emulador nem token.** `flutter run -d chrome` roda no navegador.
> Veja se já está no caminho: rode `flutter test` — os 2 testes devem aparecer **vermelhos** (é o que você vai deixar verde).

---

## Exercício 1 — UI: componha o `MovieCard` (Ex1)
Hoje o card mostra **só o título**. Em `lib/widgets/movie_card.dart` (TASK 1), componha:
- `Card` → `Padding(16)` → `Column` (`crossAxisAlignment: .start`, `mainAxisSize: .min`):
  - **título** (fonte 20, negrito)
  - **nota**: `Row` com `Icon(Icons.star, color: Colors.amber)` + `Text(' ${movie.rating}')`
  - **ano** (`movie.year`, cinza)

✅ **Verde quando:** o teste *"Ex1 — MovieCard mostra título, nota (⭐) e ano"* passa.

## Exercício 2 — Estado: favoritos com Riverpod (Ex2)
Estado compartilhado a partir de **uma fonte só** (`favoritesProvider`), refletindo no **card** e no **contador do header**:
1. **TASK 2** — `lib/state/favorites.dart`: implemente o `favoritesProvider` (`Notifier<Set<int>>` com `toggle(id)`).
2. **TASK 3** — `lib/widgets/movie_card.dart`: vire `ConsumerWidget`, leia `ref.watch(favoritesProvider)` e adicione um coração (`IconButton` `favorite`/`favorite_border`) que chama `toggle`.
3. **TASK 4** — `lib/screens/home_screen.dart`: vire `ConsumerWidget` e mostre `♥ <nº>` lendo `ref.watch(favoritesProvider).length`.

✅ **Verde quando:** o teste *"Ex2 — favoritar reflete no card e no contador do header"* passa (favoritar → `♥ 1` + coração preenchido).

> **A prova do estado compartilhado:** o coração (card) e o contador (header) leem o **mesmo** provider — favoritar num lugar atualiza o outro **sem passar nada por parâmetro**.

---

## Critérios de avaliação (15 pts)
| # | Critério | Pts | Como é medido |
|---|---|---|---|
| 1 | App compila e roda (`flutter run` / `flutter analyze` limpo) | 2 | manual (eliminatório) |
| 2 | **Ex1** · `MovieCard` compõe título + nota (⭐) + ano | 5 | `flutter test` (Ex1 verde) |
| 3 | **Ex2** · `favoritesProvider` + card favoritando + contador no header | 6 | `flutter test` (Ex2 verde) |
| 4 | README — como rodar + **1 parágrafo**: por que provider > prop drilling | 2 | manual (Canvas) |

> O autograder posta uma **nota mínima** (a parte de `flutter test`); compilar/rodar e o parágrafo do README são avaliados na leitura (Canvas). A final sai no Canvas.

## Entrega
- **Fork + Pull Request** no repo público da disciplina; cole o link do PR no Canvas.
- O **J.A.R.V.I.S.** roda `flutter test` a cada commit e comenta o resultado.
- **Hands-on da aula não pontua** — a entrega solo (deixar os testes verdes) vale os 15 pts.

> **Bridging nativo entra na Aula 4** (KMP + Platform Channel) — aqui o foco é **UI + estado**.
