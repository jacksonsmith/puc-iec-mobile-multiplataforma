import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DirectorChips } from '@/components/director-chips';
import { FilmGrid } from '@/components/film-grid';
import { FilmRail } from '@/components/film-rail';
import { HomeHeaderActions } from '@/components/home-header-actions';
import { KodamaMark } from '@/components/kodama-mark';
import { SearchBar } from '@/components/search-bar';
import { EmptyState } from '@/components/states/empty-state';
import { ErrorState } from '@/components/states/error-state';
import { LoadingState } from '@/components/states/loading-state';
import { Text } from '@/components/text';
import { useBrandTokens } from '@/components/use-brand-tokens';
import { getDirectors } from '@/domain/directors';
import { filterFilms } from '@/domain/filter';
import { formatFilmCount } from '@/domain/format';
import { buildRails } from '@/domain/rails';
import { useFilmFiltersStore } from '@/state/film-filters-store';
import { useFilms } from '@/state/use-films';

const FAVORITES_SLUG = 'favorites';
const GLOW_HEIGHT = 560;
// A Spec 005 troca esta lista pelos favoritos salvos no aparelho.
const FAVORITE_IDS: string[] = [];

// O react-native-web não entende experimental_backgroundImage.
function getGlowStyle(image: string): ViewStyle {
  return Platform.OS === 'web'
    ? ({ backgroundImage: image } as ViewStyle)
    : { experimental_backgroundImage: image };
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tokens = useBrandTokens();
  const { data: films, fetchStatus, isError, isRefetching, refetch } = useFilms();
  const query = useFilmFiltersStore((state) => state.query);
  const setQuery = useFilmFiltersStore((state) => state.setQuery);
  const director = useFilmFiltersStore((state) => state.director);
  const setDirector = useFilmFiltersStore((state) => state.setDirector);
  const rails = useMemo(() => buildRails(films ?? [], FAVORITE_IDS, director), [films, director]);
  const directors = useMemo(() => getDirectors(films ?? []), [films]);
  const searchResults = useMemo(
    () => filterFilms(films ?? [], { query, director }),
    [films, query, director],
  );
  const isSearching = query.trim().length > 0;

  function isFavorite(filmId: string) {
    return FAVORITE_IDS.includes(filmId);
  }

  function openFilm(filmId: string) {
    router.push({ pathname: '/film/[id]', params: { id: filmId } });
  }

  const glowImage = `radial-gradient(ellipse 120% 70% at 20% 0%, ${tokens.color('glow-sky')}, transparent 60%), radial-gradient(ellipse 80% 50% at 90% 40%, ${tokens.color('glow-lamp')}, transparent 70%)`;

  function renderContent() {
    if (!films) {
      return isError || fetchStatus === 'paused' ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <LoadingState />
      );
    }

    if (isSearching) {
      if (searchResults.length === 0) {
        return (
          <View className="px-4">
            <EmptyState
              testID="state-empty"
              icon={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
              title="Nenhum filme encontrado"
              message="Tente outro título ou escolha Todos."
              actionLabel="Limpar busca"
              onAction={() => setQuery('')}
            />
          </View>
        );
      }

      return (
        <FilmGrid
          query={query}
          films={searchResults}
          isFavorite={isFavorite}
          onPressFilm={openFilm}
        />
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
              isFavorite={isFavorite}
              onPressFilm={openFilm}
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
      <View pointerEvents="none" style={[styles.glow, getGlowStyle(glowImage)]} />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            tintColor={tokens.color('sky')}
            onRefresh={() => {
              refetch();
            }}
          />
        }>
        <View className="mb-4 flex-row items-center gap-2 px-4">
          <KodamaMark size={40} />
          <Text variant="display">Kodama</Text>
          <HomeHeaderActions />
        </View>
        <View className="mb-4 px-4">
          <SearchBar value={query} onChangeText={setQuery} onClear={() => setQuery('')} />
        </View>
        <View className="mb-6">
          {films && (
            <DirectorChips
              directors={directors}
              totalCount={films.length}
              selected={director}
              onSelect={setDirector}
            />
          )}
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
