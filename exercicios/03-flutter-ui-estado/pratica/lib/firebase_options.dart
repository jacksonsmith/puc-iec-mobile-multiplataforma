import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) return web;
    throw UnsupportedError('Firebase options are configured for web only.');
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyA0mrUma7-43XHGU9hff_SnHyDJP1ua_HM',
    appId: '1:170749578014:web:8e70b49ee30b91c38e570f',
    messagingSenderId: '170749578014',
    projectId: 'filmes-a3',
    authDomain: 'filmes-a3.firebaseapp.com',
    storageBucket: 'filmes-a3.firebasestorage.app',
    measurementId: 'G-12F6B638X3',
  );
}
