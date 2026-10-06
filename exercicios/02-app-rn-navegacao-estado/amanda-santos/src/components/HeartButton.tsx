import { Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withSpring, withTiming } from 'react-native-reanimated';
export default function HeartButton({ active, onPress }: {active: boolean; onPress: () => void}) {
 const scale = useSharedValue(1); const rotation = useSharedValue(0);
 const animatedStyle = useAnimatedStyle(() => {
  'worklet';
  return {transform: [{scale: scale.value}, {rotate: `${rotation.value}deg`}]};
 });
 return <Pressable accessibilityRole="button" accessibilityLabel={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} accessibilityState={{selected: active}}
  style={{padding: 12}} onPress={event => {
   event.stopPropagation();
   scale.value = withSequence(withSpring(1.4), withSpring(1));
   rotation.value = withSequence(withTiming(-15, {duration: 100}), withSpring(0));
   onPress();
  }}><Animated.Text style={[{fontSize: 28, color: active ? '#d62855' : '#666'}, animatedStyle]}>{active ? '♥' : '♡'}</Animated.Text></Pressable>;
}
