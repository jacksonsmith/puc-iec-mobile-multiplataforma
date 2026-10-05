// src/components/MovieCard.tsx
//
// CAMADA COMPONENTS — componente reutilizável de card de filme.
// ATIVIDADE 2 — integrar com useFavoritesStore + HeartButton

import { Animated, Image, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Movie } from '@/types/movie';
import { posterUrl } from '@/utils/poster-url';
import type { RootStackParamList } from '@/routes/RootStack';
import { useFavoritesStore } from '@/store/favoritesStore';
import HeartButton from './HeartButton';
import { useRef } from 'react';

type Props = { movie: Movie };

export default function MovieCard({ movie }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const poster = posterUrl(movie.poster_path, 'w185');
  const isFav = useFavoritesStore((s) => s.isFavorite(movie.id));
  const toggle = useFavoritesStore((s) => s.toggle);
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 8,
      onPanResponderMove: (_, gestureState) => {
        const nextX = Math.max(-120, Math.min(120, gestureState.dx));
        pan.setValue({ x: nextX, y: 0 });
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldToggle = Math.abs(gestureState.dx) > 80;
        if (shouldToggle) {
          toggle(movie.id);
        }
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          friction: 6,
          tension: 80,
        }).start();
      },
    }),
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.card, { transform: [{ translateX: pan.x }, { translateY: pan.y }] }]}
    >
      <Pressable
        onPress={() => navigation.navigate('Detail', { id: movie.id, title: movie.title })}
        style={styles.content}
      >
        {poster && <Image source={{ uri: poster }} style={styles.poster} />}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {movie.title}
          </Text>
          <Text style={styles.meta}>⭐ {movie.vote_average.toFixed(1)}</Text>
        </View>

        <HeartButton
          active={isFav}
          onPress={(event) => {
            event.stopPropagation();
            toggle(movie.id);
          }}
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  content: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
    alignItems: 'center',
  },
  poster: { width: 60, height: 90, borderRadius: 4 },
  info: { flex: 1, gap: 4 },
  title: { fontSize: 16, fontWeight: '600' },
  meta: { color: '#666', fontSize: 12 },
});
