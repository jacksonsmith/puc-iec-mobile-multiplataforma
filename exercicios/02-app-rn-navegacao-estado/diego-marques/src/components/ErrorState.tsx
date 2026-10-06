import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  message?: string;
  onRetry?: () => void;
};

export default function ErrorState({
  message = 'Não foi possível carregar os filmes.',
  onRetry,
}: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={48} color="#888" />
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Pressable onPress={onRetry} style={styles.button} accessibilityRole="button">
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 24 },
  message: { fontSize: 16, color: '#444', textAlign: 'center' },
  button: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#0066cc', borderRadius: 6 },
  buttonText: { color: '#fff', fontWeight: '600' },
});
