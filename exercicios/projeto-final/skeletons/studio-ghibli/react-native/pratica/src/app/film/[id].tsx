import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FilmBanner } from '@/components/film-banner';
import { FilmDetailFrame } from '@/components/film-detail-frame';
import { ErrorState } from '@/components/states/error-state';
import { DetailLoadingState } from '@/components/states/loading-state';
import { Text } from '@/components/text';
import { formatRuntime, formatScore, isHighScore } from '@/domain/format';
import { useFilm } from '@/state/use-film';

const ENTER_DURATION_MS = 240;
const TITLE_OVERLAP = -40;

export default function FilmDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: film, fetchStatus, isError } = useFilm(id);

  function closeDetail() {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  if (!film) {
    return (
      <FilmDetailFrame onClose={closeDetail}>
        <View className="flex-1 justify-center bg-canvas">
          {isError || fetchStatus === 'paused' ? (
            <ErrorState
              title="Não foi possível carregar este filme"
              message="Verifique sua conexão ou volte para a lista."
              actionLabel="Voltar"
              onRetry={closeDetail}
            />
          ) : (
            <DetailLoadingState />
          )}
        </View>
      </FilmDetailFrame>
    );
  }

  return (
    <FilmDetailFrame onClose={closeDetail}>
      <ScrollView
        testID="detail-screen"
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-canvas"
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
        <Animated.View entering={FadeIn.duration(ENTER_DURATION_MS)}>
          <FilmBanner film={film} onBack={closeDetail} />
          <View className="px-4" style={{ marginTop: TITLE_OVERLAP }}>
            <Text testID="detail-title" variant="display" accessibilityRole="header">
              {film.title}
            </Text>
            <Text variant="original" tone="muted" lang="ja" className="mt-1">
              {film.originalTitle}
            </Text>
            <Text variant="meta" tone="muted" className="mt-2">
              {film.releaseYear} · {formatRuntime(film.runningTimeMin)} ·{' '}
              <Text variant="meta" tone={isHighScore(film.rtScore) ? 'meadow' : 'muted'}>
                {formatScore(film.rtScore)}
              </Text>{' '}
              no Rotten Tomatoes
            </Text>
          </View>
          <View className="gap-4 px-4 pt-6">
            <Text>{film.description}</Text>
            <View className="gap-1">
              <Text testID="detail-director" variant="meta" tone="muted">
                Direção: {film.director}
              </Text>
              <Text variant="meta" tone="muted">
                Produção: {film.producer}
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </FilmDetailFrame>
  );
}
