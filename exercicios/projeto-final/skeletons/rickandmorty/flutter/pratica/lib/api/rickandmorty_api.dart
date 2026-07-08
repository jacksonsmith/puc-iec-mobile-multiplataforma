import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/character.dart';

class RickAndMortyApi {
  static const String baseUrl = 'https://rickandmortyapi.com/api';

  Future<List<CharacterSummary>> fetchList({int page = 1}) async {
    final res = await http.get(Uri.parse('$baseUrl/character?page=$page'));
    if (res.statusCode != 200) {
      throw Exception('Falha ao carregar lista de personagens');
    }
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    final results = body['results'] as List;
    return results
        .map((e) => CharacterSummary.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<CharacterDetail> fetchDetail(int id) async {
    final res = await http.get(Uri.parse('$baseUrl/character/$id'));
    if (res.statusCode != 200) {
      throw Exception('Falha ao carregar detalhe do personagem $id');
    }
    return CharacterDetail.fromJson(jsonDecode(res.body) as Map<String, dynamic>);
  }

  /// Retorna o conjunto de nomes de personagens com o status [status]
  /// (alive/dead/unknown) — a própria API filtra, sem precisar de endpoint
  /// separado de "tipo" (diferente do PokeAPI).
  Future<Set<String>> fetchNamesByStatus(String status) async {
    final res = await http.get(Uri.parse('$baseUrl/character/?status=$status'));
    if (res.statusCode != 200) {
      throw Exception('Falha ao carregar status $status');
    }
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    final results = body['results'] as List;
    return results.map((e) => e['name'] as String).toSet();
  }
}
