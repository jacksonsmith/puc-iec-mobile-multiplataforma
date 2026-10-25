// src/screens/MovieList.tsx
//
// CAMADA SCREENS — UI pura. Consome queries + components.
// "Screen não deveria saber COMO buscar dados. Só renderiza estados da UI."
//
// HANDS-ON AULA 2 — Passo 5 (FlatList + usePopularMovies)
// ATIVIDADE 2 — usar MovieCard com favoritar + paginação infinita (bônus)

import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useInfinitePopularMovies } from '@/queries/movies/get-popular-movies';
import { useCounterStore } from '@/store/counterStore';
import { isTokenError, isTokenMissing } from '@/services/api';
import TokenMissingScreen from '@/components/TokenMissingScreen';
import MovieCard from '@/components/MovieCard';

function CounterHeader() {
  const count = useCounterStore((s) => s.count);
  const increment = useCounterStore((s) => s.increment);
  const decrement = useCounterStore((s) => s.decrement);
  const reset = useCounterStore((s) => s.reset);

  return (
    <View style={styles.counter}>
      <Text style={styles.counterText}>Counter: {count}</Text>
      <Pressable onPress={decrement} style={styles.counterButton}>
        <Text>−</Text>
      </Pressable>
      <Pressable onPress={increment} style={styles.counterButton}>
        <Text>+</Text>
      </Pressable>
      <Pressable onPress={reset} style={styles.counterButton}>
        <Text>reset</Text>
      </Pressable>
    </View>
  );
}

export default function MovieList() {
  const { data, isLoading, error, refetch, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfinitePopularMovies();

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

  // TMDB às vezes repete um filme entre páginas — dedupe pelo id pra não duplicar keys.
  const seen = new Set<number>();
  const movies = (data?.pages ?? [])
    .flatMap((p) => p.results)
    .filter((m) => (seen.has(m.id) ? false : (seen.add(m.id), true)));

  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <MovieCard movie={item} />}
      ListHeaderComponent={CounterHeader}
      onRefresh={refetch}
      refreshing={isRefetching && !isFetchingNextPage}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingNextPage ? <ActivityIndicator style={styles.footer} /> : null}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  counter: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 },
  counterText: { flex: 1, fontSize: 16, fontWeight: '600' },
  counterButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  footer: { padding: 16 },
});
