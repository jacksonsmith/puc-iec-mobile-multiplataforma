import { SymbolView } from 'expo-symbols';
import { Pressable, TextInput, View } from 'react-native';

import { Glass } from './glass';
import { useBrandTokens } from './use-brand-tokens';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
};

export function SearchBar({ value, onChangeText, onClear }: SearchBarProps) {
  const tokens = useBrandTokens();
  const mutedColor = tokens.color('ink-muted');

  return (
    <Glass className="h-12 flex-row items-center gap-2 rounded-lg pl-4 pr-2">
      <SymbolView
        name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
        size={20}
        tintColor={mutedColor}
      />
      <TextInput
        testID="search-input"
        accessibilityLabel="Buscar por título"
        className="h-full flex-1 font-text-400 text-body text-ink"
        placeholder="Buscar por título"
        placeholderTextColor={mutedColor}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <Pressable
          testID="search-clear"
          accessibilityRole="button"
          accessibilityLabel="Limpar busca"
          hitSlop={8}
          onPress={onClear}>
          <View className="h-8 w-8 items-center justify-center">
            <SymbolView
              name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' }}
              size={20}
              tintColor={mutedColor}
            />
          </View>
        </Pressable>
      )}
    </Glass>
  );
}
