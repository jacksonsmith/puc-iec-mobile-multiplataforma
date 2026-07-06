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
segredo/cadastro pago necessário). Cada tema tem uma pasta própria em [`temas/`](./temas/) com
endpoints, fixtures usadas nos testes e detalhes específicos.

| # | Tema | API | Por que é real |
|---|------|-----|-----------------|
| 1 | **PokeAPI** — Pokédex | [pokeapi.co](https://pokeapi.co) | Schema simples e estável, zero rate-limit agressivo — "hello world" de API real amplamente usado em tutoriais de mobile |
| 2 | **Rick and Morty API** — personagens | [rickandmortyapi.com](https://rickandmortyapi.com) | Filtro nativo por `status` mapeia direto na feature 4; domínio bem distinto visualmente do tema 1 |
| 3 | **TheMealDB** — receitas | [themealdb.com](https://www.themealdb.com/api.php) | Domínio "comida" com variação visual real; filtro por categoria nativo |
| 4 | **TheCocktailDB** — drinks | [thecocktaildb.com](https://www.thecocktaildb.com/api.php) | Mesmo mantenedor da TheMealDB (schema irmão), tema visual distinto |
| 5 | **Studio Ghibli API** — filmes | [ghibliapi.vercel.app](https://ghibliapi.vercel.app) | Curadoria fixa e estável (22 filmes, não deprecia), filtro por diretor mapeia na feature 4 |

Ver `temas/01-pokeapi/README.md`, `temas/02-rickandmorty/README.md`, `temas/03-themealdb/README.md`,
`temas/04-thecocktaildb/README.md` e `temas/05-studio-ghibli/README.md` pra detalhes de endpoint e as
fixtures exatas que os testes Maestro usam.

## Framework

Escolha 1 dos 3 (o mesmo grupo entrega só **1 combinação** tema+framework):

| Framework | Onde já foi ensinado | Dificuldade aqui |
|---|---|---|
| React Native | Atividade 2 | ⭐⭐ |
| Flutter | Atividade 3 | ⭐⭐⭐ |
| KMP Compose Multiplatform | Atividade 6 | ⭐⭐⭐⭐ |

## Entrega

1. Fork do repo público da disciplina.
2. Editar **só** `exercicios/projeto-final/skeletons/<tema>/<framework>/pratica/` — implementar os 5
   `// TODO` marcados nos arquivos de tela.
3. Abrir PR. O autograder roda automaticamente: builda o app, boota um emulador Android, roda os 5
   flows Maestro, e comenta a nota no PR.
4. Apresentação ao vivo com demo funcionando (data a combinar).

**Critério eliminatório:** se o app não builda, o autograder não consegue nem tentar rodar os testes —
os 15 pts do critério E2E ficam zerados automaticamente.

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
