// src/components/MovieCard.tsx
//
// CAMADA COMPONENTS: componente reutilizável de card de filme.
// ATIVIDADE 2: integrar com useFavoritesStore + HeartButton

import { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Movie } from '@/types/movie';
import { posterUrl } from '@/utils/poster-url';
import { formatRating, releaseYear } from '@/utils/format';
import type { RootStackParamList } from '@/routes/RootStack';
import { useFavoritesStore } from '@/store/favoritesStore';
import { colors, radius, shadow, spacing, typography } from '@/theme';
import HeartButton from './HeartButton';
import RatingBadge from './RatingBadge';

type Props = { movie: Movie };

function MovieCard({ movie }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const poster = posterUrl(movie.poster_path, 'w185');
  const year = releaseYear(movie.release_date);

  const isFav = useFavoritesStore((s) => s.isFavorite(movie.id));
  const toggle = useFavoritesStore((s) => s.toggle);

  // Card e coração são irmãos (não aninhados): evita botão dentro de botão
  // no web e deixa os dois alvos separados pro leitor de tela.
  return (
    <View style={styles.card}>
      <Pressable
        onPress={() => navigation.navigate('Detail', { id: movie.id, title: movie.title })}
        style={({ pressed }) => [styles.content, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`${movie.title}${year ? `, ${year}` : ''}, nota ${formatRating(movie.vote_average)}`}
      >
        {poster ? (
          <Image source={{ uri: poster }} style={styles.poster} />
        ) : (
          <View style={[styles.poster, styles.posterPlaceholder]}>
            <Ionicons name="film-outline" size={24} color={colors.textMuted} />
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {movie.title}
          </Text>
          <View style={styles.metaRow}>
            <RatingBadge value={movie.vote_average} />
            {year && <Text style={styles.year}>{year}</Text>}
          </View>
          {!!movie.overview && (
            <Text style={styles.overview} numberOfLines={2}>
              {movie.overview}
            </Text>
          )}
        </View>
      </Pressable>

      <HeartButton active={isFav} onPress={() => toggle(movie.id)} />
    </View>
  );
}

export default memo(MovieCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm - 2,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...shadow,
  },
  content: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  pressed: { opacity: 0.7 },
  poster: { width: 72, height: 108, borderRadius: radius.md, backgroundColor: colors.surfaceMuted },
  posterPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, gap: spacing.xs + 2, paddingTop: 2 },
  title: { fontSize: 16, fontWeight: '700', color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  year: typography.caption,
  overview: typography.caption,
});
