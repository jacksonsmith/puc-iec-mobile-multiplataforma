
import 'package:filmes_flutter/screens/home_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:filmes_flutter/state/favorites.dart';

void main() {

  void validateFavoritesHeartColor(WidgetTester tester, Color expectedColor) {
    final text = tester.widget<Text>(
      find.byWidgetPredicate(
        (widget) =>
            widget is Text &&
            widget.textSpan != null &&
            widget.textSpan!.toPlainText().contains('♥')
      ),
    );

    final heartSpan = (text.textSpan as TextSpan).children!.first as TextSpan;
    expect(heartSpan.style?.color, equals(expectedColor));
  }

  test('favoritos: toggle e clear', () {
    final c = ProviderContainer();
    addTearDown(c.dispose);

    expect(c.read(favoritesProvider), isEmpty);

    c.read(favoritesProvider.notifier).toggle(1);
    expect(c.read(favoritesProvider).contains(1), isTrue);

    c.read(favoritesProvider.notifier).toggle(1);
    expect(c.read(favoritesProvider).contains(1), isFalse);

    c.read(favoritesProvider.notifier).toggle(1);
    c.read(favoritesProvider.notifier).toggle(2);
    
    c.read(favoritesProvider.notifier).clear();

    expect(c.read(favoritesProvider), isEmpty);
  });

  testWidgets('Valida cor favoritos trocada corretamente', (tester) async {
    await tester.pumpWidget(const ProviderScope(child: MaterialApp(home: HomeScreen())));
    await tester.pumpAndSettle();
    await tester.tap(find.byIcon(Icons.favorite_border).at(0));
    await tester.pump();

    validateFavoritesHeartColor(tester, Colors.red);
    
    await tester.tap(find.byIcon(Icons.favorite).at(0));
    await tester.pump();

    validateFavoritesHeartColor(tester, Colors.grey);
  });
}
