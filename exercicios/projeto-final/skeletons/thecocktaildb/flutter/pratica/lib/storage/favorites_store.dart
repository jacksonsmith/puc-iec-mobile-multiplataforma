import 'package:shared_preferences/shared_preferences.dart';

/// Persistência local simples dos ids de drink favoritados. IDs do
/// TheCocktailDB vêm como string (`"11000"`), não numérico.
class FavoritesStore {
  static const _key = 'favorite_drink_ids';

  Future<Set<String>> load() async {
    final prefs = await SharedPreferences.getInstance();
    final stored = prefs.getStringList(_key) ?? [];
    return stored.toSet()
  }

  Future<bool> toggle(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final current = await load();
    final bool isNowFavorite;
    if (current.contains(id)) {
      current.remove(id);
      isNowFavorite = false;
    } else {
      current.add(id);
      isNowFavorite = true;
    }
    await prefs.setStringList(_key, current.toList());
    return isNowFavorite;
  }
}
