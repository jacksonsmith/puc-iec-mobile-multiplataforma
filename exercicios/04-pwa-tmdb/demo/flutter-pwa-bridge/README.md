# Demo: Flutter Shell → PWA (transparente)

Demo de aula mostrando que um app Flutter pode carregar um PWA via WebView
de forma completamente transparente — o usuário não sabe que está num WebView.

## Como rodar

```bash
cd demos/flutter-pwa-bridge
flutter pub get
flutter run        # Android emulator ou dispositivo físico
```

## O que acontece

1. **Splash nativa Flutter** (2s) — código Dart, animação fade-in
2. **Transição fade** para o WebView
3. **PWA carrega** em `https://pwa-tmdb-aula4.vercel.app`
4. Service Worker registra → app funciona offline dentro do WebView

## Ponto pedagógico

O `User-Agent` enviado é `CineHub/1.0 FlutterShell`.
O PWA pode detectar isso e suprimir o install banner (já instalado, na prática):

```ts
// useInstallPrompt.ts
const isFlutterShell = navigator.userAgent.includes('FlutterShell');
// Se isFlutterShell → não mostrar banner de instalação
```

## Arquitetura

```
Flutter (nativo)          WebView
┌──────────────┐         ┌────────────────────────────┐
│ SplashScreen │ ──────► │ pwa-tmdb-aula4.vercel.app  │
│ (Dart)       │  fade   │                            │
└──────────────┘         │ ┌──────────┐ ┌──────────┐ │
                         │ │    SW    │ │ IndexedDB│ │
                         │ │  (cache) │ │  (dados) │ │
                         │ └──────────┘ └──────────┘ │
                         └────────────────────────────┘
```

## Limitações do demo

- Não substitui um app nativo completo (câmera, Bluetooth, notificações push nativas)
- Objetivo: mostrar que a fronteira PWA↔nativo é fluida
- Produção real: Flutter + deep link → abre rota específica do PWA
