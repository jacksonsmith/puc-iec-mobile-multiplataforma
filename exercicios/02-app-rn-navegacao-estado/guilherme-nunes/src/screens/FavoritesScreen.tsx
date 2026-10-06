import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import MovieCard from '@/components/MovieCard';
import { isTokenError, isTokenMissing } from '@/services/api';
import { useFavoriteMovies } from '@/queries/movies/get-movie-by-id';
import { useFavoritesStore } from '@/store/favoritesStore';
import TokenMissingScreen from '@/components/TokenMissingScreen';

export default function FavoritesScreen() {
  const ids = useFavoritesStore((state) => state.ids);
  const movieQueries = useFavoriteMovies(ids);
  const isLoading = movieQueries.some((query) => query.isLoading);
  const isFetching = movieQueries.some((query) => query.isFetching);
  const error = movieQueries.find((query) => query.error)?.error;
  const favorites = movieQueries.flatMap((query) => (query.data ? [query.data] : []));

  if (isTokenMissing || isTokenError(error)) return <TokenMissingScreen />;
  if (isLoading) return <ActivityIndicator style={styles.center} size="large" />;
  if (error) {
    return (
      <View style={styles.center}>
        <Text>Não foi possível carregar os filmes.</Text>
      </View>
    );
  }

  const refresh = () => movieQueries.forEach((query) => void query.refetch());

  return (
    <FlatList
      contentContainerStyle={favorites.length === 0 ? styles.emptyList : undefined}
      data={favorites}
      keyExtractor={(movie) => String(movie.id)}
      renderItem={({ item }) => <MovieCard movie={item} />}
      onRefresh={refresh}
      refreshing={isFetching}
      ListEmptyComponent={
        <Text style={styles.emptyText}>
          {ids.length === 0
            ? 'Seus filmes favoritos aparecerão aqui.'
            : 'Não foi possível carregar os detalhes dos filmes favoritos.'}
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyList: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyText: { color: '#475569', textAlign: 'center', lineHeight: 21 },
});
