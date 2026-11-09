import { Skeleton } from 'moti/skeleton';
import { View } from 'react-native';

import { useColorScheme } from '../color-scheme';
import { FILM_CARD_WIDTH } from '../film-card';
import { useBrandTokens } from '../use-brand-tokens';

const RAIL_COUNT = 3;
const CARDS_PER_RAIL = 3;
const POSTER_HEIGHT = FILM_CARD_WIDTH * 1.5;
const POSTER_RADIUS = 12;

function RailSkeleton() {
  const colorScheme = useColorScheme() ?? 'light';
  const tokens = useBrandTokens();
  const raised = tokens.color('canvas-raised');
  const colors = [raised, tokens.color('canvas'), raised];

  return (
    <View className="gap-3">
      <View className="px-4">
        <Skeleton colorMode={colorScheme} colors={colors} width={160} height={24} radius={6} />
      </View>
      <View className="flex-row gap-3 pl-4">
        {Array.from({ length: CARDS_PER_RAIL }, (_, index) => (
          <Skeleton
            key={index}
            colorMode={colorScheme}
            colors={colors}
            width={FILM_CARD_WIDTH}
            height={POSTER_HEIGHT}
            radius={POSTER_RADIUS}
          />
        ))}
      </View>
    </View>
  );
}

export function LoadingState() {
  return (
    <View testID="state-loading" accessibilityLabel="Carregando filmes" className="gap-8">
      {Array.from({ length: RAIL_COUNT }, (_, index) => (
        <RailSkeleton key={index} />
      ))}
    </View>
  );
}

export function DetailLoadingState() {
  const colorScheme = useColorScheme() ?? 'light';
  const tokens = useBrandTokens();
  const raised = tokens.color('canvas-raised');
  const colors = [raised, tokens.color('canvas'), raised];

  return (
    <View testID="state-loading" accessibilityLabel="Carregando filme" className="gap-6">
      <Skeleton colorMode={colorScheme} colors={colors} width="100%" height={220} radius={0} />
      <View className="gap-3 px-4">
        <Skeleton colorMode={colorScheme} colors={colors} width="70%" height={40} radius={6} />
        <Skeleton colorMode={colorScheme} colors={colors} width="100%" height={96} radius={6} />
      </View>
    </View>
  );
}
