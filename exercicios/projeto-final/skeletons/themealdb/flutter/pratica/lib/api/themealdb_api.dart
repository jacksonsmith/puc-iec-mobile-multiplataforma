import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/meal.dart';

class TheMealDbApi {
  static const String baseUrl = 'https://www.themealdb.com/api/json/v1/1';

  Future<List<MealSummary>> fetchList() async {
    final res = await http.get(Uri.parse('$baseUrl/search.php?s='));
    if (res.statusCode != 200) {
      throw Exception('Falha ao carregar lista de receitas');
    }
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    final meals = (body['meals'] as List?) ?? [];
    return meals
        .map((e) => MealSummary.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<MealDetail> fetchDetail(String id) async {
    final res = await http.get(Uri.parse('$baseUrl/lookup.php?i=$id'));
    if (res.statusCode != 200) {
      throw Exception('Falha ao carregar detalhe da receita $id');
    }
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    final meals = body['meals'] as List;
    return MealDetail.fromJson(meals.first as Map<String, dynamic>);
  }

  /// A própria API filtra por categoria — sem precisar de endpoint separado
  /// de "tipo" como o PokeAPI.
  Future<Set<String>> fetchNamesByCategory(String category) async {
    final res = await http.get(Uri.parse('$baseUrl/filter.php?c=$category'));
    if (res.statusCode != 200) {
      throw Exception('Falha ao carregar categoria $category');
    }
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    final meals = (body['meals'] as List?) ?? [];
    return meals.map((e) => e['strMeal'] as String).toSet();
  }
}
