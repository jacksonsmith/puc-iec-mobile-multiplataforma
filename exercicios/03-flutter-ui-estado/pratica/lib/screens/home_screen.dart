// lib/screens/home_screen.dart
//
// A lista já está pronta (usa o MovieCard).
// Ex2 (TASK 5): contador de favoritos no header.
// Ex2 (TASK 6): botão "limpar" favoritos.
// Ex5 (TASK 8): banner com Remote Config.

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/favorites.dart';
import '../services/remote_config.dart';
import '../theme/app_theme.dart';
import '../widgets/movie_list.dart';
import '../widgets/offline_banner.dart';
import '../widgets/offline_toggle.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Ex2 · TASK 5 — mesmo provider que o card escreve: o contador acompanha sem receber nada por parâmetro
    final count = ref.watch(favoritesProvider).length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Filmes'),
        actions: [
          const OfflineToggle(), // modo avião simulado (pronto)
          // Ex2 · TASK 6 — limpar: escreve no mesmo provider; card e contador reagem juntos
          IconButton(
            tooltip: 'Limpar favoritos',
            icon: const Icon(Icons.delete_outline),
            onPressed: () => ref.read(favoritesProvider.notifier).clear(),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Center(child: Text('♥ $count')),
          ),
        ],
      ),
      body: Column(
        // ignore: prefer_const_literals_to_create_immutables
        children: [
          const OfflineBanner(), // TASK 11 — aviso de offline
          const _RemoteBanner(), // Ex5 · TASK 8 — texto vindo do Remote Config
          const Expanded(child: MovieList()), // lista vinda do repositório (cache-first)
        ],
      ),
    );
  }
}

// ── Ex5 · TASK 8 — banner com o texto do Remote Config ───────────────────────────────────────
// StatefulWidget para buscar UMA vez (no initState). Se o FutureBuilder chamasse
// fetchBannerMessage() direto no build da HomeScreen, cada toque no ♥ (que redesenha a tela)
// faria uma nova busca no Firebase.
class _RemoteBanner extends StatefulWidget {
  const _RemoteBanner();

  @override
  State<_RemoteBanner> createState() => _RemoteBannerState();
}

class _RemoteBannerState extends State<_RemoteBanner> {
  late final Future<String> _message;

  @override
  void initState() {
    super.initState();
    _message = fetchBannerMessage();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<String>(
      future: _message,
      builder: (context, snapshot) {
        final text = snapshot.data;
        if (text == null || text.isEmpty) return const SizedBox.shrink(); // carregando: nada na tela
        return Container(
          width: double.infinity,
          margin: const EdgeInsets.fromLTRB(16, 4, 16, 8),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            gradient: AppColors.brandGradient,
            borderRadius: BorderRadius.circular(14),
          ),
          child: Text(
            text,
            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
          ),
        );
      },
    );
  }
}
