import 'package:flutter/material.dart';
import '../api/cocktaildb_api.dart';
import '../models/drink.dart';
import 'detail_screen.dart';

const List<String> _categories = ['shot', 'beer', 'shake'];

String _apiCategory(String slug) {
  switch (slug) {
    case 'shot':
      return 'Shot';
    case 'beer':
      return 'Beer';
    case 'shake':
      return 'Shake';
    default:
      return 'Cocktail';
  }
}

class ListScreen extends StatefulWidget {
  const ListScreen({super.key});

  @override
  State<ListScreen> createState() => _ListScreenState();
}

class _ListScreenState extends State<ListScreen> {
  final CocktailDbApi _api = CocktailDbApi();

  List<DrinkSummary> _all = [];
  bool _loading = true;
  String? _error;
  String _searchText = '';
  String? _selectedCategory;
  Set<String>? _categoryNames;

  @override
  void initState() {
    super.initState();
    _loadList();
  }

  Future<void> _loadList() async {
    try {
      final result = await _api.fetchList();
      setState(() {
        _all = result;
        _loading = false;
      });
    } catch (error) {
      print(error.toString());
      setState(() {
        _error = error.toString();
        _loading = false;
      });
    }
  }

  Future<void> _selectCategory(String? category) async {
    try {
      if (category == null) {
        setState(() {
          _selectedCategory = null;
          _categoryNames = null;
        });
      } else {
        final result = await _api.fetchNamesByCategory(_apiCategory(category));
        setState(() {
          _categoryNames = result.toSet();
          _selectedCategory = category;
        });
      }
    } catch (error) {
      print(error.toString());
      setState(() {
        _error = error.toString();
        _loading = false;
      });
    }
  }

  List<DrinkSummary> get _filtered {
    // TODO 3 (feature 3 — busca) + TODO 4 (feature 4 — categoria): filtrar
    // `_all` por `_categoryNames` (quando não-nulo, `_categoryNames!.contains`)
    // e por `_searchText` (substring case-insensitive do `name`).
    return _all.where((drink) {
          final matchesCategory =
              _categoryNames == null || _categoryNames!.contains(drink.name);
          final matchesSearch =
              drink.name.toLowerCase().contains(_searchText.toLowerCase());
          return matchesCategory && matchesSearch;
        }).toList();
      }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Drinks')),
      body: Semantics(identifier: 'item-list-screen', child: _buildBody()),
    );
  }

  Widget _buildBody() {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_error != null) {
      return Center(child: Text(_error!));
    }
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(12),
          child: Semantics(
            identifier: 'search-input',
            child: TextField(
              decoration: const InputDecoration(
                labelText: 'Buscar drink',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.search),
              ),
              onChanged: (value) => setState(() => _searchText = value),
            ),
          ),
        ),
        SizedBox(
          height: 44,
          child: ListView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            children: [
              _buildCategoryChip(null, 'Todos'),
              for (final category in _categories)
                _buildCategoryChip(category, category),
            ],
          ),
        ),
        const SizedBox(height: 8),
        Expanded(
          child: ListView.builder(
            itemCount: _filtered.length,
            itemBuilder: (context, index) {
              final drink = _filtered[index];
              return Semantics(
                identifier: 'item-card-${drink.id}',
                child: ListTile(
                  leading: Image.network(drink.thumbUrl, width: 40, height: 40),
                  title: Text(drink.name),
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => DetailScreen(drinkId: drink.id),
                      ),
                    );
                  },
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildCategoryChip(String? category, String label) {
    final selected = _selectedCategory == category;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: Semantics(
        identifier: category == null
            ? 'category-chip-all'
            : 'category-chip-$category',
        child: ChoiceChip(
          label: Text(capitalize(label)),
          selected: selected,
          onSelected: (_) => _selectCategory(category),
        ),
      ),
    );
  }
}
