# ADR-0001: Stack mobile para app de ordens de serviço em campo

> Decisão arquitetural para app mobile B2B de técnicos de manutenção. Formato baseado em Nygard (2011).

## Status

`Proposto` (2026-06-03)

**Autor:** Giovane Carvalho Reis  
**Stakeholders consultados:** Tech Lead, PO de operações, 2 devs do squad

## Contexto

Empresa de manutenção industrial (~800 técnicos em campo) precisa substituir planilha + WhatsApp por **app mobile** Android e iOS.

- **Usuários:** ~800 técnicos, crescendo pra 1.200 em 12 meses
- **Distribuição:** ~65% Android / 35% iOS (celular corporativo misto)
- **Time atual:** 6 engenheiros web/full-stack; **ninguém com experiência sólida em mobile nativo ou cross-platform**
- **Uso real:** técnico abre OS, tira foto, assina na tela, salva localmente e envia quando volta o sinal — **offline-first é obrigatório**
- **Prazo:** MVP em 10 meses (contrato com cliente âncora)
- **Orçamento:** difícil contratar 2 mobile sênior agora; dá pra alocar 1 dev RN part-time nos primeiros 3 meses

Resumindo: precisamos lançar Android e iOS com time pequeno, sem montar dois squads nativos separados.

## Decisão

Adotar **React Native (Expo bare workflow)** com **TypeScript**, usando libs maduras pra offline (ex.: SQLite/WatermelonDB) e módulos nativos só onde fizer falta (câmera, assinatura).

## Alternativas consideradas

### Critérios e pesos

| Critério | Peso | Por quê pesa assim |
|----------|------|--------------------|
| Time-to-market | 25% | 10 meses com contrato amarrado — não dá pra errar no prazo |
| Curva pro time atual | 20% | Time não domina mobile; precisa de stack com material e mercado |
| Offline-first | 20% | Técnico passa horas sem sinal em galpão ou estrada |
| Manutenção iOS + Android | 15% | Um codebase ajuda muito time pequeno |
| Maturidade do ecossistema | 10% | Precisa de lib estável, não experimento |
| Integração com device | 10% | Câmera, armazenamento local, assinatura na tela |

### Matriz (nota 0–10)

| Alternativa | TTM | Curva | Offline | Manut. | Maturidade | Device | **Score** |
|-------------|-----|-------|---------|--------|------------|--------|-----------|
| Nativo (Kotlin + Swift) | 4 | 5 | 9 | 5 | 10 | 10 | **6,55** |
| **React Native + Expo** | **9** | **6** | **7** | **8** | **9** | **8** | **7,75** |
| Flutter | 7 | 4 | 8 | 7 | 8 | 8 | **6,80** |
| KMP + Compose Multiplatform | 6 | 7 | 8 | 7 | 6 | 8 | **6,95** |
| PWA + wrapper | 9 | 7 | 4 | 8 | 7 | 5 | **6,85** |

**Cálculo:** `score = Σ(nota × peso)`. RN vence por TTM + ecossistema maduro + um codebase pros dois SOs. Nativo pontua bem em offline e device, mas TTM baixo inviabiliza o prazo. Flutter e PWA ficaram atrás: curva de Dart e offline fraco no PWA.

## Consequências

**Positivas:**
- Um codebase TypeScript roda Android e iOS — time pequeno agradece
- Expo acelera setup, build e OTA de correções urgentes
- Ecossistema grande: offline, câmera, formulários — tem lib e tutorial pra quase tudo
- TypeScript traz tipagem estática — reduz bugs conforme o app cresce
- Contratar dev RN part-time é mais fácil que achar KMP ou Flutter sênior

**Negativas:**
- React Native + React exige curva de front — o time vai precisar de capacitação
- Offline robusto exige escolher stack certo (SQLite, fila local) — não vem de graça
- Performance de listas grandes e bridge nativa podem virar dor de cabeça depois
- Upgrades de RN/Expo quebram build de vez em quando — precisa planejar
- Sensação “100% nativa” pode ficar abaixo do app Kotlin/Swift puro

**Mitigações:**
- 1 dev RN sênior part-time nos 3 primeiros meses (telas + pipeline + offline)
- Travar versão LTS do Expo/RN no MVP; upgrade major vira sprint dedicada
- Prototipar fluxo offline (criar OS sem rede → enviar depois) antes de polir UI
- Capacitação interna em TypeScript + React Native (~40h) pro time
- Módulos nativos pontuais pra câmera e assinatura se a lib JS não atender

## Referências

1. **Nygard, M.** (2011) *Documenting Architecture Decisions*. https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
2. **Charland, A.; Leroux, B.** (2011) *Mobile Application Development: Web vs. Native*. Communications of the ACM, 54(5), pp. 49–53. DOI:10.1145/1941487.1941504
3. **Joorabchi, M. E.; Mesbah, A.; Kruchten, P.** (2013) *Real Challenges in Mobile App Development*. Proc. ESEM, pp. 15–24. DOI:10.1109/ESEM.2013.11
4. **Eisenman, B.** (2018) *Learning React Native* (O'Reilly, 2ª ed.) — caps. 1, 2 e 9.
5. **Meta** (2024) *React Native Documentation*. https://reactnative.dev/docs/environment-setup
