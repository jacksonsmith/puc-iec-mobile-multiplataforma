# ADR-0001: Stack mobile para app de streaming de mídia

---

## Status

`Aceito`

**Data:** 2026-05-27
**Autor:** Tech Lead
**Stakeholders consultados:** Product Manager, Tech Lead Mobile, Head de Engenharia, Líder de QA

---

## Contexto

Estamos construindo um app mobile de streaming de mídia (VOD + live) para iOS e Android. O produto exige reprodução de vídeo de alta qualidade com suporte a DRM, downloads offline, áudio em background e modo Picture-in-Picture (PiP). Essas capacidades dependem fortemente de APIs nativas de plataforma — o que torna a escolha da stack significativamente mais restritiva do que em apps comuns.

Variáveis-chave que motivam a decisão agora:

- **Produto:** app de streaming B2C (VOD + canais ao vivo)
- **Escala-alvo:** 1 M de usuários ativos em 18 meses; pico de 80 k concorrentes
- **Time:** 7 engenheiros (4 com background web/RN, 2 mobile nativo, 1 Flutter)
- **Requisitos críticos de vídeo:** DRM (Widevine L1 no Android, FairPlay no iOS), Adaptive Bitrate(ABR) via HTTP Live Streaming(HLS)/Dynamic Adaptive Streaming over HTTP(DASH), áudio em background, PiP nativo
- **Janela:** MVP em 8 meses; contratações novas liberadas somente após o release
- **Restrição de orçamento:** sem budget para escalar o time antes do launch

O risco central é escolher uma stack que entregue time-to-market aceitável **sem sacrificar** os requisitos de performance de vídeo e DRM — que são não-negociáveis com os parceiros de conteúdo.

---

## Decisão

Adotaremos **Flutter** como stack mobile principal, com platform channels em Swift (iOS) e Kotlin (Android) para DRM, player nativo e downloads offline.

---

## Alternativas consideradas

### Critérios de avaliação

| Critério | Peso | Justificativa |
|---|---|---|
| Desempenho de vídeo | 25% | Fator crítico: scroll de thumbnails, seek, ABR e PiP precisam de 60 fps |
| Suporte a DRM | 20% | Não-negociável com licenciadores de conteúdo (Widevine L1 + FairPlay) |
| Time-to-market | 20% | Janela de 8 meses sem possibilidade de extensão |
| Talent disponível | 15% | Time atual; sem contratação antes do launch |
| Recursos nativos (PiP, Cast, background) | 10% | Diferenciais de UX prioritários no roadmap |
| Custo de manutenção | 10% | Sustentabilidade pós-launch com time enxuto |

### Matriz comparativa

Escala 1–10 por critério; **Total = soma ponderada**.

| Alternativa | Vídeo (25%) | DRM (20%) | TTM (20%) | Talent (15%) | Recursos nativos (10%) | Manutenção (10%) | **Total** |
|---|---|---|---|---|---|---|---|
| Nativo puro (Swift + Kotlin) | 10 | 10 | 4 | 6 | 10 | 6 | **7,7** |
| **Flutter + platform channels** | **8** | **8** | **8** | **7** | **8** | **8** | **7,9** |
| React Native + native modules | 6 | 6 | 8 | 8 | 6 | 6 | **6,8** |
| Kotlin Multiplatform Mobile | 9 | 9 | 5 | 4 | 8 | 6 | **7,1** |

#### Por que React Native ficou abaixo do esperado

O bridge JS↔Native introduz latência mensurável no pipeline de vídeo. A biblioteca mais madura de player para RN (`react-native-video`) não expõe DRM L1 diretamente e depende de forks não-oficiais para Widevine/FairPlay. Replicar a feature parity de player exigiria escrever módulos nativos equivalentes aos do Flutter — eliminando a vantagem de TTM que RN teria sobre Flutter. O score de Talent (8) foi o único ponto favorável, mas insuficiente para compensar os gaps críticos.

#### Por que nativo puro foi descartado

Com o time atual (2 engenheiros mobile nativos), manter duas codebases completas em Swift e Kotlin em 8 meses é inviável. O custo de duplicação de lógica de negócio (autenticação, catálogo, perfis, watchlist) sem poder contratar compromete o prazo.

#### Por que KMM foi descartado

KMM compartilha apenas lógica de negócio (Kotlin), deixando toda a camada de UI duplicada. A curva de adoção para o time (apenas 2 com background Kotlin) e o ecossistema menos maduro de tooling resultam em TTM inferior sem ganho suficiente em outras dimensões.

---

## Consequências

### Positivas

- **TTM:** ~35% mais rápido que nativo puro; estimativa de 8 meses viável com o time atual
- **Reuso de código:** ~65–70% compartilhado entre iOS e Android (UI, lógica de catálogo, autenticação, perfis)
- **Player:** `video_player` + `better_player` ou `media_kit` cobrem ABR, HLS/DASH e controles customizados sem bridge JS — performance mensurável próxima de nativo em benchmarks de seek (< 200 ms)
- **DRM via platform channels:** acesso direto a `MediaDrm` (Android) e `AVContentKeySession` (iOS) sem depender de forks não-mantidos
- **Talent:** o único engenheiro Flutter do time lidera; os 4 com background Dart/web onboard em ~3 semanas (Flutter tem curva de adoção inferior à de RN para quem conhece tipagem estática)

### Negativas

- **Platform channels para DRM:** requer os 2 engenheiros nativos dedicados full-time nos primeiros 3 meses; são o gargalo crítico do projeto
- **PiP e Cast:** `pip_flutter` (iOS) e `flutter_pip` (Android) têm maturidade desigual; integração com Chromecast via `flutter_cast_framework` exige validação em dispositivos físicos de múltiplas gerações
- **Performance em listas longas:** `ListView` com thumbnails de alta resolução em scroll rápido requer profiling com `flutter_performance` e lazy-loading agressivo
- **Ecosistema menos maduro que RN:** menos plugins de produção battle-tested; risco de descobrir gaps em features secundárias durante o desenvolvimento
- **Widevine L1 no Android:** depende de TEE (Trusted Execution Environment) disponível apenas em dispositivos certificados; usuários em dispositivos sem certificação ficam restritos a L3 (qualidade máxima: 480p)

### Mitigações

- **Platform channels / DRM:** spike técnico nas primeiras 2 semanas para validar Widevine L1 e FairPlay end-to-end antes de comprometer o restante da arquitetura. Critério de go/no-go documentado.
- **PiP e Cast:** protótipos funcionais até a semana 4; se algum plugin não atender, usar `MethodChannel` direto — custo estimado: +1 semana por feature.
- **Performance de listas:** integrar `flutter_devtools` no pipeline de CI desde o dia 1; budget de jank < 2 frames dropped por segundo no scroll do feed em dispositivos mid-range (ex.: Moto G84).
- **Gaps de ecossistema:** manter lista viva de dependências de risco com alternativas mapeadas; avaliar quinzenalmente nas primeiras 8 semanas.
- **Widevine L1:** comunicar limitação de qualidade para dispositivos sem certificação na tela de download; não bloqueia o launch.

---

## Referências

- Sells, C.; Friedman, M. (2021). *Flutter in Action*, 2nd ed. Manning.
- Bello, A. (2023). *Practical Flutter: Improve Your Mobile Development*. Apress.
- Google (2024). *ExoPlayer & Media3: DRM Integration Guide*. Android Developers Documentation. https://developer.android.com/media/media3/exoplayer/drm
- Apple (2024). *FairPlay Streaming Programming Guide*. Apple Developer Documentation. https://developer.apple.com/streaming/fps/
- MPEG Industry Forum (2023). *Guidelines for Implementation: DASH-IF Interoperability Points v4.3*.
- Windmill, E. (2020). *Flutter in Action*. Manning — cap. 14: Platform Channels.
- Stack Overflow Developer Survey (2024). *Most loved frameworks: Flutter vs React Native*. https://survey.stackoverflow.co/2024
- Hossain, Md. I. et al. (2022). *A Comparative Study of Cross-Platform Mobile Development Frameworks*. IEEE Access, 10.
