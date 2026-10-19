// src/screens/Favorites.tsx
//
// BÔNUS — aba Favoritos: lista persistida (ids vêm do store + MMKV).
// O store guarda só os ids; os dados de cada filme vêm do cache do TanStack Query
// (mesmas queryKeys do detalhe, então quase sempre já estão em cache).

import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useQueries } from '@tanstack/react-query';
import { useFavoritesStore } from '@/store/favoritesStore';
import { movieQueryOptions } from '@/queries/movies/get-movie-by-id';
import { isTokenError } from '@/services/api';
import MovieCard from '@/components/MovieCard';
import TokenMissingScreen from '@/components/TokenMissingScreen';
import type { Movie } from '@/types/movie';

export default function Favorites() {
  const ids = useFavoritesStore((s) => s.ids);
  const results = useQueries({ queries: ids.map((id) => movieQueryOptions(id)) });

  if (results.some((r) => isTokenError(r.error))) {
    return <TokenMissingScreen />;
  }

  const movies = results.map((r) => r.data).filter((m): m is Movie => !!m);
  const loading = results.some((r) => r.isLoading);

  if (ids.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>🤍</Text>
        <Text style={styles.emptyText}>Nenhum favorito ainda.</Text>
        <Text style={styles.hint}>Toque no coração (ou arraste o card pra direita).</Text>
      </View>
    );
  }

  if (loading && movies.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <MovieCard movie={item} />}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, padding: 24 },
  emptyIcon: { fontSize: 40 },
  emptyText: { fontSize: 16, fontWeight: '600' },
  hint: { color: '#666', fontSize: 12, textAlign: 'center' },
});
