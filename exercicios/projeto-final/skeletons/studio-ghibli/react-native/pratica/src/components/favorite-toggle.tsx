import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import { Platform, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { Glass } from './glass';
import { Text } from './text';
import { useBrandTokens } from './use-brand-tokens';

const POP_SCALE = 1.25;
const SPRING_CONFIG = { damping: 14, stiffness: 220 };

type FavoriteToggleProps = {
  testID: string;
  isFavorite: boolean;
  onToggle: () => void;
  variant?: 'labeled' | 'icon';
};

export function FavoriteToggle({
  testID,
  isFavorite,
  onToggle,
  variant = 'labeled',
}: FavoriteToggleProps) {
  const tokens = useBrandTokens();
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const isIcon = variant === 'icon';
  const starStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  const onImageColor = isFavorite ? 'lamp-on-image' : 'ink-on-image';
  const starColor = tokens.color(isIcon ? onImageColor : isFavorite ? 'lamp' : 'ink');

  function handlePress() {
    onToggle();

    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!reduceMotion) {
      scale.set(withSequence(withSpring(POP_SCALE, SPRING_CONFIG), withSpring(1, SPRING_CONFIG)));
    }
  }

  const star = (
    <Animated.View style={starStyle}>
      <SymbolView
        name={{ ios: isFavorite ? 'star.fill' : 'star', android: 'star', web: 'star' }}
        size={22}
        tintColor={starColor}
      />
    </Animated.View>
  );

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      accessibilityState={{ selected: isFavorite }}
      onPress={handlePress}>
      {isIcon ? (
        <Glass
          variant="scrim"
          blur="sm"
          className="h-12 w-12 items-center justify-center rounded-full">
          {star}
        </Glass>
      ) : (
        <Glass className="h-12 flex-row items-center gap-2 self-start rounded-full pl-3.5 pr-5">
          {star}
          <Text variant="body-strong" tone={isFavorite ? 'lamp' : 'ink'}>
            {isFavorite ? 'Nos favoritos' : 'Favoritar'}
          </Text>
        </Glass>
      )}
    </Pressable>
  );
}
