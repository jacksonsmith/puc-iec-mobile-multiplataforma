// src/components/MovieCard.tsx
//
// CAMADA COMPONENTS — componente reutilizável de card de filme.
// ATIVIDADE 2 — integrar com useFavoritesStore + HeartButton

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { Movie } from '@/types/movie';
import { posterUrl } from '@/utils/poster-url';
import type { RootStackParamList } from '@/routes/RootStack';
import { useFavoritesStore } from '@/store/favoritesStore';
import { fetchMovieById } from '@/queries/movies/get-movie-by-id';
import HeartButton from './HeartButton';

type Props = { movie: Movie };

export default function MovieCard({ movie }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const poster = posterUrl(movie.poster_path, 'w185');
  const posterScale = useSharedValue(1);

  const isFav = useFavoritesStore((state) => state.isFavorite(movie.id));
  const toggle = useFavoritesStore((state) => state.toggle);

  const posterStyle = useAnimatedStyle(() => ({
    transform: [{ scale: posterScale.value }],
  }));

  const openDetail = () => {
    navigation.navigate('Detail', { id: movie.id, title: movie.title });
  };

  const handlePress = () => {
    void queryClient.prefetchQuery({
      queryKey: ['movie', movie.id],
      queryFn: () => fetchMovieById(movie.id),
      staleTime: 1000 * 60 * 5,
    });

    posterScale.value = withSpring(1.4, { damping: 14, stiffness: 180 }, (finished) => {
      if (finished) {
        posterScale.value = 1;
        runOnJS(openDetail)();
      }
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      style={styles.card}
    >
      {poster && <Animated.Image source={{ uri: poster }} style={[styles.poster, posterStyle]} />}
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
