# ADR — Resumo das decisões arquiteturais

> Resumo de 1 página exigido pelo enunciado. Os registros completos estão em [`docs/adr/`](docs/adr/) e [`docs/pdr/`](docs/pdr/).

## App
Catálogo dos filmes do **Studio Ghibli** (dados de `ghibliapi.vercel.app`) com lista, detalhe, busca, filtro por diretor e favoritos que continuam salvos depois de fechar o app.

## Framework: Expo + React Native ([ADR 0001](docs/adr/0001-expo-react-native.md))
**Por quê:** já trabalho com TypeScript e React, o React Native usa os componentes reais de cada sistema (incluindo o vidro nativo do iOS) e os testes no app real encontram os elementos da tela por etiquetas que o React Native já oferece. O Expo cuida da parte mais difícil de preparar e gerar o app.
**Descartados:**
- **Flutter:** usa a linguagem Dart e desenha a própria tela, o que afasta o app do visual real do sistema.
- **KMP:** é forte para compartilhar regras complexas, que não temos, e tem ambiente pesado e web experimental.
- **React Native sem Expo:** exigiria manter e ajustar à mão os projetos de Android e iOS.

## Estado: TanStack Query + Zustand ([ADR 0004](docs/adr/0004-estado-tanstack-zustand.md))
**Por quê:** dados que vêm da internet e dados que nascem no app têm necessidades diferentes. O **TanStack Query** cuida dos filmes: guarda uma cópia, mostra carregando e erro, e tenta de novo se falhar. O **Zustand** guarda busca, filtro e favoritos, sendo que os favoritos ficam gravados no aparelho.
**Descartados:**
- **Redux Toolkit:** pede muita estrutura para um app de 5 telas.
- **Context + useReducer:** redesenharia mais partes da tela do que o necessário e não ajuda a lidar com falhas de internet.

## Arquitetura: camadas ([ADR 0006](docs/adr/0006-arquitetura-camadas.md))
O código é dividido por responsabilidade: telas (`app`), peças visuais (`components`), estado (`state`), acesso à API (`data`) e regras do app (`domain`). As regras ficam isoladas e podem ser testadas sem abrir o app.

## Interface: NativeWind + Moti ([ADR 0002](docs/adr/0002-nativewind.md), [ADR 0003](docs/adr/0003-moti.md))
Toda a camada de estilos fica em um arquivo só e o código das telas fica mais curto. Os temas Noite e Dia seguem a preferência do celular. A imagem do filme e o vidro sobre ela não mudam com o tema ([PDR 0003](docs/pdr/0003-identidade-visual.md)). O Moti faz as animações curtas e o Skeleton loading.

## Testes ([ADR 0005](docs/adr/0005-estrategia-testes.md))
O Vitest verifica as regras de negócio em TypeScript puro. O Maestro faz os testes de ponta a ponta no celular, com 5 fluxos rodando automaticamente (um por funcionalidade).

## Processo
Cada funcionalidade segue a sequência especificação, plano, tarefas e PR, e cada decisão importante fica registrada em um ADR (técnica) ou PDR (produto). Detalhes em [`docs/README.md`](docs/README.md).
