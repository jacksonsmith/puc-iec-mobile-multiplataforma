# ADR-0001: Stack multiplataforma para o projeto Renraku

> **ADR (Architecture Decision Record)** — baseado em Michael Nygard (2011) *Documenting Architecture Decisions*. Roteiro livre: siga as seções, mas não precisa ser rígido — o que importa é o raciocínio.


---

## Status

`Aceito`

**Data:** 2026-09-22
**Autor:** Igor Suzart

## Contexto

> Renraku é um leitor EPUB multiplataforma (nome vem do japonês: 連絡 = comunicação/elo/leitura em voz alta) que precisa rodar em 6 alvos a partir de um único codebase, com render EPUB real — não WebView mockado.

- **Produto:** leitor EPUB multiplataforma
- **Plataformas-alvo:** Linux desktop (primário, first-class), macOS, Windows, iOS, Android, Web (opcional)
- **Renderização EPUB:** precisa suportar EPUB 2 e 3 com paginação real, reflow, e idealmente TTS — descarta soluções 100% browser-side (travam com arquivos grandes)
- **Persistência:** local-only (SQLite), sem backend nesta fase — sync entre devices fica fora de escopo
- **Restrição técnica crítica:** Linux desktop precisa ser alvo de primeira classe, não experimento — essa restrição invalida React Native como escolha default

## Decisão

> Adotaremos **Flutter + Riverpod + Drift (SQLite) + flutter_readium (Readium-based)** com **theming Yaru (Ubuntu/GNOME)** no desktop Linux — um único codebase Dart que roda em Linux desktop (target primário), Windows, iOS, Android e opcionalmente Web, com persistência local via SQLite, state reativo via Riverpod, Readium toolkit pra parsing/render robusto de EPUB 2 e 3, e identidade visual Ubuntu no desktop (Material 3 + Cupertino continuam cuidando de mobile via Flutter).

## Alternativas consideradas

> Comparação honesta com prós/contras — sem matriz de peso × nota (isso fica pro Projeto Final, quando o cenário for mais complexo).

| Alternativa | Prós | Contras |
|---|---|---|
| **Flutter + Readium + Yaru** (escolhida) | Um codebase roda em Linux (first-class), Windows, iOS, Android, Web; Canonical é o novo mantenedor oficial do Flutter desktop (Google I/O 2026); Readium é toolkit open-source de referência pra EPUB; DX excelente com hot reload; Dart moderno com Null safety; Material 3 + Cupertino prontos; `yaru.dart` entrega theming Ubuntu/GNOME oficial no desktop Linux | Existem menos desenvolvedores Dart do que JS; ecossistema JS tem mais libs em nichos específicos; |
| React Native + Expo | Ecossistema JS/TS maduro em mobile; WebView resolve render de EPUB; vasta documentação e libs de terceiros | Linux desktop não é target oficial do RN — exige Electron wrapper ou RN Desktop (instável); Web só via wrapper com caveats; sem theming Ubuntu nativo |
| Nativo (QML + Kotlin + Swift) | Melhor performance/UX possível em cada plataforma; theming nativo "de graça" (QML/Yaru no KDE/GNOME, Material You no Android, SwiftUI no iOS) | 3 codebases separadas (QML, Kotlin, Swift) — inviável pra 1 pessoa manter; prazo e esforço explodem |

## Consequências

**Positivas:**

- Linux desktop first-class desde o dia 1 — alvo primário atendido nativamente
- Readium toolkit é referência mundial em EPUB (mantido pela Readium Foundation)
- Canonical no comando do Flutter desktop (anunciado em maio/2026 no Google I/O)
- Um codebase, 5+ plataformas — "escrevi uma vez, roda em todo lugar"
- Material 3 + Cupertino dá UI nativa em mobile, e **Yaru** entrega theming Ubuntu/GNOME oficial no desktop Linux sem custom theme próprio
- Persistência local com Drift (Dart ORM type-safe) e Riverpod 2.x incentiva boa arquitetura
- Snapcraft pra publicar no Snap Store do Ubuntu

**Negativas:**

- Manter dois design systems (Yaru e Material) para o projeto
- `flutter_readium` ainda é novo — pode ter bugs em edge cases. *Mitigação:* `epubx` (parser puro Dart) é alternativa madura como fallback
- Linux desktop tem quirks distro-dependentes (acessibilidade GTK/Orca, notificações systemd, tray icon)
- Sem backend = sem sync entre devices — se virar requisito, refactor grande
- Tamanho do app desktop — Flutter desktop empacotado ainda é ~30–40MB mínimo

## Referências

> Fontes que sustentam a decisão: doc oficial da tecnologia + anúncio de manutenção + referência da toolkit + paper/template base.

- **Google I/O 2026** — *Canonical takes over Flutter desktop maintenance.* omgubuntu.co.uk (2026, maio).
- **Flutter Documentation** — *Supported deployment platforms.* docs.flutter.dev (atualizado 2026-09-14).
- **Readium Foundation** — *open-source toolkit for EPUB.* readium.org.
- **Yaru (Ubuntu/Canonical)** — *yaru.dart — Flutter port do theming Ubuntu/GNOME.* github.com/ubuntu/yaru.dart
- **Material Design 3** — m3.material.io.
- **Nygard, Michael (2011).** *Documenting Architecture Decisions.* ThoughtWorks.