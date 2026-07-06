import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/pokemon.dart';

class PokeApi {
  static const String baseUrl = 'https://pokeapi.co/api/v2';

  Future<List<PokemonSummary>> fetchList({int limit = 151}) async {
    final res =
        await http.get(Uri.parse('$baseUrl/pokemon?limit=$limit&offset=0'));
    if (res.statusCode != 200) {
      throw Exception('Falha ao carregar lista de pokémons');
    }
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    final results = body['results'] as List;
    return results
        .map((e) => PokemonSummary.fromListEntry(
              e['name'] as String,
              e['url'] as String,
            ))
        .toList();
  }

  Future<PokemonDetail> fetchDetail(int id) async {
    final res = await http.get(Uri.parse('$baseUrl/pokemon/$id'));
    if (res.statusCode != 200) {
      throw Exception('Falha ao carregar detalhe do pokémon $id');
    }
    return PokemonDetail.fromJson(jsonDecode(res.body) as Map<String, dynamic>);
  }

  /// Retorna o conjunto de nomes de pokémon que pertencem ao tipo [type].
  Future<Set<String>> fetchNamesByType(String type) async {
    final res = await http.get(Uri.parse('$baseUrl/type/$type'));
    if (res.statusCode != 200) {
      throw Exception('Falha ao carregar tipo $type');
    }
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    final entries = body['pokemon'] as List;
    return entries
        .map((e) => e['pokemon']['name'] as String)
        .toSet();
  }
}
