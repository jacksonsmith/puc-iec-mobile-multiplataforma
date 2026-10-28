// lib/firebase_options.dart — config do MEU projeto Firebase (plano Spark, free tier).
// Criado pelo "Plano B" do enunciado (console → app Web → firebaseConfig), equivalente ao que o
// `flutterfire configure` gera. Não é segredo de produção (o enunciado permite commitar).
import 'package:firebase_core/firebase_core.dart';

class DefaultFirebaseOptions {
  static const FirebaseOptions currentPlatform = FirebaseOptions(
    apiKey: 'AIzaSyDXnKh4nalt-8d06KbExKWd12QKmq8oiLs',
    appId: '1:188091812896:web:ee19ec783dbbef01bb4045',
    messagingSenderId: '188091812896',
    projectId: 'filmes-flutter-77dc4',
    authDomain: 'filmes-flutter-77dc4.firebaseapp.com',
    storageBucket: 'filmes-flutter-77dc4.firebasestorage.app',
  );
}
