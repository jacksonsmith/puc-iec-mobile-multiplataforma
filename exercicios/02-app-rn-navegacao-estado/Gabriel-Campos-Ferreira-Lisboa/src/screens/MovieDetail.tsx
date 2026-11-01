import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import HeartButton from '../components/HeartButton';
import { useMovieById } from '../queries/movies';
import { isTokenMissing } from '../services/api';
import { useFavoritesStore } from '../store/favoritesStore';
import type { RootStackParamList } from '../routes/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function MovieDetail({ route }: Props) {
    const { id, title } = route.params;
    const { data, isLoading, error } = useMovieById(id);
    const active = useFavoritesStore((state) => state.isFavorite(id));
    const toggle = useFavoritesStore((state) => state.toggle);

    if (isTokenMissing) return <Text style={styles.message}>Configure EXPO_PUBLIC_TMDB_TOKEN no arquivo .env.</Text>;
    if (isLoading) return <ActivityIndicator style={styles.loading} size="large" color="#e11d48" />;
    if (error || !data) return <Text style={styles.message}>Não foi possível carregar {title}.</Text>;

    const poster = data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : undefined;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {poster ? <Image source={{ uri: poster }} style={styles.poster} /> : null}
            <View style={styles.titleRow}>
                <Text style={styles.title}>{data.title}</Text>
                <HeartButton active={active} onPress={() => toggle(id)} />
            </View>
            <Text style={styles.meta}>⭐ {data.vote_average.toFixed(1)} · {data.release_date || 'Data não informada'}</Text>
            <Text style={styles.overview}>{data.overview || 'Sem sinopse disponível.'}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, gap: 16, backgroundColor: '#fff', flexGrow: 1 },
    loading: { flex: 1 },
    poster: { width: 220, height: 330, alignSelf: 'center', borderRadius: 12, backgroundColor: '#e5e7eb' },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    title: { flex: 1, fontSize: 24, fontWeight: '800', color: '#111827' },
    meta: { color: '#6b7280', fontSize: 14 },
    overview: { color: '#374151', fontSize: 16, lineHeight: 24 },
    message: { padding: 24, textAlign: 'center', color: '#4b5563' },
});
