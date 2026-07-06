import 'package:flutter/material.dart';
import '../api/poke_api.dart';
import '../models/pokemon.dart';
import 'detail_screen.dart';

const List<String> _categories = ['fire', 'water', 'electric', 'grass'];

class ListScreen extends StatefulWidget {
  const ListScreen({super.key});

  @override
  State<ListScreen> createState() => _ListScreenState();
}

class _ListScreenState extends State<ListScreen> {
  final PokeApi _api = PokeApi();

  List<PokemonSummary> _all = [];
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
    // TODO 1 (feature 1 — lista): chamar `_api.fetchList()`, guardar o resultado
    // em `_all` e marcar `_loading = false` via setState. Tratar erro com
    // `_error` (mensagem) igual ao padrão dos outros catch deste arquivo.
    setState(() {
      _loading = false;
    });
  }

  Future<void> _selectCategory(String? category) async {
    // TODO 4 (feature 4 — categoria/filtro): quando `category` não é null,
    // chamar `_api.fetchNamesByType(category)` e guardar em `_categoryNames`
    // (setState). Quando `category` é null, limpar `_categoryNames`.
    setState(() {
      _selectedCategory = category;
    });
  }

  List<PokemonSummary> get _filtered {
    // TODO 3 (feature 3 — busca) + TODO 4 (feature 4 — categoria): filtrar
    // `_all` por `_categoryNames` (quando não-nulo, manter só quem está no
    // set) e por `_searchText` (substring case-insensitive do `name`) — igual
    // à lógica already implementada no gabarito (`_categoryNames!.contains`,
    // `.toLowerCase().contains`).
    return _all;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Pokédex')),
      body: Semantics(
        identifier: 'item-list-screen',
        child: _buildBody(),
      ),
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
                labelText: 'Buscar pokémon',
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
              final pokemon = _filtered[index];
              return Semantics(
                identifier: 'item-card-${pokemon.id}',
                child: ListTile(
                  leading: Image.network(pokemon.spriteUrl, width: 40, height: 40),
                  title: Text(_capitalize(pokemon.name)),
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => DetailScreen(pokemonId: pokemon.id),
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
        identifier: category == null ? 'category-chip-all' : 'category-chip-$category',
        child: ChoiceChip(
          label: Text(_capitalize(label)),
          selected: selected,
          onSelected: (_) => _selectCategory(category),
        ),
      ),
    );
  }

  String _capitalize(String s) => s.isEmpty ? s : s[0].toUpperCase() + s.substring(1);
}
