// src/screens/MovieList.tsx
//
// CAMADA SCREENS — UI pura. Consome queries + components.
// "Screen não deveria saber COMO buscar dados. Só renderiza estados da UI."
//
// HANDS-ON AULA 2 — Passo 5 (FlatList + usePopularMovies)
// ATIVIDADE 2 — usar MovieCard com favoritar

import MovieCard from '@/components/MovieCard';
import TokenMissingScreen from '@/components/TokenMissingScreen';
import { usePopularMovies } from '@/queries/movies/get-popular-movies';
import { isTokenError, isTokenMissing } from '@/services/api';
import { useCounterStore } from '@/store/counterStore';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

export default function MovieList() {
  const { data, isLoading, error, refetch } = usePopularMovies();
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

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={data?.results ?? []}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <MovieCard movie={item} />}
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>Counter: {count}</Text>
          <Text style={styles.hint}>{data?.results?.length ?? 0} filmes carregados</Text>
        </View>
      }
      onRefresh={refetch}
      refreshing={isLoading}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  hint: { color: '#666', fontSize: 12 },
});
