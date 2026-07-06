import 'package:flutter/material.dart';
import 'screens/list_screen.dart';
import 'screens/favorites_screen.dart';

void main() {
  runApp(const PokedexFinalApp());
}

class PokedexFinalApp extends StatelessWidget {
  const PokedexFinalApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pokédex — Projeto Final',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.red),
        useMaterial3: true,
      ),
      home: const HomeShell(),
    );
  }
}

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _selectedIndex == 0 ? const ListScreen() : const FavoritesScreen(),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        items: [
          const BottomNavigationBarItem(
            icon: Icon(Icons.catching_pokemon),
            label: 'Pokédex',
          ),
          BottomNavigationBarItem(
            icon: Semantics(
              identifier: 'tab-favorites',
              child: const Icon(Icons.favorite),
            ),
            label: 'Favoritos',
          ),
        ],
      ),
    );
  }
}
// smoke-test negativo — TODOs propositalmente não implementados
