// src/screens/MovieList.tsx
//
// CAMADA SCREENS — UI pura. Consome queries + components.
// "Screen não deveria saber COMO buscar dados. Só renderiza estados da UI."
//
// HANDS-ON AULA 2 — Passo 5 (FlatList + usePopularMovies)
// ATIVIDADE 2 — usar MovieCard com favoritar

import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { usePopularMovies } from '@/queries/movies/get-popular-movies';
import { isTokenError, isTokenMissing } from '@/services/api';
import TokenMissingScreen from '@/components/TokenMissingScreen';
import MovieCard from '@/components/MovieCard';
import { useFavoritesStore } from '@/store/favoritesStore';
import { MoviesResponse } from '@/types/movie';
import { useMemo } from 'react';

export default function MovieList() {
  const { data, isLoading, error, refetch } = usePopularMovies();
  const favoriteMoviesIds = useFavoritesStore((s) => s.ids);

  const favoriteMoviesData: MoviesResponse = useMemo(() => {
    if (!data) return { page: 1, results: [], total_pages: 0, total_results: 0 };

    const favoriteResults = data.results.filter((movie) => favoriteMoviesIds.includes(movie.id));

    return {
      ...data,
      results: favoriteResults,
    };
  }, [data, favoriteMoviesIds]);

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
    <View style={styles.container}>
      <FlatList
        data={favoriteMoviesData?.results ?? []}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <MovieCard movie={item} />}
        onRefresh={refetch}
        refreshing={isLoading}
      />
      <Text style={styles.hint}>{favoriteMoviesData?.results?.length ?? 0} filmes carregados</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  hint: { color: '#666', fontSize: 12 },
});
