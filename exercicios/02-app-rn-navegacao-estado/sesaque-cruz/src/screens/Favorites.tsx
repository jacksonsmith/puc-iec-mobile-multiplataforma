// src/screens/Favorites.tsx
//
// BÔNUS ATIVIDADE 2: aba Favoritos (Bottom Tabs) com a lista persistida no MMKV.
// O store só guarda ids; os dados de cada filme vêm do cache do TanStack Query.

import { useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useQueries } from '@tanstack/react-query';
import { movieByIdQuery } from '@/queries/movies/get-movie-by-id';
import { useFavoritesStore } from '@/store/favoritesStore';
import { isTokenError } from '@/services/api';
import MovieCard from '@/components/MovieCard';
import StateView from '@/components/StateView';
import TokenMissingScreen from '@/components/TokenMissingScreen';
import type { HomeTabsParamList } from '@/routes/HomeTabs';
import type { Movie, MovieDetails } from '@/types/movie';
import { colors, spacing, typography } from '@/theme';

const renderItem = ({ item }: { item: Movie }) => <MovieCard movie={item} />;
const keyExtractor = (item: Movie) => String(item.id);

// Alert.alert não faz nada no react-native-web, então no web usa window.confirm.
const confirmClear = (onConfirm: () => void) => {
  const title = 'Limpar favoritos?';
  const message = 'Todos os filmes salvos serão removidos.';
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Limpar', style: 'destructive', onPress: onConfirm },
  ]);
};

export default function Favorites() {
  const navigation = useNavigation<BottomTabNavigationProp<HomeTabsParamList>>();
  const insets = useSafeAreaInsets();
  const ids = useFavoritesStore((s) => s.ids);
  const clear = useFavoritesStore((s) => s.clear);
  // Mais recentes primeiro.
  const orderedIds = useMemo(() => [...ids].reverse(), [ids]);
  const results = useQueries({ queries: orderedIds.map((id) => movieByIdQuery(id)) });

  if (results.some((r) => isTokenError(r.error))) return <TokenMissingScreen />;

  if (ids.length === 0) {
    return (
      <StateView
        icon="heart-outline"
        title="Nenhum favorito ainda"
        message="Toque no coração de um filme para guardá-lo aqui. Seus favoritos ficam salvos no aparelho."
        actionLabel="Explorar filmes"
        onAction={() => navigation.navigate('Home')}
      />
    );
  }

  const movies = results.map((r) => r.data).filter((m): m is MovieDetails => m !== undefined);
  const isLoading = results.some((r) => r.isLoading);
  const failed = results.filter((r) => r.isError);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.content}
        data={movies}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>Meus favoritos</Text>
              <Text style={styles.subtitle}>
                {ids.length} {ids.length === 1 ? 'filme salvo' : 'filmes salvos'}
              </Text>
            </View>
            <Pressable
              onPress={() => confirmClear(clear)}
              hitSlop={8}
              accessibilityRole="button"
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Text style={styles.clear}>Limpar</Text>
            </Pressable>
          </View>
        }
        ListFooterComponent={
          <>
            {isLoading && <ActivityIndicator style={styles.footer} color={colors.primary} />}
            {failed.length > 0 && (
              <Pressable
                onPress={() => failed.forEach((r) => r.refetch())}
                accessibilityRole="button"
                style={styles.footer}
              >
                <Text style={styles.error}>
                  {failed.length === 1
                    ? '1 filme não carregou.'
                    : `${failed.length} filmes não carregaram.`}{' '}
                  <Text style={styles.retry}>Tentar novamente</Text>
                </Text>
              </Pressable>
            )}
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  list: { flex: 1 },
  content: { paddingBottom: spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerText: { gap: 2 },
  title: typography.title,
  subtitle: typography.caption,
  clear: { color: colors.primary, fontWeight: '700', fontSize: 15 },
  pressed: { opacity: 0.6 },
  footer: { padding: spacing.lg, alignItems: 'center' },
  error: { ...typography.caption, textAlign: 'center' },
  retry: { color: colors.primary, fontWeight: '700' },
});
