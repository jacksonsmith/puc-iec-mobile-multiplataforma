// src/screens/MovieList.tsx
//
// CAMADA SCREENS — UI pura. Consome queries + components.
// "Screen não deveria saber COMO buscar dados. Só renderiza estados da UI."
//
// HANDS-ON AULA 2 — Passo 5 (FlatList + usePopularMovies)
// ATIVIDADE 2 — usar MovieCard com favoritar
// BONUS — paginação infinita (onEndReached + useInfiniteQuery)

import { useMemo } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { usePopularMovies } from '@/queries/movies/get-popular-movies';
import { useCounterStore } from '@/store/counterStore';
import { isTokenError, isTokenMissing } from '@/services/api';
import { flattenUniqueMovies } from '@/utils/movie-pages';
import TokenMissingScreen from '@/components/TokenMissingScreen';
import MovieCard from '@/components/MovieCard';

export default function MovieList() {
  const {
    data,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = usePopularMovies();
  const count = useCounterStore((s) => s.count);

  // data.pages = [página 1, página 2, ...]; a FlatList quer um array só.
  // useMemo: só recalcula quando chega página nova, não a cada render.
  const movies = useMemo(() => flattenUniqueMovies(data?.pages), [data]);

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

  // Tela de erro só quando não há nada pra mostrar. Se a página 7 falhar,
  // as 6 primeiras continuam na tela e o erro aparece no rodapé.
  if (error && !data) {
    return (
      <View style={styles.center}>
        <Text>Erro: {String(error)}</Text>
      </View>
    );
  }

  // onEndReached dispara várias vezes perto do fim; os guards evitam
  // pedir a mesma página duas vezes ou pedir depois da última.
  // Depois de um erro, não tenta sozinho: espera o toque em "tentar de novo".
  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
      fetchNextPage();
    }
  };

  const footer = isFetchingNextPage ? (
    <ActivityIndicator style={styles.footer} />
  ) : isFetchNextPageError ? (
    <Pressable onPress={() => fetchNextPage()} style={styles.footer}>
      <Text style={styles.retry}>Erro ao carregar mais filmes. Tocar para tentar de novo</Text>
    </Pressable>
  ) : !hasNextPage && movies.length > 0 ? (
    <Text style={[styles.footer, styles.end]}>Fim da lista</Text>
  ) : null;

  // FlatList é virtualizada: só monta os itens perto da área visível.
  // onEndReachedThreshold 0.5 = pede a próxima página quando falta meia tela
  // para o fim, então a página nova chega antes de o usuário bater no fundo.
  // refreshing usa isRefetching, não isLoading: isLoading só vale na 1ª carga
  // (já tratada no return acima), então o pull-to-refresh nunca mostraria o spinner.
  // Na query infinita, isRefetching já ignora o fetchNextPage: o spinner do topo
  // não pisca a cada página nova (quem mostra esse carregamento é o rodapé).
  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <MovieCard movie={item} />}
      ListHeaderComponent={<Text style={styles.header}>Counter: {count}</Text>}
      ListFooterComponent={footer}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      onRefresh={refetch}
      refreshing={isRefetching}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', padding: 16 },
  footer: { paddingVertical: 24, alignItems: 'center' },
  retry: { color: '#c0392b', textAlign: 'center' },
  end: { textAlign: 'center', color: '#888' },
});
