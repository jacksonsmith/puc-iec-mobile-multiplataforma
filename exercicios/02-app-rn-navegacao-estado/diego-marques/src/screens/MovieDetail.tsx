import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useMovieById } from '@/queries/movies/get-movie-by-id';
import { posterUrl } from '@/utils/poster-url';
import { isTokenError } from '@/services/api';
import TokenMissingScreen from '@/components/TokenMissingScreen';
import ErrorState from '@/components/ErrorState';
import HeartButton from '@/components/HeartButton';
import { useFavoritesStore } from '@/store/favoritesStore';
import type { RootStackParamList } from '@/routes/RootStack';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function MovieDetail({ route }: Props) {
  const { id } = route.params;
  const { data, isLoading, error, refetch } = useMovieById(id);
  const isFav = useFavoritesStore((s) => s.isFavorite(id));
  const toggle = useFavoritesStore((s) => s.toggle);

  if (isTokenError(error)) return <TokenMissingScreen />;
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (error || !data) {
    return <ErrorState message="Não foi possível carregar este filme." onRetry={refetch} />;
  }

  const poster = posterUrl(data.poster_path, 'w500');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {poster && <Image source={{ uri: poster }} style={styles.poster} />}

      <View style={styles.headerRow}>
        <Text style={styles.title}>{data.title}</Text>
        <HeartButton active={isFav} onPress={() => toggle(id)} size={32} />
      </View>

      <Text style={styles.meta}>
        Nota {data.vote_average.toFixed(1)} · {data.release_date}
      </Text>
      <Text style={styles.overview}>{data.overview}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  poster: { width: 200, height: 300, alignSelf: 'center', borderRadius: 8 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', flex: 1 },
  meta: { color: '#666' },
  overview: { fontSize: 14, lineHeight: 20 },
});
