// src/screens/Favorites.tsx
//
// ATIVIDADE 2 — bônus: aba Favoritos (Bottom Tabs).
//
// O store guarda apenas ids (número), então buscamos os detalhes no cache /
// TMDB via useQueries. Favoritos já visitados aparecem instantaneamente
// graças ao prefetch do MovieCard.

import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useQueries } from '@tanstack/react-query';
import { useFavoritesStore } from '@/store/favoritesStore';
import {
  fetchMovieById,
  MOVIE_DETAIL_STALE_TIME,
} from '@/queries/movies/get-movie-by-id';
import MovieCard from '@/components/MovieCard';
import type { Movie } from '@/types/movie';

export default function Favorites() {
  const ids = useFavoritesStore((s) => s.ids);

  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['movie', id],
      queryFn: () => fetchMovieById(id),
      staleTime: MOVIE_DETAIL_STALE_TIME,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const movies = results
    .map((r) => r.data)
    .filter((movie): movie is Movie => Boolean(movie));

  if (ids.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>🤍</Text>
        <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
        <Text style={styles.emptyHint}>
          Toque no coração de um filme na aba Filmes.
        </Text>
      </View>
    );
  }

  if (isLoading && movies.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <MovieCard movie={item} />}
        ListFooterComponent={
          <Text style={styles.hint}>{movies.length} favorito(s)</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 8 },
  emptyIcon: { fontSize: 56 },
  emptyTitle: { fontSize: 18, fontWeight: '600' },
  emptyHint: { color: '#666', textAlign: 'center' },
  hint: { color: '#666', fontSize: 12, textAlign: 'center', paddingVertical: 16 },
});
