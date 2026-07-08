import 'package:flutter/material.dart';
import '../api/ghibli_api.dart';
import '../models/film.dart';
import '../storage/favorites_store.dart';
import 'detail_screen.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  final GhibliApi _api = GhibliApi();
  final FavoritesStore _favoritesStore = FavoritesStore();

  List<FilmSummary> _favorites = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    // TODO 5 (feature 5 — favoritos): cruzar `_favoritesStore.load()` (ids)
    // com `_api.fetchList()` (dados), guardar em `_favorites` via setState
    // e marcar `_loading = false`.
    setState(() {
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Favoritos')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _favorites.isEmpty
              ? const Center(child: Text('Nenhum favorito ainda.'))
              : ListView.builder(
                  itemCount: _favorites.length,
                  itemBuilder: (context, index) {
                    final film = _favorites[index];
                    return Semantics(
                      identifier: 'favorite-item-${film.id}',
                      child: ListTile(
                        title: Text(film.title),
                        onTap: () async {
                          await Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => DetailScreen(filmId: film.id),
                            ),
                          );
                          _load();
                        },
                      ),
                    );
                  },
                ),
    );
  }
}
