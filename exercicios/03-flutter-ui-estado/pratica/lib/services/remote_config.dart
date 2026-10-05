// lib/services/remote_config.dart
//
// TASK 8 (Ex5): serviço para buscar parâmetros do Firebase Remote Config.

import 'package:firebase_remote_config/firebase_remote_config.dart';
import 'package:flutter/foundation.dart';

Future<String> fetchBannerMessage() async {
  try {
    final remoteConfig = FirebaseRemoteConfig.instance;
    await remoteConfig.setConfigSettings(RemoteConfigSettings(
      fetchTimeout: const Duration(seconds: 10),
      minimumFetchInterval: const Duration(seconds: 0),
    ));
    await remoteConfig.fetchAndActivate();
    final message = remoteConfig.getString('banner_message');
    return message.isNotEmpty ? message : 'Bem-vindo ao app de filmes!';
  } catch (e) {
    debugPrint('RemoteConfig error: $e');
    return 'Bem-vindo ao app de filmes!';
  }
}
