import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../routes/types';
import { useFavoritesStore } from '../store/favoritesStore';
import type { Movie } from '../types/movie';
import HeartButton from './HeartButton';

type Props = { movie: Movie };

const imageUrl = (path: string | null, size: 'w185' | 'w500') =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : undefined;

export default function MovieCard({ movie }: Props) {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const active = useFavoritesStore((state) => state.isFavorite(movie.id));
    const toggle = useFavoritesStore((state) => state.toggle);
    const poster = imageUrl(movie.poster_path, 'w185');

    return (
        <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('Detail', { id: movie.id, title: movie.title })}
            style={styles.card}
        >
            {poster ? (
                <Image accessibilityLabel={`Pôster de ${movie.title}`} source={{ uri: poster }} style={styles.poster} />
            ) : (
                <View style={[styles.poster, styles.noPoster]}><Text>🎬</Text></View>
            )}
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
                <Text style={styles.meta}>⭐ {movie.vote_average.toFixed(1)}</Text>
            </View>
            <HeartButton active={active} onPress={() => toggle(movie.id)} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        padding: 12,
        gap: 12,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#d1d5db',
    },
    poster: { width: 60, height: 90, borderRadius: 6, backgroundColor: '#e5e7eb' },
    noPoster: { justifyContent: 'center', alignItems: 'center' },
    info: { flex: 1, gap: 6 },
    title: { fontSize: 16, fontWeight: '600', color: '#111827' },
    meta: { color: '#6b7280', fontSize: 13 },
});
