# ADR-0001: Stack mobile para app de delivery de bairro

> **Exemplo do professor — não copie, é só pra mostrar o formato e o nível de profundidade esperado.**

## Status

`Aceito`

**Data:** 2026-09-21
**Autor:** Prof. Jackson Smith Moisés Matias

## Contexto

- **Produto:** app de delivery de comida pra restaurantes de um bairro (não é concorrente de iFood — é local, poucos restaurantes parceiros)
- **Escala alvo:** ~50 mil pedidos/mês em 6 meses, só 1 cidade
- **Time:** 4 engenheiros, todos com background em JavaScript/web, nenhum com experiência mobile nativa
- **Restrição:** orçamento curto (startup bootstrap), precisa lançar em 6 meses

## Decisão

Adotaremos **React Native** como stack mobile principal.

## Alternativas consideradas

| Alternativa | Prós | Contras |
|---|---|---|
| **React Native** (escolhida) | Time já sabe JS/TS, reaproveita conhecimento web, ecossistema grande (mapas, push, pagamento) | Bridging nativo se precisar de algo muito específico de plataforma |
| Flutter | Performance ótima, 1 codebase | Time inteiro precisaria aprender Dart do zero — risco pro prazo de 6 meses |
| Nativo (Kotlin + Swift) | Melhor performance/UX possível | 2 codebases pra manter com só 4 devs — inviável no prazo |
| PWA | Mais rápido de lançar, sem loja de app | Push notification e geolocalização em background mais limitados no iOS — crítico pro delivery |

## Consequências

**Positivas:**
- Time produtivo desde a primeira semana (já sabe JS/TS)
- Reuso de ~70% do código entre iOS e Android
- Bibliotecas prontas pra mapa, pagamento e push (economiza tempo de dev)

**Negativas:**
- Se precisar de algo muito específico de plataforma (ex: widget nativo), vai exigir aprender Kotlin/Swift pontualmente
- Performance de listas muito grandes exige atenção (não é o caso aqui, volume é baixo)

## Referências

- React Native — documentação oficial. https://reactnative.dev/docs/getting-started
- Charland, A.; Leroux, B. (2011). *Mobile Application Development: Web vs. Native*. Communications of the ACM, 54(5).

---

## Por que esse exemplo funciona

- **Contexto curto e concreto** — 4 bullets, não um parágrafo genérico
- **Decisão em 1 frase**, sem enrolação
- **4 alternativas com prós/contras reais** — cada "contra" é específico do cenário, não genérico
- **Consequência negativa de verdade** — não é só "está tudo ótimo"
- **Cabe em 1 página**
