# Atividade 2 — Feed de filmes, favoritos e animação

Aplicativo Expo/React Native concluído com feed da TMDB, navegação para detalhes, favoritos globais em Zustand persistidos em MMKV e botão de coração animado com Reanimated.

## Requisitos

- Node.js 22+
- Android Studio/emulador Android ou Xcode/simulador iOS
- Token de leitura da API da [TMDB](https://www.themoviedb.org/settings/api)

> MMKV é um módulo nativo JSI. O Expo Go padrão não inclui esse módulo: execute o app em um development build/emulador. No navegador e nos testes, o adaptador usa `localStorage` ou memória como fallback.

## Configurar e executar

1. Instale as dependências com `npm install`.
2. Copie `.env.example` para `.env` e preencha `EXPO_PUBLIC_TMDB_TOKEN` com seu API Read Access Token.
3. Gere/execute o app nativo com `npx expo run:android` (Windows/Linux) ou `npx expo run:ios` (macOS). Depois, inicie o Metro com `npx expo start --dev-client`.

Também é possível usar `npx expo start --web` para validar a interface no navegador; a persistência web usa `localStorage`, não MMKV.

## Testes e tipos

- `npm test` — 10 testes para counter, ações de favoritos e gravação no storage.
- `npm run typecheck` — verificação TypeScript.

O workflow do GitHub Actions executa ambos em cada push e pull request.

## Implementação

- `src/store/favoritesStore.ts`: ações `add`, `remove`, `toggle`, `clear` e seletor `isFavorite`; carrega IDs na inicialização e persiste cada atualização.
- `src/storage/mmkv.ts`: adaptador síncrono MMKV nativo com fallback web/testes.
- `src/components/HeartButton.tsx`: opção A (heart pop), usando `useSharedValue`, `useAnimatedStyle`, `withSequence`, `withTiming` e `withSpring`; a animação roda como worklet na UI thread.
- `src/components/MovieCard.tsx`: integra estado e botão animado ao feed; a tela de detalhes também permite favoritar.
- `src/store/counterStore.ts` e `__tests__/`: counter + 10 testes Jest verdes.

## Credenciais

Nunca versione o arquivo `.env`. A variável `EXPO_PUBLIC_TMDB_TOKEN` é embutida no bundle do cliente; use apenas um token de desenvolvimento apropriado e não trate essa variável como segredo de servidor.
