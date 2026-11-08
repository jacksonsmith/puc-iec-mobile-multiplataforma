// lib/services/remote_config.dart

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_remote_config/firebase_remote_config.dart';
import 'package:flutter/foundation.dart';

const _defaultBannerMessage = 'Bem-vindo ao app de filmes!';

Future<String> fetchBannerMessage() async {
  if (Firebase.apps.isEmpty) return _defaultBannerMessage;

  try {
    final remoteConfig = FirebaseRemoteConfig.instance;
    await remoteConfig.setConfigSettings(RemoteConfigSettings(
      fetchTimeout: const Duration(seconds: 10),
      minimumFetchInterval: Duration.zero,
    ));
    await remoteConfig.setDefaults({'banner_message': _defaultBannerMessage});
    await remoteConfig.fetchAndActivate();
    return remoteConfig.getString('banner_message');
  } catch (error, stackTrace) {
    debugPrint('Remote Config (banner_message): $error\n$stackTrace');
    return _defaultBannerMessage;
  }
}
