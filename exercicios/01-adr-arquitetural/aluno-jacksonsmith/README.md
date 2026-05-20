# Entrega Atividade 1 — Jackson Smith

> Entrega de **teste** do prof pra validar o autograder J.A.R.V.I.S.
> Caso: MVP streaming de podcast educacional, time 3 engs, janela 12 semanas.

## Arquivo principal

→ [`ADR-0001-stack-mobile-streaming-mvp.md`](./ADR-0001-stack-mobile-streaming-mvp.md)

## Contexto da decisão

Time pequeno (3 engs, 2 com background web/TS), MVP de 12 semanas, áudio em background. Escolhi RN com Expo managed por equilíbrio entre TTM, talent disponível e cobertura dos requisitos de áudio via `expo-av` / `react-native-track-player`. Documentei plano de migração pra bare workflow caso v2 exija nativo.
