import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/film.dart';

class GhibliApi {
  static const String baseUrl = 'https://ghibliapi.vercel.app';

  Future<List<FilmSummary>> fetchList() async {
    final res = await http.get(Uri.parse('$baseUrl/films'));
    if (res.statusCode != 200) {
      throw Exception('Falha ao carregar lista de filmes');
    }
    final body = jsonDecode(res.body) as List;
    return body.map((e) => FilmSummary.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<FilmDetail> fetchDetail(String id) async {
    final res = await http.get(Uri.parse('$baseUrl/films/$id'));
    if (res.statusCode != 200) {
      throw Exception('Falha ao carregar detalhe do filme $id');
    }
    return FilmDetail.fromJson(jsonDecode(res.body) as Map<String, dynamic>);
  }

  /// A própria API filtra por diretor — sem precisar de endpoint separado
  /// de "categoria" como o PokeAPI.
  Future<Set<String>> fetchTitlesByDirector(String director) async {
    final res = await http.get(Uri.parse('$baseUrl/films?director=$director'));
    if (res.statusCode != 200) {
      throw Exception('Falha ao carregar diretor $director');
    }
    final body = jsonDecode(res.body) as List;
    return body.map((e) => e['title'] as String).toSet();
  }
}
