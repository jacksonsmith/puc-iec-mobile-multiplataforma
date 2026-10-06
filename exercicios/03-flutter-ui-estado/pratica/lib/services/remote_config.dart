// lib/services/remote_config.dart
//
// Ex5 (TASK 8): busca o parâmetro `banner_message` do Firebase Remote Config.
//
// Pré-requisito: TASK 3 feito (projeto Firebase configurado) + parâmetro
// `banner_message` criado e PUBLICADO no console (Build → Remote Config).

import 'package:firebase_remote_config/firebase_remote_config.dart';
import 'package:flutter/foundation.dart'; // debugPrint

const _defaultBannerMessage = 'Bem-vindo ao app de filmes!';

// ── Ex5 · TASK 8 — fetchBannerMessage() ──────────────────────────────────────────────────────
// Ordem: configura → define o padrão local → busca e ativa → lê. Nunca lança erro: no pior caso
// devolve o padrão, e o banner aparece mesmo sem rede ou sem Firebase.
Future<String> fetchBannerMessage() async {
  try {
    final remoteConfig = FirebaseRemoteConfig.instance; // sem Firebase (flutter test) lança aqui
    await remoteConfig.setConfigSettings(RemoteConfigSettings(
      fetchTimeout: const Duration(seconds: 10),
      minimumFetchInterval: Duration.zero, // sem cache — sempre busca de novo (didático; o padrão é 12h)
    ));
    await remoteConfig.setDefaults({'banner_message': _defaultBannerMessage});
    try {
      await remoteConfig.fetchAndActivate();
    } catch (e) {
      // offline ou timeout: o getString abaixo devolve o último valor ativado (ou o padrão)
      debugPrint('Remote Config (buscar): $e');
    }
    return remoteConfig.getString('banner_message');
  } catch (e) {
    debugPrint('Remote Config: $e'); // no `flutter test` aparece "No Firebase App" — esperado
    return _defaultBannerMessage;
  }
}

// 👉 Teste você mesmo: muda o valor de `banner_message` no console do Firebase,
// dá refresh no app (F5) — o texto muda sem recompilar nada.
