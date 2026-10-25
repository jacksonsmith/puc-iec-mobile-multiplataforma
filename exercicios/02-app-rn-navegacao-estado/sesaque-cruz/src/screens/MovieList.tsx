// src/screens/MovieList.tsx
//
// CAMADA SCREENS: UI pura. Consome queries + components.
// "Screen não deveria saber COMO buscar dados. Só renderiza estados da UI."
//
// HANDS-ON AULA 2: Passo 5 (FlatList + usePopularMovies)
// ATIVIDADE 2: usar MovieCard com favoritar

import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { flattenUniqueMovies, usePopularMovies } from '@/queries/movies/get-popular-movies';
import { isTokenError, isTokenMissing } from '@/services/api';
import TokenMissingScreen from '@/components/TokenMissingScreen';
import MovieCard from '@/components/MovieCard';
import StateView from '@/components/StateView';
import type { Movie } from '@/types/movie';
import { colors, spacing, typography } from '@/theme';

const renderItem = ({ item }: { item: Movie }) => <MovieCard movie={item} />;
const keyExtractor = (item: Movie) => String(item.id);

export default function MovieList() {
  const insets = useSafeAreaInsets();
  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = usePopularMovies();
  const movies = useMemo(() => flattenUniqueMovies(data?.pages), [data]);
  // Spinner só no pull-to-refresh manual, não nos refetch em background.
  const [refreshing, setRefreshing] = useState(false);

  const loadMore = useCallback(() => {
    // Sem nova tentativa automática após erro: o usuário toca em "Tentar novamente".
    if (hasNextPage && !isFetchingNextPage && !isFetchNextPageError) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // Tela amigável quando token TMDB não foi configurado ou está inválido.
  if (isTokenMissing || isTokenError(error)) {
    return <TokenMissingScreen />;
  }

  if (isLoading) return <StateView loading message="Carregando filmes populares…" />;

  // Erro numa página seguinte também marca a query como erro, mas mantém data:
  // nesse caso a lista continua visível e o rodapé oferece "Tentar novamente".
  if (error && !data) {
    return (
      <StateView
        icon="cloud-offline-outline"
        title="Não foi possível carregar os filmes"
        message="Verifique sua conexão e tente novamente."
        actionLabel="Tentar novamente"
        onAction={() => refetch()}
      />
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.content}
        data={movies}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Filmes em alta</Text>
            <Text style={styles.subtitle}>Os filmes mais populares da semana na TMDB</Text>
          </View>
        }
        ListEmptyComponent={<StateView icon="film-outline" title="Nenhum filme encontrado" />}
        ListFooterComponent={
          <PaginationFooter
            loading={isFetchingNextPage}
            failed={isFetchNextPageError}
            reachedEnd={!hasNextPage && movies.length > 0}
            onRetry={() => fetchNextPage()}
          />
        }
      />
    </View>
  );
}

type PaginationFooterProps = {
  loading: boolean;
  failed: boolean;
  reachedEnd: boolean;
  onRetry: () => void;
};

function PaginationFooter({ loading, failed, reachedEnd, onRetry }: PaginationFooterProps) {
  if (loading) return <ActivityIndicator style={styles.footer} color={colors.primary} />;

  if (failed) {
    return (
      <Pressable onPress={onRetry} accessibilityRole="button" style={styles.footer}>
        <Text style={styles.footerText}>
          Não foi possível carregar mais filmes. <Text style={styles.retry}>Tentar novamente</Text>
        </Text>
      </Pressable>
    );
  }

  if (reachedEnd) {
    return <Text style={[styles.footer, styles.footerText]}>Você chegou ao fim da lista.</Text>;
  }

  return null;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  list: { flex: 1 },
  content: { paddingBottom: spacing.xl },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    gap: 2,
  },
  title: typography.title,
  subtitle: typography.caption,
  footer: { padding: spacing.lg, alignItems: 'center' },
  footerText: { ...typography.caption, textAlign: 'center' },
  retry: { color: colors.primary, fontWeight: '700' },
});
