# ADR-NNNN: [Título da Decisão]

> **Template ADR (Architecture Decision Record)** — baseado em Michael Nygard (2011) *Documenting Architecture Decisions*. Roteiro livre: siga as seções, mas não precisa ser rígido — o que importa é o raciocínio.

---

## Status

`Proposto` | `Aceito`

**Data:** YYYY-MM-DD
**Autor:** Nome do(a) decisor(a)

## Contexto

> Descreva as **forças em jogo** em poucos bullets: o que o produto precisa, restrições de negócio/prazo/equipe, o que não pode dar errado.

Exemplo:
- **Produto:** app de delivery de comida pra bairro
- **Escala alvo:** 50 mil pedidos/mês em 6 meses
- **Time:** 4 engenheiros, nenhum com experiência nativa
- **Restrição:** orçamento curto, precisa lançar rápido

## Decisão

> **Uma frase clara** com a escolha feita.

Exemplo: Adotaremos Flutter como stack mobile, por unificar iOS/Android com 1 time pequeno.

## Alternativas consideradas

> Compare **pelo menos 3 alternativas** com prós/contras — não precisa de matriz de peso × nota (isso fica pro Projeto Final, quando o cenário for mais complexo).

| Alternativa | Prós | Contras |
|---|---|---|
| **Flutter** (escolhida) | 1 codebase, hot reload, boa performance | Time precisa aprender Dart |
| React Native | Time já sabe JS, ecossistema grande | Bridging nativo pode complicar em apps simples |
| Nativo (Kotlin + Swift) | Melhor performance/UX possível | 2 codebases, 2x o tempo pra time de 4 pessoas |

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
