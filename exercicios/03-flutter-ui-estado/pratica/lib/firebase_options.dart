import 'package:firebase_core/firebase_core.dart';

/// Os padrões apontam somente ao emulador local (projeto demo).
/// Para nuvem, passe a configuração pública por --dart-define-from-file.
class DefaultFirebaseOptions {
  static const currentPlatform = FirebaseOptions(
    apiKey: String.fromEnvironment('FIREBASE_API_KEY',
        defaultValue: 'local-emulator'),
    appId: String.fromEnvironment('FIREBASE_APP_ID',
        defaultValue: '1:123456789:web:local'),
    messagingSenderId:
        String.fromEnvironment('FIREBASE_SENDER_ID', defaultValue: '123456789'),
    projectId: String.fromEnvironment('FIREBASE_PROJECT_ID',
        defaultValue: 'demo-puc-mobile'),
  );
}
