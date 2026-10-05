# ADR-0001: Stack mobile para catálogo e pedidos de loja de roupas

## Status

`Aceito`

**Data:** 2026-10-02  
**Autor:** Guilherme Nunes

## Contexto

- **Produto:** catálogo de roupas e envio de pedidos para uma loja local.
- **Time:** 3 desenvolvedores com experiência em JavaScript e desenvolvimento web.
- **Prazo:** lançamento em 2 meses.
- **Necessidade:** alcançar clientes em Android e iOS com baixo atrito para acessar produtos e iniciar um pedido. O cenário não exige recursos avançados do aparelho nem presença obrigatória nas lojas de aplicativos.

## Decisão

Adotaremos uma **PWA (Progressive Web App)** responsiva, acessível por URL e instalável na tela inicial, para lançar o catálogo e o fluxo de pedidos no prazo usando a experiência web existente.

## Alternativas consideradas

| Alternativa | Prós | Contras |
|---|---|---|
| **PWA (escolhida)** | Aproveita HTML, CSS e JavaScript já usados pelo time; uma aplicação para Android, iOS e desktop; links de produtos podem ser compartilhados e encontrados pela busca; publicação por deploy web. | Instalação, notificações e APIs variam entre navegadores; não tem a mesma presença de um app publicado nas lojas. |
| **React Native** | Compartilha grande parte do código entre Android e iOS; usa JavaScript e apresenta interface com componentes nativos. | Componentes e estilos web não são reutilizados diretamente; aprender React Native e configurar builds/publicação consome parte do prazo. |
| **Nativo (Kotlin + Swift)** | Maior acesso às APIs e convenções de cada plataforma; controle direto da experiência nativa. | Exige duas implementações e aprendizado de stacks sem experiência indicada no time, tornando o prazo de 2 meses mais arriscado. |

## Consequências

**Positivas:** o time trabalha com ferramentas conhecidas; clientes podem abrir o catálogo por um link compartilhado, sem instalar um app antes; uma atualização web chega sem ciclos separados de publicação nas lojas. Um estudo de caso de uma varejista de moda descreve o uso de PWA nesse tipo de experiência [web.dev — George.com](https://web.dev/case-studies/asda-george).

**Negativas:** instalação e recursos do aparelho dependem do navegador, então a experiência deve ser verificada em iOS e Android. O envio e a confirmação do pedido exigem conexão; o catálogo pode continuar acessível offline, mas pedidos não devem ser confirmados sem resposta do servidor. Se a loja passar a exigir presença nas lojas ou integração profunda com o aparelho, a decisão deverá ser reavaliada.

## Referências

- MDN Web Docs. [Progressive web applications (PWAs)](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_web_apps) — documentação sobre URLs compartilháveis, descoberta via busca, múltiplos formatos e recursos progressivos.
- web.dev. [George.com enhances the mobile customer experience with new Progressive Web App](https://web.dev/case-studies/asda-george) — estudo de caso de uma varejista de moda.
