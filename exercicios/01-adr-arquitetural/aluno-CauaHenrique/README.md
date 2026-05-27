# ADR Arquitetural — Cauã Henrique Viana Salgado

> Entrega da Atividade 1 — Arquitetura de Aplicações Móveis e Multiplataforma — PUC IEC 1º/2026.
> Diretório padrão `aluno-CauaHvS` para acionamento do autograder J.A.R.V.I.S.

Cenário escolhido: **D — Saúde / Telemedicina**

Caso: plataforma de telemedicina B2C com consultas por videochamada, prontuário eletrônico e integração RNDS/SUS. Restrições reais: LGPD (dados sensíveis de saúde), CFM (autenticação de médico), WebRTC sem SDK proprietário, time enxuto de 6 engenheiros sem iOS nativo, janela de 10 meses.

## Arquivo principal

→ [`ADR-0001-stack-mobile-telemedicina.md`](./ADR-0001-stack-mobile-telemedicina.md)

## Decisão resumida

**Flutter + Platform Channels** (score 8.30) sobre React Native (7.70), Nativo puro (7.20), KMP (7.10) e PWA (5.50). Escolha sustentada por performance em hardware de médio porte (perfil SUS), acesso direto ao Keystore/Secure Enclave para compliance LGPD, e viabilidade de entrega com time sem iOS nativo em 10 meses.