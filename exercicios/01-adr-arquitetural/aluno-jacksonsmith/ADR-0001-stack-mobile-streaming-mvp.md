# ADR-0001: Stack mobile para MVP de streaming de podcast educacional

## Status

`Aceito` (2026-05-20)

**Autor:** Jackson Smith (aluno teste)
**Stakeholders consultados:** PM, Tech Lead

## Contexto

- **Produto:** app mobile MVP de streaming de podcasts educacionais (alunos pós-graduação)
- **Escala alvo:** 5k usuários em 6 meses, 50k em 18 meses
- **Distribuição esperada:** 65% Android / 35% iOS (público brasileiro)
- **Time:** 3 engenheiros (2 fullstack web/TS, 1 mobile RN júnior)
- **Restrições:**
  - Janela MVP: 12 semanas
  - Sem orçamento pra contratar mais engs nos próximos 6 meses
  - Áudio precisa rodar em background + lock screen (controles iOS/Android)
  - Não precisa offline-first complexo na v1
- **Compliance:** LGPD básico, sem dados sensíveis financeiros

## Decisão

Adotar **React Native com Expo (managed workflow)** como stack única, usando `expo-av` ou `react-native-track-player` pra áudio. Sem módulos nativos custom na v1.

## Alternativas consideradas

### Critérios e pesos

| Critério | Peso | Justificativa |
|----------|------|---------------|
| Time-to-market | 30% | MVP de 12 semanas é hard deadline |
| Talent disponível | 25% | Time pequeno, 2 vêm de TS web |
| Performance áudio | 15% | Lock screen + background = essencial |
| Manutenção | 15% | Time não escala — quanto menos código melhor |
| Custo build/deploy | 10% | Bootstrap, orçamento limitado |
| Maturidade | 5% | MVP, podemos aceitar libs novas |

### Matriz comparativa (nota 0–10)

| Alternativa | TTM | Talent | Áudio | Manut. | Custo | Maturidade | Score |
|-------------|-----|--------|-------|--------|-------|------------|-------|
| Nativo puro (Kotlin + Swift) | 3 | 4 | 10 | 4 | 5 | 10 | 4.85 |
| **React Native (Expo managed)** | **9** | **9** | **8** | **8** | **9** | **9** | **8.65** |
| Flutter | 7 | 4 | 9 | 7 | 7 | 8 | 6.65 |
| Kotlin Multiplatform | 5 | 3 | 8 | 6 | 6 | 7 | 5.20 |
| PWA + Capacitor wrapper | 9 | 8 | 5 | 7 | 9 | 7 | 7.65 |

**Cálculo:** soma ponderada com pesos normalizados em 100%. RN Expo vence com folga pelo combo TTM + talent + manutenção.

## Consequências

**Positivas:**
- MVP no ar em 12 semanas é factível com esse time
- 2 devs web/TS produtivos no app desde semana 1
- Expo gerencia build iOS sem precisar de Mac dedicado (EAS Build)
- `expo-av` ou `track-player` cobrem requisitos de áudio v1

**Negativas:**
- Se precisar de módulo nativo custom (ex: DRM específico), Expo managed limita — vai precisar virar bare workflow ou config plugin
- Performance de áudio em background em Android tem casos de borda (Doze mode, fabricantes asiáticos)
- Dependência forte do ecossistema Expo (preço EAS sobe se virar produto pago)

**Mitigações:**
- Plano de migração documentado: managed → bare workflow se v2 exigir nativo
- Testes manuais em devices Xiaomi/Samsung (asiáticos + Doze mode) antes do GA
- Monitorar pricing Expo EAS e custo de migração pra build próprio

## Referências

1. **Nygard, M.** (2011) *Documenting Architecture Decisions*. https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
2. **Charland, A.; Leroux, B.** (2011) *Mobile Application Development: Web vs. Native*. Communications of the ACM, 54(5).
3. **Eisenman, B.** (2018) *Learning React Native* (O'Reilly, 2ed) — cap. 1 e 2.
4. **Expo Documentation** (2025) *Set up your environment* + *expo-av audio*. https://docs.expo.dev/
5. **Android Developers** (2024) *Background work on Android: Doze and App Standby*.
