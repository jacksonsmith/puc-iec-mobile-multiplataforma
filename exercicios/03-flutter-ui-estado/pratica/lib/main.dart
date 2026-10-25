// lib/main.dart — ponto de entrada do app.
//
// ProviderScope = a "raiz" do Riverpod (deixa qualquer widget ler providers).

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'data/key_value_store.dart';
import 'state/movies_provider.dart';

import 'screens/home_screen.dart';
import 'theme/app_theme.dart';

// TASK 3 + TASK 7: Firebase (lib/firebase_options.dart = config do meu projeto, free tier)
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized(); // necessário p/ SharedPreferences (e p/ o Firebase)
  final prefs = await SharedPreferences.getInstance(); // o "armário" que sobrevive ao F5

  try {
    await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

    // TASK 10: persistência OFFLINE do Firestore (na web vem desligada). Precisa ser
    // configurada antes de qualquer leitura/escrita. Efeito: leituras saem do cache local
    // e escritas feitas sem rede ficam numa fila e sincronizam sozinhas na volta.
    FirebaseFirestore.instance.settings = const Settings(persistenceEnabled: true);
  } catch (e) {
    // Sem Firebase o app segue funcionando: favoritos ficam só em memória.
    debugPrint('Firebase não inicializado: $e');
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
