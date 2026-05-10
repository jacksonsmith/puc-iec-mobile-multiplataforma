# Atividade 5 — Integração GraphQL + Auth (10 pts)

> **Aula:** 5 (24/06/2026) | **Prazo:** 30/06/2026 | **Auto-grade:** ✅

## Objetivo

App RN com Apollo Client (cache normalizado), OAuth/PKCE (react-native-app-auth), secure storage (Keychain/Keystore) e mitigação OWASP Mobile Top 10.

## Estrutura esperada

```
exercicios/05-graphql-auth/aluno-<github-username>/
├── package.json                # @apollo/client + react-native-app-auth + react-native-keychain
├── src/
│   ├── apollo.ts (ou similar)
│   ├── auth.ts
│   └── *.ts
└── README.md                    # OWASP Mobile Top 10 — 3 itens mitigados
```

## Critérios (10 pts)

| # | Critério | Peso |
|---|----------|------|
| 1 | Apollo Client (InMemoryCache + Provider) | 3 |
| 2 | Queries/Mutations GraphQL | 2 |
| 3 | OIDC + PKCE | 2 |
| 4 | Secure storage (Keychain/Keystore) | 2 |
| 5 | README cobrindo OWASP Mobile Top 10 | 1 |

## Vídeo

Login OIDC + queries GraphQL + SSL pinning testado contra mitmproxy.
