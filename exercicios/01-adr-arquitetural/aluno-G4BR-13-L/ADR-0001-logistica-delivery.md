# ADR-0001: Stack mobile para plataforma de logística e delivery

> Padrão ADR baseado em Michael Nygard (2011).

## Status

`Aceito` (2026-06-03)

**Autor:** Equipe Mobile · LogiFast Tecnologia Ltda.
**Stakeholders consultados:** Head de Engenharia, Gerente de Operações, Diretor de Produto, Coordenador de Logística

## Contexto

* **Produto:** plataforma de logística e delivery para entregadores, clientes e operadores logísticos
* **Escala:** 500 mil usuários ativos, meta de 2 milhões em 24 meses
* **Distribuição:** 85% Android / 15% iOS
* **Time atual:** 8 engenheiros — 5 React Native (TypeScript), 2 Backend, 1 Android Kotlin
* **Janela:** MVP nacional em 8 meses
* **Requisitos críticos:**

  * Rastreamento GPS em background
  * Navegação integrada com mapas
  * Sincronização offline-first
  * Atualização de localização em tempo real
  * Notificações push de alta confiabilidade
  * Registro de entregas com evidências fotográficas
* **Restrições:**

  * Cobertura em regiões com conectividade instável
  * Forte pressão por redução de custo operacional
  * Necessidade de evoluir rapidamente funcionalidades de negócio
  * Não utilizar tecnologias experimentais ou sem adoção consolidada

## Decisão

Adotar **React Native (Expo Bare Workflow) com módulos nativos específicos para geolocalização, processamento em background e integração com mapas**, compartilhando a maior parte da UI e lógica entre Android e iOS.

## Alternativas consideradas

### Critérios de avaliação e pesos

| Critério                    | Peso | Justificativa                             |
| --------------------------- | ---- | ----------------------------------------- |
| Time-to-market              | 25%  | Mercado altamente competitivo             |
| Geolocalização e background | 25%  | Principal requisito de negócio            |
| Disponibilidade de talentos | 20%  | Expansão da equipe prevista               |
| Manutenção multiplataforma  | 15%  | Controle de custos recorrentes            |
| Offline-first               | 10%  | Operação em áreas com baixa conectividade |
| Maturidade do ecossistema   | 5%   | Redução de riscos técnicos                |

### Matriz comparativa (nota 0–10)

| Alternativa                        | TTM   | Geo/Background | Talent | Manut. | Offline | Maturidade | Score    |
| ---------------------------------- | ----- | -------------- | ------ | ------ | ------- | ---------- | -------- |
| Nativo puro (Kotlin + Swift)       | 4     | 10             | 6      | 4      | 9       | 10         | 6.65     |
| **React Native + módulos nativos** | **9** | **8**          | **9**  | **8**  | **8**   | **9**      | **8.45** |
| Flutter                            | 7     | 8              | 6      | 8      | 8       | 8          | 7.25     |
| Kotlin Multiplatform               | 6     | 8              | 4      | 7      | 8       | 6          | 6.20     |
| PWA + Wrapper Nativo               | 9     | 4              | 8      | 9      | 5       | 7          | 6.80     |

**Cálculo:** `score = Σ(nota_i × peso_i)`

O React Native apresentou o melhor equilíbrio entre velocidade de entrega, disponibilidade de profissionais e atendimento dos requisitos de rastreamento logístico.

## Consequências

### Positivas

* Compartilhamento de aproximadamente 75% do código entre Android e iOS
* Menor custo de desenvolvimento e manutenção
* Time atual produtivo imediatamente
* Grande ecossistema de bibliotecas para mapas, push notifications e sincronização offline
* Possibilidade de desenvolver módulos nativos apenas para funcionalidades críticas

### Negativas

* Geolocalização em background exige customizações nativas e testes extensivos
* Dependência de APIs específicas de Android e iOS para otimização de bateria
* Atualizações do React Native podem exigir adaptações em integrações nativas
* Possíveis diferenças comportamentais entre plataformas durante operações em segundo plano

### Mitigações

* Isolar rastreamento GPS e sincronização offline em módulos nativos auditáveis
* Manter pipeline automatizado de testes em dispositivos reais
* Revisão trimestral de dependências críticas
* Capacitação cruzada entre desenvolvedores React Native e Android/iOS

## Referências

1. **Nygard, M.** (2011). *Documenting Architecture Decisions*. Disponível em: [https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
2. **Charland, A.; Leroux, B.** (2011). *Mobile Application Development: Web vs. Native*. Communications of the ACM, 54(5), pp. 49–53. DOI: 10.1145/1941487.1941504
3. **Eisenman, B.** (2018). *Learning React Native* (2ª edição). O'Reilly Media.
4. **React Native Documentation**. Architecture, Native Modules e Background Processing. [https://reactnative.dev](https://reactnative.dev)
5. **Google Android Developers**. Background Location Access Best Practices. [https://developer.android.com/location/background](https://developer.android.com/location/background)
6. **JetBrains**. Kotlin Multiplatform Production Case Studies. [https://www.jetbrains.com/kotlin-multiplatform/production/](https://www.jetbrains.com/kotlin-multiplatform/production/)
