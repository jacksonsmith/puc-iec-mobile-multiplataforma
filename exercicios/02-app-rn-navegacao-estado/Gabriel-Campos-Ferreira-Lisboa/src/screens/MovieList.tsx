import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { usePopularMovies } from '../queries/movies';
import { isTokenMissing } from '../services/api';
import MovieCard from '../components/MovieCard';

export default function MovieList() {
    const { data, isLoading, isFetching, error, refetch } = usePopularMovies();

    if (isTokenMissing) {
        return (
            <View style={styles.center}>
                <Text style={styles.message}>Configure EXPO_PUBLIC_TMDB_TOKEN no arquivo .env para carregar filmes.</Text>
            </View>
        );
    }
    if (isLoading) return <ActivityIndicator style={styles.center} size="large" color="#e11d48" />;
    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.message}>Não foi possível carregar os filmes.</Text>
                <Text onPress={() => refetch()} style={styles.retry}>Tentar novamente</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={data?.results ?? []}
            keyExtractor={(movie) => String(movie.id)}
            renderItem={({ item }) => <MovieCard movie={item} />}
            refreshControl={<RefreshControl refreshing={isFetching} onRefresh={() => refetch()} tintColor="#e11d48" />}
            contentContainerStyle={styles.list}
            ListHeaderComponent={
                <View style={styles.header}>
                    <Text style={styles.heading}>Populares agora</Text>
                    <Text style={styles.caption}>Toque no coração para salvar seus filmes favoritos.</Text>
                </View>
            }
            ListEmptyComponent={<Text style={styles.message}>Nenhum filme encontrado.</Text>}
        />
    );
}

const styles = StyleSheet.create({
    list: { flexGrow: 1, backgroundColor: '#f9fafb' },
    header: { paddingHorizontal: 18, paddingTop: 20, paddingBottom: 12 },
    heading: { fontSize: 26, fontWeight: '800', color: '#111827' },
    caption: { marginTop: 5, color: '#6b7280', fontSize: 14 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    message: { color: '#4b5563', textAlign: 'center', fontSize: 16 },
    retry: { color: '#be123c', fontWeight: '700', marginTop: 16 },
});
