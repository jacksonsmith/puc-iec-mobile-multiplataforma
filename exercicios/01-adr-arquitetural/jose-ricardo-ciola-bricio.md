# ADR-0001: Stack mobile para uma loja de peças de celular

## Status

`Aceito`

**Data:** 2026-09-30
**Autor:** José Ricardo Ciola Bricio

## Contexto

- **Produto:** aplicativo de catálogo e pedidos para uma loja local de peças de celular, com busca por marca e modelo, consulta de compatibilidade, disponibilidade em estoque, carrinho e envio de pedidos.
- **Time:** 3 desenvolvedores com experiência em JavaScript e desenvolvimento web, mas sem especialização declarada em Android ou iOS.
- **Prazo:** lançamento da primeira versão em 2 meses.
- **Restrições:** equipe pequena e prazo curto exigem alto reaproveitamento de código entre Android e iOS e baixo custo de aprendizagem.
- **Prioridade:** permitir que clientes encontrem rapidamente peças compatíveis com seus aparelhos e façam pedidos sem que a loja precise manter duas implementações independentes.

## Decisão

Adotaremos **React Native com Expo**, pois permite ao time aproveitar sua experiência em JavaScript e compartilhar a maior parte da implementação entre Android e iOS, reduzindo o risco de não cumprir o prazo.

## Alternativas consideradas

| Alternativa | Prós | Contras |
|---|---|---|
| **React Native com Expo** (escolhida) | Usa JavaScript/React, reduzindo a curva de aprendizagem; compartilha código entre Android e iOS; Expo oferece estrutura e ferramentas que aceleram o início do projeto | Publicação e testes continuam específicos por plataforma; bibliotecas ou recursos incomuns podem exigir configuração ou código nativo |
| Flutter | Uma base de código para as duas plataformas; bom conjunto de componentes e desempenho consistente | Exige aprender Dart e o ecossistema Flutter em um prazo de apenas 2 meses |
| PWA | Aproveita diretamente as competências web; publicação rápida por URL e sem aprovação de lojas | Experiência de instalação e integração com o sistema varia entre plataformas; presença e descoberta nas lojas ficam limitadas |
| Nativo (Kotlin + Swift) | Máximo controle das APIs e da experiência de cada plataforma | Exige duas stacks e tende a duplicar implementação, testes e manutenção; incompatível com o perfil e o prazo do time |

## Consequências

**Positivas:**

- O time poderá reutilizar seu conhecimento em JavaScript e concentrar esforços na busca por compatibilidade, no catálogo e nos pedidos.
- Uma base de código compartilhada reduzirá o trabalho necessário para disponibilizar e manter Android e iOS.
- O uso do Expo fornecerá uma estrutura inicial, bibliotecas e ferramentas de desenvolvimento adequadas a uma equipe pequena.

**Negativas:**

- Será necessário reservar tempo para testes, assinatura e publicação separada nas lojas Android e iOS.
- Diferenças de interface e comportamento entre plataformas ainda poderão exigir código condicional.
- A confiabilidade do aplicativo dependerá da atualização frequente do estoque e das informações de compatibilidade das peças.
- Uma futura dependência de hardware ou SDK sem suporte no Expo poderá demandar módulos nativos e conhecimento de Kotlin ou Swift.

## Referências

- React Native. *Get Started with React Native*. Documentação oficial. https://reactnative.dev/docs/environment-setup
- Charland, A.; Leroux, B. (2011). *Mobile Application Development: Web vs. Native*. Communications of the ACM, 54(5), 49–53. https://doi.org/10.1145/1941487.1941504
- Nygard, M. (2011). *Documenting Architecture Decisions*. Cognitect. https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions
