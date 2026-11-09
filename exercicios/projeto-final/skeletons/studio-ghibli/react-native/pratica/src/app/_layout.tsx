import '@/global.css';

import { ShipporiMinchoB1_600SemiBold } from '@expo-google-fonts/shippori-mincho-b1/600SemiBold';
import { ShipporiMinchoB1_700Bold } from '@expo-google-fonts/shippori-mincho-b1/700Bold';
import { ShipporiMinchoB1_800ExtraBold } from '@expo-google-fonts/shippori-mincho-b1/800ExtraBold';
import { ZenKakuGothicNew_400Regular } from '@expo-google-fonts/zen-kaku-gothic-new/400Regular';
import { ZenKakuGothicNew_500Medium } from '@expo-google-fonts/zen-kaku-gothic-new/500Medium';
import { ZenKakuGothicNew_700Bold } from '@expo-google-fonts/zen-kaku-gothic-new/700Bold';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { useColorScheme } from '@/components/color-scheme';
import { useBrandTokens } from '@/components/use-brand-tokens';
import { queryClient } from '@/state/query-client';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Mantém a tela inicial por baixo quando o detalhe abre direto por link.
  anchor: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const tokens = useBrandTokens();
  const [fontsLoaded, fontError] = useFonts({
    ShipporiMinchoB1_600SemiBold,
    ShipporiMinchoB1_700Bold,
    ShipporiMinchoB1_800ExtraBold,
    ZenKakuGothicNew_400Regular,
    ZenKakuGothicNew_500Medium,
    ZenKakuGothicNew_700Bold,
  });
  const isReady = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (isReady) SplashScreen.hideAsync();
  }, [isReady]);

  if (!isReady) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: tokens.color('canvas') },
          }}>
          <Stack.Screen name="index" />
          <Stack.Screen
            name="film/[id]"
            options={
              Platform.OS === 'web'
                ? {
                    presentation: 'transparentModal',
                    animation: 'fade',
                    contentStyle: { backgroundColor: 'transparent' },
                  }
                : undefined
            }
          />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
