import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchDetail } from '../api/ghibliApi';
import { loadFavorites, toggleFavorite } from '../storage/favoritesStore';
import { FilmDetail } from '../types/film';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function DetailScreen({ route, navigation }: Props) {
  const { filmId } = route.params;
  const [detail, setDetail] = useState<FilmDetail | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDetail(filmId)
      .then(setDetail)
      .catch(() => setError('Erro ao carregar detalhes'));
    loadFavorites().then((favs) => setIsFavorite(favs.has(filmId)));
  }, [filmId]);

  const onToggleFavorite = async () => {
    const favs = await toggleFavorite(filmId);
    setIsFavorite(favs.has(filmId));
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
            source={{ uri: detail.image }}
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
              {detail.title}
            </Text>
            <TouchableOpacity testID="detail-favorite-button" onPress={onToggleFavorite}>
              <Text style={{ fontSize: 24 }}>{isFavorite ? '♥' : '♡'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ marginTop: 8 }}>Diretor: {detail.director}</Text>
          <Text style={{ marginTop: 16 }}>Ano: {detail.release_date}</Text>
          <Text>Duração: {detail.running_time} min</Text>
        </>
      )}
    </View>
  );
}
