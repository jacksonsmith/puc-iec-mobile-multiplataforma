// test/app_test.dart — SPEC da atividade (o que o grader checa).
// Faça estes testes passarem (`flutter test`). NÃO edite este arquivo —
// seu teste autoral vai em test/favorites_test.dart (Ex3).

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:filmes_flutter/screens/home_screen.dart';
import 'package:filmes_flutter/widgets/movie_card.dart';
import 'package:filmes_flutter/models/movie.dart';

void main() {
  testWidgets('Ex1 — MovieCard mostra título, nota (⭐) e ano', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: Scaffold(
            body: MovieCard(
              movie: Movie(id: 1, title: 'Matrix', rating: 8.7, year: '1999 · Ficção'),
            ),
          ),
        ),
      ),
    );
    expect(find.text('Matrix'), findsOneWidget);
    expect(find.text(' 8.7'), findsOneWidget);
    expect(find.text('1999 · Ficção'), findsOneWidget);
    expect(find.byIcon(Icons.star), findsOneWidget);
  });

  testWidgets('Ex2 — favoritar reflete no card e no contador do header', (tester) async {
    await tester.pumpWidget(const ProviderScope(child: MaterialApp(home: HomeScreen())));
    await tester.pumpAndSettle();
    expect(find.text('♥ 0'), findsOneWidget);
    await tester.tap(find.byIcon(Icons.favorite_border).first);
    await tester.pump();
    expect(find.text('♥ 1'), findsOneWidget);
    expect(find.byIcon(Icons.favorite), findsWidgets);
  });

  testWidgets('Ex2 — "limpar" zera o contador (estado compartilhado)', (tester) async {
    await tester.pumpWidget(const ProviderScope(child: MaterialApp(home: HomeScreen())));
    await tester.pumpAndSettle();
    await tester.tap(find.byIcon(Icons.favorite_border).first);
    await tester.pump();
    expect(find.text('♥ 1'), findsOneWidget);
    await tester.tap(find.byIcon(Icons.delete_outline));
    await tester.pump();
    expect(find.text('♥ 0'), findsOneWidget);
  });
}
