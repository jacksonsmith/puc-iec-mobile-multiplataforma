// lib/main.dart: ponto de entrada do app.
//
// ProviderScope = a "raiz" do Riverpod (deixa qualquer widget ler providers).

import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'data/key_value_store.dart';
import 'firebase_options.dart';
import 'screens/home_screen.dart';
import 'state/movies_provider.dart';
import 'theme/app_theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized(); // necessário p/ SharedPreferences e Firebase
  final prefs = await SharedPreferences.getInstance(); // o "armário" que sobrevive ao F5

  // TASK 3 + TASK 7: conecta ao projeto Firebase (lib/firebase_options.dart).
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

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
      title: 'CineFav',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.dark(),
      home: const HomeScreen(),
    );
  }
}
