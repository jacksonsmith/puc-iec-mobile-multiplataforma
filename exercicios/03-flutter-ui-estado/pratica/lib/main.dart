
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'firebase_options.dart';
import 'screens/home_screen.dart';
import 'data/key_value_store.dart';
import 'state/movies_provider.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Inicializa o armazenamento local persistente.
  final prefs = await SharedPreferences.getInstance();

  // TASK 7 — Inicializa o Firebase.
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  // TASK 10 — Habilita a persistencia offline do Firestore.
  FirebaseFirestore.instance.settings = const Settings(
    persistenceEnabled: true,
  );

  // Conecta o cache persistente ao Riverpod.
  runApp(
    ProviderScope(
      overrides: [
        storeProvider.overrideWithValue(
          SharedPrefsStore(prefs),
        ),
      ],
      child: const MovieApp(),
    ),
  );
}

class MovieApp extends StatelessWidget {
  const MovieApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Filmes',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorSchemeSeed: const Color(0xFF003366),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}
