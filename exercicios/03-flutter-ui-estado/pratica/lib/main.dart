// lib/main.dart — ponto de entrada do app.
//
// ProviderScope = a "raiz" do Riverpod (deixa qualquer widget ler providers).

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'data/key_value_store.dart';
import 'firebase_options.dart'; // TASK 3 — config do meu projeto Firebase
import 'state/movies_provider.dart';

import 'screens/home_screen.dart';
import 'theme/app_theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized(); // necessário p/ SharedPreferences (e p/ o Firebase)
  final prefs = await SharedPreferences.getInstance(); // o "armário" que sobrevive ao F5

  try {
    // TASK 7 — Firebase antes do runApp: o favoritesProvider já nasce lendo o Firestore
    await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
    // TASK 10 — na web a persistência offline do Firestore vem DESLIGADA. Ligada, as escritas
    // feitas sem rede ficam numa fila local (IndexedDB) e sincronizam sozinhas na volta.
    FirebaseFirestore.instance.settings = const Settings(persistenceEnabled: true);
  } catch (e) {
    // Sem Firebase o app abre do mesmo jeito: favoritos só em memória (comportamento do TASK 2).
    debugPrint('Firebase indisponível: $e');
  }

  runApp(ProviderScope(
    overrides: [storeProvider.overrideWithValue(SharedPrefsStore(prefs))],
    child: const MovieApp(),
  ));
}

class MovieApp extends StatelessWidget {
  const MovieApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Filmes',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.dark(), // tema pronto (dark premium) — você não precisa mexer
      home: const HomeScreen(),
    );
  }
}
