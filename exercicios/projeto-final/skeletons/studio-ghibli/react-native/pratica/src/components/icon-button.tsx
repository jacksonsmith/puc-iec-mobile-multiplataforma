import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, type PressableProps, View } from 'react-native';

import { Glass } from './glass';
import { useBrandTokens } from './use-brand-tokens';

type IconButtonProps = Omit<PressableProps, 'children'> & {
  icon: SymbolViewProps['name'];
  accessibilityLabel: string;
  isActive?: boolean;
};

export function IconButton({ icon, isActive = false, ...props }: IconButtonProps) {
  const tokens = useBrandTokens();
  const iconColor = tokens.color(isActive ? 'on-sky' : 'ink');
  const symbol = <SymbolView name={icon} size={20} tintColor={iconColor} />;

  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: isActive }} {...props}>
      {isActive ? (
        <View className="h-12 w-12 items-center justify-center rounded-full bg-sky">{symbol}</View>
      ) : (
        <Glass className="h-12 w-12 items-center justify-center rounded-full">{symbol}</Glass>
      )}
    </Pressable>
  );
}
