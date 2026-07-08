import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'favorite_pokemon_ids';

export async function loadFavorites(): Promise<Set<number>> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return new Set();
  return new Set(JSON.parse(raw) as number[]);
}

export async function toggleFavorite(id: number): Promise<Set<number>> {
  const current = await loadFavorites();
  if (current.has(id)) {
    current.delete(id);
  } else {
    current.add(id);
  }
  await AsyncStorage.setItem(KEY, JSON.stringify(Array.from(current)));
  return current;
}
