// lib/firebase_options.dart — TASK 3 (Plano B: config copiada do console do Firebase).
// Projeto pessoal no plano Spark: esses valores identificam o projeto, não são segredo.
// Quem controla o acesso são as regras do Firestore.

import 'package:firebase_core/firebase_core.dart';

class DefaultFirebaseOptions {
  static const FirebaseOptions currentPlatform = FirebaseOptions(
    apiKey: 'AIzaSyAd1neFLgzKo04RH3Q5Cq6ftcAxbjBCYR0',
    appId: '1:274764629950:web:c153ecec1b8647a72b9bef',
    messagingSenderId: '274764629950',
    projectId: 'projeto-mobile-multiplataforma',
    authDomain: 'projeto-mobile-multiplataforma.firebaseapp.com',
    storageBucket: 'projeto-mobile-multiplataforma.firebasestorage.app',
    measurementId: 'G-KDNSK9B51M',
  );
}
