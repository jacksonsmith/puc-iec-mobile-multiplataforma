# ADR-NNNN: [Título da Decisão]

> **Template ADR (Architecture Decision Record)** — baseado em Michael Nygard (2011) *Documenting Architecture Decisions*. Use como base para Atividade 1 da disciplina Arquitetura Mobile Multiplataforma e qualquer decisão arquitetural relevante em projetos finais.

---

## Status

`Proposto` | `Aceito` | `Substituído por ADR-NNNN` | `Depreciado`

**Data:** YYYY-MM-DD
**Autor:** Nome do(a) decisor(a)
**Stakeholders consultados:** Nome 1, Nome 2

## Contexto

> Descreva as **forças em jogo**: requisitos técnicos, restrições de negócio, talent disponível, prazo, regulação, sistemas legados.
> 
> Bom contexto explica **por que essa decisão precisa ser tomada agora** e **quais são as variáveis-chave**.

Exemplo:
- **Produto:** app de investimento retail B2C
- **Escala alvo:** 5M usuários ativos em 18 meses
- **Time:** 8 engenheiros (5 com background web/RN, 3 nativo Android)
- **Compliance:** BACEN exige biometria + SSL pinning + auditoria de transações
- **Janela:** primeiro release em 9 meses
- **Restrição:** orçamento pra contratar limitado nos próximos 6 meses

## Decisão

> **Uma frase clara** com a escolha feita.

Exemplo: Adotaremos React Native como stack mobile principal, com módulos nativos (Kotlin + Swift) para crypto e biometria.

## Alternativas consideradas

> Liste **mínimo 3 alternativas** com matriz quantitativa. Critérios e pesos justificados.

### Critérios de avaliação

| Critério | Peso |
|----------|------|
| Performance crítica | 20% |
| Time-to-market | 25% |
| Talent disponível | 20% |
| Manutenção dual | 15% |
| Compliance regulatório | 20% |

### Matriz comparativa

| Alternativa | Performance | Time-to-market | Talent | Manutenção | Compliance | Total |
|------------|------------|----------------|--------|-----------|-----------|-------|
| Nativo puro (Kotlin + Swift) | 10 | 5 | 7 | 6 | 9 | 7.4 |
| **React Native + native modules** | **8** | **9** | **9** | **7** | **8** | **8.2** |
| Flutter | 9 | 7 | 6 | 7 | 7 | 7.2 |
| Kotlin Multiplatform | 9 | 6 | 5 | 6 | 8 | 6.7 |
| PWA (descartado early) | 5 | 9 | 9 | 8 | 5 | 7.0 |

## Consequências

### Positivas

- **Time-to-market:** ~30% mais rápido que nativo puro
- **Reuso de código:** ~70% compartilhado entre iOS e Android
- **Talent:** time atual cobre 5 dos 8 engenheiros sem retreinar
- **Iteração:** hot reload acelera feedback de PMs/designers

### Negativas

- **Bridging:** crypto e biometria exigem 2 engenheiros sêniores native (custo)
- **Performance hot path:** scroll com many media items requer profiling contínuo
- **Atualização RN:** quebras de breaking change a cada 6-12 meses exigem manutenção
- **OWASP Mobile Top 10:** time precisa de capacitação específica (~40h)

### Mitigações

- **Bridging:** alocar 2 sêniores nativo nos primeiros 6 meses; treinar júniores depois.
- **Performance:** integrar Sentry Performance no dia 1; budget de 60fps no scroll de feed.
- **Atualização RN:** travar em LTS atual; planejar upgrade major a cada 12 meses como projeto dedicado.
- **OWASP:** treinamento pré-launch + auditoria externa antes do release.

## Referências

- Eisenman, B. (2018). *Learning React Native*, 2nd ed. O'Reilly.
- Newman, S. (2021). *Building Microservices*, 2nd ed. O'Reilly.
- Charland, A.; Leroux, B. (2011). *Mobile Application Development: Web vs. Native*. CACM, 54(5).
- Joorabchi, M. E.; Mesbah, A.; Kruchten, P. (2013). *Real Challenges in Mobile App Development*. ESEM.
- Airbnb Engineering (2018). *Sunsetting React Native* — série de 5 posts.
- OWASP Mobile Application Security Verification Standard (MASVS) v2.1.

## Histórico

| Data | Autor | Mudança |
|------|-------|---------|
| 2026-MM-DD | Nome | Versão inicial |

---

## Notas pra quem está usando este template

1. **Não pule alternativas analisadas.** Sem comparação, vira justificativa pós-facto.
2. **Quantifique sempre que possível.** "Performance ruim" não é argumento; "<2s cold start" é.
3. **Cite fontes.** Decisão sem referência é palpite.
4. **Documente trade-offs negativos.** ADRs honestos envelhecem melhor.
5. **Revise em 6-12 meses.** Contexto muda; ADRs também devem.
