# ADR-0001: Stack mobile para app de investimento retail B2C

> **Exemplo de entrega.** Não copie — adapte pro seu cenário. Padrão baseado em Michael Nygard (2011).

## Status

`Aceito` (2026-04-15)

**Autor:** Equipe Mobile · Banco Fictício S.A.
**Stakeholders consultados:** Head de Engenharia, Compliance Officer, Diretor de Produto

## Contexto

- **Produto:** app de investimento retail B2C (renda fixa, fundos, ações)
- **Escala:** 2M usuários hoje, alvo 5M em 18 meses
- **Distribuição:** 58% iOS / 42% Android (base de clientes alta renda)
- **Time atual:** 12 engenheiros — 5 RN (TS), 4 nativos (3 Android Kotlin + 1 iOS Swift), 3 backend
- **Compliance:** BACEN exige biometria + SSL pinning + audit log + segregação de ambientes
- **Janela:** primeiro release em 9 meses (regulatório + go-to-market casado)
- **Restrições:**
  - Orçamento de contratação reduzido nos próximos 6 meses
  - Não pode usar tecnologia em beta (regulatório)
  - 70% das features são CRUD + listas + formulários (não exigem 60fps)
  - 30% precisam crypto local + biometria + comunicação tokenizada com BFF

## Decisão

Adotar **React Native (Expo bare workflow)** como stack mobile principal, com **módulos nativos (Kotlin + Swift)** para crypto, biometria e SSL pinning. UI compartilhada entre iOS/Android.

## Alternativas consideradas

### Critérios de avaliação e pesos

| Critério | Peso | Justificativa |
|----------|------|---------------|
| Time-to-market | 25% | Janela regulatória de 9 meses é hard deadline |
| Talent disponível | 20% | Time atual é majoritariamente RN; mercado BH/SP idem |
| Compliance/segurança | 20% | BACEN não negocia; falha = multa + retirada do ar |
| Performance crítica | 15% | Maior parte das telas é CRUD; crypto exige profile |
| Manutenção dual (iOS+Android) | 10% | Custo recorrente, mas previsível |
| Maturidade do ecossistema | 10% | Beta + lib não-mantida = risco regulatório |

### Matriz comparativa (nota 0–10)

| Alternativa | TTM | Talent | Compliance | Perf | Manut. | Maturidade | Score |
|-------------|-----|--------|------------|------|--------|------------|-------|
| Nativo puro (Kotlin + Swift) | 4 | 6 | 9 | 10 | 5 | 10 | 6.85 |
| **React Native + módulos nativos** | **9** | **9** | **8** | **8** | **7** | **9** | **8.35** |
| Flutter | 7 | 5 | 7 | 9 | 7 | 8 | 6.95 |
| Kotlin Multiplatform (Compose Multiplatform) | 6 | 4 | 7 | 9 | 6 | 6 | 5.85 |
| PWA + wrapper nativo | 9 | 8 | 5 | 5 | 8 | 7 | 6.85 |

**Cálculo:** `score = Σ(nota_i × peso_i)`. RN + native modules vence por equilíbrio entre TTM e talent, com compliance atendido via módulos nativos isolados.

## Consequências

**Positivas:**
- Reuso ~70% do codebase entre iOS/Android (UI + lógica de negócio em TS)
- Time atual produtivo desde o dia 1 (não precisa retrain massa)
- Crypto e biometria isolados em módulos nativos auditáveis (compliance feliz)
- Expo SDK 55+ entrega New Architecture (JSI/Fabric) — performance OK

**Negativas:**
- Bridging nativo exige 2 engenheiros sêniores dedicados (custo + lock-in pessoal)
- Performance da camada crypto exige profile contínuo (não é "free")
- Upgrades de RN/Expo são pontos de risco — janela de freeze de 1 release/ano
- Lib externa em RN não-mantida = débito técnico (gerência ativa de deps)

**Mitigações:**
- Plano de capacitação cruzada: nativos aprendem RN/TS, RN devs aprendem Kotlin/Swift
- Auditoria trimestral de deps (renovate + revisão manual de libs críticas)
- Compliance: módulos nativos passam por security review do time de SecEng

## Referências

1. **Nygard, M.** (2011) *Documenting Architecture Decisions*. https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
2. **Charland, A.; Leroux, B.** (2011) *Mobile Application Development: Web vs. Native*. Communications of the ACM, 54(5), pp. 49–53. DOI:10.1145/1941487.1941504
3. **Eisenman, B.** (2018) *Learning React Native* (O'Reilly, 2ª ed.) — capítulos 1, 2 e 9 (Native Modules).
4. **Airbnb Engineering** (2018) *Sunsetting React Native* — série de 5 posts. https://medium.com/airbnb-engineering/sunsetting-react-native-1868ba28e30a
5. **BACEN** (2024) *Resolução BCB nº 304: Política de Segurança Cibernética para Instituições Financeiras*.
