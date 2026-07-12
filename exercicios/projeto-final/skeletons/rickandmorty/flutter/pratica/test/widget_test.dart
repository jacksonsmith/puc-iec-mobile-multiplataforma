import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:rickmorty_final/main.dart';

void main() {
  testWidgets('App builds and shows the bottom navigation', (tester) async {
    await tester.pumpWidget(const RickAndMortyFinalApp());
    await tester.pump();

    expect(find.byType(BottomNavigationBar), findsOneWidget);
  });
}
