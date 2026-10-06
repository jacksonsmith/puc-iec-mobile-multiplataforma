// src/screens/MovieList.tsx
//
// CAMADA SCREENS — UI pura. Consome queries + components.
// "Screen não deveria saber COMO buscar dados. Só renderiza estados da UI."
//
// HANDS-ON AULA 2 — Passo 5 (FlatList + usePopularMovies)
// ATIVIDADE 2 — usar MovieCard com favoritar

import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { usePopularMovies } from '@/queries/movies/get-popular-movies';
import { useCounterStore } from '@/store/counterStore';
import { isTokenError, isTokenMissing } from '@/services/api';
import TokenMissingScreen from '@/components/TokenMissingScreen';
import MovieCard from '@/components/MovieCard';

export default function MovieList() {
  const { data, isLoading, isFetching, error, refetch } = usePopularMovies();
  const count = useCounterStore((s) => s.count);
  const increment = useCounterStore((s) => s.increment);
  const decrement = useCounterStore((s) => s.decrement);
  const reset = useCounterStore((s) => s.reset);

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

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={data?.results ?? []}
      keyExtractor={(movie) => String(movie.id)}
      renderItem={({ item }) => <MovieCard movie={item} />}
      onRefresh={() => { void refetch(); }}
      refreshing={isFetching}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Filmes populares</Text>
          <View style={styles.counterRow}>
            <Text style={styles.counter}>Contador: {count}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Diminuir contador" onPress={decrement} style={styles.counterButton}>
              <Text>−</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Aumentar contador" onPress={increment} style={styles.counterButton}>
              <Text>+</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Zerar contador" onPress={reset} style={styles.resetButton}>
              <Text>Zerar</Text>
            </Pressable>
          </View>
          <Text style={styles.hint}>Toque no coração para salvar um filme. Puxe a lista para atualizar.</Text>
        </View>
      }
      ListEmptyComponent={<Text style={styles.empty}>Nenhum filme encontrado.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingBottom: 24 },
  header: { padding: 16, gap: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#172554' },
  counterRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  counter: { marginRight: 'auto', fontSize: 16, fontWeight: '600' },
  counterButton: { borderRadius: 8, backgroundColor: '#e2e8f0', paddingHorizontal: 12, paddingVertical: 8 },
  resetButton: { borderRadius: 8, backgroundColor: '#dbeafe', paddingHorizontal: 12, paddingVertical: 8 },
  hint: { color: '#475569', fontSize: 13 },
  empty: { padding: 24, textAlign: 'center', color: '#64748b' },
});
