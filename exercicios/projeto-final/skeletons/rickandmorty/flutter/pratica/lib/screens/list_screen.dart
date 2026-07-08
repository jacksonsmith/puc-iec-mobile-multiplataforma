import 'package:flutter/material.dart';
import '../api/rickandmorty_api.dart';
import '../models/character.dart';
import 'detail_screen.dart';

const List<String> _statuses = ['alive', 'dead', 'unknown'];

class ListScreen extends StatefulWidget {
  const ListScreen({super.key});

  @override
  State<ListScreen> createState() => _ListScreenState();
}

class _ListScreenState extends State<ListScreen> {
  final RickAndMortyApi _api = RickAndMortyApi();

  List<CharacterSummary> _all = [];
  bool _loading = true;
  String? _error;
  String _searchText = '';
  String? _selectedStatus;
  Set<String>? _statusNames;

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

  Future<void> _selectStatus(String? status) async {
    // TODO 4 (feature 4 — categoria/filtro): quando `status` não é null,
    // chamar `_api.fetchNamesByStatus(status)` e guardar em `_statusNames`
    // (setState). Quando `status` é null, limpar `_statusNames`.
    setState(() {
      _selectedStatus = status;
    });
  }

  List<CharacterSummary> get _filtered {
    // TODO 3 (feature 3 — busca) + TODO 4 (feature 4 — categoria): filtrar
    // `_all` por `_statusNames` (quando não-nulo, manter só quem está no
    // set) e por `_searchText` (substring case-insensitive do `name`).
    return _all;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Rick and Morty')),
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
                labelText: 'Buscar personagem',
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
              _buildStatusChip(null, 'Todos'),
              for (final status in _statuses) _buildStatusChip(status, status),
            ],
          ),
        ),
        const SizedBox(height: 8),
        Expanded(
          child: ListView.builder(
            itemCount: _filtered.length,
            itemBuilder: (context, index) {
              final character = _filtered[index];
              return Semantics(
                identifier: 'item-card-${character.id}',
                child: ListTile(
                  title: Text(capitalize(character.name)),
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => DetailScreen(characterId: character.id),
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

  Widget _buildStatusChip(String? status, String label) {
    final selected = _selectedStatus == status;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: Semantics(
        identifier: status == null ? 'category-chip-all' : 'category-chip-$status',
        child: ChoiceChip(
          label: Text(capitalize(label)),
          selected: selected,
          onSelected: (_) => _selectStatus(status),
        ),
      ),
    );
  }
}
