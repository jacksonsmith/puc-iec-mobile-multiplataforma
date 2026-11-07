// src/screens/Favorites.tsx
//
// ATIVIDADE 2 — bônus Bottom Tabs: aba "Favoritos" com a lista persistida.
//
// O store guarda só os ids (o que precisa sobreviver ao reload). Os dados de
// cada filme vêm do TanStack Query — e quase sempre já estão em cache pelo
// prefetch do MovieCard.

import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useQueries } from '@tanstack/react-query';
import { useFavoritesStore } from '@/store/favoritesStore';
import { movieByIdQueryOptions } from '@/queries/movies/get-movie-by-id';
import { isTokenMissing } from '@/services/api';
import TokenMissingScreen from '@/components/TokenMissingScreen';
import MovieCard from '@/components/MovieCard';
import type { Movie } from '@/types/movie';

export default function Favorites() {
  const ids = useFavoritesStore((s) => s.ids);
  const clear = useFavoritesStore((s) => s.clear);

  const queries = useQueries({ queries: ids.map((id) => movieByIdQueryOptions(id)) });

  if (isTokenMissing) return <TokenMissingScreen />;

  if (ids.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>🤍</Text>
        <Text style={styles.emptyText}>Nenhum favorito ainda.</Text>
        <Text style={styles.hint}>Toque no coração de um filme na aba Filmes.</Text>
      </View>
    );
  }

  const movies = queries.map((q) => q.data).filter((m): m is Movie => !!m);
  const loading = queries.some((q) => q.isLoading);

  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <MovieCard movie={item} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.count}>
            {ids.length} {ids.length === 1 ? 'favorito' : 'favoritos'}
          </Text>
          <Pressable onPress={clear} style={styles.clearButton}>
            <Text style={styles.clearText}>Limpar tudo</Text>
          </Pressable>
        </View>
      }
      ListFooterComponent={loading ? <ActivityIndicator style={styles.footer} /> : null}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, padding: 24 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 18, fontWeight: '600' },
  hint: { color: '#666', textAlign: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  count: { flex: 1, fontSize: 16, fontWeight: '600' },
  clearButton: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#fde8e8', borderRadius: 6 },
  clearText: { color: '#b42318', fontWeight: '500' },
  footer: { padding: 16 },
});
