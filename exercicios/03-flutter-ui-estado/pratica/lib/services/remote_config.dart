// lib/services/remote_config.dart
//
// Ex5 (TASK 8): busca o parâmetro `banner_message` do Firebase Remote Config.
// Pré-requisito: projeto Firebase configurado (TASK 3) + parâmetro `banner_message`
// criado e PUBLICADO no console (Build → Remote Config).

import 'package:firebase_remote_config/firebase_remote_config.dart';
import 'package:flutter/foundation.dart'; // debugPrint

const _defaultBannerMessage = 'Bem-vindo ao app de filmes!';

Future<String> fetchBannerMessage() async {
  try {
    final remoteConfig = FirebaseRemoteConfig.instance;
    await remoteConfig.setConfigSettings(RemoteConfigSettings(
      fetchTimeout: const Duration(seconds: 10),
      minimumFetchInterval: Duration.zero, // sem cache — sempre busca de novo (didático)
    ));
    await remoteConfig.setDefaults({'banner_message': _defaultBannerMessage});
    await remoteConfig.fetchAndActivate();
    final value = remoteConfig.getString('banner_message');
    return value.isEmpty ? _defaultBannerMessage : value;
  } catch (e) {
    // offline ou Firebase não inicializado (ex.: `flutter test`) → valor padrão
    debugPrint('Remote Config: $e');
    return _defaultBannerMessage;
  }
}
