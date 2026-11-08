// lib/firebase_options.dart — TASK 3: config do MEU projeto Firebase (cinefav-paulnune, plano Spark).
//
// Mesmo formato que o `flutterfire configure` gera, montado à mão a partir do `firebaseConfig` do
// console (Plano B do enunciado). Não é segredo: a config web vai embutida em qualquer app web —
// quem protege os dados são as REGRAS do Firestore (só `favorites/meus-favoritos` é liberado).
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart' show kIsWeb;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) return web;
    throw UnsupportedError('Só a plataforma web foi configurada neste projeto Firebase.');
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyBY-4ulvqyIVHMpWWf7RwejwWSuKYYSh40',
    appId: '1:692324910030:web:1b1e9ab48211c178f8619f',
    messagingSenderId: '692324910030',
    projectId: 'cinefav-paulnune',
    authDomain: 'cinefav-paulnune.firebaseapp.com',
    storageBucket: 'cinefav-paulnune.firebasestorage.app',
    measurementId: 'G-7B43MK4XP6',
  );
}
