import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:pokedex_final/main.dart';

void main() {
  testWidgets('App builds and shows the bottom navigation', (tester) async {
    await tester.pumpWidget(const PokedexFinalApp());
    await tester.pump();

    expect(find.byType(BottomNavigationBar), findsOneWidget);
  });
}
