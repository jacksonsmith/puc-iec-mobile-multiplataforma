# Projeto Final em Grupo (30 pts)

**Disciplina:** Arquitetura de Aplicações Móveis e Multiplataforma
**Modalidade:** grupo (3 a 4 alunos, auto-organizados)
**Entrega:** PR no fork do repo público (data a definir — combinar na próxima aula)
**Apresentação:** ao vivo, com demo funcionando (10min + 5min Q&A)

---

## O que é

Cada grupo escolhe **um tema** (app + API pública gratuita) e **um framework** (Flutter, React
Native ou KMP Compose Multiplatform — os 3 que vocês já usaram nas Atividades 2, 3 e 6) dentre as
combinações disponíveis. Nós já construímos os **skeletons** dos 3 frameworks para cada tema — sua
tarefa é completar **5 features** que faltam no skeleton `pratica/` do seu tema+framework escolhido,
até fazer os **5 testes E2E (Maestro)** passarem de verdade em CI.

Diferente do trabalho final de Testes de Aplicações Mobile (relatório + repo linkado), aqui a
**entrega é o PR em si** — o mesmo modelo de fork+PR que vocês já usam nas outras atividades desta
disciplina. Um **autograder roda um emulador Android real no CI** e executa os 5 flows Maestro contra
o app que vocês construíram — é a mesma convenção de testID nos 3 frameworks, então o app "funciona"
quando o Maestro consegue achar e interagir com os elementos certos.

## As 5 features (iguais em todo tema + framework)

| # | Feature | O que faz |
|---|---|---|
| 1 | Lista consumindo API real | Tela inicial faz fetch de uma lista da API e renderiza os itens |
| 2 | Navegação lista → detalhe | Tocar num item abre uma tela de detalhe com dados adicionais |
| 3 | Busca por texto | Campo de busca filtra a lista (client-side) pelo texto digitado |
| 4 | Categoria/filtro estruturado | Chips de categoria que refinam a lista via parâmetro real da API |
| 5 | Favoritos persistidos localmente | Favoritar no detalhe, ver na aba Favoritos, sobrevive a reabrir o app |

Cada `pratica/` já vem com a tela toda montada (testID nos lugares certos, navegação, layout) — só a
**lógica de cada feature** (chamar a API, aplicar o filtro, persistir o favorito) está marcada com
`// TODO N` nos arquivos certos. Vocês **não escrevem UI do zero** — o trabalho é ligar a lógica que
falta pros testIDs que o Maestro procura passarem a funcionar de verdade (não é decorar o testID em
cima de um elemento que não faz nada — o grader valida isso, ver seção de rubrica).

## Temas disponíveis

Todos usam API pública **sem key real** (ou key de demonstração documentada oficialmente — nenhum
segredo/cadastro pago necessário), sem rate-limit que atrapalhe o CI, e todos resolvem a **feature 4
(categoria/filtro)** via parâmetro real da API — não é filtro inventado. A diferença entre eles é
domínio visual e o **tipo do id** (isso afeta o `FavoritesStore`/model nos 3 frameworks — vale olhar
antes de escolher, não só depois de já ter começado).

| # | Tema | API retorna | Filtro (feature 4) | Tipo do id |
|---|------|---|---|---|
| 1 | **PokeAPI** — Pokédex (151 pokémons) | nome, sprite, tipos, altura/peso | `type` — 1 chamada extra pra cruzar com a lista | `Int` |
| 2 | **Rick and Morty** — personagens (826, paginado) | nome, status (alive/dead/unknown), espécie, gênero | `status` — nativo, `?status=` já filtrado | `Int` |
| 3 | **TheMealDB** — receitas (25 do seed) | nome, categoria, área/origem, foto do prato | `c` (categoria) — nativo, `filter.php?c=` | **`String`** |
| 4 | **TheCocktailDB** — drinks (100 da categoria Cocktail) | nome, categoria, tipo de copo, alcoólico/não | `c` (categoria) — nativo, `filter.php?c=` (mesmo padrão do tema 3, mesmo mantenedor) | **`String`** |
| 5 | **Studio Ghibli** — filmes (22, curadoria fixa) | título, diretor, ano, duração | `director` — nativo, `?director=` | **`String` (UUID)** |

Domínio bicho (1) → personagem de série (2) → comida (3) → drinks (4) → filmes (5): escolham pelo
que o grupo achar mais divertido de montar tela pra ele, a dificuldade técnica das 5 features é a
mesma nos 5 temas. A única decisão que muda código de verdade é o tipo do id — temas 3, 4 e 5 usam
`String` (não `Int`) no model e no `Set` de favoritos.

Cada tema tem uma pasta própria em [`temas/`](./temas/) com endpoints exatos, fixtures usadas nos 5
testes Maestro (qual item/categoria/termo de busca esperar) e gotchas específicos — abram o README
do tema escolhido **antes** de começar a implementar: `temas/01-pokeapi/README.md`,
`temas/02-rickandmorty/README.md`, `temas/03-themealdb/README.md`, `temas/04-thecocktaildb/README.md`,
`temas/05-studio-ghibli/README.md`.

## Framework

Escolha 1 dos 3 (o mesmo grupo entrega só **1 combinação** tema+framework):

| Framework | Onde já foi ensinado | Dificuldade aqui |
|---|---|---|
| React Native | Atividade 2 | ⭐⭐ |
| Flutter | Atividade 3 | ⭐⭐⭐ |
| KMP Compose Multiplatform | Atividade 6 | ⭐⭐⭐⭐ |

## Entrega — passo a passo

**0. Grupo + escolha** — formem o grupo (3-4 pessoas), decidam **1 tema + 1 framework** juntos (ver
tabelas acima). É a única decisão que precisa de consenso antes de escrever código.

**1. Fork** — cada grupo faz fork do repo público da disciplina (só precisa de 1 fork, quem abre o PR).

**2. Implementar** — editem **só**
`exercicios/projeto-final/skeletons/<tema>/<framework>/pratica/` e completem os 5 `// TODO`
marcados nos arquivos de tela (a tela/navegação/testID já vêm prontos — ver "As 5 features" acima).
Leiam o README do tema escolhido antes (endpoints exatos + fixtures).

**3. Abrir o PR** — o autograder dispara sozinho: builda o app, sobe um emulador Android real no
CI, roda os 5 flows Maestro contra ele, e comenta a nota no PR.

> **Critério eliminatório:** se o app não builda, o autograder não consegue nem tentar rodar os
> testes — os 15 pts do critério E2E ficam **zerados automaticamente**, então rodem `flutter build`
> / `./gradlew assembleDebug` / `expo prebuild` localmente antes de confiar no PR.

**4. Ler o comentário do bot** — a nota que aparece é **mínima automática** (só o que dá pra
verificar sem humano: os 5 flows Maestro + convenção de testID). Contribuição individual e
apresentação são avaliadas **manualmente depois**, no Canvas — não aparecem no comentário do bot.

**5. Iterar** — deu 0/15 num flow, ou builda mas falha no meio? Ajustem o código e deem push na
mesma branch — o autograder **roda de novo automaticamente** a cada commit novo no PR. Podem
iterar quantas vezes quiserem até a apresentação.

**6. Apresentação** — ao vivo, com demo funcionando (10min + 5min Q&A), data a combinar.

## Rubrica (30 pts)

| Critério | Peso | Pts |
|---|---|---|
| CI E2E — 5 flows Maestro passando (3pts/flow) | 50% | 15 |
| Convenção de testID correta (não hardcoded pra enganar o teste) | ~17% | 5 |
| Contribuição individual (commits do grupo, avaliação manual) | ~13% | 4 |
| Apresentação + demo ao vivo + Q&A | ~13% | 4 |
| Qualidade do código + README reprodutível | ~7% | 2 |

O autograder posta uma nota **mínima automática** no PR (o critério E2E + a checagem estrutural de
testID) — a nota final, incluindo os critérios manuais (contribuição individual e apresentação), é
lançada no Canvas depois da apresentação.

Dúvidas: Teams da turma ou jackson.96@gmail.com.
