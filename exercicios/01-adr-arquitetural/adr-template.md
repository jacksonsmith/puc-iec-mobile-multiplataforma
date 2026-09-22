# ADR-NNNN: [Título da Decisão]

> **Template ADR (Architecture Decision Record)** — baseado em Michael Nygard (2011) *Documenting Architecture Decisions*. Roteiro livre: siga as seções, mas não precisa ser rígido — o que importa é o raciocínio.

---

## Status

`Proposto` | `Aceito` — escolha um e apague o outro.

**Data:** YYYY-MM-DD
**Autor:** Nome do(a) decisor(a)

## Contexto

> Descreva as **forças em jogo** em poucos bullets: o que o produto precisa, restrições de negócio/prazo/equipe, o que não pode dar errado.

Exemplo (ilustrativo — use os dados do SEU cenário, não este):
- **Produto:** app de agendamento pra barbearia
- **Escala alvo:** ~500 agendamentos/mês, 1 unidade só
- **Time:** 2 engenheiros, background web
- **Restrição:** orçamento apertado, dono quer lançar em 2 meses

## Decisão

> **Uma frase clara** com a escolha feita.

Exemplo: Adotaremos PWA, por ser o mais rápido de lançar sem loja de app.

## Alternativas consideradas

> Compare **pelo menos 3 alternativas** com prós/contras — não precisa de matriz de peso × nota (isso fica pro Projeto Final, quando o cenário for mais complexo).

| Alternativa | Prós | Contras |
|---|---|---|
| **PWA** (escolhida, exemplo) | Lança direto no navegador, sem loja de app, 1 dev mantém | Sem acesso a hardware avançado |
| React Native | Ecossistema grande, app "de verdade" na loja | Overhead de manter build iOS/Android pra time de 2 |
| Nativo (Kotlin + Swift) | Melhor performance/UX possível | 2 codebases — inviável pro prazo de 2 meses |

## Consequências

**Positivas:** o que melhora com essa escolha.
**Negativas:** o que fica mais difícil ou arriscado — seja honesto, ADR sem lado negativo não é análise.

## Referências

> Pelo menos **2 fontes confiáveis**: doc oficial da tecnologia + 1 outra (post de engenharia validado, paper, livro técnico). Cite autor/fonte, não só um link solto.

- Ex: Flutter docs — flutter.dev
- Ex: Charland, A.; Leroux, B. (2011). *Mobile Application Development: Web vs. Native*. CACM, 54(5).

---

## Notas pra quem está usando este template

1. **Não pule alternativas.** Sem comparar, vira justificativa pós-facto, não decisão.
2. **Seja honesto nas consequências negativas.** ADR que só tem lado bom não convence ninguém.
3. **1 página é o alvo.** Curto e objetivo > longo e genérico.
