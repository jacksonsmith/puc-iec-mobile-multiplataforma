// src/screens/FavoritesScreen.tsx
//
// CAMADA SCREENS — lista de filmes favoritados.
// Filtra os resultados de usePopularMovies pelos IDs em useFavoritesStore.

import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFavoritesStore } from '@/store/favoritesStore';
import { usePopularMovies } from '@/queries/movies/get-popular-movies';
import MovieCard from '@/components/MovieCard';

export default function FavoritesScreen() {
  const ids = useFavoritesStore((s) => s.ids);
  const { data } = usePopularMovies();

  const favorites = (data?.results ?? []).filter((m) => ids.includes(m.id));

  if (ids.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>Nenhum favorito ainda.</Text>
        <Text style={styles.hint}>Toque no ❤️ em qualquer filme para favoritar.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <MovieCard movie={item} />}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.empty}>Favoritos não encontrados na lista atual.</Text>
        </View>
      }
      contentContainerStyle={favorites.length === 0 ? styles.fill : undefined}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 8 },
  fill: { flex: 1 },
  empty: { fontSize: 16, fontWeight: '600', color: '#333' },
  hint: { fontSize: 13, color: '#888', textAlign: 'center' },
});
