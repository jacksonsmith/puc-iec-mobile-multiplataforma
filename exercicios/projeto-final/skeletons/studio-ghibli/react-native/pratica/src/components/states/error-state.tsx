import { SymbolView } from 'expo-symbols';
import { View } from 'react-native';

import { Button } from '../button';
import { Glass } from '../glass';
import { Text } from '../text';
import { useBrandTokens } from '../use-brand-tokens';

type ErrorStateProps = {
  onRetry: () => void;
};

export function ErrorState({ onRetry }: ErrorStateProps) {
  const tokens = useBrandTokens();

  return (
    <View className="items-center px-4">
      <Glass
        testID="state-error"
        variant="strong"
        blur="lg"
        className="w-full max-w-sm items-center gap-2 rounded-lg px-6 py-8">
        <SymbolView
          name={{ ios: 'wifi.slash', android: 'wifi_off', web: 'wifi_off' }}
          size={24}
          tintColor={tokens.color('danger')}
        />
        <Text variant="body-strong" tone="danger" className="text-center">
          Não foi possível carregar os filmes
        </Text>
        <Text variant="meta" tone="muted" className="mb-3 text-center">
          Verifique sua conexão e tente de novo.
        </Text>
        <Button testID="retry-button" label="Tentar novamente" onPress={onRetry} />
      </Glass>
    </View>
  );
}
