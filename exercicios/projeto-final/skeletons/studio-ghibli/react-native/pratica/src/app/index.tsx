import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DirectorChips } from '@/components/director-chips';
import { FilmGrid } from '@/components/film-grid';
import { FilmRail } from '@/components/film-rail';
import { ForestBackground } from '@/components/forest-background';
import { HomeHeaderActions } from '@/components/home-header-actions';
import { KodamaMark } from '@/components/kodama-mark';
import { SearchBar } from '@/components/search-bar';
import { EmptyState } from '@/components/states/empty-state';
import { ErrorState } from '@/components/states/error-state';
import { LoadingState } from '@/components/states/loading-state';
import { Text } from '@/components/text';
import { useBrandTokens } from '@/components/use-brand-tokens';
import { getDirectors } from '@/domain/directors';
import { isFavorite as isFavoriteFilm } from '@/domain/favorites';
import { filterFilms } from '@/domain/filter';
import { formatFilmCount } from '@/domain/format';
import { buildRails } from '@/domain/rails';
import { useFavoritesStore } from '@/state/favorites-store';
import { useFilmFiltersStore } from '@/state/film-filters-store';
import { useFilms } from '@/state/use-films';

const FAVORITES_SLUG = 'favorites';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tokens = useBrandTokens();
  const { data: films, fetchStatus, isError, isRefetching, refetch } = useFilms();
  const query = useFilmFiltersStore((state) => state.query);
  const setQuery = useFilmFiltersStore((state) => state.setQuery);
  const director = useFilmFiltersStore((state) => state.director);
  const setDirector = useFilmFiltersStore((state) => state.setDirector);
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const rails = useMemo(
    () => buildRails(films ?? [], favoriteIds, director),
    [films, favoriteIds, director],
  );
  const directors = useMemo(() => getDirectors(films ?? []), [films]);
  const searchResults = useMemo(
    () => filterFilms(films ?? [], { query, director }),
    [films, query, director],
  );
  const isSearching = query.trim().length > 0;

  function isFavorite(filmId: string) {
    return isFavoriteFilm(favoriteIds, filmId);
  }

  function openFilm(filmId: string) {
    router.push({ pathname: '/film/[id]', params: { id: filmId } });
  }

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
          testID="search-results"
          title={`Resultados para “${query.trim()}”`}
          countLabel={formatFilmCount(searchResults.length)}
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
              onSeeAll={isFavoritesRail ? () => router.push('/favorites') : undefined}
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
      <ForestBackground />
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
