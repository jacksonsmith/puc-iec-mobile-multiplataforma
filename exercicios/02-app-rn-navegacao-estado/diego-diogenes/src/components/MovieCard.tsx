// src/components/MovieCard.tsx
//
// CAMADA COMPONENTS — componente reutilizável de card de filme.
// ATIVIDADE 2 — integrar com useFavoritesStore + HeartButton.

import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Movie } from '@/types/movie';
import { posterUrl } from '@/utils/poster-url';
import type { RootStackParamList } from '@/routes/RootStack';
import { useFavoritesStore } from '@/store/favoritesStore';
import {
  fetchMovieById,
  MOVIE_DETAIL_STALE_TIME,
} from '@/queries/movies/get-movie-by-id';
import HeartButton from './HeartButton';

type Props = { movie: Movie };

export default function MovieCard({ movie }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const poster = posterUrl(movie.poster_path, 'w185');

  const isFav = useFavoritesStore((s) => s.isFavorite(movie.id));
  const toggle = useFavoritesStore((s) => s.toggle);

  const openDetail = () => {
    // Bônus: pré-aquece o cache do detalhe antes de navegar.
    queryClient.prefetchQuery({
      queryKey: ['movie', movie.id],
      queryFn: () => fetchMovieById(movie.id),
      staleTime: MOVIE_DETAIL_STALE_TIME,
    });

    navigation.navigate('Detail', { id: movie.id, title: movie.title });
  };

  return (
    <Pressable onPress={openDetail} style={styles.card}>
      {poster && <Image source={{ uri: poster }} style={styles.poster} />}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.meta}>⭐ {movie.vote_average.toFixed(1)}</Text>
      </View>

      <HeartButton active={isFav} onPress={() => toggle(movie.id)} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  poster: { width: 60, height: 90, borderRadius: 4 },
  info: { flex: 1, gap: 4 },
  title: { fontSize: 16, fontWeight: '600' },
  meta: { color: '#666', fontSize: 12 },
});
