// lib/main.dart — ponto de entrada do app.

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

import 'data/key_value_store.dart';
import 'state/movies_provider.dart';

import 'screens/home_screen.dart';
import 'theme/app_theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final prefs = await SharedPreferences.getInstance();

  try {
    // TASK 3 + TASK 7: Inicializa Firebase com as opções da plataforma
    await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

    // TASK 10: Persistência offline do Firestore ativada
    FirebaseFirestore.instance.settings = const Settings(persistenceEnabled: true);
  } catch (e) {
    debugPrint('Firebase init ignored or fallback in web/test: $e');
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
      theme: AppTheme.dark(),
      home: const HomeScreen(),
    );
  }
}
