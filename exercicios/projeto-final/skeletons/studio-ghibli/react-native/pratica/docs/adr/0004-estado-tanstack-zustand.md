# ADR 0004 — Estado: TanStack Query (servidor) + Zustand (cliente)

- **Status:** aceito
- **Data:** 2026-11-07

## Contexto
"Estado" é a informação que o app guarda enquanto funciona e que muda o que aparece na tela. No nosso app, existem dois tipos bem diferentes:

- **Dados que vêm da internet:** a lista de filmes da API. Eles pertencem a um servidor e podem demorar, falhar ou ficar desatualizados.
- **Dados que nascem no próprio app:** os favoritos, o texto da busca e o diretor escolhido no filtro. Eles estão sempre disponíveis, e os favoritos precisam continuar salvos depois que o app é fechado.

A rubrica pede que o ADR justifique a escolha de como guardar o estado.

## Decisão
Usar uma ferramenta para cada tipo de dado:

- **TanStack Query para os dados da internet.** Ele guarda uma cópia recente dos filmes para não buscar de novo sem necessidade (*cache*), informa se está carregando ou se deu erro, e tenta novamente quando a chamada falha. Ao abrir o detalhe de um filme, reaproveita o que já veio na lista, então a tela aparece na hora.
- **Zustand para os dados do próprio app.** É uma biblioteca pequena para compartilhar informação entre telas. Os favoritos são gravados no aparelho com o recurso `persist` e o `AsyncStorage`, que é o armazenamento local do app.

## Alternativas descartadas

### Redux Toolkit com RTK Query
O Redux é uma das bibliotecas de estado mais conhecidas e o RTK Query é a parte dele que busca dados na internet. Resolveria os dois tipos de dado com uma ferramenta só.

**Por que não:** cada informação pede uma estrutura própria (partes do estado chamadas *slices*, ações, configuração central). Isso compensa em sistemas grandes, com muitas pessoas, mas é trabalho demais para um app de 5 telas.

### Context com `useReducer`
São recursos que já vêm no React, sem instalar nada.

**Por que não:** teríamos dois problemas. Quando um valor do Context muda, todos os componentes que o usam são redesenhados, mesmo os que não dependem daquela parte, e isso pode deixar as fileiras de filmes lentas. Além disso, o Context não traz nada para lidar com internet: cópia dos dados, nova tentativa e aviso de erro teriam que ser feitos à mão.

### Só Zustand, inclusive para buscar os filmes
Teríamos uma biblioteca a menos para aprender e instalar.

**Por que não:** o Zustand só guarda valores. Teríamos que programar sozinhos o controle de carregamento e erro, as novas tentativas e a reutilização de dados, que o TanStack Query já entrega prontos e testados. A API que usamos é gratuita e pode ficar instável, então esse tratamento é importante, e a rubrica cobra os estados de carregamento e erro.

## Consequências
- ✅ Os estados de carregando e erro ficam prontos com pouco código, e o app lida melhor com falhas da API.
- ✅ As regras de favoritar ficam separadas em `src/domain/favorites.ts`, o que permite testá-las sem abrir o app.
- ⚠️ Passamos a ter duas bibliotecas, então o grupo precisa seguir uma regra simples: **o que vem da internet fica no TanStack Query; o que nasce no app fica no Zustand.**
