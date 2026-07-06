class DrinkSummary {
  final String id;
  final String name;
  final String thumbUrl;

  DrinkSummary({required this.id, required this.name, required this.thumbUrl});

  factory DrinkSummary.fromJson(Map<String, dynamic> json) => DrinkSummary(
        id: json['idDrink'] as String,
        name: json['strDrink'] as String,
        thumbUrl: json['strDrinkThumb'] as String? ?? '',
      );
}

class DrinkDetail {
  final String id;
  final String name;
  final String category;
  final String alcoholic;
  final String glass;
  final String thumbUrl;

  DrinkDetail({
    required this.id,
    required this.name,
    required this.category,
    required this.alcoholic,
    required this.glass,
    required this.thumbUrl,
  });

  factory DrinkDetail.fromJson(Map<String, dynamic> json) => DrinkDetail(
        id: json['idDrink'] as String,
        name: json['strDrink'] as String,
        category: json['strCategory'] as String? ?? '',
        alcoholic: json['strAlcoholic'] as String? ?? '',
        glass: json['strGlass'] as String? ?? '',
        thumbUrl: json['strDrinkThumb'] as String? ?? '',
      );
}

String capitalize(String s) => s.isEmpty ? s : s[0].toUpperCase() + s.substring(1);
