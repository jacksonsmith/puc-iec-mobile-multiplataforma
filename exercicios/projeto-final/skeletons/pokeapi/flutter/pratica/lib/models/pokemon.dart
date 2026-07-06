class PokemonSummary {
  final int id;
  final String name;

  PokemonSummary({required this.id, required this.name});

  String get spriteUrl =>
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/$id.png';

  factory PokemonSummary.fromListEntry(String name, String url) {
    final segments = url.split('/').where((s) => s.isNotEmpty).toList();
    final id = int.parse(segments.last);
    return PokemonSummary(id: id, name: name);
  }
}

class PokemonDetail {
  final int id;
  final String name;
  final List<String> types;
  final int heightDm;
  final int weightHg;

  PokemonDetail({
    required this.id,
    required this.name,
    required this.types,
    required this.heightDm,
    required this.weightHg,
  });

  String get spriteUrl =>
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/$id.png';

  factory PokemonDetail.fromJson(Map<String, dynamic> json) {
    final types = (json['types'] as List)
        .map((t) => t['type']['name'] as String)
        .toList();
    return PokemonDetail(
      id: json['id'] as int,
      name: json['name'] as String,
      types: types,
      heightDm: json['height'] as int,
      weightHg: json['weight'] as int,
    );
  }
}
