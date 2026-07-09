# ADR-0001: Stack mobile para plataforma de telemedicina B2C/B2B2C

## Status

`Aceito` (2026-05-26)

**Autor:** Igor  
**Stakeholders consultados:** Produto, Engenharia Mobile, Segurança da Informação, Operações Clínicas

## Contexto

- **Produto:** aplicativo de telemedicina com triagem, consulta por videochamada, prescrição digital, envio de exames e carteira de documentos clínicos.
- **Escala alvo:** 1M usuários cadastrados, 120k MAU e picos de 3k consultas simultâneas em campanhas corporativas.
- **Time atual:** 7 engenheiros, sendo 4 com React/TypeScript, 1 Android Kotlin, 1 iOS Swift e 1 backend.
- **Compliance:** LGPD, dados sensíveis de saúde, consentimento auditável, criptografia em trânsito, armazenamento local mínimo e segregação de logs sem dados clínicos.
- **Restrições de produto:** primeiro release em 6 meses, atendimento em iOS/Android, videochamada com SDK nativo/WebRTC, push de lembretes, upload offline temporário de exames e acessibilidade.
- **Força arquitetural dominante:** maximizar entrega multiplataforma sem perder acesso nativo para câmera, push, biometria, storage seguro e telemetria de qualidade da chamada.

## Decisão

Adotaremos **React Native com TypeScript** como stack mobile principal, usando **módulos nativos Kotlin/Swift** apenas para videochamada/WebRTC, storage seguro, biometria e integrações de plataforma.

## Alternativas consideradas

### Critérios de avaliação e pesos

| Critério | Peso | Justificativa |
|---|---:|---|
| Time-to-market | 25% | Release em 6 meses e time pequeno favorecem alto reuso entre iOS/Android. |
| Segurança e compliance | 25% | LGPD e dados de saúde exigem controle de storage, logs, autenticação e auditoria. |
| Acesso nativo e mídia | 20% | Videochamada, câmera, push, biometria e notificações são caminhos críticos. |
| Talent disponível | 15% | Time tem maioria React/TypeScript e pouca capacidade para duas bases nativas completas. |
| Manutenção evolutiva | 10% | Produto terá releases frequentes e mudanças regulatórias/operacionais. |
| Experiência offline/baixa conectividade | 5% | Uploads e triagens devem tolerar instabilidade, mas consulta ao vivo segue online. |

### Matriz comparativa (nota 0-10)

| Alternativa | TTM | Seg./LGPD | Nativo/mídia | Talent | Manut. | Offline | Score |
|---|---:|---:|---:|---:|---:|---:|---:|
| Nativo puro (Kotlin + Swift) | 4 | 10 | 10 | 5 | 5 | 8 | 7.05 |
| **React Native + módulos nativos** | **9** | **8** | **8** | **9** | **8** | **7** | **8.35** |
| Flutter | 7 | 8 | 8 | 5 | 7 | 7 | 7.20 |
| Kotlin Multiplatform | 6 | 8 | 8 | 4 | 6 | 7 | 6.55 |
| PWA | 9 | 5 | 4 | 9 | 8 | 8 | 6.75 |

**Cálculo:** `score = soma(nota x peso)`. React Native vence porque equilibra prazo, reuso e aderência ao time, mantendo escape nativo para os pontos sensíveis. Nativo puro teria menor risco técnico em mídia e segurança, mas o custo de duas bases reduz a chance de cumprir o release de 6 meses.

## Consequências

**Positivas:**
- Uma base TypeScript cobre fluxos de triagem, agenda, perfil, documentos, pagamentos e estado de consulta.
- Componentes nativos ficam isolados em fronteiras auditáveis para WebRTC, biometria e storage seguro.
- Time atual consegue entregar valor desde o primeiro sprint, com suporte pontual dos especialistas Kotlin/Swift.
- React Native preserva distribuição via app stores e acesso a recursos de plataforma que uma PWA teria dificuldade de garantir.

**Negativas:**
- Módulos nativos viram pontos críticos de manutenção e exigem revisão em upgrades de iOS, Android e React Native.
- SDKs de videochamada podem expor diferenças entre plataformas que não aparecem na camada JavaScript.
- Dependências de terceiros em saúde precisam triagem de privacidade, licenças e postura de segurança.
- Performance e consumo de bateria em consulta ao vivo exigem profiling contínuo em aparelhos medianos.

**Mitigações:**
- Definir contrato estável para módulos nativos e testes de integração para câmera, microfone, push e storage seguro.
- Fazer security review antes do beta e auditoria trimestral de dependências com Renovate e revisão manual das libs críticas.
- Registrar budgets: abertura do app abaixo de 2,5s em aparelho intermediário, chamada com queda controlada de qualidade e sem PII em logs.
- Planejar janela semestral de upgrade React Native e testes de regressão em iOS/Android antes de releases regulatórios.

## Referências

1. NYGARD, M. (2011). *Documenting Architecture Decisions*. Cognitect Blog. Acesso em: 26 maio 2026.
2. CHARLAND, A.; LEROUX, B. (2011). *Mobile Application Development: Web vs. Native*. Communications of the ACM, 54(5), p. 49-53. DOI: 10.1145/1941487.1941504.
3. EISENMAN, B. (2018). *Learning React Native*, 2nd ed. O'Reilly Media. ISBN 978-1491989142.
4. REACT NATIVE. (2026). *Core Components and Native Components*. Documentacao oficial. Acesso em: 26 maio 2026.
5. PEAL, G. (2018). *Sunsetting React Native*. Airbnb Engineering. Acesso em: 26 maio 2026.

## Histórico

| Data | Autor | Mudança |
|---|---|---|
| 2026-05-26 | Igor | Versão inicial da decisão. |
