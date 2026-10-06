import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { usePopularMovies } from '@/queries/movies/get-popular-movies';
import { isTokenError, isTokenMissing } from '@/services/api';
import TokenMissingScreen from '@/components/TokenMissingScreen';
import ErrorState from '@/components/ErrorState';
import MovieCard from '@/components/MovieCard';

export default function MovieList() {
  const { data, isLoading, isRefetching, error, refetch } = usePopularMovies();

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
    return <ErrorState onRetry={refetch} />;
  }

  return (
    <FlatList
      data={data?.results ?? []}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <MovieCard movie={item} />}
      onRefresh={refetch}
      refreshing={isRefetching}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
