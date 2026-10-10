// lib/services/remote_config.dart
//
// Ex5 (TASK 8): busca o parâmetro `banner_message` do Firebase Remote Config.
//
// Pré-requisito: TASK 3 feito (projeto Firebase configurado) + parâmetro
// `banner_message` criado no console (Build → Remote Config).

import 'package:firebase_remote_config/firebase_remote_config.dart';
import 'package:flutter/foundation.dart'; // debugPrint

const _defaultBannerMessage = 'Bem-vindo ao app de filmes!';

Future<String> fetchBannerMessage() async {
  try {
    final remoteConfig = FirebaseRemoteConfig.instance;
    await remoteConfig.setConfigSettings(RemoteConfigSettings(
      fetchTimeout: const Duration(seconds: 10),
      minimumFetchInterval:
          Duration.zero, // sem cache — sempre busca de novo (didático)
    ));
    await remoteConfig.setDefaults({'banner_message': _defaultBannerMessage});
    await remoteConfig.fetchAndActivate();
    return remoteConfig.getString('banner_message');
  } catch (e) {
    // offline, ou `flutter test` (Firebase não inicializado) — usa o texto padrão
    debugPrint('Remote Config: $e');
    return _defaultBannerMessage;
  }
}
