import 'package:flutter/material.dart';
import '../api/ghibli_api.dart';
import '../models/film.dart';
import 'detail_screen.dart';

const Map<String, String> _directors = {
  'miyazaki': 'Hayao Miyazaki',
  'takahata': 'Isao Takahata',
};

class ListScreen extends StatefulWidget {
  const ListScreen({super.key});

  @override
  State<ListScreen> createState() => _ListScreenState();
}

class _ListScreenState extends State<ListScreen> {
  final GhibliApi _api = GhibliApi();

  List<FilmSummary> _all = [];
  bool _loading = true;
  String? _error;
  String _searchText = '';
  String? _selectedDirectorSlug;
  Set<String>? _titlesForDirector;

  @override
  void initState() {
    super.initState();
    _loadList();
  }

  Future<void> _loadList() async {
    // TODO 1 (feature 1 — lista): chamar `_api.fetchList()`, guardar o
    // resultado em `_all` e marcar `_loading = false` via setState. Tratar
    // erro com `_error` (mensagem) igual ao padrão do catch abaixo.
    setState(() {
      _loading = false;
    });
  }

  Future<void> _selectDirector(String? slug) async {
    // TODO 4 (feature 4 — categoria/filtro): quando `slug` não é null,
    // chamar `_api.fetchTitlesByDirector(_directors[slug]!)` e guardar em
    // `_titlesForDirector` (setState). Quando `slug` é null, limpar
    // `_titlesForDirector`.
    setState(() {
      _selectedDirectorSlug = slug;
    });
  }

  List<FilmSummary> get _filtered {
    // TODO 3 (feature 3 — busca) + TODO 4 (feature 4 — categoria): filtrar
    // `_all` por `_titlesForDirector` (quando não-nulo, manter só quem tem
    // `title` no set) e por `_searchText` (substring case-insensitive do
    // `title`) — igual à lógica já implementada no gabarito.
    return _all;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Studio Ghibli')),
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
                labelText: 'Buscar filme',
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
              _buildDirectorChip(null, 'Todos'),
              for (final slug in _directors.keys) _buildDirectorChip(slug, slug),
            ],
          ),
        ),
        const SizedBox(height: 8),
        Expanded(
          child: ListView.builder(
            itemCount: _filtered.length,
            itemBuilder: (context, index) {
              final film = _filtered[index];
              return Semantics(
                identifier: 'item-card-${film.id}',
                child: ListTile(
                  title: Text(film.title),
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => DetailScreen(filmId: film.id),
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

  Widget _buildDirectorChip(String? slug, String label) {
    final selected = _selectedDirectorSlug == slug;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: Semantics(
        identifier: slug == null ? 'category-chip-all' : 'category-chip-$slug',
        child: ChoiceChip(
          label: Text(capitalize(label)),
          selected: selected,
          onSelected: (_) => _selectDirector(slug),
        ),
      ),
    );
  }
}
