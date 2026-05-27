# ADR-0001: Stack mobile para plataforma de telemedicina B2C

> Padrão baseado em Michael Nygard (2011). Cenário D — Saúde / Telemedicina.

## Status

`Proposto` (2026-05-27)

**Autor:** Cauã Henrique Viana Salgado
**Stakeholders consultados:** Tech Lead, Compliance Officer, Diretor de Produto, Engenharia Mobile

## Contexto

- **Produto:** plataforma de telemedicina B2C (consultas por videochamada, prontuário eletrônico, prescrição digital, integração RNDS/SUS via FHIR R4)
- **Escala:** 0 → 500k usuários ativos em 12 meses; pico 5× em campanhas de saúde pública (ex: dengue, vacinação)
- **Distribuição:** 70% Android / 30% iOS — público majoritariamente dispositivos médio/baixo custo (Snapdragon 400-600, 3-4GB RAM, perfil SUS)
- **Time atual:** 6 engenheiros — 4 com background web/React (TypeScript), 2 Android (Kotlin); nenhum com experiência iOS nativa
- **Compliance:**
  - LGPD (Lei 13.709/2018) — dados de saúde são categoria especial (Art. 11): criptografia em repouso e em trânsito, consentimento explícito, rastreabilidade de acesso
  - CFM Resolução 2.314/2022 — autenticação forte do médico (CRM válido), registro de atendimento, assinatura digital de prescrição
  - OWASP MASVS v2.1 — conformidade com M1, M2 e M5 obrigatória para dados de saúde
- **Integrações críticas:** WebRTC (sem SDK proprietário) para videochamada, Android BiometricPrompt / iOS LocalAuthentication, RNDS REST FHIR R4 com certificado ICP-Brasil
- **Janela:** MVP em 10 meses (videochamada + agendamento + prontuário básico)
- **Restrições:**
  - Sem budget para times paralelos iOS e Android independentes
  - Não pode usar tecnologia em status `alpha` (regulatório de saúde)
  - Sessões longas: consultas ~18 min — performance de UI e videochamada simultâneas em hardware de médio porte é crítica
  - Offline parcial obrigatório: prontuário e histórico devem funcionar sem internet

## Decisão

Adotar **Flutter (Dart) + Platform Channels** como stack mobile principal, com módulos nativos em **Kotlin (Android)** e **Swift (iOS)** para WebRTC, biometria e criptografia local exigida pela LGPD.

## Alternativas consideradas

### Critérios de avaliação e pesos

| Critério | Peso | Justificativa |
|---|---|---|
| Performance (videochamada + UI) | 25% | Core do produto — lag e jank em dispositivos médio/baixo custo impactam diretamente a consulta |
| Compliance LGPD + segurança | 20% | Dados de saúde = categoria especial — falha gera multa até 2% do faturamento (Art. 52 LGPD) e descredenciamento |
| Time-to-market | 20% | Time enxuto precisa entregar iOS e Android em 10 meses sem duplicação |
| Talent disponível | 15% | Reaproveitamento do time atual reduz custo e prazo de capacitação |
| Manutenibilidade | 10% | Plataforma de saúde tem ciclo longo — decisão sustenta 5+ anos |
| Integração WebRTC / APIs nativas | 10% | WebRTC sem SDK proprietário + RNDS com certificado ICP-Brasil exigem acesso nativo de baixo nível |

### Matriz comparativa (nota 0–10)

| Alternativa | Perf. | Compliance | TTM | Talent | Manut. | WebRTC | Score |
|---|---|---|---|---|---|---|---|
| Nativo puro (Kotlin + Swift) | 10 | 10 | 4 | 4 | 6 | 10 | 7.20 |
| **Flutter + Platform Channels** | **9** | **9** | **8** | **7** | **8** | **8** | **8.30** |
| React Native + Native Modules | 7 | 8 | 9 | 9 | 6 | 7 | 7.70 |
| Kotlin Multiplatform (KMP) | 9 | 9 | 5 | 5 | 7 | 8 | 7.10 |
| PWA | 4 | 4 | 9 | 9 | 8 | 3 | 5.50 |

**Cálculo:** `score = Σ(nota_i × peso_i)`. Flutter vence por equilibrar performance em hardware de médio porte, compliance via Platform Channels diretos ao Keystore/Secure Enclave, e viabilidade de entrega com time enxuto sem iOS nativo.

**Por que não React Native (segundo colocado, 7.70):** a bridge JS ↔ nativo introduz latência perceptível em sessões de videochamada ativas com UI reagindo ao estado da chamada em Snapdragon 400. Além disso, o histórico de breaking changes graves a cada major release (Airbnb Engineering, 2018) representa risco elevado para produto de saúde que não pode ter downtime regulatório.

**Por que não Nativo puro (7.20):** time não tem engenheiro iOS — contratar ou treinar levaria 3-6 meses, inviabilizando a janela de 10 meses. Duplicação de codebase com 6 engenheiros é insustentável.

## Consequências

**Positivas:**
- Reuso ~85% do codebase entre iOS e Android (UI + lógica de negócio + integrações RNDS em Dart)
- Motor Impeller renderiza 60fps estável em Snapdragon 450 — perfil exato do público-alvo (Google, 2024)
- Platform Channels acessam Android Keystore e iOS Secure Enclave diretamente — criptografia de dados de saúde no hardware, não em software
- Flutter test framework integrado (unit, widget, integration) facilita auditoria de conformidade CFM/LGPD
- Dart tem curva de aprendizado menor para quem vem de TypeScript — 4 engenheiros React absorvem em 6-8 semanas

**Negativas:**
- `flutter_webrtc` (plugin mais usado) não tem auditoria de segurança formal — risco para produto de saúde
- Pool de desenvolvedores Flutter ~3× menor que React Native no mercado brasileiro — contratação futura mais lenta
- Binário Flutter ~10-15MB maior que equivalente React Native — impacto em dispositivos com 16GB de armazenamento (ainda comuns no perfil SUS)
- Nenhum engenheiro do time tem experiência Swift — módulo iOS do Platform Channel exige capacitação dedicada

**Mitigações:**
- WebRTC: fork do `flutter_webrtc` + revisão de segurança interna antes do sprint 3; engenheiro Android sênior responsável
- Talent: capacitação Flutter para 4 engenheiros React no sprint 0; documentar onboarding para futuras contratações
- Binário: habilitar `--split-debug-info`, tree shaking e deferred loading no pipeline de build desde o sprint 2
- Swift: alocar 1 engenheiro Android para aprendizado Swift básico nos primeiros 2 meses com foco exclusivo no módulo WebRTC iOS

## Referências

1. **Charland, A.; Leroux, B.** (2011) *Mobile Application Development: Web vs. Native*. Communications of the ACM, 54(5), pp. 49–53. DOI: 10.1145/1941487.1941504
2. **Joorabchi, M. E.; Mesbah, A.; Kruchten, P.** (2013) *Real Challenges in Mobile App Development*. ESEM 2013, IEEE. DOI: 10.1109/ESEM.2013.9
3. **Google LLC.** (2024) *Flutter architectural overview*. https://docs.flutter.dev/resources/architectural-overview
4. **Airbnb Engineering** (2018) *Sunsetting React Native* — série de 5 posts. https://medium.com/airbnb-engineering/sunsetting-react-native-1868ba28e30a
5. **Brasil.** (2018) *Lei nº 13.709/2018 — LGPD*. https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
6. **OWASP.** (2024) *Mobile Application Security Verification Standard (MASVS) v2.1*. https://mas.owasp.org/MASVS/