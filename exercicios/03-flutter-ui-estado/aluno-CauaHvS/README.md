# Atividade 3 — Flutter UI + Estado

## O que foi implementado

### Exercício 1 — MovieCard
O widget `MovieCard` foi construído com `Card > Padding(16) > Column`, exibindo o título em negrito (fontSize 20), a nota com ícone de estrela e o ano em cinza.

### Exercício 2 — Estado com Riverpod
O `favoritesProvider` usa `NotifierProvider<FavoritesNotifier, Set<int>>`. O `FavoritesNotifier` mantém um `Set<int>` com os IDs dos filmes favoritados e expõe dois métodos:
- `toggle(id)` — adiciona ou remove o ID do conjunto
- `clear()` — esvazia o conjunto

O `MovieCard` foi convertido para `ConsumerWidget` e lê o estado via `ref.watch(favoritesProvider)` para alternar o ícone de coração. O `HomeScreen` também virou `ConsumerWidget` e exibe o contador `♥ N` no AppBar, além do botão de limpar favoritos — todos lendo e escrevendo o mesmo `favoritesProvider`, sem prop drilling.

### Exercício 3 — Teste unitário
O arquivo `test/favorites_test.dart` testa o `favoritesProvider` em isolamento com `ProviderContainer`, verificando o estado inicial vazio, o toggle (add/remove) e o clear.
