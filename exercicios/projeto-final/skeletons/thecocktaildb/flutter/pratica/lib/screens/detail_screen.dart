import 'package:flutter/material.dart';
import '../api/cocktaildb_api.dart';
import '../models/drink.dart';
import '../storage/favorites_store.dart';

class DetailScreen extends StatefulWidget {
  final String drinkId;

  const DetailScreen({super.key, required this.drinkId});

  @override
  State<DetailScreen> createState() => _DetailScreenState();
}

class _DetailScreenState extends State<DetailScreen> {
  final CocktailDbApi _api = CocktailDbApi();
  final FavoritesStore _favoritesStore = FavoritesStore();

  DrinkDetail? _detail;
  bool _isFavorite = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final detail = await _api.fetchDetail(widget.drinkId);
      final favorites = await _favoritesStore.load();
      setState(() {
        _detail = detail;
        _isFavorite = favorites.contains(widget.drinkId);
      });
    } catch (error) {
      setState(() {
        _error = error.toString();
      });
    }
  }

  Future<void> _toggleFavorite() async {
    // TODO 5 (feature 5 — favoritos): chamar `_favoritesStore.toggle(widget.drinkId)`
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
            child: Image.network(detail.thumbUrl, height: 140),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Semantics(
                identifier: 'detail-title',
                child: Text(
                  detail.name,
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
          Chip(label: Text(detail.category)),
          const SizedBox(height: 16),
          Text('Alcoólico: ${detail.alcoholic}'),
          Text('Copo: ${detail.glass}'),
        ],
      ),
    );
  }
}
