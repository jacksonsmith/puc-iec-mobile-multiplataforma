// lib/screens/home_screen.dart

import 'package:flutter/material.dart';
// TASK 5/6 — vire `ConsumerWidget` (build(context, ref)) e descomente:
// import 'package:flutter_riverpod/flutter_riverpod.dart';
// import '../state/favorites.dart';
// ⏸ [TASK 8 — ADIADA, pule]: descomente quando o remote_config.dart estiver pronto
// import '../services/remote_config.dart';
import '../widgets/movie_list.dart';
import '../widgets/offline_banner.dart';
import '../widgets/offline_toggle.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  late final Future<String> _bannerMessage;

  @override
  void initState() {
    super.initState();
    _bannerMessage = fetchBannerMessage();
  }

  @override
  Widget build(BuildContext context) {
    final favoriteCount = ref.watch(favoritesProvider).length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Filmes'),
        actions: [
          const OfflineToggle(),
          IconButton(
            icon: const Icon(Icons.delete_outline),
            tooltip: 'Limpar favoritos',
            onPressed: () => ref.read(favoritesProvider.notifier).clear(),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Center(child: Text('♥ $favoriteCount')),
          ),
        ],
      ),
      body: Column(
        children: [
          const OfflineBanner(),
          FutureBuilder<String>(
            future: _bannerMessage,
            builder: (context, snapshot) {
              final message = snapshot.data;
              if (message == null || message.isEmpty) {
                return const SizedBox.shrink();
              }
              return Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Text(message, textAlign: TextAlign.center),
              );
            },
          ),
          const Expanded(child: MovieList()),
        ],
      ),
    );
  }
}
