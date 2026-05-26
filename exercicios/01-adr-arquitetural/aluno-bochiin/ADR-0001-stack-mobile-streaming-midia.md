# ADR-NNNN: [Título da Decisão]

## Status

`Proposto`

**Data:** 2026-05-27

**Autor:** André Daniel Gomes Soares

**Stakeholders consultados:** Diretor de Produto, Usuários, Head de Engenharia

## Contexto
- **Produto**: App para consumo de mídia digital(Filmes, Séries, Animações)
- **Escala alvo**: 1 milhão de usuários ativos em 1 ano
- **Time:**: (A pensar)
- **Distribuição:** 80% Android / 20% IOS (Atualmente o mercado possui mais aparelhos Android do que IOS)
- **Janela**: Primeiro release em 1 ano
- **Compilance**: Digital Millennium Copyright Act (Lei de Direitos Autorais do Milênio Digital) e DRM (Digital Rights Management, ou Gestão de Direitos Digitais)
- **Restrições**:
    - Disponilizar mídias em qualidade mínima de Full HD e máxima QUAD HD
    - Disponilizar mídias para download e acesso offline
    - Criptografia para dados e stream de conteudo

## Decisão

Será utilizada a Stack Nativa para cada Smartphone(Switft + Android Nativo) com a utilização da plataforma KPM(Kotlin Multiplaform) para centralização de código de funcionalidades do Backend

## Alternativas consideradas

### Critérios de avaliação

| Critério | Peso |
|----------|------|
| Performance crítica | 35% |
| Time-to-market | 10% |
| Talent disponível | 15% |
| Manutenção dual | 15% |
| Compliance regulatório | 25% |

### Matriz comparativa

| Alternativa | Performance | Time-to-market | Talent | Manutenção | Compliance | Total |
|------------|------------|----------------|--------|-----------|-----------|-------|
| Kotlin Multiplatform + Modulos Nátivos | 10 | 8 | 7 | 7 | 9 | 8.2 |
| React Native + native modules | 8 | 9 | 9 | 7 | 7 | 8.0 |
| Flutter | 6 | 8 | 7 | 6 | 6 | 6.6 |
| PWA | 4 | 9 | 9 | 7 | 5 | 6.8 |

## Consequências

### Positivas

- **Reuso do código**: ~70% compartilhado entre iOS e Android com a utilização de KMP
- **Performance**: Utilização de ferramentas nativas para performance
- **Time-to-market:** Lógica unificada acessivel via KMP ainda oferece um ótimo Time-to-market

### Negativas

- **Suporte tecnologia**: KMP ainda é uma tecnologia nova no mercado e com menor suporte, é possivel que algumas features precisem ser implementadas, sendo que em outras tecnologias já existe suporte/bibliotecas para funcionalidades
- **Adequação do time**: Ainda na questão da tecnologia, é necessário que o time se capacite antes para utilizar essa nova tecnologia
- **Time híbrido**: Ainda é necessário times especificos por plataforma, visto que ainda é necessário funcionalidades
nativas para IOS e Android, além do visual

### Mitigações

- **Plano de capacitação:** Planejamento inicial para testes com nova tecnlogia junto a 1 arquiteto e um senior 
- **Esteira de testes de QA**: Testes planejados e organizados focados em performance
- **Experiencia prévia**: Principalmente para a plaforma Android, alguns devs pode ter experiencia prévia com Java e 
as familiaridades de Kotlin com Java, diminuindo a curva de aprendizado

## Referências

- **JetBrains** (s.d.) *Kotlin Multiplatform overview*. Kotlin Documentation. Disponível em: <https://kotlinlang.org/docs/multiplatform/kmp-overview.html>
- **JetBrains** (s.d.) *Kotlin Multiplatform vs. React Native*. Kotlin Documentation. Disponível em: <https://kotlinlang.org/docs/multiplatform/kotlin-multiplatform-react-native.html>
- **Charland, A.; Leroux, B.** (2011) *Mobile Application Development: Web vs. Native*. CACM, 54(5), 49-53
- **Que, P.; Guo, X.; Zhu, M.** (2016) *A Comprehensive Comparison Between Hybrid and Native App Paradigm*. CICN, 611-614
- **Vilček, T.; Jakopec, T.** (2017) *Comparative analysis of tools for development of native and hybrid mobile applications*. MIPRO, 1516-1521

## Histórico

| Data | Autor | Mudança |
|------|-------|---------|
| 2026-05-25 | André Gomes | Versão inicial |

---
