# Atividade 1 — ADR Arquitetural (15 pts)

> **Disciplina:** Arquitetura Mobile Multiplataforma — PUC IEC 2026
> **Aula correspondente:** Aula 1 (20/05/2026)
> **Prazo:** 26/05/2026 — 23:59 (horário Brasília)
> **Formato:** markdown ou PDF
> **Auto-grading:** ❌ (avaliação manual no Canvas)

## Objetivo

Redigir um **Architecture Decision Record (ADR)** completo justificando a escolha de stack mobile para um caso real, com matriz quantitativa de trade-offs e fundamentação acadêmica.

## Cenários sugeridos (escolha 1)

Você pode propor outro cenário, mas precisa ter **escala e restrições reais** (não app pessoal).

| # | Domínio | Restrições típicas |
|---|---------|--------------------|
| A | Banco digital retail | BACEN, biometria, SSL pinning, fraude |
| B | E-commerce marketplace | Pico Black Friday, checkout, deep linking |
| C | Streaming de mídia | DRM, offline, codec, bateria |
| D | Saúde / telemedicina | LGPD + dados sensíveis, videochamada, integração SUS |
| E | Logística / delivery | Background location, mapas, offline-first |

## Requisitos mínimos

1. **Mínimo 4 alternativas analisadas** entre: Nativo (Kotlin+Swift), React Native, Flutter, Kotlin Multiplatform, PWA
2. **Matriz quantitativa** com critérios + pesos justificados + score por alternativa
3. **Decisão clara** em 1 frase
4. **Consequências** positivas e negativas (não esconda o negativo)
5. **Mínimo 3 referências acadêmicas** (paper, livro técnico, post de engenharia revisado por pares — não Medium random)
6. **1 página** de extensão alvo. ADR de 20 páginas perde pontos.

## Como entregar

1. **Fork** deste repo
2. Cria pasta: `exercicios/01-adr-arquitetural/aluno-<seu-github-username>/`
3. Coloca o ADR em `ADR-0001-<slug-do-caso>.md` (baseado em [`../adr-template.md`](../adr-template.md))
4. Adiciona `README.md` com link pro ADR + 1 parágrafo de contexto
5. Push + abre PR pra `main` do upstream
6. Também sobe o ADR (markdown ou PDF) no Canvas

## Estrutura esperada

```
exercicios/01-adr-arquitetural/aluno-<github-username>/
├── ADR-0001-<slug>.md         # ADR principal
├── README.md                  # link + contexto curto
└── referencias.bib            # opcional, BibTeX se ABNT/IEEE
```

## Critérios de avaliação (15 pts)

| # | Critério | Peso |
|---|----------|------|
| 1 | Contexto bem delimitado (forças, restrições, escala) | 2 |
| 2 | ≥ 4 alternativas analisadas com profundidade | 3 |
| 3 | Matriz quantitativa com critérios + pesos justificados | 3 |
| 4 | Decisão clara + consequências (+ e −) | 2 |
| 5 | ≥ 3 referências acadêmicas reais | 2 |
| 6 | Coerência interna (decisão sustentada pelo contexto) | 2 |
| 7 | Formato 1-página (ADR enxuto) | 1 |

**Pass threshold:** 60% (9 pts).

## Template

Use [`../adr-template.md`](../adr-template.md) como base. Não copie-cole o exemplo do template — adapte pro seu cenário.

## Referências sugeridas pra começar

- **Nygard, M.** (2011) *Documenting Architecture Decisions* — fonte do padrão ADR
- **Charland, A.; Leroux, B.** (2011) *Mobile Application Development: Web vs. Native*. CACM, 54(5)
- **Eisenman, B.** *Learning React Native* (O'Reilly, 2ed)
- **Airbnb Engineering** *Sunsetting React Native* (série 5 partes)
- **JetBrains** *KMP Production Stories* (Square, McDonald's, Netflix)

## Pitfalls

- ADR escrito **depois** da decisão pronta → vira justificativa, não decisão
- Alternativas só listadas, sem matriz quantitativa → critério 3 zero
- "PWA é ruim" sem dado → opinião, não análise
- Referências = blog posts random → critério 5 zero
- 15 páginas de ADR → critério 7 zero

## Dúvidas

Fórum do Canvas (módulo Atividade 1) ou e-mail do professor.
