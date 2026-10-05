import { useQueries } from '@tanstack/react-query';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import MovieCard from '@/components/MovieCard';
import TokenMissingScreen from '@/components/TokenMissingScreen';
import { fetchMovieById } from '@/queries/movies/get-movie-by-id';
import { isTokenError, isTokenMissing } from '@/services/api';
import { useFavoritesStore } from '@/store/favoritesStore';

export default function FavoritesList() {
  const ids = useFavoritesStore((state) => state.ids);
  const queries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['movie', id],
      queryFn: () => fetchMovieById(id),
      staleTime: 1000 * 60 * 5,
    })),
  });

  const movies = queries.flatMap((query) => (query.data ? [query.data] : []));
  const error = queries.find((query) => query.error)?.error;
  const isLoading = queries.some((query) => query.isPending);

  if (isTokenMissing || isTokenError(error)) {
    return <TokenMissingScreen />;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Erro ao carregar favoritos: {String(error)}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={movies}
      keyExtractor={(movie) => String(movie.id)}
      renderItem={({ item }) => <MovieCard movie={item} />}
      ListEmptyComponent={
        isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Text style={styles.empty}>Nenhum filme favorito ainda.</Text>
        )
      }
      contentContainerStyle={movies.length === 0 ? styles.emptyContainer : undefined}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { color: '#666', fontSize: 16 },
});