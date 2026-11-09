import { View } from 'react-native';

import { useOfflineSimulation } from '@/state/use-offline-simulation';

import { setColorScheme, useColorScheme } from './color-scheme';
import { IconButton } from './icon-button';

export function HomeHeaderActions() {
  const isDark = useColorScheme() === 'dark';
  const { isOffline, toggleOffline } = useOfflineSimulation();

  return (
    <View className="ml-auto flex-row gap-2">
      <IconButton
        testID="theme-toggle"
        accessibilityLabel={isDark ? 'Usar tema claro' : 'Usar tema escuro'}
        icon={
          isDark
            ? { ios: 'sun.max.fill', android: 'light_mode', web: 'light_mode' }
            : { ios: 'moon.fill', android: 'dark_mode', web: 'dark_mode' }
        }
        onPress={() => setColorScheme(isDark ? 'light' : 'dark')}
      />
      <IconButton
        testID="offline-toggle"
        accessibilityLabel={isOffline ? 'Desligar modo avião' : 'Simular modo avião'}
        icon={{ ios: 'airplane', android: 'flight', web: 'flight' }}
        isActive={isOffline}
        onPress={toggleOffline}
      />
    </View>
  );
}
