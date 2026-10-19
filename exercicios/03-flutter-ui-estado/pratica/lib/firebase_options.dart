import 'package:firebase_core/firebase_core.dart';

/// Configuração pública do app Web registrado no projeto pessoal da atividade.
class DefaultFirebaseOptions {
  static const currentPlatform = FirebaseOptions(
    apiKey: 'AIzaSyCXlj-LRT1__OwnqemJWb-FnZLA4GQQBNc',
    appId: '1:335873204540:web:5b65853e1f3c1d9669be39',
    messagingSenderId: '335873204540',
    projectId: 'filmes-aula-3',
    authDomain: 'filmes-aula-3.firebaseapp.com',
    storageBucket: 'filmes-aula-3.firebasestorage.app',
  );

  static bool get isConfigured =>
      currentPlatform.apiKey.isNotEmpty &&
      currentPlatform.appId.isNotEmpty &&
      currentPlatform.messagingSenderId.isNotEmpty &&
      currentPlatform.projectId.isNotEmpty;
}
