# Atividade 2 — Feed de filmes com favoritos

## Identificação

- **Aluno:** Guilherme Nunes
- **Reanimated:** opção A — Heart pop
- **Bônus:** Bottom Tabs com aba Favoritos; `staleTime` e prefetch do detalhe
- **Fork:** https://github.com/Guilhermennf/puc-iec-mobile-multiplataforma

## Como rodar

1. Instale Node.js 20+ e configure o Android Studio com um emulador Android.
2. Na pasta deste projeto, crie seu `.env` a partir de `.env.example` e informe `EXPO_PUBLIC_TMDB_TOKEN` com um token de leitura do TMDB.

```bash
npm ci
npx expo run:android
# Nos próximos inícios, após instalar o development build:
npx expo start --dev-client
```

`expo run:android` compila e instala um development build que inclui o MMKV nativo. Depois, `expo start --dev-client` inicia o Metro para esse build. **Expo Go não contém o módulo nativo MMKV.** No iOS, use um Mac com Xcode e execute `npx expo run:ios` antes de iniciar o Metro.

Para executar os testes:

```bash
npm test -- --runInBand
```

## O que o app faz

O feed consulta filmes populares da TMDB com TanStack Query. É possível abrir os detalhes e favoritar ou desfavoritar filmes pelo botão de coração animado. Os IDs dos favoritos ficam persistidos em MMKV no app nativo; a versão web usa `localStorage`. A aba Favoritos consulta os detalhes dos IDs persistidos.

## Arquitetura

```text
src/
├── components/       # MovieCard e HeartButton com Reanimated
├── queries/movies/   # TanStack Query e chamadas de filmes
├── routes/           # Bottom Tabs dentro do Native Stack
├── screens/          # Lista, favoritos e detalhe
├── services/         # Cliente HTTP TMDB
├── storage/          # Adapter MMKV/localStorage
└── store/             # Zustand: contador e favoritos
__tests__/             # Testes dos stores
```

## Decisões técnicas

- Filmes e detalhes são estado do servidor e ficam no TanStack Query; IDs favoritos e contador são estado local no Zustand.
- MMKV persiste os IDs no app nativo. O adapter usa `localStorage` apenas no alvo web; o app nativo precisa de development build.
- `HeartButton` anima escala e rotação com `useSharedValue`, `useAnimatedStyle`, `withSequence`, `withTiming` e `withSpring`.
- A lista inicia o prefetch do detalhe antes da navegação; a query mantém os dados frescos por cinco minutos.
- A seleção visual observa diretamente `ids.includes(id)` para atualizar quando os favoritos mudam.

## Referências

- [Expo — React Native Reanimated no SDK 54](https://docs.expo.dev/versions/v54.0.0/sdk/reanimated/)
- [Expo — Development builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [React Native MMKV](https://github.com/mrousavy/react-native-mmkv)
- [Zustand](https://github.com/pmndrs/zustand)
- [TanStack Query](https://tanstack.com/query/latest)
