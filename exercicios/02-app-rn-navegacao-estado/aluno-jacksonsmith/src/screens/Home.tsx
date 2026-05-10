import React from 'react';
import { View, Button } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export default function HomeScreen() {
  const offset = useSharedValue(0);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));
  return (
    <View>
      <Animated.View style={[{ width: 50, height: 50, backgroundColor: 'blue' }, style]} />
      <Button title="Move" onPress={() => (offset.value = withSpring(100))} />
    </View>
  );
}
