// lib/screens/home_screen.dart
//
// A lista já está pronta (usa o MovieCard).
// Ex2 (TASK 5): contador de favoritos no header.
// Ex2 (TASK 6): botão "limpar" favoritos.
// Ex5 (TASK 8): banner com Remote Config.

import 'package:flutter/material.dart';
// TASK 5/6 — vire `ConsumerWidget` (build(context, ref)) e descomente:
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/favorites.dart';
// TODO [TASK 8]: descomente quando o remote_config.dart estiver pronto
import '../services/remote_config.dart';
import '../widgets/movie_list.dart';
import '../widgets/offline_banner.dart';
import '../widgets/offline_toggle.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  // TASK 8: busca o banner UMA vez (initState), não a cada rebuild — senão pisca ao favoritar.
  late final Future<String> _bannerMessage;

  @override
  void initState() {
    super.initState();
    _bannerMessage = fetchBannerMessage();
  }

  @override
  Widget build(BuildContext context) {
    final count = ref.watch(favoritesProvider).length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Filmes'),
        actions: [
          OfflineToggle(), // modo avião simulado (pronto)
          // ── Ex2 · TASK 6 — botão "limpar" favoritos · 🧑‍💻 EM CASA (sozinho) ──
          // adicione um IconButton(icon: Icon(Icons.delete_outline)) que chama
          //   ref.read(favoritesProvider.notifier).clear()
          //
          IconButton(
            icon: const Icon(Icons.delete_outline),
            onPressed: () => ref.read(favoritesProvider.notifier).clear(),
          ),
          
          // ── Ex2 · TASK 5 — contador de favoritos · 🧑‍💻 EM CASA (sozinho) ─────
          // troque o '0' por ref.watch(favoritesProvider).length
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Center(child: Text('♥ $count', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold))),
          ),
        ],
      ),
      body: Column(
        // ignore: prefer_const_literals_to_create_immutables
        children: [
          const OfflineBanner(), // TASK 11 — aviso de offline
          // ── Ex5 · TASK 8 — banner Remote Config · 🧑‍💻 EM CASA (sozinho) ────────────────
          // Vire esta parte um FutureBuilder<String> (ou StatefulWidget com initState)
          // que chama fetchBannerMessage() de '../services/remote_config.dart' e
          // renderiza o texto retornado num Container no topo da lista.
          FutureBuilder<String>(
            future: _bannerMessage,
            builder: (context, snapshot) {
              final message = snapshot.data ?? '';
              if (snapshot.connectionState == ConnectionState.waiting ||
                  snapshot.hasError ||
                  message.isEmpty) {
                return const SizedBox.shrink(); // carregando, erro ou mensagem vazia: sem faixa
              } else {
                return Container(
                  color: Colors.blue,
                  padding: const EdgeInsets.all(8),
                  alignment: Alignment.center,
                  child: Text(
                    message,
                    style: const TextStyle(color: Colors.white),
                  ),
                );
              }
            },
          ),
          const Expanded(child: MovieList()), // lista vinda do repositório (cache-first)
        ],
      ),
    );
  }
}
