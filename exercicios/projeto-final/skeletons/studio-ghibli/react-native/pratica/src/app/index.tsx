import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FilmRail } from '@/components/film-rail';
import { HomeHeaderActions } from '@/components/home-header-actions';
import { KodamaMark } from '@/components/kodama-mark';
import { EmptyState } from '@/components/states/empty-state';
import { ErrorState } from '@/components/states/error-state';
import { LoadingState } from '@/components/states/loading-state';
import { Text } from '@/components/text';
import { useBrandTokens } from '@/components/use-brand-tokens';
import { formatFilmCount } from '@/domain/format';
import { buildRails } from '@/domain/rails';
import { useFilms } from '@/state/use-films';

const FAVORITES_SLUG = 'favorites';
const GLOW_HEIGHT = 560;
// A Spec 005 troca esta lista pelos favoritos salvos no aparelho.
const FAVORITE_IDS: string[] = [];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tokens = useBrandTokens();
  const { data: films, fetchStatus, isError, isRefetching, refetch } = useFilms();
  const rails = useMemo(() => buildRails(films ?? [], FAVORITE_IDS), [films]);

  const glowImage = `radial-gradient(ellipse 120% 70% at 20% 0%, ${tokens.color('glow-sky')}, transparent 60%), radial-gradient(ellipse 80% 50% at 90% 40%, ${tokens.color('glow-lamp')}, transparent 70%)`;

  function renderContent() {
    if (!films) {
      return isError || fetchStatus === 'paused' ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <LoadingState />
      );
    }

    return (
      <View className="gap-8">
        {rails.map((rail) => {
          const isFavoritesRail = rail.slug === FAVORITES_SLUG;

          return (
            <FilmRail
              key={rail.slug}
              slug={rail.slug}
              title={rail.title}
              films={rail.films}
              variant={isFavoritesRail ? 'favorites' : undefined}
              countLabel={
                isFavoritesRail ? `★ ${rail.films.length}` : formatFilmCount(rail.films.length)
              }
              isFavorite={(filmId) => FAVORITE_IDS.includes(filmId)}
              onPressFilm={(filmId) =>
                router.push({ pathname: '/film/[id]', params: { id: filmId } })
              }
              emptyState={
                <EmptyState
                  testID="state-favorites-empty"
                  icon={{ ios: 'star', android: 'star', web: 'star' }}
                  iconColor="lamp"
                  title="Nenhum favorito ainda"
                  message="Toque na ★ de um filme para guardá-lo aqui."
                  className="w-[264px]"
                />
              }
            />
          );
        })}
      </View>
    );
  }

  return (
    <View testID="item-list-screen" className="flex-1 bg-canvas">
      <View
        pointerEvents="none"
        style={[styles.glow, { experimental_backgroundImage: glowImage }]}
      />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            tintColor={tokens.color('sky')}
            onRefresh={() => {
              refetch();
            }}
          />
        }>
        <View className="mb-6 flex-row items-center gap-2 px-4">
          <KodamaMark size={40} />
          <Text variant="display">Kodama</Text>
          <HomeHeaderActions />
        </View>
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: GLOW_HEIGHT,
  },
});
