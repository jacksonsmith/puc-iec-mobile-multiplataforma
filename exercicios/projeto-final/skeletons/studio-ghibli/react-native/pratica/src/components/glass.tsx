import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, StyleSheet, useColorScheme, View, type ViewProps } from 'react-native';

const FILL_CLASS = {
  default: 'bg-glass',
  strong: 'bg-glass-strong',
  scrim: 'bg-glass-scrim',
};

// A intensidade do expo-blur equivale a cerca de 2× o token de blur (12, 24 e 48).
const BLUR_INTENSITY = { sm: 24, md: 48, lg: 96 };

type GlassProps = ViewProps & {
  variant?: keyof typeof FILL_CLASS;
  blur?: keyof typeof BLUR_INTENSITY;
};

function useReducedTransparency() {
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceTransparencyEnabled().then(setIsReduced);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceTransparencyChanged',
      setIsReduced,
    );

    return () => subscription.remove();
  }, []);

  return isReduced;
}

export function Glass({
  variant = 'default',
  blur = 'md',
  className = '',
  children,
  ...props
}: GlassProps) {
  const colorScheme = useColorScheme();
  const isTransparencyReduced = useReducedTransparency();

  if (isTransparencyReduced) {
    return (
      <View className={`border border-glass-line bg-canvas-raised ${className}`} {...props}>
        {children}
      </View>
    );
  }

  // Sobre imagem o vidro é sempre escuro, nos dois temas.
  const tint = variant === 'scrim' || colorScheme === 'dark' ? 'dark' : 'light';
  const isLiquidGlass = isLiquidGlassAvailable();

  return (
    <View className={`overflow-hidden border border-glass-line ${className}`} {...props}>
      {isLiquidGlass ? (
        <GlassView style={StyleSheet.absoluteFill} colorScheme={tint} />
      ) : (
        <BlurView style={StyleSheet.absoluteFill} tint={tint} intensity={BLUR_INTENSITY[blur]} />
      )}
      {(!isLiquidGlass || variant === 'scrim') && (
        <View
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
          className={FILL_CLASS[variant]}
        />
      )}
      {children}
    </View>
  );
}
