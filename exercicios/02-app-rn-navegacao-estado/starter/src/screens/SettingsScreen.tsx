// src/screens/SettingsScreen.tsx
//
// CAMADA SCREENS — configurações do app.

import { Button, StyleSheet, Text, View } from 'react-native';
import { useFavoritesStore } from '@/store/favoritesStore';

export default function SettingsScreen() {
  const count = useFavoritesStore((s) => s.ids.length);
  const clear = useFavoritesStore((s) => s.clear);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Favoritos salvos:</Text>
        <Text style={styles.value}>{count}</Text>
      </View>
      <Button title="Limpar todos os favoritos" onPress={clear} color="#e74c3c" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 20 },
  title: { fontSize: 22, fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontSize: 16, color: '#555' },
  value: { fontSize: 16, fontWeight: '600' },
});
