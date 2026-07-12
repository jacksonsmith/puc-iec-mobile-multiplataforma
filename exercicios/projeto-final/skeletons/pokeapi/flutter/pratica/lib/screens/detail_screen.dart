import 'package:flutter/material.dart';
import '../api/poke_api.dart';
import '../models/pokemon.dart';
import '../storage/favorites_store.dart';

class DetailScreen extends StatefulWidget {
  final int pokemonId;

  const DetailScreen({super.key, required this.pokemonId});

  @override
  State<DetailScreen> createState() => _DetailScreenState();
}

class _DetailScreenState extends State<DetailScreen> {
  final PokeApi _api = PokeApi();
  final FavoritesStore _favoritesStore = FavoritesStore();

  PokemonDetail? _detail;
  bool _isFavorite = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    // TODO 2 (feature 2 — detalhe): chamar `_api.fetchDetail(widget.pokemonId)`
    // e `_favoritesStore.load()`, guardar em `_detail`/`_isFavorite` via
    // setState. Tratar erro com `_error` (ver padrão do catch abaixo).
  }

  Future<void> _toggleFavorite() async {
    // TODO 5 (feature 5 — favoritos): chamar `_favoritesStore.toggle(widget.pokemonId)`
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
            child: Image.network(detail.spriteUrl, height: 140),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Semantics(
                identifier: 'detail-title',
                child: Text(
                  _capitalize(detail.name),
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
          Wrap(
            spacing: 8,
            children: detail.types
                .map((t) => Chip(label: Text(t)))
                .toList(),
          ),
          const SizedBox(height: 16),
          Text('Altura: ${detail.heightDm / 10} m'),
          Text('Peso: ${detail.weightHg / 10} kg'),
        ],
      ),
    );
  }

  String _capitalize(String s) => s.isEmpty ? s : s[0].toUpperCase() + s.substring(1);
}
