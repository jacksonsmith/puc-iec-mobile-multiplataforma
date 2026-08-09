# ADR Arquitetural — Cauã Henrique Viana Salgado

> Entrega da Atividade 1 — Arquitetura de Aplicações Móveis e Multiplataforma — PUC IEC 1º/2026.

Cenário escolhido: **D — Saúde / Telemedicina**

Caso real: **Conexa Saúde** — ecossistema digital de saúde líder na América Latina. Fundada em 2016 no Rio de Janeiro, atende 30 milhões de beneficiários, 1,5 milhão de pacientes ativos, 7,2 milhões de consultas/ano, em parceria com 192 operadoras (Bradesco, Amil, Unimeds) e 1.300+ empresas. Faturamento projetado de R$ 300M+ em 2025.

## Arquivo principal

→ [`ADR-0001-stack-mobile-conexa-saude.md`](./ADR-0001-stack-mobile-conexa-saude.md)

## Decisão resumida

**React Native (New Architecture) + Native Modules** (score 8.65) sobre Flutter (7.10), Nativo puro (6.55), KMP (6.35) e PWA (6.35). Escolha sustentada pelo reaproveitamento total do time React/TypeScript existente numa janela de 12 meses com SLA ativo para 192 operadoras, sem abrir mão de compliance LGPD via Native Modules isolados para WebRTC, biometria e criptografia.