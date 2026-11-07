// lib/firebase_options.dart — config do app web do projeto Firebase pessoal (plano Spark).
// Equivalente ao que o `flutterfire configure` gera (Plano B do enunciado).
// Não é segredo: o navegador recebe esses valores de qualquer forma; quem protege os dados
// são as regras do Firestore.

import 'package:firebase_core/firebase_core.dart';

class DefaultFirebaseOptions {
  static const FirebaseOptions currentPlatform = FirebaseOptions(
    apiKey: 'AIzaSyBdGqMRL4f0LvpRUocCNJSrkXa1XtdMO5Q',
    appId: '1:1052514145545:web:c814143344a573c59a2fd8',
    messagingSenderId: '1052514145545',
    projectId: 'puc-iec-mobile-multiplataforma',
    authDomain: 'puc-iec-mobile-multiplataforma.firebaseapp.com',
    storageBucket: 'puc-iec-mobile-multiplataforma.firebasestorage.app',
  );
}
