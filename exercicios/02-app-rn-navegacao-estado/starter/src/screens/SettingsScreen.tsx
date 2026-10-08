// src/screens/SettingsScreen.tsx
//
// BÔNUS — aba Settings. Reaproveita o counterStore (hands-on) e usa a action
// clear() do favoritesStore.

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useCounterStore } from '@/store/counterStore';
import { useFavoritesStore } from '@/store/favoritesStore';

export default function SettingsScreen() {
  const count = useCounterStore((s) => s.count);
  const { increment, decrement, reset } = useCounterStore.getState();
  const total = useFavoritesStore((s) => s.ids.length);
  const clear = useFavoritesStore((s) => s.clear);

  return (
    <View style={styles.container}>
      <Text style={styles.section}>Counter (Zustand)</Text>
      <Text style={styles.count}>{count}</Text>
      <View style={styles.row}>
        <Pressable style={styles.button} onPress={decrement}>
          <Text style={styles.buttonText}>−</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={reset}>
          <Text style={styles.buttonText}>reset</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={increment}>
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
      </View>

      <Text style={styles.section}>Favoritos (Zustand + MMKV)</Text>
      <Text style={styles.hint}>{total} filme(s) salvo(s)</Text>
      <Pressable
        style={[styles.button, styles.danger, total === 0 && styles.disabled]}
        onPress={clear}
        disabled={total === 0}
      >
        <Text style={styles.buttonText}>Limpar favoritos</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  section: { fontSize: 16, fontWeight: '600', marginTop: 12 },
  count: { fontSize: 40, fontWeight: 'bold' },
  row: { flexDirection: 'row', gap: 12 },
  hint: { color: '#666' },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonText: { fontSize: 15, fontWeight: '500' },
  danger: { backgroundColor: '#ffd9d9' },
  disabled: { opacity: 0.4 },
});
