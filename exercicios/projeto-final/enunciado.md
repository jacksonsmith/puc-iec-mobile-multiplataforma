# Projeto Final em Grupo (30 pts)

**Disciplina:** Arquitetura de Aplicações Móveis e Multiplataforma
**Modalidade:** grupo (3 a 4 alunos, auto-organizados)
**Entrega:** PR no fork do repo público — prazo: ver Canvas
**Apresentação:** ao vivo, com demo funcionando (10min + 5min Q&A) — data: ver Canvas

---

## O que é

O grupo constrói **um app mobile** em **Flutter, React Native ou KMP Compose Multiplatform** (os 3 que
vocês usaram nas Atividades 2, 3 e 5) e o entrega por **Pull Request**. O app tem que ser **bem
arquitetado, funcionar de verdade e ser agradável de usar** — não basta "funcionar".

**Tema: livre.** Vocês podem:

- **(A) escolher um dos 5 temas prontos** (PokeAPI, Rick and Morty, TheMealDB, TheCocktailDB, Studio Ghibli), com **skeleton de ponto de partida**; ou
- **(B) escolher qualquer tema que o grupo quiser** (um app de hábitos, receitas, clima, cinema, estudo, viagem, o que for) e construir do zero.

As duas opções têm **a mesma rubrica e o mesmo nível de exigência**. O skeleton é só um atalho — usar
ele **não dá ponto a mais** e o visual dele é básico de propósito: a nota de UI/UX é do **seu** trabalho.

## O que o app precisa ter

### 1. Funcionalidade (mínimo)

| # | Requisito | Detalhe |
|---|---|---|
| 1 | Lista de dados reais | Tela inicial busca dados de uma **API ou fonte real** e mostra uma lista |
| 2 | Detalhe | Tocar num item abre uma tela de detalhe com mais informação |
| 3 | Busca | Busca ou filtro pelo usuário |
| 4 | Persistência local | Algo que o usuário escolhe (favoritos, histórico, preferências) **sobrevive a fechar o app** |
| 5 | Estados de erro | **Carregando**, **vazio** e **erro/sem internet** tratados com mensagem clara — nunca tela branca ou crash |

### 2. UI/UX — o mínimo pra ficar bonito (checklist)

Cada item abaixo é verificado na demo e nos **screenshots do README** (pelo menos 3):

- **Design tokens**: cores, tipografia e espaçamentos definidos **em um lugar só** (tema/`ThemeData`/`MaterialTheme`/arquivo de tema), não valores soltos pelas telas.
- **Tema claro e escuro** funcionando.
- **Loading com skeleton/shimmer** (ou placeholder equivalente), não só um spinner solto no meio da tela.
- **Imagens** com placeholder enquanto carregam e fallback se falharem.
- **Layout responsivo**: funciona em celular e em **paisagem/tela maior** sem cortar nem esticar feio.
- **Acessibilidade básica**: contraste legível, alvo de toque ≥ 48dp, ícones com descrição (label/`contentDescription`).
- **Identidade**: **ícone do app e splash próprios** (não o padrão do framework) e navegação consistente.
- **Sem cara de protótipo**: alinhamentos, hierarquia visual (título/subtítulo), componentes reutilizáveis.

### 3. Arquitetura + ADR

- **Camadas separadas**: dados (API/storage), estado/lógica e UI — sem fetch dentro do widget/componente.
- **Gerenciamento de estado** coerente com o framework (Riverpod/Bloc/Provider, Zustand/Context/React Query, ViewModel/StateFlow…).
- **ADR curto (`ADR.md`, ~1 página)** na pasta do app: por que esse framework, por que esse gerenciador de estado, que alternativa vocês descartaram e por quê (mesmo formato da Atividade 1). Mínimo de 600 caracteres.

### 4. Testes

Escrevam **testes automatizados próprios** (unitários e/ou de widget/componente — **pelo menos 3 casos**)
para a lógica que vocês criaram. **Não existe teste "que o grupo precisa passar"**: a nota olha *o que*
vocês decidiram testar e se faz sentido. Se partirem de um skeleton, os `flows/` do Maestro vêm de
brinde **para vocês se autoverificarem** — rodar é opcional e não vale ponto.

## Opção A — temas prontos (skeletons)

| # | Tema | API retorna | Filtro natural | Tipo do id |
|---|------|---|---|---|
| 1 | **PokeAPI** — Pokédex | nome, sprite, tipos, altura/peso | `type` | `Int` |
| 2 | **Rick and Morty** | nome, status, espécie, gênero | `status` | `Int` |
| 3 | **TheMealDB** — receitas | nome, categoria, área, foto | `c` (categoria) | `String` |
| 4 | **TheCocktailDB** — drinks | nome, categoria, copo, alcoólico | `c` (categoria) | `String` |
| 5 | **Studio Ghibli** — filmes | título, diretor, ano, duração | `director` | `String` (UUID) |

Cada tema tem uma pasta em [`temas/`](./temas/) (endpoints, gotchas) e cada combinação
tema+framework tem um skeleton em `skeletons/<tema>/<framework>/pratica/` com `README.md` de setup.
No skeleton a tela e a lógica das 5 features já estão estruturadas com `// TODO` — **os requisitos 4
(persistência), 5 (estados) e todo o checklist de UI/UX continuam sendo trabalho do grupo.**

**Exclusividade (só Opção A):** cada combinação **tema + framework** de skeleton é de **um grupo só**.
**Reserva:** abram uma **issue** `Grupo <nomes> — <tema> + <framework>`; vale a ordem de chegada
(timestamp). Se a combinação já foi reservada, escolham outra (pode repetir o tema **ou** o framework).

## Opção B — tema livre

Qualquer tema vale, com 3 condições:

1. **Custo zero para todos**: API/dados **gratuitos**, sem cartão e sem cadastro pago. Chave grátis é ok, mas **nunca commitem a chave** (usem `local.properties`/`.env` fora do git e expliquem no README como obter a sua).
2. **Dados reais** (API pública, JSON público ou serviço gratuito) — não vale lista hardcoded no código.
3. **Registrem na issue** `Grupo <nomes> — <tema livre> + <framework>` com 2 linhas: o que o app faz e qual a fonte de dados. Não precisa de aprovação; é para eu acompanhar e para evitar surpresa.

Não há limite de combinações para tema livre. Exige mais trabalho de arranque (sem skeleton) — a
rubrica **não** dá bônus por isso; escolham pelo que o grupo quer construir.

## Entrega — passo a passo

**0. Grupo + escolha** — formem o grupo (3-4 pessoas), decidam **tema (A ou B) + framework** e
**registrem via issue** (acima).

**1. Fork do grupo** — **UM** integrante faz fork do repo público da disciplina: esse fork é o
**repo do grupo** e é dele que sai o PR final. Os outros **não criam fork próprio** — todos clonam o
fork do grupo.

**2. Trabalhar em grupo** — cada integrante clona o **fork do grupo**, cria uma branch com a sua parte
e abre **PR interno → `main` do fork do grupo**. O grupo revisa e mergeia. É assim que cada um acumula
commits/PRs na própria conta — exatamente o que **Contribuição individual** avalia. (Dica: o dono do
fork adiciona os colegas como *collaborators* em Settings → Collaborators.) Commits todos na conta de
uma pessoa só = grupo perde esses pontos.

**3. Onde fica o app** — o PR deve tocar **uma única pasta**:

- **Tema livre (B):** `exercicios/projeto-final/entregas/<nome-do-grupo>/` (crie a pasta; o app inteiro, o `README.md` e o `ADR.md` ficam aqui).
- **Skeleton (A):** `exercicios/projeto-final/skeletons/<tema>/<framework>/pratica/` (edite no lugar; coloque `README.md`/`ADR.md` dentro dela). Comecem pelo `README.md` do skeleton.

**4. `README.md` do app** (obrigatório): o que o app faz · **como rodar** (passo a passo, com o `cd`
da pasta) · **pelo menos 3 screenshots** (`![...](...)`) · link para o `ADR.md` · como obter chave de API, se houver.

**5. Abrir o PR final** — do `main` do **fork do grupo** → repo da disciplina. **Não há autograder
neste projeto**: o professor clona o PR, builda, roda o app e avalia pela rubrica abaixo.

> **Critério eliminatório:** se o app **não builda**, ele não pode ser demonstrado — Funcionalidade
> fica **zerada**. Rodem o build local antes de abrir o PR
> (`flutter build apk --debug` · `./gradlew :androidApp:assembleDebug` · `npx expo prebuild` + `./gradlew assembleDebug`).

**6. Iterar** — podem dar push na mesma branch até o prazo; o PR aberto cedo permite ao professor
avisar de problemas (build, README, ADR) antes da entrega.

**7. Apresentação** — ao vivo, com demo funcionando (10min + 5min Q&A), data: ver Canvas.

## Marcos sugeridos (o projeto dura 2 semanas)

Não há apresentação intermediária — o **PR aberto cedo** é o checkpoint (sem nota; o professor olha
o PR e avisa se algo está fora do esperado).

| Quando | Marco | Como comprovar |
|---|---|---|
| Semana 1 (início) | Grupo formado + tema e framework registrados | Issue aberta |
| Meio do caminho | App builda, lista + detalhe funcionando | PR final aberto (pode ser *draft*) |
| Semana 2 | Persistência, estados de erro e checklist de UI/UX; README + ADR; ensaio da demo | PR final atualizado |
| Fim | Apresentação ao vivo (10min + 5min Q&A) | App rodando |

## Rubrica (30 pts)

| Critério | Pts |
|---|---|
| **UI/UX** — checklist da seção 2 + demo | 8 |
| **Arquitetura + ADR** — camadas, estado, coerência com o ADR | 7 |
| **Funcionalidade** — 5 requisitos, estados de erro, build passando | 6 |
| **Apresentação + demo ao vivo + Q&A** | 4 |
| **Contribuição individual** — commits e PRs internos por integrante | 3 |
| **Qualidade** — testes próprios (≥ 3 casos) + README reprodutível | 2 |

A nota é lançada no Canvas depois da apresentação. A nota individual pode diferir da nota do grupo
conforme a Contribuição individual.

Dúvidas: Teams da turma ou jackson.96@gmail.com.
