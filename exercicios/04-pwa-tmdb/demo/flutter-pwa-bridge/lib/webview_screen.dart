import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

const _pwaUrl = 'https://pwa-tmdb-aula4.vercel.app';

class WebViewScreen extends StatefulWidget {
  const WebViewScreen({super.key});

  @override
  State<WebViewScreen> createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> {
  late final WebViewController _controller;
  bool _loading = true;

  @override
  void initState() {
    super.initState();

    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      // UA customizado: o PWA pode detectar que está dentro do shell Flutter
      // e ajustar comportamento (ex.: suprimir install banner)
      ..setUserAgent('CineHub/1.0 FlutterShell')
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageFinished: (_) => setState(() => _loading = false),
          // Abre links externos no browser nativo, não no WebView
          onNavigationRequest: (req) {
            if (!req.url.startsWith(_pwaUrl)) {
              return NavigationDecision.prevent;
            }
            return NavigationDecision.navigate;
          },
        ),
      )
      ..loadRequest(Uri.parse(_pwaUrl));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Sem AppBar → fullscreen idêntico a app nativo instalado
      body: SafeArea(
        child: Stack(
          children: [
            WebViewWidget(controller: _controller),
            if (_loading)
              const Center(
                child: CircularProgressIndicator(color: Color(0xFF01b4e4)),
              ),
          ],
        ),
      ),
    );
  }
}
