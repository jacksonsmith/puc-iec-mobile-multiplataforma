// lib/main.dart — ponto de entrada do app.
//
// ProviderScope = a "raiz" do Riverpod (deixa qualquer widget ler providers).
// Você NÃO precisa mexer aqui.

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'data/key_value_store.dart';
import 'firebase_options.dart';
import 'screens/home_screen.dart';
import 'state/movies_provider.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final preferences = await SharedPreferences.getInstance();

  final firebaseOptions = DefaultFirebaseOptions.currentPlatform;
  if (firebaseOptions.apiKey.isNotEmpty &&
      firebaseOptions.appId.isNotEmpty &&
      firebaseOptions.projectId.isNotEmpty) {
    try {
      await Firebase.initializeApp(options: firebaseOptions);
      FirebaseFirestore.instance.settings =
          const Settings(persistenceEnabled: true);
    } catch (_) {
      // O app e as funções offline continuam disponíveis sem Firebase.
    }
  }

  runApp(ProviderScope(
    overrides: [
      storeProvider.overrideWithValue(SharedPrefsStore(preferences)),
    ],
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
      theme: ThemeData(
        colorSchemeSeed: const Color(0xFF003366),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}
