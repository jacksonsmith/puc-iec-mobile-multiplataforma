// src/screens/MovieDetail.tsx
//
// ATIVIDADE 2 — tela de detalhe do filme.
// Demonstra TanStack Query em outra tela (já implementado).

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { useMovieById } from '@/queries/movies/get-movie-by-id';
import { posterUrl } from '@/utils/poster-url';
import type { RootStackParamList } from '@/routes/RootStack';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function MovieDetail({ route }: Props) {
  const { id } = route.params;
  const { data, isLoading, error } = useMovieById(id);

  if (isLoading) return <ActivityIndicator style={styles.center} />;
  if (error || !data) return <Text style={styles.center}>Erro ao carregar</Text>;

  const poster = posterUrl(data.poster_path, 'w500');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {poster && <Image source={{ uri: poster }} style={styles.poster} />}
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.meta}>
        ⭐ {data.vote_average.toFixed(1)} · {data.release_date}
      </Text>
      <Text style={styles.overview}>{data.overview}</Text>

      {/* TODO [TASK 8]: adicionar HeartButton aqui (Reanimated worklet) */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  poster: { width: 200, height: 300, alignSelf: 'center', borderRadius: 8 },
  title: { fontSize: 22, fontWeight: 'bold' },
  meta: { color: '#666' },
  overview: { fontSize: 14, lineHeight: 20 },
});
