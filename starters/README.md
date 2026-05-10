# Starters — Arquitetura Mobile Multiplataforma

Templates iniciais para cada aula. Use como base e fork-and-edit.

## Como usar

```bash
# Para Aula 1 (setup inicial RN com Clean Architecture)
npx create-expo-app@latest meu-app --template blank-typescript
cd meu-app
# adapte pra Clean Architecture conforme aula

# Para Atividade 1 (ADR Arquitetural)
# Use template em ../exercicios/adr-template.md
```

## Recursos por aula

| Aula | Tema | Setup recomendado |
|------|------|-------------------|
| 1 | Fundamentos + RN | `npx create-expo-app --template blank-typescript` |
| 2 | RN deep + RTK | base aula 1 + `@reduxjs/toolkit` + `@react-navigation/native` |
| 3 | Native bridging | base aula 2 + ejected (`expo prebuild`) |
| 4 | PWA | `npm create vite@latest -- --template react-ts` + Workbox |
| 5 | GraphQL + Auth | base aula 2 + `@apollo/client` + `react-native-app-auth` |
| 6 | IA on-device | base + `react-native-fast-tflite` ou MLC-LLM |

## Recursos compartilhados

- [`../exercicios/adr-template.md`](../exercicios/adr-template.md) — Template ADR (Atividade 1)
- [`../BIBLIOGRAFIA.md`](../BIBLIOGRAFIA.md) — bibliografia completa

> Starters individuais por aula serão publicados conforme aulas avançam.
