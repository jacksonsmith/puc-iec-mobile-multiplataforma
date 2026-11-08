import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Text } from '@/components/text';

// Tela provisória: a Spec 002 implementa o detalhe do filme.
export default function FilmDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View testID="film-detail" className="flex-1 items-center justify-center gap-4 bg-canvas p-4">
      <Text variant="meta" tone="muted">
        {id}
      </Text>
      <Button label="Voltar" onPress={() => router.back()} />
    </View>
  );
}
