# ADR-0001: Seleção de Stack Mobile para App de Delivery de Comida de Bairro

> **Documentação de Decisão Arquitetural (ADR)** baseada no modelo de Michael Nygard (2011).

---

## Status

`Aceito`

**Data:** 2026-10-05  
**Autor:** Henrique Miguel de Jesus (Aluno PUC Minas - IEC)  

## Contexto

O objetivo do projeto é desenvolver um aplicativo mobile completo de delivery de comida voltado para estabelecimentos de um bairro, englobando catálogo de restaurantes/cardápios, checkout, geolocalização para rastreamento de entregas e Notificações Push sobre o status dos pedidos.

As principais forças e restrições envolvidas são:
- **Produto:** App de delivery de comida de bairro (iOS e Android).
- **Time de Desenvolvimento:** Time pequeno composto por 4 desenvolvedores.
- **Restrições de Negócio:** Orçamento curto/reduzido e prazo de desenvolvimento de 6 meses.
- **Requisitos Críticos:** Desempenho fluido na listagem de cardápios, rastreamento de entregadores via GPS em tempo real e entrega confiável de Notificações Push.

## Decisão

Adotaremos **Flutter** como a stack tecnológica principal para o desenvolvimento cross-platform (Android e iOS).

## Alternativas consideradas

| Alternativa | Prós | Contras |
|---|---|---|
| **Flutter** *(Escolhida)* | Uma única base de código para iOS e Android; performance nativa fluida renderizada via GPU; forte ecossistema de mapas/geolocalização; viável para o prazo de 6 meses com time de 4 devs e orçamento reduzido. | Requer curva de aprendizado inicial da linguagem Dart e do paradigma de widgets para os membros do time sem experiência prévia. |
| **React Native** | Grande ecossistema de pacotes e reaproveitamento de habilidades JS/TS caso o time possua bagagem web. | Funcionalidades de geolocalização e rastreamento em segundo plano (background GPS) podem demandar abstrações adicionais complexas e pontes nativas. |
| **Nativo (Kotlin + Swift)** | Controle absoluto sobre APIs do sistema operacional (GPS em background, notificações e consumo de bateria). | Requer dividir o time de 4 devs em 2 equipes separadas para manter 2 bases de código independentes, estourando o orçamento restrito. |
| **PWA (Progressive Web App)** | Menor custo de desenvolvimento e publicação sem necessidade de submissão a lojas de apps. | Limitações severas no iOS para execução de rastreamento por GPS em segundo plano e inconsistência de Notificações Push, inviabilizando a experiência de delivery. |

## Consequências

**Positivas:**
- **Redução de Custo de Manutenção:** 1 única base de código compartilhada entre Android e iOS, otimizando a alocação dos 4 desenvolvedores.
- **UI Consistente e Fluida:** A engine gráfica do Flutter (Impeller/Skia) garante 60/120 fps nas telas de cardápio e mapas de acompanhamento.
- **Viabilidade Financeira e de Prazo:** Permite construir e testar a solução completa dentro da janela de 6 meses sem estourar o orçamento.

**Negativas:**
- Necessidade do time investir as primeiras semanas na capacitação na linguagem Dart e arquitetura de estados do Flutter (ex: Bloc / Provider / Riverpod).
- Tamanho ligeiramente maior do binário final instalado no aparelho em comparação com um app totalmente nativo minimalista.

## Referências

1. **Flutter Documentation** — *Architectural Overview & Building Mobile Apps with Flutter*. Disponível em: <https://docs.flutter.dev/>. Acesso em: 05 oct. 2026.
2. **BMW Group Tech** (2020). *Flutter & My BMW App: How BMW uses Flutter to develop mobile apps*. BMW Group Press & Engineering Blog. Disponível em: <https://www.press.bmwgroup.com/global/article/detail/T0318534EN/>. (Exemplo prático de aplicação mobile escalável cross-platform usando Flutter).
3. **Nygard, M.** (2011). *Documenting Architecture Decisions*. Cognitect Blog. Disponível em: <https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions>.
4. **Charland, A.; Leroux, B.** (2011). *Mobile Application Development: Web vs. Native*. Communications of the ACM, 54(5), pp. 49-53.
