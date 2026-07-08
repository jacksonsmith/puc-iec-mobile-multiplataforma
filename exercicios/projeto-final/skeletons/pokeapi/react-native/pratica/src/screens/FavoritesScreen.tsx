import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchList } from '../api/pokeApi';
import { loadFavorites } from '../storage/favoritesStore';
import { PokemonSummary, capitalize, spriteUrl } from '../types/pokemon';
import type { RootStackParamList } from '../../App';
import BottomNav from './BottomNav';

type Props = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

export default function FavoritesScreen({ navigation }: Props) {
  const [favorites, setFavorites] = useState<PokemonSummary[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      // TODO 5 (feature 5 — favoritos): cruzar loadFavorites() (ids) com
      // fetchList() (dados), setFavorites() com o resultado filtrado.
      setFavorites([]);
      return () => {};
    }, []),
  );

  return (
    <View style={{ flex: 1 }}>
      {favorites === null && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      )}
      {favorites !== null && favorites.length === 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Nenhum favorito ainda.</Text>
        </View>
      )}
      {favorites !== null && favorites.length > 0 && (
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              testID={`favorite-item-${item.id}`}
              onPress={() => navigation.navigate('Detail', { pokemonId: item.id })}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
              }}
            >
              <Image source={{ uri: spriteUrl(item.id) }} style={{ width: 40, height: 40 }} />
              <Text style={{ marginLeft: 12, fontSize: 16 }}>{capitalize(item.name)}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <BottomNav navigation={navigation} active="Favorites" />
    </View>
  );
}
