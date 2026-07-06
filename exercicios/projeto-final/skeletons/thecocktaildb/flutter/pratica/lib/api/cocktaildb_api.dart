import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/drink.dart';

class CocktailDbApi {
  static const String baseUrl = 'https://www.thecocktaildb.com/api/json/v1/1';

  /// Fonte primária da lista — `search.php?s=` (vazio) é instável na key de
  /// demo, então usamos a categoria "Cocktail" via filter.php (100 itens,
  /// estável).
  Future<List<DrinkSummary>> fetchList({String category = 'Cocktail'}) async {
    final res = await http.get(Uri.parse('$baseUrl/filter.php?c=$category'));
    if (res.statusCode != 200) {
      throw Exception('Falha ao carregar lista de drinks');
    }
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    final results = (body['drinks'] as List?) ?? [];
    return results
        .map((e) => DrinkSummary.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<DrinkDetail> fetchDetail(String id) async {
    final res = await http.get(Uri.parse('$baseUrl/lookup.php?i=$id'));
    if (res.statusCode != 200) {
      throw Exception('Falha ao carregar detalhe do drink $id');
    }
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    final drinks = body['drinks'] as List;
    return DrinkDetail.fromJson(drinks.first as Map<String, dynamic>);
  }

  /// Retorna o conjunto de nomes de drinks na categoria [category] — mesmo
  /// endpoint usado pra lista, só troca o valor de `c`.
  Future<Set<String>> fetchNamesByCategory(String category) async {
    final res = await http.get(Uri.parse('$baseUrl/filter.php?c=$category'));
    if (res.statusCode != 200) {
      throw Exception('Falha ao carregar categoria $category');
    }
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    final results = (body['drinks'] as List?) ?? [];
    return results.map((e) => e['strDrink'] as String).toSet();
  }
}
