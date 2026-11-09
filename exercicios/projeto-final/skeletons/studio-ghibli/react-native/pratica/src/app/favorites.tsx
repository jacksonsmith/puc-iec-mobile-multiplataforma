import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FilmGrid } from '@/components/film-grid';
import { ForestBackground } from '@/components/forest-background';
import { IconButton } from '@/components/icon-button';
import { EmptyState } from '@/components/states/empty-state';
import { ErrorState } from '@/components/states/error-state';
import { LoadingState } from '@/components/states/loading-state';
import { Text } from '@/components/text';
import { isFavorite } from '@/domain/favorites';
import { formatFilmCount } from '@/domain/format';
import { getFavoriteFilms } from '@/domain/rails';
import { useFavoritesStore } from '@/state/favorites-store';
import { useFilms } from '@/state/use-films';

export default function FavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const { data: films, fetchStatus, isError, refetch } = useFilms();
  const favoriteFilms = useMemo(
    () => getFavoriteFilms(films ?? [], favoriteIds),
    [films, favoriteIds],
  );

  function closeScreen() {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  function renderContent() {
    if (!films) {
      return isError || fetchStatus === 'paused' ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <LoadingState />
      );
    }

    if (favoriteFilms.length === 0) {
      return (
        <View className="px-4">
          <EmptyState
            testID="state-favorites-empty"
            icon={{ ios: 'star', android: 'star', web: 'star' }}
            iconColor="lamp"
            title="Nenhum favorito ainda"
            message="Toque na ★ de um filme para guardá-lo aqui."
          />
        </View>
      );
    }

    return (
      <FilmGrid
        testID="favorites-grid"
        title="Todos os favoritos"
        countLabel={formatFilmCount(favoriteFilms.length)}
        films={favoriteFilms}
        getCardTestID={(filmId) => `favorite-item-${filmId}`}
        isFavorite={(filmId) => isFavorite(favoriteIds, filmId)}
        onPressFilm={(filmId) => router.push({ pathname: '/film/[id]', params: { id: filmId } })}
      />
    );
  }

  return (
    <View className="flex-1 bg-canvas">
      <ForestBackground />
      <ScrollView
        testID="favorites-screen"
        className="flex-1"
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }}>
        <View className="mb-4 flex-row items-center gap-3 px-4">
          <IconButton
            testID="favorites-back-button"
            accessibilityLabel="Voltar"
            icon={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
            onPress={closeScreen}
          />
          <Text variant="title-lg" accessibilityRole="header">
            Seus favoritos
          </Text>
        </View>
        {renderContent()}
      </ScrollView>
    </View>
  );
}
