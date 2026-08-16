# ADR-0001: Stack mobile para app de gestão de entregas last-mile

> Padrão baseado em Michael Nygard (2011).

## Status

`Aceito` (2026-06-10)

**Autor:** Equipe de Arquitetura Mobile · LogiTrack Entregas S.A.  
**Stakeholders consultados:** Head de Engenharia Mobile, Diretor de Operações, CISO

---

## Contexto

- **Produto:** app para motoristas de última milha — roteirização, prova de entrega fotográfica e rastreio de frota em tempo real
- **Escala:** 50.000 motoristas ativos; meta 120.000 em 18 meses
- **Distribuição:** 88% Android (dispositivos entry-level R$400–800), 12% iOS (supervisores e parceiros enterprise)
- **Time atual:** 15 engenheiros — 8 mobile (6 Flutter/Dart, 2 React Native/TS), 7 backend Go
- **Restrições críticas:**
  - 40% das entregas ocorrem em zonas com cobertura 2G ou sem sinal → **offline-first é bloqueante**
  - Background location ativo 8–12h/dia (rastreio contínuo da frota durante a jornada)
  - LGPD: dados de geolocalização dos motoristas são dados pessoais sensíveis → anonimização e política de retenção obrigatórias
  - Bateria: dispositivos entry-level degradam rapidamente com GPS contínuo — eficiência é requisito operacional
- **Janela:** MVP em 6 meses (contrato com varejista âncora com multa por atraso)

---

## Decisão

Adotar **Flutter (Dart)** como stack mobile principal, utilizando **Drift** (SQLite) para persistência offline com sincronização delta e o plugin `flutter_background_geolocation` (Transistor Software) para rastreio contínuo de baixo consumo.

---

## Alternativas consideradas

### Critérios e pesos

| Critério | Peso | Justificativa |
|----------|------|---------------|
| Offline-first e sincronização delta | 25% | 40% das entregas sem cobertura — falha aqui é bloqueante de negócio |
| Background location + eficiência de bateria | 25% | GPS 8–12h/dia; bateria curta = motorista parado = SLA perdido |
| Desempenho em dispositivos Android entry-level | 20% | 88% da frota usa Android ≤ R$800 — janks em listas longas = UX crítica |
| Integração com câmera, sensores e periféricos | 15% | Foto de comprovante, leitura de código de barras (ML Kit), NFC |
| Time-to-market + talent disponível | 15% | Deadline de 6 meses; 6 dos 8 mobile devs são Flutter |

### Matriz comparativa (notas 0–10)

| Alternativa | Offline (25%) | BG Loc/Bat. (25%) | Entry-level (20%) | Sensores (15%) | TTM/Talent (15%) | **Score** |
|-------------|:---:|:---:|:---:|:---:|:---:|:---:|
| Nativo puro (Kotlin + Swift) | 9 | 10 | 10 | 10 | 3 | **8.70** |
| React Native | 7 | 6 | 6 | 7 | 8 | **6.70** |
| **Flutter** | **9** | **9** | **9** | **9** | **9** | **9.00** |
| Kotlin Multiplatform (KMP) | 8 | 9 | 9 | 8 | 4 | **7.85** |
| PWA (Progressive Web App) | 5 | 3 | 5 | 5 | 8 | **4.95** |

> **Cálculo:** `score = Σ(nota_i × peso_i)` — ex. Flutter: (9×0,25)+(9×0,25)+(9×0,20)+(9×0,15)+(9×0,15) = **9,00**

Flutter lidera ao equilibrar performance próxima ao nativo — graças ao motor Impeller sem ponte JS — com um único codebase para iOS/Android e total aproveitamento do time atual. O nativo puro pontua mais alto em performance isolada (10 em três critérios), mas perde decisivamente em TTM (score 3): dois codebases exigiriam recontratação de especialistas iOS, inviável no prazo. KMP é promissor mas imaturo para UI compartilhada nesse horizonte. PWA falha estruturalmente em background location — APIs Web `getCurrentPosition` em background são bloqueadas por iOS/Android por política de privacidade.

---

## Consequências

**Positivas:**
- Codebase único cobre 100% dos dispositivos iOS e Android — ~70% do código compartilhado (UI + lógica de negócio em Dart)
- Motor Impeller (padrão no Flutter 3.10+) renderiza 60fps consistentes em dispositivos Snapdragon 450, sem o overhead da bridge JS presente no React Native
- Drift + isolates nativos do Dart permitem sincronização delta em background sem bloquear a UI — essencial para o offline-first
- Plugin `flutter_background_geolocation` (Transistor) implementa estratégias adaptativas de distância/tempo, reduzindo consumo de bateria GPS em ~40% vs. polling contínuo
- Time produtivo desde o dia 1 — 6 dos 8 devs mobile já trabalham com Flutter/Dart

**Negativas:**
- Ecossistema de plugins Flutter é menor que o do React Native; alguns periféricos (impressoras portáteis Bluetooth, maquininhas de pagamento) podem exigir platform channels customizados
- `flutter_background_geolocation` é licença comercial (~US$399/app) — custo recorrente não mapeado no orçamento inicial
- Dart tem pool de talentos menor que Kotlin/Swift no mercado brasileiro — contratações futuras serão mais seletivas
- Compilação AOT do Flutter gera binários maiores (~15–20 MB a mais que RN equivalente) — impacto na distribuição OTA em conexões lentas

**Mitigações:**
- Mapear periféricos especiais no sprint 0; desenvolver platform channels antes do feature freeze
- Incluir licença Transistor no orçamento de infra (< 0,1% do custo operacional anual projetado)
- Programa de capacitação interna Dart para 2 RN devs nos primeiros 2 meses + contratação de 1 sênior Flutter
- Utilizar `deferred components` (Flutter split APK) para reduzir tamanho do download inicial

---

## Referências

1. **Nygard, M.** (2011). *Documenting Architecture Decisions*. Cognitect Blog. https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
2. **Charland, A.; Leroux, B.** (2011). *Mobile Application Development: Web vs. Native*. Communications of the ACM, 54(5), pp. 49–53. DOI:10.1145/1941487.1941504 *(peer-reviewed)*
3. **Joorabchi, M. E.; Mesbah, A.; Kruchten, P.** (2013). *Real Challenges in Mobile App Development*. Proceedings of ACM/IEEE ESEM 2013. DOI:10.1109/ESEM.2013.9 *(peer-reviewed)*
4. **Flutter Team — Google** (2024). *Background processes and isolates*. Flutter Official Documentation. https://docs.flutter.dev/perf/isolates
5. **Brasil** (2018). *Lei Geral de Proteção de Dados Pessoais — Lei n.º 13.709/2018 (LGPD)*. Diário Oficial da União. https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm

---

## Histórico

| Data | Autor | Mudança |
|------|-------|---------|
| 2026-06-10 | Equipe Mobile | Versão inicial — decisão aceita |
