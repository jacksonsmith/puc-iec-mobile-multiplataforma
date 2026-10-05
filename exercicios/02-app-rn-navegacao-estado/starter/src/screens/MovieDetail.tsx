// src/screens/MovieDetail.tsx
//
// ATIVIDADE 2 — tela de detalhe do filme.
// Demonstra TanStack Query em outra tela (já implementado).

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useEffect } from 'react';
import { useMovieById } from '@/queries/movies/get-movie-by-id';
import { posterUrl } from '@/utils/poster-url';
import { isTokenError } from '@/services/api';
import TokenMissingScreen from '@/components/TokenMissingScreen';
import type { RootStackParamList } from '@/routes/RootStack';
import { useFavoritesStore } from '@/store/favoritesStore';
import HeartButton from '@/components/HeartButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function MovieDetail({ route, navigation }: Props) {
  const { id } = route.params;
  const { data, isLoading, error } = useMovieById(id);
  const isFav = useFavoritesStore((s) => s.isFavorite(id));
  const toggle = useFavoritesStore((s) => s.toggle);
  const posterScale = useSharedValue(0.9);

  useEffect(() => {
    posterScale.value = withSpring(1, {
      damping: 12,
      stiffness: 140,
    });
  }, [posterScale]);

  const animatedPosterStyle = useAnimatedStyle(() => ({
    transform: [{ scale: posterScale.value }],
  }));

  if (isTokenError(error)) return <TokenMissingScreen />;
  if (isLoading) return <ActivityIndicator style={styles.center} />;
  if (error || !data) return <Text style={styles.center}>Erro ao carregar</Text>;

  const poster = posterUrl(data.poster_path, 'w500');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Botão voltar custom (fallback caso header não esteja visível) */}
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>← Voltar</Text>
      </Pressable>

      {poster && (
        <Animated.Image
          source={{ uri: poster }}
          style={[styles.poster, animatedPosterStyle]}
        />
      )}

      {/* Linha com título + slot pro HeartButton (TASK 8) */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{data.title}</Text>
        <HeartButton
          active={isFav}
          onPress={(event) => {
            event.stopPropagation();
            toggle(id);
          }}
        />
      </View>

      <Text style={styles.meta}>
        ⭐ {data.vote_average.toFixed(1)} · {data.release_date}
      </Text>
      <Text style={styles.overview}>{data.overview}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  backText: { fontSize: 15, color: '#0066cc', fontWeight: '500' },
  poster: { width: 200, height: 300, alignSelf: 'center', borderRadius: 8 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', flex: 1 },
  meta: { color: '#666' },
  overview: { fontSize: 14, lineHeight: 20 },
});
