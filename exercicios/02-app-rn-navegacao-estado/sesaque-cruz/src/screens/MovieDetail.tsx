// src/screens/MovieDetail.tsx
//
// ATIVIDADE 2: tela de detalhe do filme.
// Demonstra TanStack Query em outra tela (já implementado).

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMovieById } from '@/queries/movies/get-movie-by-id';
import { backdropUrl, posterUrl } from '@/utils/poster-url';
import { formatRuntime, releaseYear } from '@/utils/format';
import { isTokenError } from '@/services/api';
import TokenMissingScreen from '@/components/TokenMissingScreen';
import HeartButton from '@/components/HeartButton';
import RatingBadge from '@/components/RatingBadge';
import StateView from '@/components/StateView';
import { useFavoritesStore } from '@/store/favoritesStore';
import type { RootStackParamList } from '@/routes/RootStack';
import { colors, radius, shadow, spacing, typography } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function MovieDetail({ route }: Props) {
  const { id } = route.params;
  const { data, isLoading, error, refetch } = useMovieById(id);
  const isFav = useFavoritesStore((s) => s.isFavorite(id));
  const toggle = useFavoritesStore((s) => s.toggle);

  if (isTokenError(error)) return <TokenMissingScreen />;
  if (isLoading) return <StateView loading />;
  if (error || !data) {
    return (
      <StateView
        icon="cloud-offline-outline"
        title="Não foi possível carregar o filme"
        message="Verifique sua conexão e tente novamente."
        actionLabel="Tentar novamente"
        onAction={() => refetch()}
      />
    );
  }

  const backdrop = backdropUrl(data.backdrop_path);
  const poster = posterUrl(data.poster_path, 'w342');
  const meta = [releaseYear(data.release_date), formatRuntime(data.runtime)]
    .filter(Boolean)
    .join(' · ');

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {backdrop ? (
        <Image source={{ uri: backdrop }} style={styles.backdrop} />
      ) : (
        <View style={[styles.backdrop, styles.backdropPlaceholder]} />
      )}

      <View style={styles.headerCard}>
        {poster ? (
          <Image source={{ uri: poster }} style={styles.poster} />
        ) : (
          <View style={[styles.poster, styles.posterPlaceholder]}>
            <Ionicons name="film-outline" size={28} color={colors.textMuted} />
          </View>
        )}

        <View style={styles.headerInfo}>
          <Text style={styles.title}>{data.title}</Text>
          {!!meta && <Text style={styles.meta}>{meta}</Text>}
          <View style={styles.ratingRow}>
            <RatingBadge value={data.vote_average} />
            <View style={styles.heartCircle}>
              <HeartButton active={isFav} onPress={() => toggle(id)} size={26} />
            </View>
          </View>
        </View>
      </View>

      {data.genres.length > 0 && (
        <View style={styles.genres}>
          {data.genres.map((genre) => (
            <View key={genre.id} style={styles.chip}>
              <Text style={styles.chipText}>{genre.name}</Text>
            </View>
          ))}
        </View>
      )}

      {!!data.tagline && <Text style={styles.tagline}>“{data.tagline}”</Text>}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sinopse</Text>
        <Text style={styles.overview}>{data.overview || 'Sinopse indisponível em português.'}</Text>
      </View>
    </ScrollView>
  );
}

const POSTER_WIDTH = 110;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxl },
  backdrop: { width: '100%', aspectRatio: 16 / 9, backgroundColor: colors.surfaceMuted },
  backdropPlaceholder: { backgroundColor: colors.border },
  headerCard: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: -spacing.xxl * 1.5,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...shadow,
  },
  poster: {
    width: POSTER_WIDTH,
    height: POSTER_WIDTH * 1.5,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  posterPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flex: 1, gap: spacing.sm, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  meta: typography.caption,
  ratingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heartCircle: {
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipText: typography.label,
  tagline: {
    ...typography.caption,
    fontStyle: 'italic',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.lg, gap: spacing.sm },
  sectionTitle: typography.heading,
  overview: typography.body,
});
