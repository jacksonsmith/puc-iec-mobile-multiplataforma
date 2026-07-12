# ADR-0001: Stack mobile para app de e-commerce marketplace B2C

> Architecture Decision Record — padrão Michael Nygard (2011). Atividade 1, Arquitetura Mobile Multiplataforma (PUC IEC 2026).

## Status

`Aceito` (2026-05-22)

**Autor:** Leandro Lima

Decisão alinhada numa reunião com o Tech Lead de Mobile e revisada depois com o Head de Growth (que puxou bastante o ponto do OTA e das campanhas semanais) e com o líder da plataforma de pagamentos, que botou o pé no freio sobre manter o caminho de pagamento em código nativo auditável.

## Contexto

Estamos num marketplace B2C multi-seller, com o fluxo clássico de catálogo, busca, carrinho, checkout e rastreio de pedido. Hoje rodamos com cerca de 1,5M de usuários ativos por mês e a meta é chegar a 4M em 12 meses. O que pesa mais que o crescimento médio, porém, é o pico de Black Friday: o tráfego sobe perto de 8 vezes a média numa janela de uns três dias, e é nesse período que qualquer falha dói de verdade.

A base é majoritariamente Android — algo em torno de 70% — e price-sensitive, com muito aparelho mid e low-end no meio. Isso não é detalhe: a maioria dos nossos usuários roda em hardware modesto, então performance de lista e imagem não é luxo.

No time somos 14 engenheiros de mobile (9 em React Native com TypeScript, 3 em Android Kotlin, 2 em iOS Swift), mais 6 devs de web React que podem encostar no mobile. A contratação está congelada por 12 meses, então qualquer escolha precisa caber nesse time como ele é hoje.

Do lado de negócio, o Growth roda A/B test e campanha promocional toda semana, e a UI muda praticamente toda sprint. As forças que mais puxam a decisão:

- Precisamos conseguir dar hotfix sem entrar na fila de revisão da loja. Um bug no checkout durante a Black Friday custa receita por minuto, e é aí que o OTA update deixa de ser conveniência e vira requisito.
- A conversão de checkout depende de latência percebida e de SDKs de pagamento e antifraude bem integrados (3DS, carteiras).
- Mídia paga e e-mail dependem de deep linking e atribuição confiáveis — links que abrem direto no produto e carregam a origem da campanha (Branch/Adjust).
- O catálogo precisa rolar liso mesmo no Android baixo; travar scroll ou imagem é perda de funil direta.

Como restrições firmes: orçamento de contratação congelado pelos próximos 12 meses, nada de tecnologia em beta no caminho de pagamento, e a expectativa de reaproveitar o time React que já temos em web e mobile.

## Decisão

Vamos com React Native (Expo, New Architecture) como stack principal. O catálogo, a busca, o carrinho e a UI de checkout ficam em TypeScript compartilhado entre iOS e Android; o que toca SDK nativo de forma sensível — gateway de pagamento e deep linking/atribuição — fica isolado em módulos nativos próprios.

O ponto que fechou a decisão foi o OTA via Expo Updates: durante a Black Friday, se o checkout quebrar, não dá pra esperar a fila de revisão da loja. Essa capacidade não existe em nativo puro nem em Flutter da mesma forma, e é justamente o cenário que mais nos assusta.

Vale registrar que não foi uma escolha óbvia. Se a base fosse 90% Android pesado e a performance de lista fosse o gargalo número um, Flutter teria sido um candidato forte. O que pesou contra foi não termos ninguém com Dart rodando em produção e o congelamento de contratação — adotar Flutter significaria treinar o time inteiro durante a janela competitiva, e isso é risco que não topamos correr agora.

## Alternativas consideradas

### Critérios de avaliação e pesos

| Critério | Peso | Justificativa |
|----------|------|---------------|
| Velocidade de iteração + OTA | 25% | Growth muda UI toda sprint; hotfix em Black Friday sem revisão de loja é diferencial de receita |
| Talent disponível / reuso | 20% | 9/14 já são RN e há 6 devs React web; contratação congelada |
| Ecossistema de SDKs (pagamento, atribuição, analytics) | 20% | Checkout e deep linking dependem de SDKs maduros e bem integrados |
| Performance de UI em low-end | 15% | Maioria da base é Android mid/low; scroll de catálogo é crítico |
| Time-to-market | 10% | Janela competitiva, mas sem deadline regulatório rígido |
| Manutenção dual (iOS+Android) | 10% | Custo recorrente, previsível |

### Matriz comparativa (nota 0–10)

| Alternativa | Iteração+OTA | Talent | SDKs | Perf low-end | TTM | Manut. | Score |
|-------------|--------------|--------|------|--------------|-----|--------|-------|
| Nativo puro (Kotlin + Swift) | 3 | 6 | 9 | 10 | 4 | 5 | 5.95 |
| **React Native (Expo + OTA)** | **10** | **9** | **9** | **7** | **9** | **7** | **8.65** |
| Flutter | 5 | 5 | 7 | 9 | 7 | 7 | 6.40 |
| Kotlin Multiplatform | 4 | 4 | 7 | 9 | 6 | 6 | 5.55 |
| PWA + wrapper (TWA) | 8 | 8 | 5 | 5 | 9 | 8 | 6.85 |

O score é a soma das notas ponderadas pelos pesos (`Σ nota_i × peso_i`). RN sai na frente por juntar três coisas que mais importam pra gente: OTA — que é o único caminho a entregar hotfix sem revisão de loja, o fator decisivo na janela de Black Friday —, o reuso do time React e o ecossistema maduro de SDKs de pagamento e atribuição.

Nativo puro lidera com folga em performance bruta, mas afunda na iteração, que tem o maior peso da matriz; é o trade-off que define a escolha. Flutter e KMP têm performance ótima, só que o time não domina Dart nem Kotlin Multiplatform e o ferramental de pagamento em JS é mais completo hoje.

O resultado que mais me fez pensar foi o PWA. Ele quase encosta no Flutter no score, porque ganha em iteração e time-to-market, e por um momento isso me deixou em dúvida. O que tirou o PWA da disputa não foi o número agregado, e sim um ponto que a matriz quase esconde: o suporte fraco a Apple Pay / Google Pay nativos e a deep linking confiável. Como esses dois são exatamente o coração do nosso problema, um PWA me obrigaria a brigar contra a plataforma justo onde menos posso arriscar.

## Consequências

O que ganhamos:

- Conseguimos publicar um hotfix de checkout no mesmo dia, sem depender da revisão da App Store ou da Play. É o motivo principal da decisão e o que mais importa na janela de Black Friday.
- A maior parte do código de produto — catálogo, busca, carrinho e a UI de checkout — passa a ser compartilhada entre as duas plataformas. Não arrisco um número exato porque pagamento e atribuição continuam nativos, mas a fatia compartilhável é a maioria do que escrevemos no dia a dia. Na prática, os 9 devs de RN e os 6 de web React começam a contribuir sem curva de aprendizado.
- Os SDKs de pagamento (Stripe/Adyen), atribuição (Branch/Adjust) e analytics (Segment) têm bindings maduros em RN, então economizamos a integração na unha.
- A cadência semanal de A/B test e campanha do Growth deixa de esbarrar no ciclo de release das lojas.

O que isso nos custa:

A performance em Android low-end é a parte que mais me incomoda, e não quero subestimá-la. RN não entrega isso de graça: lista longa de catálogo e carregamento de imagem viram problema real se a gente relaxar. Vai exigir profiling desde o começo, não como ajuste de fim de projeto.

Além disso:

- OTA tem limite de política das lojas. Dá pra trocar JS, mas mudar o comportamento do app de forma substancial sem nova submissão viola as guidelines. Precisamos de governança pra não tomar takedown.
- O caminho de pagamento ainda nos prende a 2 engenheiros nativos para os módulos sensíveis. É custo recorrente e algum lock-in de pessoa — se os dois saírem, ficamos expostos justamente na parte mais crítica.
- Upgrade major de RN/Expo é sempre um susto. Cada bump pode quebrar módulo nativo, então tratamos como risco a gerenciar, não como rotina.

Como pretendemos lidar com isso:

- Performance entra como meta desde o dia 1: scroll fluido no catálogo, `FlashList` no lugar da `FlatList`, cache de imagem agressivo e Sentry Performance instrumentado antes do primeiro release. Se em algum momento uma tela não fechar o orçamento de frame, ela é candidata a virar nativa — sem dogma.
- A política de OTA fica escrita e explícita: só bundle JS; qualquer mudança de feature ou fluxo passa por release de loja. Isso protege contra violar guideline por descuido.
- Pagamento isolado em módulos nativos auditáveis, com security review por SDK antes de entrar no caminho do dinheiro.
- Upgrade major de RN/Expo vira um projeto dedicado, planejado para fora da temporada de Black Friday, nunca às pressas no meio de um pico.

## Referências

1. **Nygard, M.** (2011) *Documenting Architecture Decisions*. https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
2. **Charland, A.; Leroux, B.** (2011) *Mobile Application Development: Web vs. Native*. Communications of the ACM (CACM), 54(5), pp. 49–53. DOI:10.1145/1941487.1941504
3. **Eisenman, B.** (2018) *Learning React Native*, 2ª ed. O'Reilly — caps. 1, 2 e 9 (Native Modules).
4. **Joorabchi, M. E.; Mesbah, A.; Kruchten, P.** (2013) *Real Challenges in Mobile App Development*. ACM/IEEE ESEM, pp. 15–24.
5. **Shopify Engineering** (2020) *React Native is the Future of Mobile at Shopify*. https://shopify.engineering/react-native-future-mobile-shopify

## Histórico

| Data | Autor | Mudança |
|------|-------|---------|
| 2026-05-22 | Leandro Lima | Versão inicial |
