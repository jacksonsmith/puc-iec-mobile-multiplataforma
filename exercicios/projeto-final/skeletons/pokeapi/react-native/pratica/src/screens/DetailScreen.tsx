import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchDetail } from '../api/pokeApi';
import { loadFavorites, toggleFavorite } from '../storage/favoritesStore';
import { PokemonDetail, capitalize, spriteUrl } from '../types/pokemon';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function DetailScreen({ route, navigation }: Props) {
  const { pokemonId } = route.params;
  const [detail, setDetail] = useState<PokemonDetail | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO 2 (feature 2 — detalhe): chamar fetchDetail(pokemonId) e setDetail()
    // com o resultado (setError() em caso de falha). Também chamar
    // loadFavorites() e setIsFavorite(favs.has(pokemonId)).
  }, [pokemonId]);

  const onToggleFavorite = async () => {
    // TODO 5 (feature 5 — favoritos): chamar toggleFavorite(pokemonId) e
    // setIsFavorite(favs.has(pokemonId)) com o resultado.
  };

  return (
    <View testID="detail-screen" collapsable={false} style={{ flex: 1, padding: 16 }}>
      <TouchableOpacity
        testID="detail-back-button"
        onPress={() => navigation.goBack()}
        style={{ marginBottom: 12 }}
      >
        <Text style={{ fontSize: 16 }}>{'< Voltar'}</Text>
      </TouchableOpacity>
      {error && <Text>{error}</Text>}
      {!detail && !error && <ActivityIndicator />}
      {detail && (
        <>
          <Image
            source={{ uri: spriteUrl(detail.id) }}
            style={{ width: 140, height: 140, alignSelf: 'center' }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 16,
            }}
          >
            <Text testID="detail-title" style={{ fontSize: 24, fontWeight: 'bold' }}>
              {capitalize(detail.name)}
            </Text>
            <TouchableOpacity testID="detail-favorite-button" onPress={onToggleFavorite}>
              <Text style={{ fontSize: 24 }}>{isFavorite ? '♥' : '♡'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ marginTop: 8 }}>{detail.types.join(', ')}</Text>
          <Text style={{ marginTop: 16 }}>Altura: {detail.heightDm / 10} m</Text>
          <Text>Peso: {detail.weightHg / 10} kg</Text>
        </>
      )}
    </View>
  );
}
