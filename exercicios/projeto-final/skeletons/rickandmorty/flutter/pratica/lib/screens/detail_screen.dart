import 'package:flutter/material.dart';
import '../api/rickandmorty_api.dart';
import '../models/character.dart';
import '../storage/favorites_store.dart';

class DetailScreen extends StatefulWidget {
  final int characterId;

  const DetailScreen({super.key, required this.characterId});

  @override
  State<DetailScreen> createState() => _DetailScreenState();
}

class _DetailScreenState extends State<DetailScreen> {
  final RickAndMortyApi _api = RickAndMortyApi();
  final FavoritesStore _favoritesStore = FavoritesStore();

  CharacterDetail? _detail;
  bool _isFavorite = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    // TODO 2 (feature 2 — detalhe): chamar `_api.fetchDetail(widget.characterId)`
    // e `_favoritesStore.load()`, guardar em `_detail`/`_isFavorite` via
    // setState. Tratar erro com `_error` (ver padrão do catch abaixo).
  }

  Future<void> _toggleFavorite() async {
    // TODO 5 (feature 5 — favoritos): chamar `_favoritesStore.toggle(widget.characterId)`
    // e atualizar `_isFavorite` via setState.
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: Semantics(
          identifier: 'detail-back-button',
          child: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ),
        title: const Text('Detalhe'),
      ),
      body: Semantics(
        identifier: 'detail-screen',
        child: _buildBody(),
      ),
    );
  }

  Widget _buildBody() {
    if (_error != null) {
      return Center(child: Text(_error!));
    }
    final detail = _detail;
    if (detail == null) {
      return const Center(child: CircularProgressIndicator());
    }
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Image.network(detail.imageUrl, height: 140),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Semantics(
                identifier: 'detail-title',
                child: Text(
                  capitalize(detail.name),
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
              ),
              Semantics(
                identifier: 'detail-favorite-button',
                child: IconButton(
                  icon: Icon(
                    _isFavorite ? Icons.favorite : Icons.favorite_border,
                    color: Colors.redAccent,
                  ),
                  onPressed: _toggleFavorite,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Chip(label: Text(detail.status)),
          const SizedBox(height: 16),
          Text('Espécie: ${detail.species}'),
          Text('Gênero: ${detail.gender}'),
        ],
      ),
    );
  }
}
