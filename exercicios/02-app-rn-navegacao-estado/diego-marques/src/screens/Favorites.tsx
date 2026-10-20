import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useMoviesByIds } from '@/queries/movies/get-movie-by-id';
import { isTokenError, isTokenMissing } from '@/services/api';
import MovieCard from '@/components/MovieCard';
import TokenMissingScreen from '@/components/TokenMissingScreen';
import type { Movie } from '@/types/movie';

export default function Favorites() {
  const ids = useFavoritesStore((s) => s.ids);
  const clear = useFavoritesStore((s) => s.clear);
  const results = useMoviesByIds(ids);

  if (isTokenMissing || results.some((r) => isTokenError(r.error))) {
    return <TokenMissingScreen />;
  }

  if (ids.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="heart-outline" size={48} color="#888" />
        <Text style={styles.empty}>Nenhum favorito ainda.</Text>
        <Text style={styles.hint}>Toque no coração de um filme na aba Filmes.</Text>
      </View>
    );
  }

  const movies = results.map((r) => r.data).filter((m): m is Movie => !!m);
  const loading = results.some((r) => r.isLoading);

  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <MovieCard movie={item} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.hint}>
            {ids.length} favorito{ids.length > 1 ? 's' : ''}
          </Text>
          <Pressable onPress={clear} hitSlop={8}>
            <Text style={styles.clear}>Limpar</Text>
          </Pressable>
        </View>
      }
      ListFooterComponent={loading ? <ActivityIndicator style={styles.footer} /> : null}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, padding: 24 },
  empty: { fontSize: 18, fontWeight: '600' },
  hint: { color: '#666', fontSize: 12, textAlign: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  clear: { color: '#cc0000', fontWeight: '600' },
  footer: { padding: 16 },
});
