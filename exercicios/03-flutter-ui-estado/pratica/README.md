# Filmes (Flutter) — Atividade 3 — Samuel Lima

App de catálogo de filmes em **Flutter** com estado compartilhado em **Riverpod**, favoritos sincronizados no **Firestore** e arquitetura **offline-first** (cache com TTL + fila de sincronização).

## Rodar
```bash
cd exercicios/03-flutter-ui-estado/pratica
flutter pub get
flutter run -d chrome --web-port 5300   # porta FIXA: o cache offline fica no navegador, por porta
# ou: rodar.bat (Windows) · ./rodar.sh (Mac/Linux) · F5 no VS Code
```
Dados reais do TMDB (opcional): copie `.env.local.example` → `.env.local`, cole a `TMDB_KEY` e rode com `rodar.bat`/`./rodar.sh`.

## Testar
```bash
flutter test      # app_test (Ex1/Ex2) + checklist + favorites_test (Ex3) + offline_test (TASKs 11–15)
flutter analyze   # limpo
```

## O que foi feito
| TASK | Onde | O quê |
|---|---|---|
| 1 | `lib/widgets/movie_card.dart` | Card composto: pôster · título · ⭐ nota · ano |
| 2, 7 | `lib/state/favorites.dart` | `favoritesProvider` (`Notifier<Set<int>>`, `toggle`/`clear`), sincronizado com o documento `favorites/meus-favoritos` |
| 3, 10 | `lib/main.dart` | `Firebase.initializeApp` + `Settings(persistenceEnabled: true)` |
| 4 | `lib/widgets/movie_card.dart` | coração (`ConsumerWidget` + `ref.watch`/`ref.read`) |
| 5, 6 | `lib/screens/home_screen.dart` | contador `♥ N` + botão limpar, lendo o mesmo provider |
| 9 | `test/favorites_test.dart` | 4 testes do provider isolado com `ProviderContainer` |
| 11 | `lib/widgets/offline_banner.dart` | aviso "Você está offline — mostrando dados salvos" |
| 12 | `lib/models/movie.dart` | `toJson`/`fromJson` (rating inteiro → `double`; `posterPath` opcional) |
| 13, 14 | `lib/data/movie_repository.dart` | `watchMovies()` cache-first + `cacheStatus()` com TTL (cache fresco não chama a API) |
| 15 | `lib/data/sync_queue.dart` | conflitos no `enqueue` (mesma ação não duplica, oposta cancela) + `flush` em ordem, persistindo a cada sucesso e parando no 1º erro |

**Firestore:** além de gravar com `.set(...)` a cada `toggle`/`clear`, o provider **escuta** o documento (`.snapshots()`). Por isso o favorito volta depois do F5 e, com duas abas abertas, favoritar numa aparece na outra. A UI muda na hora (atualização otimista) e o Firestore confirma em seguida. Sem Firebase (ex.: `flutter test`), o provider funciona só em memória.

## Local × cloud × offline-first
Estado **local** (o `Set<int>` do TASK 2, ou o cache no `SharedPreferences`) é instantâneo e funciona sem rede, mas fica preso a um aparelho/navegador e, se for só memória, morre no reload. Estado **cloud** (Firestore) é a fonte da verdade compartilhada: sobrevive ao reload, sincroniza entre abas e dispositivos e permite backup, mas cada leitura e escrita depende de rede, tem latência e custo e falha offline. O **offline-first** junta os dois: a tela lê sempre do que está no aparelho (cache com TTL, persistência do Firestore) e trata a rede como sincronização em segundo plano. As escritas feitas offline vão para uma fila (`SyncQueue` / fila do Firestore) e são enviadas na volta. O preço é a complexidade: o dado pode estar velho (por isso o TTL) e é preciso resolver conflitos (ex.: favoritar e desfavoritar offline se cancelam antes de chegar ao servidor).

## Prints

**Offline** (modo avião ✈️ ligado): banner no topo e lista vinda do cache, com os favoritos marcados.

![App offline](docs/offline.jpg)

**Firestore (favorito sobrevivendo ao F5):** _pendente. O código do Ex4 está pronto, mas o `lib/firebase_options.dart` ainda tem os valores de exemplo do enunciado. O print entra quando o projeto Firebase estiver configurado._
