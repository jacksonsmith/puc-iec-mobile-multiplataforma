// lib/firebase_options.dart
//
// Config do app Web no projeto Firebase pessoal `cinefav-atividade3` (plano Spark).
// Não é segredo: identifica o projeto, e o acesso aos dados é controlado pelas regras
// do Firestore (só o documento favorites/meus-favoritos fica liberado).
import 'package:firebase_core/firebase_core.dart';

class DefaultFirebaseOptions {
  static const FirebaseOptions currentPlatform = FirebaseOptions(
    apiKey: 'AIzaSyBoLCTtLUoi2kBrWxvGVZlsBhQrP3fQ5Wo',
    appId: '1:882039730825:web:f8fbb42003e0a9f14a0c58',
    messagingSenderId: '882039730825',
    projectId: 'cinefav-atividade3',
    authDomain: 'cinefav-atividade3.firebaseapp.com',
    storageBucket: 'cinefav-atividade3.firebasestorage.app',
    measurementId: 'G-PFRCVFX8MP',
  );
}
