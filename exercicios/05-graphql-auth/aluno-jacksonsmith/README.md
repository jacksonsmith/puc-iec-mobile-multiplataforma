# Atividade 5 — Aluno: jacksonsmith (teste)

App RN com Apollo + OIDC/PKCE + Keychain.

## OWASP Mobile Top 10 — 3 itens mitigados

- **M3 Insecure Authentication**: OAuth 2.1 + OIDC + PKCE (RFC 7636) via react-native-app-auth
- **M5 Insecure Communication**: SSL pinning configurado (config externo)
- **M9 Insecure Data Storage**: tokens em Keychain (iOS) / Keystore (Android) via react-native-keychain — não AsyncStorage

## Como rodar

```bash
yarn install
cd ios && pod install && cd ..
yarn ios
```
