// src/screens/FavoritesScreen.tsx
//
// BÔNUS — aba Favoritos: lista persistida (ids vêm do store + MMKV).
// Screen só consome dados: ids do Zustand, detalhes do TanStack Query.

import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useMoviesByIds } from '@/queries/movies/get-movies-by-ids';
import { isTokenError, isTokenMissing } from '@/services/api';
import TokenMissingScreen from '@/components/TokenMissingScreen';
import MovieCard from '@/components/MovieCard';

export default function FavoritesScreen() {
  const ids = useFavoritesStore((s) => s.ids);
  const { movies, isLoading, error } = useMoviesByIds(ids);

  if (isTokenMissing || isTokenError(error)) {
    return <TokenMissingScreen />;
  }

  if (ids.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>🤍</Text>
        <Text style={styles.emptyText}>Nenhum favorito ainda.</Text>
        <Text style={styles.hint}>Toque no coração de um filme para salvá-lo aqui.</Text>
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
    <FlatList
      data={movies}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <MovieCard movie={item} />}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, padding: 24 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 18, fontWeight: '600' },
  hint: { color: '#666', fontSize: 13, textAlign: 'center' },
});
