# ADR-0001: Stack mobile para plataforma de telemedicina — Conexa Saúde

> Padrão baseado em Michael Nygard (2011). Cenário D — Saúde / Telemedicina.

## Status

`Proposto` (2026-05-27)

**Autor:** Cauã Henrique Viana Salgado
**Stakeholders consultados:** Tech Lead Mobile, Compliance Officer, Diretor de Produto, Engenharia de Plataforma

## Contexto

- **Produto:** Conexa Saúde — ecossistema digital de saúde líder na América Latina, com teleconsultas em mais de 30 especialidades médicas, prontuário eletrônico, prescrição digital e saúde mental (pós-fusão com Zenklub em 2023)
- **Escala:** 30 milhões de beneficiários cobertos, 1,5 milhão de pacientes ativos em 2024, 7,2 milhões de consultas/ano, pico de demanda em campanhas de saúde pública e surtos epidemiológicos (ex: dengue)
- **Distribuição:** majoritariamente B2B2C — 1.300+ empresas clientes (McDonald's, P&G, Petrobras, Volkswagen) e 192 operadoras de saúde (Bradesco, Amil, Unimeds); canal B2C em expansão via parceria com Vivo Ventures
- **Time:** squad mobile de ~8 engenheiros com background predominante em React/TypeScript (stack histórica da empresa); 2 engenheiros com experiência nativa Android
- **Compliance:**
  - LGPD (Lei 13.709/2018) — dados de saúde são categoria especial (Art. 11): criptografia em repouso e em trânsito, consentimento explícito, rastreabilidade de acesso obrigatória
  - CFM Resolução 2.314/2022 — regulamenta telemedicina: autenticação forte do médico (CRM válido), registro de atendimento, assinatura digital de prescrição
  - ANS — regulação de operadoras exige SLA de disponibilidade e auditabilidade de atendimentos
  - OWASP MASVS v2.1 — conformidade obrigatória com M1, M2 e M5 para dados sensíveis de saúde
- **Integrações críticas:** WebRTC para videochamada (core do produto), BiometricPrompt/LocalAuthentication para autenticação de médicos, APIs de operadoras (HL7/FHIR), dashboard de health analytics com dados de sinistralidade
- **Janela:** reescrita do app mobile em 12 meses para suportar crescimento pós-fusão Zenklub e expansão B2C
- **Restrições:**
  - Stack histórica React/TypeScript — time produtivo nessa base; reescrita completa em linguagem nova tem custo de retraining
  - Faturamento projetado R$ 300M+ em 2025 — downtime regulatório tem impacto financeiro direto
  - Consultas de saúde mental respondem por ~50% do volume — sessões longas (~45 min) exigem estabilidade de videochamada superior ao atendimento clínico geral
  - Público B2B2C: dispositivos corporativos (iOS gerenciado) + dispositivos pessoais de colaboradores (Android fragmentado)

## Decisão

Adotar **React Native (New Architecture — JSI/Fabric) + Native Modules** como stack mobile principal, com módulos nativos em Kotlin (Android) e Swift (iOS) para WebRTC, biometria e criptografia local exigida pela LGPD.

## Alternativas consideradas

### Critérios de avaliação e pesos

| Critério | Peso | Justificativa |
|---|---|---|
| Talent e reaproveitamento do time | 25% | Time de 8 engenheiros já domina React/TypeScript — retraining para Dart ou Kotlin/Swift consome 3-6 meses de produtividade numa janela de 12 meses |
| Compliance LGPD + segurança | 20% | Dados de saúde = categoria especial — falha gera multa até 2% faturamento (Art. 52 LGPD) + risco de descredenciamento por operadoras |
| Performance (videochamada + sessões longas) | 20% | Sessões de saúde mental de 45 min — estabilidade de WebRTC e UI responsiva são requisito, não diferencial |
| Time-to-market | 15% | Janela de 12 meses para suportar crescimento pós-fusão; atraso impacta SLA com 192 operadoras |
| Manutenibilidade | 10% | Plataforma com 30M beneficiários — decisão sustenta ciclo de 5+ anos |
| Maturidade do ecossistema | 10% | Integrações com SDKs de operadoras (HL7/FHIR) e saúde mental precisam de libs estáveis e mantidas |

### Matriz comparativa (nota 0–10)

| Alternativa | Talent | Compliance | Perf. | TTM | Manut. | Maturidade | Score |
|---|---|---|---|---|---|---|---|
| Nativo puro (Kotlin + Swift) | 4 | 10 | 10 | 3 | 6 | 10 | 6.55 |
| **React Native + Native Modules** | **10** | **8** | **8** | **9** | **7** | **9** | **8.65** |
| Flutter + Platform Channels | 5 | 8 | 9 | 6 | 8 | 8 | 7.10 |
| Kotlin Multiplatform (KMP) | 4 | 9 | 9 | 5 | 7 | 6 | 6.35 |
| PWA | 9 | 4 | 4 | 9 | 8 | 7 | 6.35 |

**Cálculo:** `score = Σ(nota_i × peso_i)`. React Native vence por reaproveitamento total do time existente (peso 25%) — fator decisivo numa janela de 12 meses com squad fixo — sem abrir mão de compliance via Native Modules isolados para crypto e biometria.

**Por que não Flutter (segundo colocado, 7.10):** apesar da performance superior do motor Impeller, o custo de retraining de 8 engenheiros React para Dart inviabiliza a janela de entrega. Flutter seria a escolha correta num greenfield com time novo, mas não na reescrita de uma plataforma com SLA ativo para 192 operadoras.

**Por que não Nativo puro (6.55):** time não tem cobertura iOS nativa — contratar ou treinar levaria 4-6 meses. Duplicação de codebase com squad de 8 engenheiros é insustentável para o ritmo de features exigido pelo crescimento pós-fusão.

## Consequências

**Positivas:**
- Time de 8 engenheiros React produtivo desde o sprint 1 — zero retraining para a camada principal do app
- Reuso ~75% do codebase entre iOS e Android (UI + lógica de negócio + integrações HL7/FHIR em TypeScript)
- New Architecture (JSI/Fabric) elimina bridge assíncrona — performance de UI comparável a Flutter em telas CRUD e formulários que compõem ~70% das telas da plataforma
- Native Modules isolados para WebRTC, BiometricPrompt e Keystore/Secure Enclave — compliance LGPD sem expor dados sensíveis na camada JS
- Ecossistema React Native maduro facilita integrações com SDKs de terceiros usados no setor de saúde (Firebase, Sentry, analytics de operadoras)

**Negativas:**
- WebRTC em sessões de 45 min (saúde mental) exige profiling contínuo — bridge JS ainda presente em libs de terceiros pode causar jank em dispositivos Android de médio porte
- Upgrades de React Native/Expo são pontos de risco — breaking changes a cada major release exigem janela de freeze de pelo menos 1 release/ano
- Native Modules para WebRTC e crypto exigem 2 engenheiros sêniores com experiência nativa dedicados nos primeiros 4 meses — lock-in de pessoas críticas
- Lib externa não mantida = débito técnico acumulado — gestão ativa de dependências é obrigatória em produto regulado

**Mitigações:**
- WebRTC: implementar `react-native-webrtc` com fork interno auditado; engenheiro Android sênior responsável pela camada nativa; monitorar estabilidade via Sentry Performance desde o sprint 1
- Upgrades RN: travar em versão LTS; planejar upgrade major como projeto dedicado a cada 12 meses fora da janela de SLA com operadoras
- Native Modules: plano de capacitação cruzada nos meses 5-8 — RN devs aprendem Kotlin/Swift básico para reduzir dependência de 2 pessoas
- Dependências: auditoria trimestral com Renovate + revisão manual de libs críticas de saúde e crypto

## Referências

1. **Charland, A.; Leroux, B.** (2011) *Mobile Application Development: Web vs. Native*. Communications of the ACM, 54(5), pp. 49–53. DOI: 10.1145/1941487.1941504
2. **Joorabchi, M. E.; Mesbah, A.; Kruchten, P.** (2013) *Real Challenges in Mobile App Development*. ESEM 2013, IEEE. DOI: 10.1109/ESEM.2013.9
3. **Airbnb Engineering** (2018) *Sunsetting React Native* — série de 5 posts. https://medium.com/airbnb-engineering/sunsetting-react-native-1868ba28e30a
4. **Meta Engineering** (2023) *React Native New Architecture*. https://reactnative.dev/docs/the-new-architecture/landing-page
5. **Brasil.** (2018) *Lei nº 13.709/2018 — LGPD*. https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
6. **OWASP.** (2024) *Mobile Application Security Verification Standard (MASVS) v2.1*. https://mas.owasp.org/MASVS/