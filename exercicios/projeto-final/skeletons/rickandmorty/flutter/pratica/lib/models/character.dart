class CharacterSummary {
  final int id;
  final String name;

  CharacterSummary({required this.id, required this.name});

  factory CharacterSummary.fromJson(Map<String, dynamic> json) =>
      CharacterSummary(id: json['id'] as int, name: json['name'] as String);
}

class CharacterDetail {
  final int id;
  final String name;
  final String status;
  final String species;
  final String gender;
  final String imageUrl;

  CharacterDetail({
    required this.id,
    required this.name,
    required this.status,
    required this.species,
    required this.gender,
    required this.imageUrl,
  });

  factory CharacterDetail.fromJson(Map<String, dynamic> json) => CharacterDetail(
        id: json['id'] as int,
        name: json['name'] as String,
        status: json['status'] as String,
        species: json['species'] as String,
        gender: json['gender'] as String,
        imageUrl: json['image'] as String,
      );
}

String capitalize(String s) => s.isEmpty ? s : s[0].toUpperCase() + s.substring(1);
