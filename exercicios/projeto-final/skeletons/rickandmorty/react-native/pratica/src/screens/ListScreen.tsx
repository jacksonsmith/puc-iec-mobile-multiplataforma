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
import { fetchList, fetchNamesByStatus } from '../api/rickAndMortyApi';
import { CharacterSummary, capitalize } from '../types/character';
import type { RootStackParamList } from '../../App';
import BottomNav from './BottomNav';

type Props = NativeStackScreenProps<RootStackParamList, 'List'>;

const STATUSES = ['alive', 'dead', 'unknown'];

export default function ListScreen({ navigation }: Props) {
  const [all, setAll] = useState<CharacterSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [statusNames, setStatusNames] = useState<Set<string> | null>(null);

  useEffect(() => {
    // TODO 1 (feature 1 — lista): chamar fetchList(), setAll() com o
    // resultado, setError() em caso de falha, setLoading(false) no final.
    setLoading(false);
  }, []);

  const onSelectStatus = async (status: string | null) => {
    // TODO 4 (feature 4 — categoria/filtro): quando `status` não é null,
    // chamar fetchNamesByStatus(status) e setStatusNames() com o resultado.
    // Quando é null, limpar statusNames.
    setSelectedStatus(status);
  };

  const filtered = useMemo(() => {
    // TODO 3 (feature 3 — busca) + TODO 4 (feature 4 — categoria): filtrar
    // `all` por `statusNames` (quando não-nulo, `statusNames.has(p.name)`)
    // e por `searchText` (substring case-insensitive do `name`).
    return all;
  }, [all, statusNames, searchText]);

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
        placeholder="Buscar personagem"
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
          selected={selectedStatus === null}
          onPress={() => onSelectStatus(null)}
        />
        {STATUSES.map((status) => (
          <Chip
            key={status}
            testID={`category-chip-${status}`}
            label={capitalize(status)}
            selected={selectedStatus === status}
            onPress={() => onSelectStatus(status)}
          />
        ))}
      </ScrollView>
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            testID={`item-card-${item.id}`}
            onPress={() => navigation.navigate('Detail', { characterId: item.id })}
            style={{
              padding: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
            }}
          >
            <Text style={{ fontSize: 16 }}>{capitalize(item.name)}</Text>
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
        backgroundColor: selected ? '#2e7d32' : '#eee',
      }}
    >
      <Text style={{ color: selected ? '#fff' : '#333' }}>{label}</Text>
    </TouchableOpacity>
  );
}
