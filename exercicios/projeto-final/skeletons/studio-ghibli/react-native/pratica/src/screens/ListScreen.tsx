import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchList, fetchTitlesByDirector } from '../api/ghibliApi';
import { FilmSummary } from '../types/film';
import type { RootStackParamList } from '../../App';
import BottomNav from './BottomNav';

type Props = NativeStackScreenProps<RootStackParamList, 'List'>;

const DIRECTORS: Record<string, string> = {
  miyazaki: 'Hayao Miyazaki',
  takahata: 'Isao Takahata',
};

export default function ListScreen({ navigation }: Props) {
  const [all, setAll] = useState<FilmSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedDirectorSlug, setSelectedDirectorSlug] = useState<string | null>(null);
  const [titlesForDirector, setTitlesForDirector] = useState<Set<string> | null>(null);

  useEffect(() => {
    // TODO 1 (feature 1 — lista): chamar fetchList(), setAll() com o
    // resultado, setError() em caso de falha, setLoading(false) no final.
    setLoading(false);
  }, []);

  const onSelectDirector = async (slug: string | null) => {
    // TODO 4 (feature 4 — categoria/filtro): quando `slug` não é null,
    // chamar fetchTitlesByDirector(DIRECTORS[slug]) e setTitlesForDirector()
    // com o resultado. Quando é null, limpar titlesForDirector.
    setSelectedDirectorSlug(slug);
  };

  const filtered = useMemo(() => {
    // TODO 3 (feature 3 — busca) + TODO 4 (feature 4 — categoria): filtrar
    // `all` por `titlesForDirector` (quando não-nulo, `titlesForDirector.has(f.title)`)
    // e por `searchText` (substring case-insensitive do `title`).
    return all;
  }, [all, titlesForDirector, searchText]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View testID="item-list-screen" collapsable={false} style={{ flex: 1 }}>
      <TextInput
        testID="search-input"
        placeholder="Buscar filme"
        value={searchText}
        onChangeText={setSearchText}
        style={{
          margin: 12,
          padding: 10,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
        }}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 48, paddingHorizontal: 12 }}
      >
        <Chip
          testID="category-chip-all"
          label="Todos"
          selected={selectedDirectorSlug === null}
          onPress={() => onSelectDirector(null)}
        />
        {Object.keys(DIRECTORS).map((slug) => (
          <Chip
            key={slug}
            testID={`category-chip-${slug}`}
            label={slug}
            selected={selectedDirectorSlug === slug}
            onPress={() => onSelectDirector(slug)}
          />
        ))}
      </ScrollView>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            testID={`item-card-${item.id}`}
            onPress={() => navigation.navigate('Detail', { filmId: item.id })}
            style={{
              padding: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
            }}
          >
            <Text style={{ fontSize: 16 }}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      <BottomNav navigation={navigation} active="List" />
    </View>
  );
}

function Chip({
  testID,
  label,
  selected,
  onPress,
}: {
  testID: string;
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        marginRight: 8,
        backgroundColor: selected ? '#455a64' : '#eee',
      }}
    >
      <Text style={{ color: selected ? '#fff' : '#333' }}>{label}</Text>
    </TouchableOpacity>
  );
}
