# ADR-0001: Saúde / telemedicina

## Status

`Aceito` (2026-05-26)

**Autor:** Luiza Silva

## Contexto

- **Produto:** plataforma SaaS de telemedicina B2C/B2B - Consultas por vídeo, prontuário digital, integração SUS
- **Escala:** 800K pacientes ativos e 12K de médicos cadastrados. Crescimento para 2400K de pacientes e 36K de médicos em 1 ano e 6 meses;
- **Distribuição:** 52% Android / 48% IOS (perfil diverso, paciente de baixa e alta renda)
- **Time atual:** 6 Engenheiros, sendo 3 Android Kotlin e 3 IOS Swift
- **Compliance:** LGPD (dados sensíveis) + CFM Res. 2.314/2022 exigem criptografia AES-256 em repouso, TLS 1.3 + certificate pinning, audit log de acesso ao prontuário
- **Janela:** primeiro release em 8 meses (MVP integrado ao SUS)
- **Restrições:**
  - Videochamada nativa com latência menor que 300ms;
  - Autenticação do certificado ICP-Brasil + FHIR R4 para integração com RNDS (Rede Nacional de Dados em Saúde, SUS);
  - Não pode usar tecnologia em beta (compliance CFM);
  - ~65% das telas em CRUD clínico + formulários; ~35$ crypto local, biometria e vídeo nativo

## Decisão

Adotar Nativo como stack de UI e Integração de mídia/segurança com camada de domínio compartilhada em Kotlin Multiplatform (KMP), isolando regras LGPD, parsing FHIR R4 e lógica de agendamento no módulo KMP e mantendo UI e APIs sensíveis inteiramente nativas por plataforma.

## Alternativas consideradas

### Critérios de avaliação e pesos

| Critério | Peso | Justificativa |
|----------|------|---------------|
| Segurança / compliance (pinning, crypto, ICP-Brasil) | 30% | Violação = sanção ANPD + responsabilidade CFM + perda do contrato B2B - risco existencial |
| Videochamada nativa (latência, qualidade em mid-range) | 25% | Momento de maior valor ao paciente; queda degrada NPS e converte em churn |
| Conformidade LGPD + auditabilidade | 15% | Dado de saúde é dado sensível; audit log exige rastreabilidade de acesso por camada |
| Time-to-market | 15% | 8 meses é hard deadline regulatório + contratual |
| Acessibilidade WCAG 2.1 AA | 10% | Cláusula de contrato B2B; não-conformidade gera multa contratual |
| Custo de manutenção (3 anos) | 5% | Relevante, mas subordinado às restrições regulatórias |

### Matriz comparativa (nota 0–10)

| Alternativa | Segurança | Vídeo nativo | LGPD/Audit | TTM | Acessib. | Manutenção | Score |
|-------------|-----------|--------------|------------|-----|----------|------------|-------|
| **Nativo + KMP domínio** | **10** | **10** | **10** | **5** | **10** | **6** | **8,75** |
| Flutter | 8 | 8 | 8 | 7 | 6 | 9 | 7,75 |
| React Native + módulos nativos | 6 | 8 | 6 | 8 | 6 | 7 | 6,90 |
| Nativo puro (sem KMP) | 10 | 10 | 10 | 3 | 10 | 4 | 8,10 |
| PWA + wrapper nativo | 3 | 3 | 5 | 9 | 6 | 8 | 4,60 |

**Cálculo:** `score = Σ(nota_i × peso_i)`. Nativo + KMP vence pela combinação de segurança/compliance máximos com reaproveitamento de ~40% do código no módulo de domínio. Nativo puro perde por TTM insuficiente em 8 meses com time de 6 pessoas.

## Consequências

**Positivas:**
- Certificate pinning, criptografia AES-256 e integração ICP-Brasil sem adaptadores de terceiros, superfície de ataque auditável pela equipe de segurança e pelo CFM
- APIs de câmera/microfone nativas garantem latência de vídeo < 300 ms em mid-range sem profile contínuo de bridge
- SwiftUI / Jetpack Compose entregam acessibilidade (Dynamic Type, TalkBack, VoiceOver) sem workarounds - auditoria WCAG simplificada
- Módulo KMP (~40% do código total) evita duplicação de regras clínicas e permite testes unitários em JVM puro, sem emulador

**Negativas:**
- Duas UIs nativas aumentam custo de novas features visuais em ~30–40% vs. Flutter/RN; risco de divergência de fluxo clínico entre plataformas
- Prazo de 8 meses exige paralelismo estrito entre squads iOS e Android desde a sprint 1 - sem margem para dependências bloqueantes
- KMP estável, mas `ktor` e serialização evoluem rapidamente; upgrades podem exigir refatoração do módulo compartilhado
- Menor reaproveitamento de UI significa mais tempo de QA para garantir paridade de comportamento entre plataformas

**Mitigações:**
- Contrato de interface claro (interfaces Kotlin no módulo KMP) com 100% de cobertura unitária antes de qualquer UI implementar
- Design system documentado com tokens compartilhados (Figma → Compose/SwiftUI) para minimizar divergência visual
- Feature flags por plataforma controlados pelo módulo KMP para rollout gradual das integrações RNDS
- Freeze de dependências KMP 45 dias antes de cada entrega de piloto