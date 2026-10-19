// lib/services/remote_config.dart
//
// ⏸ ADIADA — a TASK 8 NÃO faz parte desta atividade (pule este arquivo).
// Ex5 (TASK 8): busca o parâmetro `banner_message` do Firebase Remote Config.
//
// Pré-requisito: TASK 3 feito (projeto Firebase configurado) + parâmetro
// `banner_message` criado no console (Build → Remote Config).

// TODO [TASK 8]: descomente o import abaixo
import 'package:firebase_remote_config/firebase_remote_config.dart';

const _defaultBannerMessage = 'Bem-vindo ao app de filmes!';

Future<String> fetchBannerMessage() async {
  try {
    final remoteConfig = FirebaseRemoteConfig.instance;
    await remoteConfig.setConfigSettings(
      RemoteConfigSettings(
        fetchTimeout: const Duration(seconds: 10),
        minimumFetchInterval: Duration.zero,
      ),
    );
    await remoteConfig.setDefaults({'banner_message': _defaultBannerMessage});
    await remoteConfig.fetchAndActivate();
    return remoteConfig.getString('banner_message');
  } catch (_) {
    return _defaultBannerMessage;
  }
}
