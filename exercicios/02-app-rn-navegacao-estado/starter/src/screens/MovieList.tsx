// src/screens/MovieList.tsx
//
// CAMADA SCREENS — UI pura. Consome queries + components.
// "Screen não deveria saber COMO buscar dados. Só renderiza estados da UI."
//
// HANDS-ON AULA 2 — Passo 5 (FlatList + usePopularMovies)
// ATIVIDADE 2 — usar MovieCard com favoritar

import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useInfinitePopularMovies } from '@/queries/movies/get-popular-movies';
import { useCounterStore } from '@/store/counterStore';
import { isTokenError, isTokenMissing } from '@/services/api';
import TokenMissingScreen from '@/components/TokenMissingScreen';
// TODO [TASK 3]: descomentar quando renderizar MovieCard
// import MovieCard from '@/components/MovieCard';
import MovieCard from '@/components/MovieCard';

export default function MovieList() {
  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePopularMovies();
  const count = useCounterStore((s) => s.count);

  // Tela amigável quando token TMDB não foi configurado ou está inválido.
  if (isTokenMissing || isTokenError(error)) {
    return <TokenMissingScreen />;
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Erro: {String(error)}</Text>
      </View>
    );
  }

  // TODO [TASK 3]: substituir o stub abaixo por FlatList
  //
  //   <FlatList
  //     data={data?.results ?? []}
  //     keyExtractor={(item) => String(item.id)}
  //     renderItem={({ item }) => <MovieCard movie={item} />}
  //     onRefresh={refetch}
  //     refreshing={isLoading}
  //   />


  // TASK 10: junta os results de todas as páginas carregadas.
  // O ranking "popular" muda entre requisições, então um filme pode aparecer
  // em duas páginas — removemos duplicados pra não repetir keys na FlatList.
  const seen = new Set<number>();
  const movies = (data?.pages ?? [])
    .flatMap((page) => page.results)
    .filter((movie) => !seen.has(movie.id) && seen.add(movie.id));

  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <MovieCard movie={item} />}
      onRefresh={refetch}
      refreshing={isRefetching && !isFetchingNextPage}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? <ActivityIndicator style={styles.footer} /> : null
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  hint: { color: '#666', fontSize: 12 },
  footer: { paddingVertical: 16 },
});
