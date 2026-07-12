import 'package:shared_preferences/shared_preferences.dart';

/// Persistência local simples dos ids de receitas favoritadas.
class FavoritesStore {
  static const _key = 'favorite_meal_ids';

  Future<Set<String>> load() async {
    final prefs = await SharedPreferences.getInstance();
    final stored = prefs.getStringList(_key) ?? [];
    return stored.toSet();
  }

  Future<void> toggle(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final current = await load();
    if (current.contains(id)) {
      current.remove(id);
    } else {
      current.add(id);
    }
    await prefs.setStringList(_key, current.toList());
  }
}
