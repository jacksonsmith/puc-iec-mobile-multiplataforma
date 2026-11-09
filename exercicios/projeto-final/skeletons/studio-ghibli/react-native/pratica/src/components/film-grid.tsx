import { useWindowDimensions, View } from 'react-native';

import type { Film } from '@/domain/film';
import { formatFilmCount } from '@/domain/format';

import { FILM_CARD_WIDTH, FilmCard } from './film-card';
import { Text } from './text';

const SCREEN_MARGIN = 16;
const COLUMN_GAP = 12;
const MIN_COLUMNS = 3;

type FilmGridProps = {
  query: string;
  films: Film[];
  isFavorite: (filmId: string) => boolean;
  onPressFilm: (filmId: string) => void;
};

function getCardWidth(screenWidth: number) {
  const availableWidth = screenWidth - SCREEN_MARGIN * 2;
  const columns = Math.max(
    MIN_COLUMNS,
    Math.floor((availableWidth + COLUMN_GAP) / (FILM_CARD_WIDTH + COLUMN_GAP)),
  );

  return Math.floor((availableWidth - COLUMN_GAP * (columns - 1)) / columns);
}

export function FilmGrid({ query, films, isFavorite, onPressFilm }: FilmGridProps) {
  const { width } = useWindowDimensions();
  const cardWidth = getCardWidth(width);

  return (
    <View testID="search-results" className="gap-3 px-4">
      <View className="flex-row flex-wrap items-baseline gap-x-2">
        <Text variant="rail-title" accessibilityRole="header">
          Resultados para “{query.trim()}”
        </Text>
        <Text variant="meta" tone="muted">
          {formatFilmCount(films.length)}
        </Text>
      </View>
      <View className="flex-row flex-wrap gap-x-3 gap-y-4">
        {films.map((film) => (
          <FilmCard
            key={film.id}
            film={film}
            width={cardWidth}
            subtitle={String(film.releaseYear)}
            isFavorite={isFavorite(film.id)}
            onPress={() => onPressFilm(film.id)}
          />
        ))}
      </View>
    </View>
  );
}
