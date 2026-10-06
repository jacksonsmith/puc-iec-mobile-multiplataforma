// src/screens/MovieList.tsx
//
// CAMADA SCREENS — UI pura. Consome queries + components.
// "Screen não deveria saber COMO buscar dados. Só renderiza estados da UI."
//
// HANDS-ON AULA 2 — Passo 5 (FlatList + usePopularMovies)
// ATIVIDADE 2 — usar MovieCard com favoritar

import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { usePopularMovies } from "@/queries/movies/get-popular-movies";
import { useFavoritesStore } from "@/store/favoritesStore";
import { isTokenError, isTokenMissing } from "@/services/api";
import TokenMissingScreen from "@/components/TokenMissingScreen";
import MovieCard from "@/components/MovieCard";

type Props = {
  favoritesOnly?: boolean;
};

export default function MovieList({ favoritesOnly = false }: Props) {
  const { data, isLoading, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = usePopularMovies();
  const favoriteIds = useFavoritesStore((state) => state.ids);
  const movies = data?.pages.flatMap((page) => page.results) ?? [];
  const visibleMovies = favoritesOnly ? movies.filter((movie) => favoriteIds.includes(movie.id)) : movies;

  // Tela amigável quando token TMDB não foi configurado ou está inválido.
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
    <FlatList
      data={visibleMovies}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <MovieCard movie={item} />}
      ListEmptyComponent={favoritesOnly ? <Text style={styles.empty}>Nenhum filme favorito.</Text> : null}
      onRefresh={refetch}
      refreshing={isLoading}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
  hint: { color: "#666", fontSize: 12 },
  empty: { padding: 24, textAlign: "center", color: "#666" },
});
