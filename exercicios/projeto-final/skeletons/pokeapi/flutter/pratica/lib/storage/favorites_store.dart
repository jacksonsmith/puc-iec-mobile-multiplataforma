import 'package:shared_preferences/shared_preferences.dart';

/// Persistência local simples dos ids de pokémon favoritados.
class FavoritesStore {
  static const _key = 'favorite_pokemon_ids';

  Future<Set<int>> load() async {
    final prefs = await SharedPreferences.getInstance();
    final stored = prefs.getStringList(_key) ?? [];
    return stored.map(int.parse).toSet();
  }

  Future<void> toggle(int id) async {
    final prefs = await SharedPreferences.getInstance();
    final current = await load();
    if (current.contains(id)) {
      current.remove(id);
    } else {
      current.add(id);
    }
    await prefs.setStringList(
      _key,
      current.map((e) => e.toString()).toList(),
    );
  }
}
