import 'package:flutter/material.dart';
import '../api/poke_api.dart';
import '../models/pokemon.dart';
import '../storage/favorites_store.dart';
import 'detail_screen.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  final PokeApi _api = PokeApi();
  final FavoritesStore _favoritesStore = FavoritesStore();

  List<PokemonSummary> _favorites = [];
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
                    final pokemon = _favorites[index];
                    return Semantics(
                      identifier: 'favorite-item-${pokemon.id}',
                      child: ListTile(
                        leading: Image.network(
                          pokemon.spriteUrl,
                          width: 40,
                          height: 40,
                        ),
                        title: Text(_capitalize(pokemon.name)),
                        onTap: () async {
                          await Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => DetailScreen(pokemonId: pokemon.id),
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

  String _capitalize(String s) => s.isEmpty ? s : s[0].toUpperCase() + s.substring(1);
}
