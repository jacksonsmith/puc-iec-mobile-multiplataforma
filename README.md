# Atividade 2 — App RN: Favoritos + MMKV + Reanimated

App React Native (Expo) com lista de filmes, favoritos persistidos entre reloads e animações rodando na UI thread.

## Funcionalidades
- Lista de filmes populares (`queries/movies/get-popular-movies.ts`)
- Favoritar/desfavoritar com `HeartButton` + `favoritesStore` (Zustand): `toggle`, `isFavorite`, `add`, `remove`, `clear`
- Persistência com MMKV (`storage/mmkv.ts`)
- Animações com Reanimated (`useSharedValue` + `useAnimatedStyle`)
- Telas: `MovieList`, `MovieDetail`
- Testes com Jest

## Como rodar
\`\`\`bash
npm install
npx expo start
\`\`\`

## Testes
\`\`\`bash
npm test
\`\`\`

## Demonstração
![Demo do app](./video-app-cinema.gif)

> Vídeo completo: [video-app-cinema.mp4](./video-app-cinema.mp4)

## Referência
- [Documentação do Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
