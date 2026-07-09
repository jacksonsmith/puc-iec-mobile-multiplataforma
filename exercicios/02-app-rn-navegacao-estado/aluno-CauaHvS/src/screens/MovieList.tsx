import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { usePopularMovies } from '@/queries/movies/get-popular-movies';
import { useCounterStore } from '@/store/counterStore';
import { isTokenError, isTokenMissing } from '@/services/api';
import TokenMissingScreen from '@/components/TokenMissingScreen';
import MovieCard from '@/components/MovieCard';

export default function MovieList() {
  const { data, isLoading, error, refetch } = usePopularMovies();
  const count = useCounterStore((s) => s.count);
  const increment = useCounterStore((s) => s.increment);
  const decrement = useCounterStore((s) => s.decrement);
  const reset = useCounterStore((s) => s.reset);

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
      <View style={styles.counter}>
        <Text style={styles.title}>Counter: {count}</Text>
        <View style={styles.buttons}>
          <Button title="−" onPress={decrement} />
          <Button title="Reset" onPress={reset} />
          <Button title="+" onPress={increment} />
        </View>
      </View>
      <FlatList
        data={data?.results ?? []}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <MovieCard movie={item} />}
        onRefresh={refetch}
        refreshing={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 16, gap: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  counter: { paddingHorizontal: 16, gap: 8 },
  title: { fontSize: 24, fontWeight: 'bold' },
  buttons: { flexDirection: 'row', gap: 8 },
});