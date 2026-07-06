import 'package:flutter/material.dart';
import '../api/cocktaildb_api.dart';
import '../models/drink.dart';
import '../storage/favorites_store.dart';
import 'detail_screen.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  final CocktailDbApi _api = CocktailDbApi();
  final FavoritesStore _favoritesStore = FavoritesStore();

  List<DrinkSummary> _favorites = [];
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
                    final drink = _favorites[index];
                    return Semantics(
                      identifier: 'favorite-item-${drink.id}',
                      child: ListTile(
                        leading: Image.network(
                          drink.thumbUrl,
                          width: 40,
                          height: 40,
                        ),
                        title: Text(drink.name),
                        onTap: () async {
                          await Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => DetailScreen(drinkId: drink.id),
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
