import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import { FlatList, Pressable, View } from 'react-native';

import type { Film } from '@/domain/film';

import { FILM_CARD_WIDTH, FilmCard } from './film-card';
import { Text } from './text';
import { useBrandTokens } from './use-brand-tokens';

const RAIL_GAP = 12;

type FilmRailProps = {
  slug: string;
  title: string;
  films: Film[];
  countLabel: string;
  isFavorite: (filmId: string) => boolean;
  onPressFilm: (filmId: string) => void;
  variant?: 'favorites';
  onSeeAll?: () => void;
  emptyState?: ReactNode;
};

export function FilmRail({
  slug,
  title,
  films,
  countLabel,
  isFavorite,
  onPressFilm,
  variant,
  onSeeAll,
  emptyState,
}: FilmRailProps) {
  const tokens = useBrandTokens();
  const isFavoritesRail = variant === 'favorites';

  return (
    <View testID={`rail-${slug}`} accessibilityLabel={title} className="gap-3">
      <View className="flex-row items-baseline gap-2 px-4">
        <Text variant="rail-title" accessibilityRole="header">
          {title}
        </Text>
        <Text variant="meta" tone={isFavoritesRail ? 'lamp' : 'muted'}>
          {countLabel}
        </Text>
        {onSeeAll && films.length > 0 && (
          <Pressable
            testID={`rail-${slug}-see-all`}
            accessibilityRole="button"
            hitSlop={12}
            className="ml-auto flex-row items-center gap-1"
            onPress={onSeeAll}>
            <Text variant="label" tone="sky">
              Ver todos
            </Text>
            <SymbolView
              name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
              size={14}
              tintColor={tokens.color('sky')}
            />
          </Pressable>
        )}
      </View>
      <FlatList
        horizontal
        data={films}
        keyExtractor={(film) => film.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={FILM_CARD_WIDTH + RAIL_GAP}
        decelerationRate="fast"
        contentContainerClassName="gap-3 px-4 pb-2"
        ListEmptyComponent={<>{emptyState}</>}
        renderItem={({ item }) => (
          <FilmCard
            film={item}
            isFavorite={isFavorite(item.id)}
            onPress={() => onPressFilm(item.id)}
          />
        )}
      />
    </View>
  );
}
