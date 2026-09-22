# Atividade 1 — ADR Arquitetural (15 pts)

**Disciplina:** Arquitetura de Aplicações Móveis e Multiplataforma
**Entrega:** ver Canvas
**Modalidade:** individual
**Tempo estimado:** ~1 hora
**Dificuldade:** ⭐ Fácil — redação técnica curta, sem setup de código

---

## Contexto

Architecture Decision Records (ADRs) são o artefato que distingue **decisão técnica** de **palpite**. Nesta atividade você vai redigir um ADR curto (1 página) justificando a escolha de stack mobile pra um cenário concreto.

## Tarefa

1. **Escolha 1 cenário** (ou proponha o seu, com o mesmo nível de detalhe):

   | # | Cenário | Restrições |
   |---|---|---|
   | A | App de delivery de comida pra bairro | Time pequeno (4 devs), orçamento curto, prazo de 6 meses |
   | B | App de agendamento pra clínica pequena | Time de 2 devs, sem experiência mobile prévia, prazo de 3 meses |
   | C | App de catálogo + pedidos pra loja de roupas local | Time de 3 devs (todos JS/web), quer lançar em 2 meses |

2. **Redigir o ADR** usando `adr-template.md` como base, comparando **pelo menos 3 alternativas** entre: Nativo (Kotlin + Swift), React Native, Flutter, Kotlin Multiplatform (KMP), PWA.

3. **Comparação qualitativa** — tabela simples de prós/contras por alternativa (ver template). **Não precisa de matriz de peso × nota** — isso é coisa pro Projeto Final, quando o cenário for mais complexo.

4. **≥2 fontes confiáveis**: doc oficial da tecnologia escolhida + pelo menos mais 1 (paper, livro técnico, post de engenharia validado — Airbnb/Discord/Netflix Tech Blog).

## Critérios de avaliação

| Critério | Pontos |
|---|---|
| Estrutura ADR correta (status com autor+data, contexto, decisão, alternativas, consequências) | 5 |
| Comparação de ≥3 alternativas com prós/contras claros | 5 |
| ≥2 referências confiáveis e pertinentes | 3 |
| Clareza e coerência (decisão sustentada pelo contexto) | 2 |

## Template + exemplo

- Template (estrutura vazia): [`adr-template.md`](https://github.com/jacksonsmith/puc-iec-mobile-multiplataforma/blob/main/exercicios/01-adr-arquitetural/adr-template.md)
- Exemplo preenchido (pra ver o formato, **não copiar** — é um cenário diferente dos 3 acima): [`ADR-0001-controle-estoque-oficina.md`](https://github.com/jacksonsmith/puc-iec-mobile-multiplataforma/blob/main/exercicios/01-adr-arquitetural/exemplo/ADR-0001-controle-estoque-oficina.md)

## Entrega

**Direto no Canvas, sem PR** (fluxo de fork + Pull Request a gente só vê na Aula 2 — não precisa disso agora).

- Sobe o arquivo (`.md`, `.pdf` ou `.txt`) **ou** cola o texto direto na caixa de texto do Canvas
- Tamanho alvo: **1 página**

## Anti-padrões a evitar

- ❌ ADR sem autor nem data — irrastreável
- ❌ ADR depois do código (vira justificativa, não decisão)
- ❌ ADR de 10+ páginas (ninguém lê)
- ❌ Alternativas sem prós/contras — só listar nomes não conta
- ❌ Referências só de blog pessoal sem credibilidade

## Material de apoio

- Material de apoio aula 1 (pasta `material-de-apoio/`): Charland & Leroux 2011, Nygard 2011, série Airbnb 2018, RN docs
