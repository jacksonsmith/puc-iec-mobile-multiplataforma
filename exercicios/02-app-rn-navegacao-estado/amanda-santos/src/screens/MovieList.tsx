import { useState } from 'react';
import { ActivityIndicator, FlatList, Button, Text, View } from 'react-native';
import { usePopularMovies } from '@/queries/movies/get-popular-movies';
import { useCounterStore } from '@/store/counterStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { isTokenMissing, isTokenError } from '@/services/api';
import { demoMode } from '@/services/demo';
import TokenMissingScreen from '@/components/TokenMissingScreen';
import MovieCard from '@/components/MovieCard';
export default function MovieList() {
 const {data, isLoading, isRefetching, error, refetch} = usePopularMovies();
 const {count, increment, decrement, reset} = useCounterStore();
 const ids = useFavoritesStore(s => s.ids); const clear = useFavoritesStore(s => s.clear);
 const [onlyFavorites, setOnlyFavorites] = useState(false);
 if (!demoMode && (isTokenMissing || isTokenError(error))) return <TokenMissingScreen />;
 if (isLoading) return <ActivityIndicator size="large" />;
 if (error) return <View><Text>Erro ao carregar os filmes.</Text><Button title="Tentar novamente" onPress={() => {void refetch();}} /></View>;
 const movies = data?.results ?? [];
 return <View style={{flex: 1, backgroundColor: '#fff'}}>
  <View style={{padding: 16, gap: 12}}>
   {demoMode && <Text style={{color: '#925000'}}>Modo demonstração • filmes fictícios • persistência web com localStorage</Text>}
   <Text>Contador: {count} • Favoritos: {ids.length}</Text>
   <View style={{flexDirection: 'row', gap: 8}}><Button title="+1" onPress={increment}/><Button title="−1" onPress={decrement}/><Button title="Zerar" onPress={reset}/></View>
   <Button title={onlyFavorites ? 'Mostrar todos os filmes' : 'Mostrar favoritos desta lista'} onPress={() => setOnlyFavorites(v => !v)} />
   <Button title="Limpar favoritos" onPress={clear} />
  </View>
  <FlatList data={onlyFavorites ? movies.filter(m => ids.includes(m.id)) : movies}
   keyExtractor={item => String(item.id)} renderItem={({item}) => <MovieCard movie={item}/>}
   refreshing={isRefetching} onRefresh={() => {void refetch();}}
   ListEmptyComponent={<Text style={{padding: 16}}>Nenhum filme nesta lista.</Text>} />
 </View>;
}
