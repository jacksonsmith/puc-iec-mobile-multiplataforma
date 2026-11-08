// lib/firebase_options.dart
//
// Configuração do projeto Firebase "puc-iec-a3-diego" (plano Spark).
// Gerado à mão a partir do `firebaseConfig` do console (Plano B do enunciado).
// Valores de um projeto pessoal/free tier — podem ir no PR sem problema.

import 'package:firebase_core/firebase_core.dart';

class DefaultFirebaseOptions {
  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyA69yziPBUiEBkS1GdgNdL98fcTzrdeNZg',
    authDomain: 'puc-iec-a3-diego.firebaseapp.com',
    projectId: 'puc-iec-a3-diego',
    storageBucket: 'puc-iec-a3-diego.firebasestorage.app',
    messagingSenderId: '173118412151',
    appId: '1:173118412151:web:5d63567a744231e883fd72',
  );

  /// A atividade roda no Chrome (web) — só essa plataforma foi registrada
  /// no projeto Firebase.
  static FirebaseOptions get currentPlatform => web;
}
