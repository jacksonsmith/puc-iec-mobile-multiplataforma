// test/app_test.dart — a SPEC da atividade (o que o grader checa).
//
// Faça estes testes passarem (`flutter test`). Eles são exatamente o que
// o autograder roda no seu PR.

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
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: HomeScreen())),
    );
    await tester.pumpAndSettle();

    // contador começa em 0
    expect(find.text('♥ 0'), findsOneWidget);

    // toca no 1º coração (estado vazio → favorite_border)
    await tester.tap(find.byIcon(Icons.favorite_border).first);
    await tester.pump();

    // contador vira 1 e o coração fica preenchido
    expect(find.text('♥ 1'), findsOneWidget);
    expect(find.byIcon(Icons.favorite), findsWidgets);
  });
}
