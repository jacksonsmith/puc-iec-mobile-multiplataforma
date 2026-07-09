```markdown
# ADR-0001 — Stack mobile para plataforma de logística e delivery

Plataforma de logística e entregas com 500 mil usuários ativos e projeção para 2 milhões em 24 meses. Operação nacional com forte predominância Android (85%), rastreamento GPS contínuo, sincronização offline, notificações em tempo real e necessidade de lançamento do MVP em 8 meses.

## Por que este ADR é relevante

- Contexto delimitado por requisitos reais de logística e mobilidade
- Matriz quantitativa com critérios, pesos, notas e score final
- Avaliação de 5 alternativas tecnológicas relevantes ao ecossistema mobile atual
- Consideração explícita de requisitos críticos como geolocalização em background e operação offline-first
- Consequências positivas e negativas documentadas de forma transparente
- Mitigações propostas para os principais riscos técnicos e operacionais
- Referências acadêmicas e fontes primárias da indústria

## O que observar na análise

- Geolocalização contínua foi tratada como requisito central do negócio
- Critérios receberam pesos proporcionais ao impacto operacional
- A alternativa vencedora não possui a melhor nota em todos os critérios, mas apresenta o melhor equilíbrio geral
- Soluções nativas foram consideradas como referência de máxima capacidade técnica
- PWA foi avaliada considerando limitações reais de background processing e acesso a recursos do dispositivo

## O que evitar

- Escolher tecnologia apenas por preferência pessoal da equipe
- Ignorar requisitos de localização em segundo plano
- Subestimar custos de manutenção de duas bases nativas independentes
- Utilizar notas arbitrárias sem justificativa baseada no contexto
- Esconder limitações e riscos da alternativa escolhida
- Tratar requisitos offline-first como detalhe de implementação

## Arquivo principal

→ [`ADR-0001-stack-mobile-logistica-delivery.md`](./ADR-0001-stack-mobile-logistica-delivery.md)
```
