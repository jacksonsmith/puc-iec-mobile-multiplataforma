# ADR 0006 — Arquitetura em camadas

- **Status:** aceito
- **Data:** 2026-11-07

## Contexto
A rubrica pede "camadas separadas" e vale 7 pontos junto com o ADR. Separar em camadas significa dividir o código por responsabilidade, como setores de uma empresa. Assim, uma mudança na API não obriga a mexer nas telas, e as regras do app podem ser testadas sozinhas.

## Decisão
Organizar o código em cinco pastas, cada uma com uma função:

```
src/
  app/         as telas e a navegação (Expo Router); só juntam as peças
  components/  peças visuais reutilizáveis (card de filme, botão)
  state/       o que o app guarda em memória (TanStack Query e Zustand)
  data/        conversa com a API Ghibli e adapta o que ela devolve
  domain/      os modelos e as regras do app (filtrar, favoritar, formatar)
```

Cada camada só pode usar as que estão abaixo dela nesta ordem: `app`, `components`, `state`, `data`, `domain`. A `domain` não depende de nenhuma outra.

Exemplo: se a API mudar o nome de um campo, ajustamos só o `data`, na parte que traduz a resposta da API para o formato usado pelo app (os *mappers*). O restante continua igual.

## Alternativas descartadas

### Pastas por funcionalidade
Em vez de separar por tipo de código, cada funcionalidade teria uma pasta com tudo dela: `features/films/`, `features/favorites/`, e assim por diante. Esse modelo é conhecido como *package by feature* e não é o mesmo que DDD, descrito mais abaixo.

**Por que não:** é ótima em apps grandes, quando cada equipe cuida de uma parte. Aqui temos só 5 funcionalidades que dividem quase tudo: o card de filme aparece nas fileiras, na busca e nos favoritos. Com pastas por funcionalidade, seria difícil decidir onde colocar o que é compartilhado. As camadas deixam isso mais claro.

### DDD (Domain-Driven Design)
É uma forma de projetar software a partir do negócio. O time define com os especialistas uma linguagem comum e divide o sistema em áreas com regras próprias (*bounded contexts*, como "pagamentos" e "estoque"). As regras ficam em objetos que representam o negócio, como *entidades* (algo com identidade própria), *agregados* (grupos de objetos tratados como uma unidade) e *repositórios* (o acesso a esses dados). DDD não é um jeito de organizar pastas, e sim de modelar o problema.

**Vantagens**
- O código usa as mesmas palavras do negócio, o que facilita a conversa entre desenvolvedores e especialistas.
- Mantém sob controle regras numerosas e que mudam com frequência.
- Separa bem as áreas de um sistema grande, o que ajuda várias equipes a trabalharem sem conflito.

**Desvantagens**
- Exige bastante modelagem e vários conceitos novos antes de o código render resultado.
- Precisa de especialistas no negócio e de regras complexas para se pagar.
- Em domínios simples, gera muitas classes que só repassam dados.

**Por que não:** nosso domínio é pequeno e tem uma área só: um catálogo de filmes somente leitura, com busca, filtro e favoritos. Não há regras complexas nem áreas de negócio separadas para modelar. Aproveitamos apenas uma ideia que também aparece no DDD: manter as regras em uma camada própria, a `domain`, sem depender de telas ou bibliotecas.

### Clean Architecture completa
É um modelo com camadas ainda mais rígidas. Cada ação do usuário vira uma classe própria (*use case*), e o acesso aos dados fica escondido atrás de contratos (*interfaces*) para que a fonte possa ser trocada sem afetar o resto.

**Por que não:** essa proteção faz sentido em sistemas complexos, com várias fontes de dados e regras que mudam muito. Nosso app só lê uma API pública, sem cadastro nem envio de dados. Criaríamos vários arquivos intermediários que apenas repassam informação, gastando tempo sem ganho real.

## Consequências
- ✅ As regras do app podem ser testadas com o Vitest, sem precisar abrir um emulador (celular virtual no computador).
- ⚠️ Nada impede tecnicamente que alguém importe uma camada pela ordem errada. Precisamos verificar isso na revisão de cada PR.
