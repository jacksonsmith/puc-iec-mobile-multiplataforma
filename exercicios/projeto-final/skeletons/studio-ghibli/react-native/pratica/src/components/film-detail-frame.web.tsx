import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type FilmDetailFrameProps = {
  children: ReactNode;
  onClose: () => void;
};

export function FilmDetailFrame({ children, onClose }: FilmDetailFrameProps) {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Fechar"
        style={StyleSheet.absoluteFill}
        className="bg-glass-scrim"
        onPress={onClose}
      />
      <View className="h-[85%] w-full max-w-xl overflow-hidden rounded-lg bg-canvas">
        {children}
      </View>
    </View>
  );
}
