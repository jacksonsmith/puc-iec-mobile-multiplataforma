# ADR-0001: Stack mobile para controle de estoque de oficina mecânica

> **Exemplo do professor — não é um dos cenários A/B/C do enunciado.** Serve só pra mostrar formato e profundidade, não pra copiar.

## Status

`Aceito`

**Data:** 2026-09-21
**Autor:** Prof. Jackson Smith Moisés Matias

## Contexto

- **Produto:** app interno pra 1 oficina mecânica controlar peças em estoque (entrada/saída, alerta de reposição)
- **Escala alvo:** uso só pelos 3 funcionários da oficina, sem previsão de crescer pra outras unidades
- **Time:** 1 desenvolvedor freelancer, contratado por poucas horas/semana
- **Restrição:** orçamento muito curto (é um app interno, não gera receita direta), sem prazo rígido

## Decisão

Adotaremos **PWA** (Progressive Web App) como stack.

## Alternativas consideradas

| Alternativa | Prós | Contras |
|---|---|---|
| **PWA** (escolhida) | 1 código só, roda no navegador do celular sem precisar de loja de app, dev único mantém sozinho fácil | Sem acesso a hardware avançado (não precisa aqui) |
| React Native | Ecossistema maduro, app "de verdade" na loja | Overhead de manter build iOS/Android pra um app de uso interno é desproporcional ao orçamento |
| Nativo (Kotlin + Swift) | Melhor UX possível | 2 codebases pra 1 dev freelancer de poucas horas — inviável |

## Consequências

**Positivas:**
- Deploy é só atualizar um site — sem processo de loja de app, sem esperar aprovação
- 1 dev consegue manter sozinho no orçamento disponível

**Negativas:**
- Se um dia precisar de leitor de código de barras via câmera com mais performance, PWA pode ficar limitado — vale revisar essa decisão se o escopo crescer

## Referências

- MDN Web Docs — Progressive Web Apps. https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
- Charland, A.; Leroux, B. (2011). *Mobile Application Development: Web vs. Native*. Communications of the ACM, 54(5).
