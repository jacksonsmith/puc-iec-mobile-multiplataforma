# Atividade 1 — ADR Arquitetural · Leandro Lima (@Leandro0101)

→ ADR principal: [`ADR-0001-stack-mobile-ecommerce-marketplace.md`](./ADR-0001-stack-mobile-ecommerce-marketplace.md)

## Contexto da entrega

O cenário escolhido foi o **B — E-commerce marketplace B2C** (1,5M→4M MAU, pico de 8× na Black Friday, base majoritariamente Android low/mid-end). O ADR decide a stack mobile entre cinco alternativas (Nativo, React Native, Flutter, Kotlin Multiplatform e PWA) usando uma matriz quantitativa com critérios e pesos justificados pelas forças do domínio — onde a **velocidade de iteração com OTA updates** (hotfix sem fila de revisão de loja durante picos), o **reuso do time React** e o **ecossistema de SDKs de pagamento/atribuição** pesam mais que performance bruta. A decisão (React Native + Expo + módulos nativos pontuais) é sustentada pela matriz e acompanhada de consequências honestas e mitigações.
